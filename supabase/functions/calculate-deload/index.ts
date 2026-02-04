import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Exercise {
  name: string;
  workingWeight: number;
  workingSets: number;
  workingReps: number;
  unit: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      exercises, 
      trainingFrequency, 
      fatigueLevel,
      recentInjuries,
      weeksOfTraining,
      saveToDb 
    } = await req.json();

    if (!exercises || exercises.length === 0) {
      return new Response(
        JSON.stringify({ error: "No exercises provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const exerciseList = exercises.map((ex: Exercise) => 
      `- ${ex.name}: ${ex.workingWeight}${ex.unit} × ${ex.workingSets} sets × ${ex.workingReps} reps`
    ).join('\n');

    const prompt = `You are a strength training coach planning a deload week.

Current Training Program:
${exerciseList}

Context:
- Training frequency: ${trainingFrequency} days/week
- Fatigue level: ${fatigueLevel}/10
- Weeks of continuous training: ${weeksOfTraining}
${recentInjuries ? `- Recent injuries/concerns: ${recentInjuries}` : ''}

Calculate an appropriate deload week that:
1. Reduces intensity by 40-60% (weight reduction)
2. Reduces volume by 30-50% (sets/reps reduction)
3. Maintains movement patterns and technique
4. Allows for recovery without losing adaptations
5. Considers the user's fatigue level and training history
6. Round weights to nearest 5 lbs or 2.5 kg

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{
  "intensityReduction": 50,
  "volumeReduction": 40,
  "exercises": [
    {
      "name": "Squat",
      "originalWeight": 225,
      "deloadWeight": 135,
      "originalSets": 4,
      "deloadSets": 3,
      "originalReps": 5,
      "deloadReps": 5
    }
  ],
  "reasoning": "Detailed explanation of the deload strategy and why these specific reductions"
}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a strength training coach. Always respond with valid JSON only, no markdown formatting." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("AI gateway error");
    }

    const data = await aiResponse.json();
    const responseText = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    let deload;
    try {
      const jsonMatch = responseText.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || [null, responseText];
      const jsonString = (jsonMatch[1] || responseText).trim();
      deload = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse AI response:", responseText);
      throw new Error("Failed to parse AI response");
    }

    // Calculate date range
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    // Save to database if authenticated and requested
    let savedId = null;
    if (saveToDb) {
      const authHeader = req.headers.get("authorization");
      if (authHeader) {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey, {
          global: { headers: { Authorization: authHeader } },
        });

        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: inserted } = await supabase
            .from("deload_weeks")
            .insert({
              user_id: user.id,
              start_date: startDate.toISOString(),
              end_date: endDate.toISOString(),
              intensity_reduction: deload.intensityReduction,
              volume_reduction: deload.volumeReduction,
              fatigue_level: fatigueLevel,
              weeks_of_training: weeksOfTraining,
              training_frequency: trainingFrequency,
              exercises: deload.exercises,
              reasoning: deload.reasoning,
            })
            .select()
            .single();

          savedId = inserted?.id;
        }
      }
    }

    return new Response(
      JSON.stringify({
        id: savedId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        intensityReduction: deload.intensityReduction,
        volumeReduction: deload.volumeReduction,
        exercises: deload.exercises,
        reasoning: deload.reasoning,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error calculating deload:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to calculate deload week" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

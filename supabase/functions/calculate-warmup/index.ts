import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { exerciseName, workingWeight, workingReps, unit, saveToDb } = await req.json();

    if (!exerciseName || !workingWeight || !workingReps) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `You are a strength training coach calculating warm-up sets.

Exercise: ${exerciseName}
Working Set Target: ${workingWeight}${unit} × ${workingReps} reps

Calculate 3-4 progressive warm-up sets that:
1. Start light enough to avoid fatigue (typically 40-50% of working weight)
2. Build progressively to prepare for the working weight
3. Use appropriate rep ranges (higher reps for lighter weights, lower for heavier)
4. Round weights to nearest 5 lbs or 2.5 kg for easy plate loading
5. For barbell exercises, start with empty bar (45lbs/20kg) if appropriate

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{
  "warmupSets": [
    { "setNumber": 1, "weight": 45, "reps": 10, "percentage": 50, "notes": "Light weight, focus on form" },
    { "setNumber": 2, "weight": 95, "reps": 5, "percentage": 70, "notes": "Moderate load" },
    { "setNumber": 3, "weight": 135, "reps": 2, "percentage": 85, "notes": "Heavy prep" }
  ],
  "reasoning": "Brief explanation of the warm-up progression strategy"
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

    // Parse JSON from response (handle potential markdown wrapping)
    let calculation;
    try {
      const jsonMatch = responseText.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || [null, responseText];
      const jsonString = (jsonMatch[1] || responseText).trim();
      calculation = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse AI response:", responseText);
      throw new Error("Failed to parse AI response");
    }

    // Save to database if authenticated and requested
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
          // Delete existing warmup sets for this exercise
          await supabase
            .from("warmup_sets")
            .delete()
            .eq("user_id", user.id)
            .eq("exercise_name", exerciseName);

          // Insert new warmup sets
          const setsToInsert = calculation.warmupSets.map((set: any) => ({
            user_id: user.id,
            exercise_name: exerciseName,
            working_weight: workingWeight,
            working_reps: workingReps,
            unit,
            set_number: set.setNumber,
            weight: set.weight,
            reps: set.reps,
            percentage: set.percentage,
            notes: set.notes,
            reasoning: calculation.reasoning,
          }));

          await supabase.from("warmup_sets").insert(setsToInsert);
        }
      }
    }

    return new Response(
      JSON.stringify({
        warmupSets: calculation.warmupSets,
        reasoning: calculation.reasoning,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error calculating warm-ups:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to calculate warm-up sets" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface WorkoutSession {
  weight: number;
  unit: string;
  reps: number;
  rir: number | null;
  sets: number;
  timestamp: string;
  goal_min_reps: number | null;
  goal_max_reps: number | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { exerciseName, sessions, goalMinReps, goalMaxReps } = await req.json() as {
      exerciseName: string;
      sessions: WorkoutSession[];
      goalMinReps: number;
      goalMaxReps: number;
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build analysis for the AI
    const last4 = sessions.slice(-4);
    const avgReps = last4.reduce((s, w) => s + w.reps, 0) / last4.length;
    const avgRir = last4.filter(w => w.rir !== null).reduce((s, w) => s + (w.rir ?? 0), 0) / last4.filter(w => w.rir !== null).length;
    const currentWeight = last4[last4.length - 1].weight;
    const currentUnit = last4[last4.length - 1].unit;

    // Determine recommendation type
    let recType: string;
    let suggestedWeight: number | null = null;

    if (avgReps > goalMaxReps && avgRir >= 1 && avgRir <= 2) {
      // Consistently above goal range with 1-2 RIR -> increase weight
      recType = "increase";
      // 10% increase rounded to nearest plate increment
      const raw = currentWeight * 1.1;
      suggestedWeight = currentUnit === "kg"
        ? Math.round(raw / 2.5) * 2.5
        : Math.round(raw / 5) * 5;
    } else if (avgReps >= goalMinReps && avgReps <= goalMaxReps) {
      recType = "hold";
    } else if (avgReps < goalMinReps) {
      // Find last successful weight (where reps were in range)
      recType = "decrease";
      const successful = sessions.filter(s => s.reps >= goalMinReps && s.weight < currentWeight);
      suggestedWeight = successful.length > 0
        ? successful[successful.length - 1].weight
        : currentUnit === "kg"
          ? Math.round((currentWeight * 0.9) / 2.5) * 2.5
          : Math.round((currentWeight * 0.9) / 5) * 5;
    } else {
      recType = "hold";
    }

    const sessionSummary = last4.map((s, i) =>
      `Session ${i + 1}: ${s.weight}${s.unit} × ${s.reps} reps${s.rir !== null ? `, ${s.rir} RIR` : ''} (${s.sets} sets)`
    ).join("\n");

    const systemPrompt = `You are Spot, a friendly and knowledgeable strength training coach inside a workout tracking app. 
Give a short, conversational recommendation (2-4 sentences max) based on the data. Be encouraging but direct. 
Use the lifter's name if you had it, otherwise just address them casually. Don't use markdown formatting.
Never say you're an AI. Speak like a real coach would between sets.`;

    const userPrompt = `Exercise: ${exerciseName}
Goal rep range: ${goalMinReps}-${goalMaxReps} reps
Last 4 sessions:
${sessionSummary}

Average reps: ${avgReps.toFixed(1)}
Average RIR: ${isNaN(avgRir) ? 'not tracked' : avgRir.toFixed(1)}
Current weight: ${currentWeight} ${currentUnit}

Recommendation type: ${recType}
${suggestedWeight ? `Suggested new weight: ${suggestedWeight} ${currentUnit}` : ''}

Give a conversational coaching recommendation based on this analysis.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const aiResult = await response.json();
    const message = aiResult.choices?.[0]?.message?.content || "Keep pushing! You're making progress.";

    return new Response(JSON.stringify({
      type: recType,
      message,
      suggestedWeight,
      exerciseName,
      currentWeight,
      unit: currentUnit,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("progression-recommendation error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

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

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

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
      recType = "increase";
      const raw = currentWeight * 1.1;
      suggestedWeight = currentUnit === "kg"
        ? Math.round(raw / 2.5) * 2.5
        : Math.round(raw / 5) * 5;
    } else if (avgReps >= goalMinReps && avgReps <= goalMaxReps) {
      recType = "hold";
    } else if (avgReps < goalMinReps) {
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

    const systemPrompt = `You are Spot, a supportive gym buddy inside a workout tracking app. You speak casually and encouragingly — like a friend who's been lifting with them for years.

Your response MUST have exactly two parts separated by a blank line:
1. FIRST: A 1-2 sentence explanation of WHY you're making this recommendation. Reference their actual numbers, sessions, and if RIR data exists, mention it naturally (e.g., "You still had 2 reps in the tank"). Be specific — mention the weight, how many sessions they've been at it, whether they crushed it or struggled.
2. SECOND: The actual recommendation — what weight to use next and what to aim for.

Tone examples:
- "You've been crushing 135lbs for 3 sessions straight and had reps to spare — let's move up!"
- "Last session was a grind at 155lbs and you didn't hit your minimum reps — let's drop back to 145lbs and build back up. No shame, that's how progress works."
- "You still had 2 reps in the tank at 135lbs — you're ready for more."

Rules:
- Never use markdown formatting
- Never say you're an AI
- Keep it to 3-4 sentences total max
- The WHY comes before the WHAT
- Be encouraging even when recommending a decrease`;

    const userPrompt = `Exercise: ${exerciseName}
Goal rep range: ${goalMinReps}-${goalMaxReps} reps
Last 4 sessions:
${sessionSummary}

Average reps: ${avgReps.toFixed(1)}
Average RIR: ${isNaN(avgRir) ? 'not tracked' : avgRir.toFixed(1)}
Current weight: ${currentWeight} ${currentUnit}

Recommendation type: ${recType}
${suggestedWeight ? `Suggested new weight: ${suggestedWeight} ${currentUnit}` : ''}

Give the WHY explanation first, then the weight recommendation.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 256,
        system: systemPrompt,
        messages: [
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
      const t = await response.text();
      console.error("Anthropic API error:", response.status, t);
      throw new Error("Anthropic API error");
    }

    const aiResult = await response.json();
    const message = aiResult.content?.[0]?.text || "Keep pushing! You're making progress.";

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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { exerciseName, sessions } = await req.json() as {
      exerciseName: string;
      sessions: { weight: number; reps: number[]; rir: number | null }[];
    };

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

    const systemPrompt = `You are a gym buddy giving progression advice. You will receive the last 4 sessions for an exercise including weight, reps per set, and RIR.

Rules:

The user's rep goal range is 6-8 reps with 1-2 RIR.

If their most recent session shows reps consistently above 8 with 1-2 RIR, recommend increasing weight by 10% rounded to the nearest 5 lb increment.

If reps are within 6-8, tell them to stay at the current weight and aim for more reps next time.

If they cannot hit 6 reps, tell them to drop back to their last successful weight.

Respond ONLY in JSON with no markdown or backticks: {"action": "INCREASE_WEIGHT" or "HOLD_WEIGHT" or "DROP_WEIGHT", "current_weight": number, "recommended_weight": number, "trend": "short summary of their last 4 sessions like 6 → 7 → 8 → 9 reps", "explanation": "one casual sentence explaining why, like a gym buddy would say it"}`;

    const userMessage = `Exercise: ${exerciseName}. Last 4 sessions: ${JSON.stringify(sessions)}.`;

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
          { role: "user", content: userMessage },
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
    const rawText = aiResult.content?.[0]?.text || "";

    // Parse the JSON response from Claude
    const parsed = JSON.parse(rawText);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("progression-recommendation error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

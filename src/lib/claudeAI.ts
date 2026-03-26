const FALLBACK_PROJECT_REF = "rvqtdwihtwnaunexyeoi";
const FALLBACK_SUPABASE_URL = `https://${FALLBACK_PROJECT_REF}.supabase.co`;
const FALLBACK_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cXRkd2lodHduYXVuZXh5ZW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzOTg4NDEsImV4cCI6MjA4NDk3NDg0MX0.VfauBA35wXbF-_yKD8YImGvz4-EU99PrmH-wnRbbovU";

function getAiBackendUrl() {
  const configuredUrl = import.meta.env.VITE_SUPABASE_URL;
  return configuredUrl?.includes(FALLBACK_PROJECT_REF)
    ? configuredUrl
    : FALLBACK_SUPABASE_URL;
}

function getAiPublishableKey() {
  const configuredKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return configuredKey?.includes(FALLBACK_PROJECT_REF)
    ? configuredKey
    : FALLBACK_PUBLISHABLE_KEY;
}

export interface WarmupSet {
  set: number;
  weight: number;
  reps: number;
}

export interface ClaudeAIResult {
  warmup: WarmupSet[];
  recommendation: "increase" | "maintain" | "decrease";
  nextWeight: number;
  sweetSpot: string;
  reasoning: string;
}

export async function getClaudeRecommendation(
  exerciseName: string,
  workingWeight: number,
  workingReps: number,
  amrapReps: number,
  unit: string,
  repRangeMin: number,
  repRangeMax: number
): Promise<ClaudeAIResult> {
  const publishableKey = getAiPublishableKey();
  const response = await fetch(`${getAiBackendUrl()}/functions/v1/ai-recommendation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
    },
    body: JSON.stringify({
      exerciseName,
      workingWeight,
      workingReps,
      amrapReps,
      unit,
      repRangeMin,
      repRangeMax,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      `AI recommendation failed: ${data?.error || "Failed to send a request to the Edge Function"}`
    );
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as ClaudeAIResult;
}

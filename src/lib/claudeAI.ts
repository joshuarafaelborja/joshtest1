import { supabase } from "@/integrations/supabase/client";

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
  const { data, error } = await supabase.functions.invoke("claude-ai", {
    body: {
      exerciseName,
      workingWeight,
      workingReps,
      amrapReps,
      unit,
      repRangeMin,
      repRangeMax,
    },
  });

  if (error) {
    throw new Error(`AI recommendation failed: ${error.message}`);
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as ClaudeAIResult;
}

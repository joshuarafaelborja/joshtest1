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

const ANTHROPIC_API_KEY = "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";

export async function getClaudeRecommendation(
  exerciseName: string,
  workingWeight: number,
  workingReps: number,
  amrapReps: number,
  unit: string,
  repRangeMin: number,
  repRangeMax: number
): Promise<ClaudeAIResult> {
  const prompt = `You are a strength coach AI. Given the following workout data, produce a warm-up protocol and a progression recommendation.

Exercise: ${exerciseName}
Working weight: ${workingWeight} ${unit}
Working reps target: ${workingReps}
AMRAP result (last set): ${amrapReps} reps
Rep range: ${repRangeMin}-${repRangeMax}

Warm-up rules:
- 2 to 3 sets, max 6 reps, minimize fatigue
- Set 1: 50% of working weight × 5 reps
- Set 2: 75% of working weight × 3 reps
- Set 3 (only if working weight ≥ 135 lbs / 60 kg): 85% × 2 reps
- Round all weights to nearest 5 ${unit === 'kg' ? 'kg' : 'lbs'}
- Skip warm-up entirely if working weight < 45 lbs / 20 kg

Progression rules based on AMRAP reps vs the ${repRangeMin}-${repRangeMax} range:
- AMRAP > ${repRangeMax} → "increase" weight 5-10%, round to nearest 5
- AMRAP = ${repRangeMax - 1} or ${repRangeMax} → "increase" weight 5%, user is ready
- AMRAP = ${repRangeMin + 1} or ${repRangeMin + 2} → "maintain", sweet spot
- AMRAP = ${repRangeMin} exactly → "maintain", almost ready
- AMRAP < ${repRangeMin} → "decrease" weight 10%, round to nearest 5

Output ONLY this JSON, no text outside it:
{
  "warmup": [{ "set": 1, "weight": number, "reps": number }, ...],
  "recommendation": "increase" | "maintain" | "decrease",
  "nextWeight": number,
  "sweetSpot": "string describing the sweet spot",
  "reasoning": "string explaining why"
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API error (${response.status}): ${errText}`);
  }

  const result = await response.json();
  const rawText = result.content?.[0]?.text || "";
  const parsed = JSON.parse(rawText);

  return parsed as ClaudeAIResult;
}

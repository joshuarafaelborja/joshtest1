import { Exercise, ExerciseLog, RecommendationResult, RecommendationType, AppData } from './types';

function getLastNLogs(exercise: Exercise, n: number): ExerciseLog[] {
  return exercise.logs.slice(-n);
}

function calculateWeeksSinceFirstLog(metadata: AppData['metadata']): number {
  if (!metadata.firstLogDate) return 0;
  const firstLog = new Date(metadata.firstLogDate);
  const now = new Date();
  const diffMs = now.getTime() - firstLog.getTime();
  return Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
}

function shouldScheduleDeload(metadata: AppData['metadata']): boolean {
  const weeks = calculateWeeksSinceFirstLog(metadata);
  if (weeks < 4) return false;
  
  if (!metadata.lastDeloadDate) return true;
  
  const lastDeload = new Date(metadata.lastDeloadDate);
  const now = new Date();
  const weeksSinceDeload = Math.floor(
    (now.getTime() - lastDeload.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );
  
  return weeksSinceDeload >= 4;
}

export function analyzePerformance(
  exercise: Exercise,
  currentLog: ExerciseLog,
  metadata: AppData['metadata']
): RecommendationResult {
  const logs = exercise.logs;
  const { minReps, goalReps } = exercise;
  
  // Check for insufficient data
  if (logs.length < 2) {
    const remaining = 3 - logs.length - 1;
    return {
      type: 'insufficient_data',
      icon: '📊',
      headline: 'Great start!',
      message: `Log ${remaining} more session${remaining > 1 ? 's' : ''} to get personalized recommendations.`,
    };
  }

  // Check for scheduled deload
  if (shouldScheduleDeload(metadata)) {
    const suggestedWeight = Math.round(currentLog.weight * 0.9);
    return {
      type: 'scheduled_deload',
      icon: '🔄',
      headline: 'Deload week!',
      message: `You've trained hard for 4+ weeks. Take a recovery week - decrease weight by 5-10% on all exercises.`,
      suggestedWeight,
    };
  }

  const lastThreeLogs = getLastNLogs(exercise, 3);
  const currentReps = currentLog.reps;

  // Progressive Overload: Current reps >= goal reps
  if (currentReps >= goalReps) {
    const minSuggested = Math.round(currentLog.weight * 1.05);
    const maxSuggested = Math.round(currentLog.weight * 1.1);
    return {
      type: 'progressive_overload',
      icon: '🎯',
      headline: 'Ready to progress!',
      message: `You hit your goal of ${goalReps} reps. Increase weight by 5-10% next time (${minSuggested}-${maxSuggested} ${currentLog.unit}).`,
      suggestedWeight: minSuggested,
    };
  }

  // Check for acute deload: Reps below minimum for 2 consecutive sessions
  if (logs.length >= 1) {
    const lastLog = logs[logs.length - 1];
    if (currentReps < minReps && lastLog.reps < minReps) {
      const suggestedWeight = Math.round(currentLog.weight * 0.9);
      return {
        type: 'acute_deload',
        icon: '⚠️',
        headline: 'Time to deload',
        message: `You're not strong enough at this weight yet. Decrease to ${suggestedWeight} ${currentLog.unit} and aim for 10 good reps with perfect form.`,
        suggestedWeight,
      };
    }
  }

  // Check for acclimation: Same weight + reps within range for 3 consecutive sessions
  if (lastThreeLogs.length >= 2) {
    const recentLogs = [...lastThreeLogs, currentLog].slice(-3);
    const allSameWeight = recentLogs.every(
      (log) => Math.abs(log.weight - currentLog.weight) < 0.1
    );
    const allInRange = recentLogs.every(
      (log) => log.reps >= minReps && log.reps <= goalReps
    );

    if (allSameWeight && allInRange && recentLogs.length === 3) {
      const minSuggested = Math.round(currentLog.weight * 1.05);
      const maxSuggested = Math.round(currentLog.weight * 1.1);
      return {
        type: 'acclimation',
        icon: '💪',
        headline: "You've adapted!",
        message: `Same weight for 3 sessions. Try increasing 5-10% to ${minSuggested}-${maxSuggested} ${currentLog.unit} and expect lower reps.`,
        suggestedWeight: minSuggested,
      };
    }
  }

  // Maintain: Reps are within range
  if (currentReps >= minReps && currentReps <= goalReps) {
    return {
      type: 'maintain',
      icon: '✅',
      headline: 'On track!',
      message: `Keep this weight (${currentLog.weight} ${currentLog.unit}) for your next session. You're in your target range of ${minReps}-${goalReps} reps.`,
    };
  }

  // Default: Still working towards minimum
  return {
    type: 'maintain',
    icon: '💪',
    headline: 'Keep pushing!',
    message: `Work towards hitting ${minReps} reps at this weight before progressing.`,
  };
}

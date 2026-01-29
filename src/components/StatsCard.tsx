import { useMemo } from 'react';
import { Flame, Dumbbell, Trophy, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AppData } from '@/lib/types';

interface StatsCardProps {
  data: AppData;
}

interface WorkoutStats {
  totalSets: number;
  totalVolume: number;
  currentStreak: number;
  mostTrainedExercise: string | null;
}

function calculateStats(data: AppData): WorkoutStats {
  const allLogs = data.exercises.flatMap(e => 
    e.logs.map(log => ({
      ...log,
      exerciseName: e.name
    }))
  );

  // Total sets
  const totalSets = allLogs.length;

  // Total volume (weight × reps, convert kg to lbs for consistency)
  const totalVolume = allLogs.reduce((sum, log) => {
    const weightInLbs = log.unit === 'kg' ? log.weight * 2.20462 : log.weight;
    return sum + (weightInLbs * log.reps);
  }, 0);

  // Current streak (consecutive days with workouts)
  const currentStreak = calculateStreak(allLogs.map(l => l.timestamp));

  // Most trained exercise
  const exerciseCounts: Record<string, number> = {};
  allLogs.forEach(log => {
    exerciseCounts[log.exerciseName] = (exerciseCounts[log.exerciseName] || 0) + 1;
  });
  
  const mostTrainedExercise = Object.entries(exerciseCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    totalSets,
    totalVolume,
    currentStreak,
    mostTrainedExercise
  };
}

function calculateStreak(timestamps: string[]): number {
  if (timestamps.length === 0) return 0;

  // Get unique dates (in local timezone)
  const uniqueDates = [...new Set(
    timestamps.map(ts => {
      const date = new Date(ts);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    })
  )].sort().reverse(); // Most recent first

  if (uniqueDates.length === 0) return 0;

  // Check if today or yesterday has a workout (streak must be current)
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

  if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
    return 0; // Streak is broken
  }

  // Count consecutive days
  let streak = 1;
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const current = parseLocalDate(uniqueDates[i]);
    const next = parseLocalDate(uniqueDates[i + 1]);
    
    const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month, day);
}

function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  return Math.round(volume).toLocaleString();
}

export function StatsCard({ data }: StatsCardProps) {
  const stats = useMemo(() => calculateStats(data), [data]);
  
  const hasWorkouts = stats.totalSets > 0;

  if (!hasWorkouts) {
    return (
      <Card className="relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-lg">
        <div className="flex flex-col items-center justify-center text-center py-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Dumbbell className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">No workouts yet</h3>
          <p className="text-sm text-muted-foreground">
            Start logging to see your stats!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 shadow-lg">
      {/* Subtle decorative element */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
      
      <div className="relative">
        <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
          Your Progress
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Total Sets */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-foreground leading-none">
                {stats.totalSets}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Total Sets
              </p>
            </div>
          </div>

          {/* Total Volume */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Dumbbell className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-foreground leading-none">
                {formatVolume(stats.totalVolume)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                lbs Lifted
              </p>
            </div>
          </div>

          {/* Current Streak */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-foreground leading-none">
                {stats.currentStreak}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Day Streak
              </p>
            </div>
          </div>

          {/* Most Trained */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold text-foreground leading-tight truncate" title={stats.mostTrainedExercise || ''}>
                {stats.mostTrainedExercise || '—'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Top Exercise
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

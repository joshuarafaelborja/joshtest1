import { useMemo } from 'react';
import { TrendingUp, Target, Flame, Trophy, Calculator, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AppData } from '@/lib/types';

interface LevelUpCardProps {
  data: AppData;
  onOpenCalculator?: () => void;
}

interface ProgressMetric {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  motivationalText: string;
}

function getProgressColor(value: number): string {
  if (value >= 80) return 'bg-emerald-500';
  if (value >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
}

function getProgressTextColor(value: number): string {
  if (value >= 80) return 'text-emerald-500';
  if (value >= 50) return 'text-amber-500';
  return 'text-rose-500';
}

function getMotivationalText(value: number, type: string): string {
  if (type === 'weekly') {
    if (value >= 100) return "🎉 Goal crushed!";
    if (value >= 80) return "Almost there!";
    if (value >= 50) return "Keep pushing!";
    return "Let's get moving!";
  }
  if (type === 'volume') {
    if (value > 0) return `+${value}% stronger!`;
    if (value === 0) return "Maintaining power";
    return "Time to push harder";
  }
  if (type === 'consistency') {
    if (value >= 80) return "On fire! 🔥";
    if (value >= 50) return "Building momentum";
    return "Every day counts";
  }
  if (type === 'pr') {
    if (value >= 50) return "PR machine!";
    if (value >= 25) return "Making gains";
    return "New PRs await";
  }
  return "";
}

function calculateMetrics(data: AppData): ProgressMetric[] {
  const allLogs = data.exercises.flatMap(e => 
    e.logs.map(log => ({
      ...log,
      exerciseName: e.name,
      exerciseId: e.id
    }))
  );

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const lastWeekStart = new Date(startOfWeek);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Weekly Goal Progress (assume 12 sets per week as default goal)
  const weeklyGoal = 12;
  const thisWeekSets = allLogs.filter(log => 
    new Date(log.timestamp) >= startOfWeek
  ).length;
  const weeklyProgress = Math.min(Math.round((thisWeekSets / weeklyGoal) * 100), 100);

  // Volume Increase (compare this week to last week)
  const thisWeekVolume = allLogs
    .filter(log => new Date(log.timestamp) >= startOfWeek)
    .reduce((sum, log) => {
      const weightInLbs = log.unit === 'kg' ? log.weight * 2.20462 : log.weight;
      return sum + (weightInLbs * log.reps);
    }, 0);

  const lastWeekVolume = allLogs
    .filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= lastWeekStart && logDate < startOfWeek;
    })
    .reduce((sum, log) => {
      const weightInLbs = log.unit === 'kg' ? log.weight * 2.20462 : log.weight;
      return sum + (weightInLbs * log.reps);
    }, 0);

  const volumeChange = lastWeekVolume > 0 
    ? Math.round(((thisWeekVolume - lastWeekVolume) / lastWeekVolume) * 100)
    : thisWeekVolume > 0 ? 100 : 0;

  // Consistency Score (days worked out this month)
  const daysInMonthSoFar = now.getDate();
  const workoutDaysThisMonth = new Set(
    allLogs
      .filter(log => new Date(log.timestamp) >= startOfMonth)
      .map(log => {
        const date = new Date(log.timestamp);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      })
  ).size;
  const consistencyScore = Math.round((workoutDaysThisMonth / daysInMonthSoFar) * 100);

  // Personal Record Rate (exercises where current max is higher than previous)
  const exercisesWithPRs = data.exercises.filter(exercise => {
    if (exercise.logs.length < 2) return false;
    
    const sortedLogs = [...exercise.logs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    const latestWeight = sortedLogs[0].weight * (sortedLogs[0].unit === 'kg' ? 2.20462 : 1);
    const previousMaxWeight = Math.max(
      ...sortedLogs.slice(1).map(l => l.weight * (l.unit === 'kg' ? 2.20462 : 1))
    );
    
    return latestWeight > previousMaxWeight;
  }).length;

  const prRate = data.exercises.length > 0 
    ? Math.round((exercisesWithPRs / data.exercises.length) * 100)
    : 0;

  return [
    {
      label: 'Weekly Goal',
      value: weeklyProgress,
      description: `${thisWeekSets}/${weeklyGoal} sets this week`,
      icon: <Target className="w-4 h-4" />,
      motivationalText: getMotivationalText(weeklyProgress, 'weekly')
    },
    {
      label: 'Volume Trend',
      value: Math.min(Math.abs(volumeChange), 100),
      description: volumeChange >= 0 ? `+${volumeChange}% vs last week` : `${volumeChange}% vs last week`,
      icon: <TrendingUp className="w-4 h-4" />,
      motivationalText: getMotivationalText(volumeChange, 'volume')
    },
    {
      label: 'Consistency',
      value: consistencyScore,
      description: `${workoutDaysThisMonth} days this month`,
      icon: <Flame className="w-4 h-4" />,
      motivationalText: getMotivationalText(consistencyScore, 'consistency')
    },
    {
      label: 'PR Rate',
      value: prRate,
      description: `${exercisesWithPRs}/${data.exercises.length} exercises`,
      icon: <Trophy className="w-4 h-4" />,
      motivationalText: getMotivationalText(prRate, 'pr')
    }
  ];
}

export function LevelUpCard({ data, onOpenCalculator }: LevelUpCardProps) {
  const metrics = useMemo(() => calculateMetrics(data), [data]);
  
  const hasData = data.exercises.some(e => e.logs.length > 0);

  if (!hasData) {
    return (
      <Card className="relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 shadow-xl">
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
        
        <div className="relative flex flex-col items-center justify-center text-center py-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Ready to Level Up?</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-xs">
            Start logging workouts to unlock your progress dashboard and see your gains come to life!
          </p>
          {onOpenCalculator && (
            <Button variant="outline" size="sm" onClick={onOpenCalculator} className="gap-2">
              <Calculator className="w-4 h-4" />
              Plan Your Workout
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-5 shadow-xl">
      {/* Decorative background elements */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-foreground">Ready to Level Up?</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Your progress this week</p>
          </div>
          {onOpenCalculator && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onOpenCalculator}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Calculator className="w-3.5 h-3.5" />
              Calculator
              <ChevronRight className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className="bg-background/50 backdrop-blur-sm rounded-xl p-3.5 border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${getProgressTextColor(metric.value)} bg-current/10`}>
                  {metric.icon}
                </div>
                <span className="text-xs font-medium text-muted-foreground">{metric.label}</span>
              </div>
              
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className={`text-2xl font-bold ${getProgressTextColor(metric.value)}`}>
                  {metric.value}%
                </span>
              </div>
              
              <div className="relative h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                <div 
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${getProgressColor(metric.value)}`}
                  style={{ width: `${Math.min(metric.value, 100)}%` }}
                />
              </div>
              
              <p className="text-[10px] text-muted-foreground leading-tight">
                {metric.description}
              </p>
              <p className="text-[10px] font-medium text-foreground/80 mt-0.5">
                {metric.motivationalText}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

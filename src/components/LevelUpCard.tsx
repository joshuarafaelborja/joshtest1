import { useMemo } from 'react';
import { TrendingUp, Target, Flame, Trophy, Calculator, ChevronRight } from 'lucide-react';
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
  if (value >= 100) return 'from-primary to-blue-500';
  if (value >= 80) return 'from-emerald-400 to-emerald-500';
  if (value >= 50) return 'from-zinc-400 to-zinc-500';
  return 'from-rose-400 to-rose-500';
}

function getProgressTextColor(value: number): string {
  if (value >= 100) return 'text-primary';
  if (value >= 80) return 'text-emerald-400';
  if (value >= 50) return 'text-zinc-50';
  return 'text-rose-400';
}

function getMotivationalText(value: number, type: string): string {
  if (type === 'weekly') {
    if (value >= 100) return "Goal crushed 🎉";
    if (value >= 80) return "Almost there";
    if (value >= 50) return "Keep pushing";
    return "Let's go";
  }
  if (type === 'volume') {
    if (value > 0) return `+${value}% stronger`;
    if (value === 0) return "Holding steady";
    return "Push harder";
  }
  if (type === 'consistency') {
    if (value >= 80) return "On fire 🔥";
    if (value >= 50) return "Building momentum";
    return "Every day counts";
  }
  if (type === 'pr') {
    if (value >= 50) return "PR machine";
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
      description: `${thisWeekSets}/${weeklyGoal} sets`,
      icon: <Target className="w-5 h-5" />,
      motivationalText: getMotivationalText(weeklyProgress, 'weekly')
    },
    {
      label: 'Volume',
      value: Math.min(Math.abs(volumeChange), 100),
      description: volumeChange >= 0 ? `+${volumeChange}% vs last week` : `${volumeChange}% vs last week`,
      icon: <TrendingUp className="w-5 h-5" />,
      motivationalText: getMotivationalText(volumeChange, 'volume')
    },
    {
      label: 'Consistency',
      value: consistencyScore,
      description: `${workoutDaysThisMonth} days this month`,
      icon: <Flame className="w-5 h-5" />,
      motivationalText: getMotivationalText(consistencyScore, 'consistency')
    },
    {
      label: 'PR Rate',
      value: prRate,
      description: `${exercisesWithPRs}/${data.exercises.length} exercises`,
      icon: <Trophy className="w-5 h-5" />,
      motivationalText: getMotivationalText(prRate, 'pr')
    }
  ];
}

export function LevelUpCard({ data, onOpenCalculator }: LevelUpCardProps) {
  const metrics = useMemo(() => calculateMetrics(data), [data]);
  
  const hasData = data.exercises.some(e => e.logs.length > 0);

  if (!hasData) {
    return (
      <div className="concrete-overlay relative overflow-hidden rounded-xl border border-border bg-card p-8">
        <div className="relative flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/30">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h3 className="heading-section mb-3">
            Ready to<br/>
            <span className="text-primary">Level Up?</span>
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Start logging workouts to unlock your progress dashboard
          </p>
          {onOpenCalculator && (
            <Button variant="outline" onClick={onOpenCalculator} className="gap-2">
              <Calculator className="w-5 h-5" />
              Plan Workout
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="concrete-subtle relative overflow-hidden rounded-xl border border-slate-600/30 bg-card">
      <div className="relative p-7">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">
              Ready to <span className="text-primary">Level Up?</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1.5">Your progress this week</p>
          </div>
          {onOpenCalculator && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onOpenCalculator}
              className="gap-1.5 text-slate-400 hover:text-slate-100"
            >
              <Calculator className="w-4 h-4" />
              Calc
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-8">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className="concrete-subtle relative rounded-xl p-8 border border-slate-600/30 hover:border-primary/50 transition-all duration-200"
            >
              {/* Icon and Label */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${getProgressTextColor(metric.value)} bg-current/10`}>
                  {metric.icon}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{metric.label}</span>
              </div>
              
              {/* Big percentage number */}
              <div className="mb-4">
                <span className={`text-6xl font-black tracking-tighter ${getProgressTextColor(metric.value)}`}>
                  {metric.value}
                </span>
                <span className={`text-2xl font-black ${getProgressTextColor(metric.value)}`}>%</span>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 rounded-full bg-slate-600/30 overflow-hidden mb-4">
                <div 
                  className={`progress-bar-fill bg-gradient-to-r ${getProgressColor(metric.value)}`}
                  style={{ width: `${Math.min(metric.value, 100)}%` }}
                />
              </div>
              
              {/* Description */}
              <p className="text-xs text-slate-400">
                {metric.description}
              </p>
              <p className="text-sm font-semibold text-slate-200 mt-1.5">
                {metric.motivationalText}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

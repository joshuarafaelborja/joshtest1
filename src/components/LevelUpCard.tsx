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
  if (value >= 80) return 'bg-success';
  if (value >= 50) return 'bg-warning';
  return 'bg-destructive';
}

function getProgressTextColor(value: number): string {
  if (value >= 80) return 'text-success';
  if (value >= 50) return 'text-warning';
  return 'text-destructive';
}

function getMotivationalText(value: number, type: string): string {
  if (type === 'weekly') {
    if (value >= 100) return "GOAL CRUSHED 🎉";
    if (value >= 80) return "ALMOST THERE";
    if (value >= 50) return "KEEP PUSHING";
    return "LET'S GO";
  }
  if (type === 'volume') {
    if (value > 0) return `+${value}% STRONGER`;
    if (value === 0) return "HOLDING STEADY";
    return "PUSH HARDER";
  }
  if (type === 'consistency') {
    if (value >= 80) return "ON FIRE 🔥";
    if (value >= 50) return "BUILDING MOMENTUM";
    return "EVERY DAY COUNTS";
  }
  if (type === 'pr') {
    if (value >= 50) return "PR MACHINE";
    if (value >= 25) return "MAKING GAINS";
    return "NEW PRS AWAIT";
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
      label: 'WEEKLY GOAL',
      value: weeklyProgress,
      description: `${thisWeekSets}/${weeklyGoal} SETS`,
      icon: <Target className="w-5 h-5" />,
      motivationalText: getMotivationalText(weeklyProgress, 'weekly')
    },
    {
      label: 'VOLUME',
      value: Math.min(Math.abs(volumeChange), 100),
      description: volumeChange >= 0 ? `+${volumeChange}% VS LAST WEEK` : `${volumeChange}% VS LAST WEEK`,
      icon: <TrendingUp className="w-5 h-5" />,
      motivationalText: getMotivationalText(volumeChange, 'volume')
    },
    {
      label: 'CONSISTENCY',
      value: consistencyScore,
      description: `${workoutDaysThisMonth} DAYS THIS MONTH`,
      icon: <Flame className="w-5 h-5" />,
      motivationalText: getMotivationalText(consistencyScore, 'consistency')
    },
    {
      label: 'PR RATE',
      value: prRate,
      description: `${exercisesWithPRs}/${data.exercises.length} EXERCISES`,
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
      <div className="relative overflow-hidden rounded-lg border-[3px] border-primary bg-card p-8">
        {/* Bold geometric background shapes */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rotate-45 translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-orange/10 rotate-12 -translate-x-8 translate-y-8" />
        
        <div className="relative flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6 border-[3px] border-primary/20">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h3 className="heading-hero text-2xl sm:text-3xl mb-3">READY TO<br/>LEVEL UP?</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs uppercase tracking-wide">
            Start logging workouts to unlock your progress dashboard
          </p>
          {onOpenCalculator && (
            <Button variant="outline" onClick={onOpenCalculator} className="gap-2">
              <Calculator className="w-5 h-5" />
              PLAN WORKOUT
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border-[3px] border-primary bg-card">
      {/* Bold geometric background shapes */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rotate-45 translate-x-20 -translate-y-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-orange/5 rotate-12 -translate-x-12 translate-y-12" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="heading-section">READY TO LEVEL UP?</h2>
            <p className="label-bold text-muted-foreground mt-1">YOUR PROGRESS THIS WEEK</p>
          </div>
          {onOpenCalculator && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onOpenCalculator}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Calculator className="w-4 h-4" />
              CALC
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className="relative bg-muted/50 rounded-lg p-4 border-[2px] border-border hover:border-primary/50 transition-colors"
            >
              {/* Icon and Label */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded flex items-center justify-center ${getProgressTextColor(metric.value)} bg-current/10`}>
                  {metric.icon}
                </div>
                <span className="label-bold text-muted-foreground">{metric.label}</span>
              </div>
              
              {/* Big percentage number */}
              <div className="mb-3">
                <span className={`stat-number ${getProgressTextColor(metric.value)}`}>
                  {metric.value}
                </span>
                <span className={`text-xl font-bold ${getProgressTextColor(metric.value)}`}>%</span>
              </div>
              
              {/* Thick progress bar */}
              <div className="progress-bar-athletic mb-3">
                <div 
                  className={`progress-bar-fill ${getProgressColor(metric.value)}`}
                  style={{ width: `${Math.min(metric.value, 100)}%` }}
                />
              </div>
              
              {/* Description */}
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {metric.description}
              </p>
              <p className="text-xs font-bold text-foreground mt-1">
                {metric.motivationalText}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

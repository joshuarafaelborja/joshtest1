import { AppData } from './types';
import { MedalData } from '@/components/MedalCard';

export function calculateMedals(data: AppData): MedalData[] {
  const allLogs = data.exercises.flatMap(e => 
    e.logs.map(log => ({
      ...log,
      exerciseName: e.name,
      exerciseId: e.id
    }))
  );

  const now = new Date();
  
  // Time boundaries
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const lastWeekStart = new Date(startOfWeek);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const fourWeeksAgo = new Date(now);
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  // ===== BRONZE: Consistency Builder =====
  // Worked out 3+ times this week
  const workoutDaysThisWeek = new Set(
    allLogs
      .filter(log => new Date(log.timestamp) >= startOfWeek)
      .map(log => {
        const date = new Date(log.timestamp);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      })
  ).size;

  const bronzeEarned = workoutDaysThisWeek >= 3;
  const bronzeEarnedDate = bronzeEarned ? getMostRecentWorkoutDate(allLogs, startOfWeek) : undefined;

  // ===== SILVER: Volume Chaser =====
  // Lifted 10% more than last week
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

  const volumeIncrease = lastWeekVolume > 0 
    ? ((thisWeekVolume - lastWeekVolume) / lastWeekVolume) * 100
    : thisWeekVolume > 0 ? 100 : 0;

  const silverEarned = volumeIncrease >= 10;
  const silverProgress = Math.min(Math.round(volumeIncrease), 10);

  // ===== GOLD: PR Crusher =====
  // Hit 5+ personal records this month
  let prsThisMonth = 0;
  
  data.exercises.forEach(exercise => {
    const logsBeforeThisMonth = exercise.logs.filter(
      log => new Date(log.timestamp) < startOfMonth
    );
    const logsThisMonth = exercise.logs.filter(
      log => new Date(log.timestamp) >= startOfMonth
    );

    if (logsBeforeThisMonth.length === 0) {
      // First month logging this exercise - each log could be a PR
      if (logsThisMonth.length > 0) {
        prsThisMonth++;
      }
    } else {
      const previousMax = Math.max(
        ...logsBeforeThisMonth.map(l => l.weight * (l.unit === 'kg' ? 2.20462 : 1))
      );
      
      const thisMonthMax = logsThisMonth.length > 0 
        ? Math.max(...logsThisMonth.map(l => l.weight * (l.unit === 'kg' ? 2.20462 : 1)))
        : 0;
      
      if (thisMonthMax > previousMax) {
        prsThisMonth++;
      }
    }
  });

  const goldEarned = prsThisMonth >= 5;

  // ===== DIAMOND: Elite Athlete =====
  // 4 week streak + 20% volume increase over 4 weeks
  const weeklyWorkoutCounts: number[] = [];
  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(startOfWeek);
    weekStart.setDate(weekStart.getDate() - (i * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const daysInWeek = new Set(
      allLogs
        .filter(log => {
          const logDate = new Date(log.timestamp);
          return logDate >= weekStart && logDate < weekEnd;
        })
        .map(log => {
          const date = new Date(log.timestamp);
          return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        })
    ).size;
    
    weeklyWorkoutCounts.push(daysInWeek);
  }

  const has4WeekStreak = weeklyWorkoutCounts.every(count => count >= 1);

  const fourWeeksAgoVolume = allLogs
    .filter(log => {
      const logDate = new Date(log.timestamp);
      const fiveWeeksAgo = new Date(fourWeeksAgo);
      fiveWeeksAgo.setDate(fiveWeeksAgo.getDate() - 7);
      return logDate >= fiveWeeksAgo && logDate < fourWeeksAgo;
    })
    .reduce((sum, log) => {
      const weightInLbs = log.unit === 'kg' ? log.weight * 2.20462 : log.weight;
      return sum + (weightInLbs * log.reps);
    }, 0);

  const volumeIncreaseOver4Weeks = fourWeeksAgoVolume > 0
    ? ((thisWeekVolume - fourWeeksAgoVolume) / fourWeeksAgoVolume) * 100
    : thisWeekVolume > 0 ? 100 : 0;

  const diamondEarned = has4WeekStreak && volumeIncreaseOver4Weeks >= 20;
  const diamondProgress = (has4WeekStreak ? 1 : 0) + (volumeIncreaseOver4Weeks >= 20 ? 1 : 0);

  return [
    {
      id: 'bronze',
      tier: 'bronze',
      icon: '🥉',
      title: 'Consistency Builder',
      description: 'Work out 3+ times this week',
      current: workoutDaysThisWeek,
      target: 3,
      earned: bronzeEarned,
      earnedDate: bronzeEarnedDate,
      motivationalText: bronzeEarned 
        ? "You're building unstoppable habits!" 
        : `${3 - workoutDaysThisWeek} more workout${3 - workoutDaysThisWeek !== 1 ? 's' : ''} to unlock! 💪`
    },
    {
      id: 'silver',
      tier: 'silver',
      icon: '🥈',
      title: 'Volume Chaser',
      description: 'Lift 10% more than last week',
      current: silverProgress,
      target: 10,
      earned: silverEarned,
      earnedDate: silverEarned ? now.toISOString() : undefined,
      motivationalText: silverEarned 
        ? "Your strength is skyrocketing!" 
        : `Push ${10 - silverProgress}% more volume! 🔥`
    },
    {
      id: 'gold',
      tier: 'gold',
      icon: '🥇',
      title: 'PR Crusher',
      description: 'Hit 5+ personal records this month',
      current: prsThisMonth,
      target: 5,
      earned: goldEarned,
      earnedDate: goldEarned ? now.toISOString() : undefined,
      motivationalText: goldEarned 
        ? "You're a record-breaking machine!" 
        : `${5 - prsThisMonth} more PR${5 - prsThisMonth !== 1 ? 's' : ''} to go! 🏆`
    },
    {
      id: 'diamond',
      tier: 'diamond',
      icon: '💎',
      title: 'Elite Athlete',
      description: '4 week streak + 20% volume increase',
      current: diamondProgress,
      target: 2,
      earned: diamondEarned,
      earnedDate: diamondEarned ? now.toISOString() : undefined,
      motivationalText: diamondEarned 
        ? "You've reached elite status!" 
        : has4WeekStreak 
          ? "Keep pushing volume! Almost there! ⚡" 
          : "Build your streak first! 📈"
    }
  ];
}

function getMostRecentWorkoutDate(logs: Array<{ timestamp: string }>, afterDate: Date): string {
  const recentLogs = logs
    .filter(log => new Date(log.timestamp) >= afterDate)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return recentLogs[0]?.timestamp || new Date().toISOString();
}

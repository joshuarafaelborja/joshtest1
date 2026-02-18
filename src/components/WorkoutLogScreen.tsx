import { useState, useEffect, useMemo } from 'react';
import { Plus, Dumbbell, ChevronDown, Users, Battery } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExerciseCard } from './ExerciseCard';
import { LevelUpCard } from './LevelUpCard';
import { SyncBanner } from './SyncBanner';
import { AccountMenu } from './AccountMenu';
import { AICoachPanel } from './AICoachPanel';
import { AppData, Exercise } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { usePreviousExercises, PreviousExercise } from '@/hooks/usePreviousExercises';
import spotLogo from '@/assets/spot-logo.svg';

interface WorkoutLogScreenProps {
  data: AppData;
  onLogNew: () => void;
  onLogPreviousExercise?: (exercise: PreviousExercise) => void;
  onSelectExercise: (exercise: Exercise) => void;
  onOpenAuth: () => void;
  onOpenSocial: () => void;
}

export function WorkoutLogScreen({ data, onLogNew, onLogPreviousExercise, onSelectExercise, onOpenAuth, onOpenSocial }: WorkoutLogScreenProps) {
  const [showCoachPanel, setShowCoachPanel] = useState(false);
  const [showExerciseDropdown, setShowExerciseDropdown] = useState(false);
  const [dismissedDeloadBanner, setDismissedDeloadBanner] = useState(false);
  const { isAuthenticated, loading, user } = useAuth();
  const { exercises: previousExercises } = usePreviousExercises();

  const hasLoggedOutBefore = !isAuthenticated && localStorage.getItem('coach-had-account') === 'true';

  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem('coach-had-account', 'true');
    }
  }, [isAuthenticated, user]);

  // Detect deload conditions: multiple exercises showing declining reps or acute deload recommendations
  const shouldSuggestDeload = useMemo(() => {
    if (data.exercises.length < 2) return false;
    
    let decliningCount = 0;
    for (const exercise of data.exercises) {
      const logs = exercise.logs;
      if (logs.length < 3) continue;
      
      const recent = logs.slice(-3);
      // Check if reps have been declining at the same weight
      const sameWeight = recent.every(l => l.weight === recent[0].weight);
      const declining = sameWeight && recent[2].reps < recent[0].reps;
      // Or if the last recommendation was an acute deload
      const lastLog = logs[logs.length - 1];
      if (declining || lastLog.recommendation === 'acute_deload') {
        decliningCount++;
      }
    }
    
    // Suggest deload if 2+ exercises show signs of fatigue
    return decliningCount >= 2;
  }, [data.exercises]);

  const sortedExercises = [...data.exercises].sort((a, b) => {
    const aLastLog = a.logs[a.logs.length - 1];
    const bLastLog = b.logs[b.logs.length - 1];
    if (!aLastLog) return 1;
    if (!bLastLog) return -1;
    return new Date(bLastLog.timestamp).getTime() - new Date(aLastLog.timestamp).getTime();
  });

  return (
    <div className="flex flex-col min-h-full">
      {/* Top bar with social + account */}
      <div className="flex items-center justify-end px-4 py-3 gap-2">
        <button
          onClick={() => setShowCoachPanel(true)}
          className="mr-auto group relative transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <img src={spotLogo} alt="Spot.AI" className="w-9 h-9 object-contain" />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background animate-pulse" />
        </button>
        <button
          onClick={onOpenSocial}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          title="Social"
        >
          <Users className="w-5 h-5 text-muted-foreground" />
        </button>
        <AccountMenu onCreateAccount={onOpenAuth} />
      </div>

      {/* Sync Banner for guests */}
      {!loading && !isAuthenticated && (
        <SyncBanner
          onCreateAccount={onOpenAuth}
          showLoginPrompt={hasLoggedOutBefore}
        />
      )}

      {/* Deload suggestion banner */}
      {shouldSuggestDeload && !dismissedDeloadBanner && (
        <div className="mx-4 mt-2 p-3 rounded-xl flex items-center gap-3" style={{ background: '#CCE0FF', border: '1px solid #0066FF' }}>
          <Battery className="w-5 h-5 shrink-0" style={{ color: '#0066FF' }} />
          <p className="text-sm flex-1" style={{ color: '#0066FF' }}>
            Consider taking it easy today — your body may need recovery.
          </p>
          <button
            onClick={() => setDismissedDeloadBanner(true)}
            className="text-xs font-medium shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: '#0066FF' }}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="px-4 pb-6 space-y-6">
        {/* Log New Set */}
        <div className="space-y-3">
          <Button
            size="xl"
            onClick={onLogNew}
            className="w-full shadow-lg shadow-primary/20"
          >
            <Plus className="w-6 h-6" />
            Log New Set
          </Button>

          {previousExercises.length > 0 && (
            <div className="relative">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowExerciseDropdown(!showExerciseDropdown)}
                className="w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" />
                  Select Recent Exercises
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${showExerciseDropdown ? 'rotate-180' : ''}`} />
              </Button>

              {showExerciseDropdown && (
                <div className="absolute z-30 w-full mt-2 border border-border rounded-xl overflow-hidden bg-card shadow-lg max-h-64 overflow-y-auto">
                  {previousExercises.map((exercise) => (
                    <button
                      key={exercise.name}
                      type="button"
                      onClick={() => {
                        if (onLogPreviousExercise) onLogPreviousExercise(exercise);
                        setShowExerciseDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors"
                    >
                      <p className="font-medium text-foreground">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Last: {exercise.lastWeight} {exercise.lastUnit} × {exercise.lastReps} reps
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Level Up Card */}
        <LevelUpCard data={data} />

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your Exercises</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Exercise List */}
        {sortedExercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[20vh] text-center border border-dashed border-border rounded-xl p-8 bg-card/50">
            <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-4">
              <Dumbbell className="w-7 h-7 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-bold mb-2 text-foreground">No exercises yet</h2>
            <p className="text-muted-foreground text-sm">Start by logging your first set</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onClick={() => onSelectExercise(exercise)}
              />
            ))}
          </div>
        )}
      </div>

      {/* AI Coach Panel */}
      <AICoachPanel
        isOpen={showCoachPanel}
        onClose={() => setShowCoachPanel(false)}
        onOpenCalculators={() => {}}
        data={data}
      />
    </div>
  );
}

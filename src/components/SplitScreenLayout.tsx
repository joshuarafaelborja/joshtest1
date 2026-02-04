import { useState, useEffect } from 'react';
import { Plus, Dumbbell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WarmupCalculator } from './WarmupCalculator';
import { ProgressiveOverloadCalculator } from './ProgressiveOverloadCalculator';
import { ExerciseCard } from './ExerciseCard';
import { AICoachPanel } from './AICoachPanel';
import { SyncBanner } from './SyncBanner';
import { AccountMenu } from './AccountMenu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppData, Exercise } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { usePreviousExercises, PreviousExercise } from '@/hooks/usePreviousExercises';
import coachLogo from '@/assets/coach-logo.svg';

interface SplitScreenLayoutProps {
  data: AppData;
  onLogNew: () => void;
  onLogPreviousExercise?: (exercise: PreviousExercise) => void;
  onSelectExercise: (exercise: Exercise) => void;
  onOpenAuth: () => void;
}

export function SplitScreenLayout({ data, onLogNew, onLogPreviousExercise, onSelectExercise, onOpenAuth }: SplitScreenLayoutProps) {
  const [showCoachPanel, setShowCoachPanel] = useState(false);
  const [showExerciseDropdown, setShowExerciseDropdown] = useState(false);
  const { isAuthenticated, loading, user } = useAuth();
  const { exercises: previousExercises } = usePreviousExercises();

  const hasLoggedOutBefore = !isAuthenticated && localStorage.getItem('coach-had-account') === 'true';

  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem('coach-had-account', 'true');
    }
  }, [isAuthenticated, user]);

  const sortedExercises = [...data.exercises].sort((a, b) => {
    const aLastLog = a.logs[a.logs.length - 1];
    const bLastLog = b.logs[b.logs.length - 1];
    if (!aLastLog) return 1;
    if (!bLastLog) return -1;
    return new Date(bLastLog.timestamp).getTime() - new Date(aLastLog.timestamp).getTime();
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowCoachPanel(true)}
              className="group relative transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <img src={coachLogo} alt="Coach" className="w-9 h-9 object-contain" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background animate-pulse" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Coach</h1>
          </div>
          <AccountMenu onCreateAccount={onOpenAuth} />
        </div>
      </header>

      {/* Sync Banner for guests */}
      {!loading && !isAuthenticated && (
        <SyncBanner 
          onCreateAccount={onOpenAuth} 
          showLoginPrompt={hasLoggedOutBefore}
        />
      )}

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Calculators Section - Priority */}
          <section className="space-y-6">
            <WarmupCalculator />
            
            <div className="h-px bg-border" />
            
            <ProgressiveOverloadCalculator />
          </section>

          {/* Divider */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Workout Log</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Log New Set Section */}
          <div className="space-y-3">
            <Button
              size="xl"
              onClick={onLogNew}
              className="w-full shadow-lg shadow-primary/20"
            >
              <Plus className="w-6 h-6" />
              Log New Set
            </Button>

            {/* Previous Exercises Dropdown */}
            {previousExercises.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowExerciseDropdown(!showExerciseDropdown)}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-card/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Quick Log Previous</p>
                      <p className="text-sm text-muted-foreground">{previousExercises.length} exercises available</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showExerciseDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showExerciseDropdown && (
                  <div className="absolute z-30 w-full mt-2 border border-border rounded-xl overflow-hidden bg-card shadow-lg max-h-64 overflow-y-auto">
                    {previousExercises.map((exercise) => (
                      <button
                        key={exercise.name}
                        type="button"
                        onClick={() => {
                          if (onLogPreviousExercise) {
                            onLogPreviousExercise(exercise);
                          }
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

          {/* Exercise List */}
          {sortedExercises.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[20vh] text-center border border-dashed border-slate-600/30 rounded-xl p-8 bg-card/50">
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <Dumbbell className="w-7 h-7 text-slate-400" />
              </div>
              <h2 className="text-lg font-bold mb-2 text-slate-100">No exercises yet</h2>
              <p className="text-slate-400 text-sm">
                Start by logging your first set
              </p>
            </div>
          ) : (
            <div className="space-y-3 pb-6">
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
      </ScrollArea>

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

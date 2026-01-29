import { useState, useEffect } from 'react';
import { Plus, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExerciseCard } from './ExerciseCard';
import { AICoachPanel } from './AICoachPanel';
import { SyncBanner } from './SyncBanner';
import { AccountMenu } from './AccountMenu';
import { LevelUpCard } from './LevelUpCard';
import { AppData, Exercise } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import coachLogo from '@/assets/coach-logo.svg';

interface WorkoutPanelProps {
  data: AppData;
  onLogNew: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  onOpenAuth: () => void;
  onOpenCalculator?: () => void;
  showHeader?: boolean;
}

export function WorkoutPanel({ data, onLogNew, onSelectExercise, onOpenAuth, onOpenCalculator, showHeader = true }: WorkoutPanelProps) {
  const [showCoachPanel, setShowCoachPanel] = useState(false);
  const { isAuthenticated, loading, user } = useAuth();

  // Check if user recently logged out (had an account before)
  const hasLoggedOutBefore = !isAuthenticated && localStorage.getItem('coach-had-account') === 'true';

  // Track when user has an account
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
    <div className="h-full flex flex-col bg-background">
      {/* Header - Bold athletic style */}
      {showHeader && (
        <header className="sticky top-0 z-10 bg-background border-b-[3px] border-border px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowCoachPanel(true)}
                className="group relative transition-transform duration-200 hover:scale-110 active:scale-95"
              >
                <img src={coachLogo} alt="Coach" className="w-12 h-12 object-contain" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-background animate-pulse" />
              </button>
              <h1 className="heading-hero text-3xl">COACH</h1>
            </div>
            <AccountMenu onCreateAccount={onOpenAuth} />
          </div>
        </header>
      )}

      {/* Sync Banner for guests */}
      {!loading && !isAuthenticated && (
        <SyncBanner 
          onCreateAccount={onOpenAuth} 
          showLoginPrompt={hasLoggedOutBefore}
        />
      )}

      {/* Content */}
      <div className="flex-1 p-4 pb-24 overflow-auto">
        {/* Level Up Card - Motivational dashboard */}
        <div className="mb-6">
          <LevelUpCard data={data} onOpenCalculator={onOpenCalculator} />
        </div>

        {/* Section divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 flex-1 bg-border" />
          <span className="label-bold text-muted-foreground">YOUR EXERCISES</span>
          <div className="h-1 flex-1 bg-border" />
        </div>

        {sortedExercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[30vh] text-center border-[3px] border-dashed border-border rounded-lg p-8">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mb-4">
              <Dumbbell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="heading-card mb-2">NO EXERCISES YET</h2>
            <p className="text-muted-foreground mb-4 text-sm uppercase tracking-wide">
              Start by logging your first set
            </p>
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

      {/* Fixed Bottom Button - Bold athletic style */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          size="xl"
          onClick={onLogNew}
          className="w-full shadow-lg animate-pulse-glow"
        >
          <Plus className="w-6 h-6" />
          LOG NEW SET
        </Button>
      </div>

      {/* AI Coach Panel */}
      <AICoachPanel 
        isOpen={showCoachPanel} 
        onClose={() => setShowCoachPanel(false)}
        onOpenCalculators={onOpenCalculator}
        data={data}
      />
    </div>
  );
}

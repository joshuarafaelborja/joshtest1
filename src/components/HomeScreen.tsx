import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExerciseCard } from './ExerciseCard';
import { AICoachPanel } from './AICoachPanel';
import { CalculatorFAB } from './CalculatorFAB';
import { GuestWelcome } from './GuestWelcome';
import { SyncBanner } from './SyncBanner';
import { AccountMenu } from './AccountMenu';
import { AppData, Exercise } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { getLocalWorkoutCount } from '@/lib/workoutService';
import coachLogo from '@/assets/coach-logo.svg';

interface HomeScreenProps {
  data: AppData;
  onLogNew: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  onOpenCalculators: () => void;
  onOpenAuth: () => void;
}

export function HomeScreen({ data, onLogNew, onSelectExercise, onOpenCalculators, onOpenAuth }: HomeScreenProps) {
  const [showCoachPanel, setShowCoachPanel] = useState(false);
  const [showGuestWelcome, setShowGuestWelcome] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const [guestWorkoutCount, setGuestWorkoutCount] = useState(0);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setGuestWorkoutCount(getLocalWorkoutCount());
      // Show welcome if no exercises and not authenticated
      if (data.exercises.length === 0) {
        setShowGuestWelcome(true);
      }
    }
  }, [loading, isAuthenticated, data.exercises.length]);

  const sortedExercises = [...data.exercises].sort((a, b) => {
    const aLastLog = a.logs[a.logs.length - 1];
    const bLastLog = b.logs[b.logs.length - 1];
    if (!aLastLog) return 1;
    if (!bLastLog) return -1;
    return new Date(bLastLog.timestamp).getTime() - new Date(aLastLog.timestamp).getTime();
  });

  const handleStartTraining = () => {
    setShowGuestWelcome(false);
    onLogNew();
  };

  // Show guest welcome for first-time visitors
  if (!loading && !isAuthenticated && showGuestWelcome && data.exercises.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={coachLogo} alt="Coach" className="w-10 h-10 object-contain" />
              <h1 className="text-2xl font-bold">Coach</h1>
            </div>
          </div>
        </header>
        <GuestWelcome 
          onCreateAccount={onOpenAuth}
          onStartTraining={handleStartTraining}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowCoachPanel(true)}
              className="group relative transition-transform duration-200 hover:scale-110 active:scale-95"
            >
              <img src={coachLogo} alt="Coach" className="w-10 h-10 object-contain" />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background animate-pulse" />
            </button>
            <h1 className="text-2xl font-bold">Coach</h1>
          </div>
          <AccountMenu onCreateAccount={onOpenAuth} />
        </div>
      </header>

      {/* Sync Banner for guests with 5+ workouts */}
      {!isAuthenticated && (
        <SyncBanner 
          workoutCount={guestWorkoutCount} 
          onCreateAccount={onOpenAuth}
        />
      )}

      {/* Content */}
      <div className="flex-1 p-4 pb-24">
        {sortedExercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <img src={coachLogo} alt="Coach mascot" className="w-20 h-20 object-contain mb-6 opacity-60" />
            <h2 className="text-xl font-semibold mb-2">No exercises yet</h2>
            <p className="text-muted-foreground mb-6">
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

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          size="lg"
          onClick={onLogNew}
          className="w-full h-14 text-lg font-semibold touch-target shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Log New Set
        </Button>
      </div>

      {/* Calculator FAB */}
      <CalculatorFAB 
        onClick={onOpenCalculators} 
        className="bottom-24 right-4"
      />

      {/* AI Coach Panel */}
      <AICoachPanel 
        isOpen={showCoachPanel} 
        onClose={() => setShowCoachPanel(false)}
        onOpenCalculators={onOpenCalculators}
      />
    </div>
  );
}

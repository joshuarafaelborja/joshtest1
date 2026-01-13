import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExerciseCard } from './ExerciseCard';
import { AppData, Exercise } from '@/lib/types';
import dogLogo from '@/assets/dog-logo.png';

interface HomeScreenProps {
  data: AppData;
  onLogNew: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export function HomeScreen({ data, onLogNew, onSelectExercise }: HomeScreenProps) {
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
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <img src={dogLogo} alt="Coach" className="w-10 h-10 object-contain" />
          <h1 className="text-2xl font-bold">Coach</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 pb-24">
        {sortedExercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <img src={dogLogo} alt="Coach mascot" className="w-24 h-24 object-contain mb-6 opacity-60" />
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
    </div>
  );
}

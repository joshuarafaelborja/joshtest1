import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RepRangeModalProps {
  exerciseName: string;
  initialMinReps?: number;
  initialGoalReps?: number;
  onSave: (minReps: number, goalReps: number) => void;
  onCancel: () => void;
}

export function RepRangeModal({ exerciseName, initialMinReps, initialGoalReps, onSave, onCancel }: RepRangeModalProps) {
  const [minReps, setMinReps] = useState(initialMinReps?.toString() ?? '6');
  const [goalReps, setGoalReps] = useState(initialGoalReps?.toString() ?? '8');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const min = parseInt(minReps);
    const goal = parseInt(goalReps);

    if (isNaN(min) || isNaN(goal)) {
      setError('Please enter valid numbers');
      return;
    }

    if (min <= 0 || goal <= 0) {
      setError('Rep counts must be greater than 0');
      return;
    }

    if (goal <= min) {
      setError('Goal reps must be higher than minimum reps');
      return;
    }

    onSave(min, goal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-card rounded-t-2xl sm:rounded-2xl p-6 shadow-xl animate-slide-up">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary touch-target"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Set Rep Range</h2>
          <p className="text-muted-foreground">
            Define your target rep range for <span className="font-semibold text-foreground">{exerciseName}</span>
          </p>
        </div>

        {/* Helper text */}
        <div className="bg-secondary rounded-lg p-4 mb-6 text-sm">
          <p className="font-medium mb-2">Rep Range Guide:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• <span className="text-foreground">Strength:</span> 3-5 reps</li>
            <li>• <span className="text-foreground">Muscle growth:</span> 6-8 reps</li>
            <li>• <span className="text-foreground">Endurance:</span> 8-12 reps</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="minReps" className="text-sm font-medium">
                Minimum Reps
              </Label>
              <Input
                id="minReps"
                type="number"
                inputMode="numeric"
                placeholder="e.g., 6"
                value={minReps}
                onChange={(e) => setMinReps(e.target.value)}
                className="h-14 text-xl mt-2"
              />
            </div>
            <div>
              <Label htmlFor="goalReps" className="text-sm font-medium">
                Goal Reps
              </Label>
              <Input
                id="goalReps"
                type="number"
                inputMode="numeric"
                placeholder="e.g., 8"
                value={goalReps}
                onChange={(e) => setGoalReps(e.target.value)}
                className="h-14 text-xl mt-2"
              />
            </div>
          </div>

          {error && (
            <p className="text-destructive text-sm mb-4">{error}</p>
          )}

          <Button type="submit" className="w-full h-14 text-lg font-semibold touch-target">
            Save Rep Range
          </Button>
        </form>
      </div>
    </div>
  );
}

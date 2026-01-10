import { ArrowLeft } from 'lucide-react';
import { Exercise } from '@/lib/types';
import { format } from 'date-fns';

interface ExerciseHistoryProps {
  exercise: Exercise;
  onBack: () => void;
}

export function ExerciseHistory({ exercise, onBack }: ExerciseHistoryProps) {
  const sortedLogs = [...exercise.logs].reverse().slice(0, 10);

  const getRecommendationBadge = (recommendation: string) => {
    const badgeConfig: Record<string, { label: string; className: string }> = {
      progressive_overload: { label: 'Increase', className: 'recommendation-badge-progress' },
      acclimation: { label: 'Increase', className: 'recommendation-badge-progress' },
      maintain: { label: 'Maintain', className: 'recommendation-badge-maintain' },
      acute_deload: { label: 'Deload', className: 'recommendation-badge-deload' },
      scheduled_deload: { label: 'Deload', className: 'recommendation-badge-deload' },
      insufficient_data: { label: 'Building data', className: 'recommendation-badge bg-muted text-muted-foreground' },
    };

    const config = badgeConfig[recommendation];
    if (!config) return null;

    return <span className={config.className}>{config.label}</span>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-secondary touch-target"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">{exercise.name}</h1>
            <p className="text-sm text-muted-foreground">
              Target: {exercise.minReps}-{exercise.goalReps} reps
            </p>
          </div>
        </div>
      </header>

      {/* History List */}
      <div className="flex-1 p-4">
        {sortedLogs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No logs yet for this exercise.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedLogs.map((log) => (
              <div
                key={log.id}
                className="card-elevated p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(log.timestamp), 'MMM d, yyyy')}
                  </span>
                  {getRecommendationBadge(log.recommendation)}
                </div>
                <p className="text-xl font-semibold">
                  {log.weight} {log.unit} × {log.reps} reps
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

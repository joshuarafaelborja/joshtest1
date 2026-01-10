import { ChevronRight } from 'lucide-react';
import { Exercise } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick: () => void;
}

export function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  const lastLog = exercise.logs[exercise.logs.length - 1];

  const getRecommendationBadge = () => {
    if (!lastLog) return null;

    const badgeConfig: Record<string, { label: string; className: string }> = {
      progressive_overload: { label: 'Increase', className: 'recommendation-badge-progress' },
      acclimation: { label: 'Increase', className: 'recommendation-badge-progress' },
      maintain: { label: 'Maintain', className: 'recommendation-badge-maintain' },
      acute_deload: { label: 'Deload', className: 'recommendation-badge-deload' },
      scheduled_deload: { label: 'Deload', className: 'recommendation-badge-deload' },
      insufficient_data: { label: 'Building data', className: 'recommendation-badge bg-muted text-muted-foreground' },
    };

    const config = badgeConfig[lastLog.recommendation];
    if (!config) return null;

    return <span className={config.className}>{config.label}</span>;
  };

  return (
    <button
      onClick={onClick}
      className="w-full card-elevated p-4 flex items-center gap-4 transition-all hover:shadow-md active:scale-[0.98] text-left touch-target"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-lg truncate">{exercise.name}</h3>
          {getRecommendationBadge()}
        </div>
        {lastLog ? (
          <p className="text-muted-foreground">
            {lastLog.weight} {lastLog.unit} × {lastLog.reps} reps
            <span className="mx-2">·</span>
            {formatDistanceToNow(new Date(lastLog.timestamp), { addSuffix: true })}
          </p>
        ) : (
          <p className="text-muted-foreground">No logs yet</p>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
    </button>
  );
}

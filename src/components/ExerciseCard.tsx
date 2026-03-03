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
      insufficient_data: { label: 'Building', className: 'recommendation-badge bg-secondary text-muted-foreground border border-border' },
    };

    const config = badgeConfig[lastLog.recommendation];
    if (!config) return null;

    return <span className={config.className}>{config.label}</span>;
  };

  return (
    <button
      onClick={onClick}
      className="group w-full rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:border-[#3B82F6]/40 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] touch-target"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-gray-900 truncate">{exercise.name}</h3>
            {getRecommendationBadge()}
          </div>
          {lastLog ? (
            <p className="text-sm text-gray-500">
              Last: {lastLog.weight} {lastLog.unit} × {lastLog.reps} reps
              <span className="text-gray-300 mx-1">·</span>
              <span className="text-gray-400">
                {formatDistanceToNow(new Date(lastLog.timestamp), { addSuffix: true })}
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-400">No logs yet</p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#3B82F6] transition-colors flex-shrink-0" />
      </div>
    </button>
  );
}

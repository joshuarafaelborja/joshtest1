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

  const getAccentColor = () => {
    if (!lastLog) return 'bg-muted';
    const colorMap: Record<string, string> = {
      progressive_overload: 'bg-primary',
      acclimation: 'bg-primary',
      maintain: 'bg-success',
      acute_deload: 'bg-warning',
      scheduled_deload: 'bg-warning',
      insufficient_data: 'bg-muted-foreground',
    };
    return colorMap[lastLog.recommendation] || 'bg-muted';
  };

  return (
    <button
      onClick={onClick}
      className="group relative w-full card-industrial p-0 overflow-hidden transition-all duration-200 hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.99] text-left touch-target"
    >
      {/* Accent bar */}
      <div className={`accent-bar-left ${getAccentColor()}`} />
      
      <div className="pl-5 pr-4 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Exercise name */}
            <div className="flex items-center gap-3 mb-3">
              <h3 className="heading-card truncate text-foreground">{exercise.name}</h3>
              {getRecommendationBadge()}
            </div>
            
            {lastLog ? (
              <div className="flex items-baseline gap-6">
                {/* Weight - Large bold number */}
                <div>
                  <span className="stat-number-sm text-primary">{lastLog.weight}</span>
                  <span className="label-bold text-muted-foreground ml-1">{lastLog.unit}</span>
                </div>
                
                {/* Reps */}
                <div>
                  <span className="stat-number-sm text-foreground">{lastLog.reps}</span>
                  <span className="label-bold text-muted-foreground ml-1">reps</span>
                </div>
              </div>
            ) : (
              <p className="label-bold text-muted-foreground">No logs yet</p>
            )}
            
            {/* Timestamp */}
            {lastLog && (
              <p className="text-xs text-muted-foreground mt-3">
                {formatDistanceToNow(new Date(lastLog.timestamp), { addSuffix: true })}
              </p>
            )}
          </div>
          
          <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
        </div>
      </div>
    </button>
  );
}

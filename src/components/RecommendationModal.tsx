import { X, TrendingUp, Minus, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AiRecommendation {
  action: 'INCREASE_WEIGHT' | 'HOLD_WEIGHT' | 'DROP_WEIGHT';
  current_weight: number;
  recommended_weight: number;
  trend: string;
  explanation: string;
}

interface RecommendationModalProps {
  recommendation: AiRecommendation;
  onClose: () => void;
}

export function RecommendationModal({ recommendation, onClose }: RecommendationModalProps) {
  const config = {
    INCREASE_WEIGHT: {
      bg: 'bg-emerald-500/15 border-emerald-500/40',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      label: 'Time to go up!',
      Icon: TrendingUp,
    },
    HOLD_WEIGHT: {
      bg: 'bg-blue-500/15 border-blue-500/40',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      label: 'Hold steady',
      Icon: Minus,
    },
    DROP_WEIGHT: {
      bg: 'bg-yellow-500/15 border-yellow-500/40',
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
      label: 'Drop back',
      Icon: TrendingDown,
    },
  }[recommendation.action];

  const { Icon } = config;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div 
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={`relative w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl animate-slide-up border ${config.bg}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary touch-target"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pt-2">
          {/* Icon + Label */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2.5 rounded-full ${config.iconBg}`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <h2 className="text-xl font-bold">{config.label}</h2>
          </div>

          {/* Weight recommendation */}
          {recommendation.action !== 'HOLD_WEIGHT' && (
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-muted-foreground text-sm">{recommendation.current_weight} lbs →</span>
              <span className="text-2xl font-bold">{recommendation.recommended_weight} lbs</span>
            </div>
          )}

          {/* Trend line */}
          <div className="bg-background/50 rounded-lg px-4 py-3 mb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Trend</p>
            <p className="text-sm font-medium">{recommendation.trend}</p>
          </div>

          {/* Explanation */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            {recommendation.explanation}
          </p>

          <Button
            onClick={onClose}
            className="w-full h-12 text-base font-semibold touch-target"
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}

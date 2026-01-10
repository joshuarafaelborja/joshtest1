import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecommendationResult } from '@/lib/types';

interface RecommendationModalProps {
  recommendation: RecommendationResult;
  onClose: () => void;
}

export function RecommendationModal({ recommendation, onClose }: RecommendationModalProps) {
  const getBgColor = () => {
    switch (recommendation.type) {
      case 'progressive_overload':
      case 'acclimation':
        return 'bg-primary/10';
      case 'maintain':
        return 'bg-success/10';
      case 'acute_deload':
      case 'scheduled_deload':
        return 'bg-warning/10';
      default:
        return 'bg-secondary';
    }
  };

  const getIconColor = () => {
    switch (recommendation.type) {
      case 'progressive_overload':
      case 'acclimation':
        return 'text-primary';
      case 'maintain':
        return 'text-success';
      case 'acute_deload':
      case 'scheduled_deload':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-card rounded-t-2xl sm:rounded-2xl p-6 shadow-xl animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary touch-target"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center pt-4">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getBgColor()} mb-6`}>
            <span className={`text-4xl ${getIconColor()}`}>{recommendation.icon}</span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl font-bold mb-3">{recommendation.headline}</h2>

          {/* Message */}
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            {recommendation.message}
          </p>

          {/* CTA */}
          <Button
            onClick={onClose}
            className="w-full h-14 text-lg font-semibold touch-target"
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}

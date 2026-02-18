import { ArrowLeft, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WarmupCalculator } from './WarmupCalculator';
import { ProgressiveOverloadCalculator } from './ProgressiveOverloadCalculator';
import { DeloadPlanner } from './DeloadPlanner';

interface CalculatorsScreenProps {
  onBack: () => void;
  onSaveToWorkout?: (exerciseName: string, weight: number, reps: number) => void;
}

export function CalculatorsScreen({ onBack }: CalculatorsScreenProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FFFFFF' }}>
      {/* Header */}
      <header className="px-6 pt-6 pb-4" style={{ background: '#FFFFFF' }}>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0 -ml-2"
            style={{ color: '#0066FF' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#0066FF' }}>
            <Calculator className="w-5 h-5" style={{ color: '#FFFFFF' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: '#0066FF' }}>CALCULATORS</h1>
            <p className="text-sm" style={{ color: '#0066FF', opacity: 0.6 }}>Smart tools for your training</p>
          </div>
        </div>
      </header>

      {/* Divider */}
      <div className="mx-6 h-px" style={{ background: '#CCE0FF' }} />

      {/* Content */}
      <div className="flex-1 px-6 pb-8 space-y-8">
        <WarmupCalculator />
        <div className="h-px" style={{ background: '#CCE0FF' }} />
        <DeloadPlanner />
        <div className="h-px" style={{ background: '#CCE0FF' }} />
        <ProgressiveOverloadCalculator />
      </div>
    </div>
  );
}

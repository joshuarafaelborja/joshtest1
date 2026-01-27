import { ArrowLeft, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WarmupCalculator } from './WarmupCalculator';
import { ProgressiveOverloadCalculator } from './ProgressiveOverloadCalculator';

interface CalculatorsScreenProps {
  onBack: () => void;
  onSaveToWorkout?: (exerciseName: string, weight: number, reps: number) => void;
}

export function CalculatorsScreen({ onBack }: CalculatorsScreenProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-background px-6 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0 -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center">
            <Calculator className="w-5 h-5 text-background" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">CALCULATORS</h1>
            <p className="text-sm text-muted-foreground">Smart tools for your training</p>
          </div>
        </div>
      </header>

      {/* Divider */}
      <div className="section-divider mx-6" />

      {/* Content */}
      <div className="flex-1 px-6 pb-8 space-y-8">
        <WarmupCalculator />
        
        <div className="section-divider" />
        
        <ProgressiveOverloadCalculator />
      </div>
    </div>
  );
}

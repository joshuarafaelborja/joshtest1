import { ArrowLeft, Calculator, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OneRepMaxCalculator, PlateCalculator, VolumeCalculator } from './calculators';
import { ProgressiveOverloadCalculator } from './ProgressiveOverloadCalculator';
import { WarmupCalculator } from './WarmupCalculator';
import coachLogo from '@/assets/coach-logo.svg';

interface CalculatorsScreenProps {
  onBack: () => void;
  onSaveToWorkout?: (exerciseName: string, weight: number, reps: number) => void;
}

export function CalculatorsScreen({ onBack, onSaveToWorkout }: CalculatorsScreenProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Calculators</h1>
            <p className="text-sm text-muted-foreground">Smart fitness tools</p>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="px-4 py-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Smart Calculators</h2>
            <p className="text-sm text-muted-foreground">
              Get instant recommendations for your workouts
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 pb-8">
        {/* Primary Calculators */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-1">
            Essential Tools
          </h3>
          <OneRepMaxCalculator onSaveToWorkout={onSaveToWorkout} />
          <PlateCalculator />
          <VolumeCalculator onSaveToWorkout={onSaveToWorkout} />
        </section>

        {/* Secondary Calculators */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-1">
            Progression & Warmup
          </h3>
          <ProgressiveOverloadCalculator />
          <WarmupCalculator />
        </section>
      </div>
    </div>
  );
}

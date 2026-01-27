import { ArrowLeft, Calculator, Sparkles, Flame, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressiveOverloadCalculator } from './ProgressiveOverloadCalculator';
import { WarmupCalculator } from './WarmupCalculator';

interface CalculatorsScreenProps {
  onBack: () => void;
  onSaveToWorkout?: (exerciseName: string, weight: number, reps: number) => void;
}

export function CalculatorsScreen({ onBack }: CalculatorsScreenProps) {
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

      {/* Hero Banner - Level Up Style */}
      <div className="mx-4 mt-6 relative overflow-hidden rounded-2xl bg-primary shadow-2xl">
        {/* Decorative circles */}
        <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -right-4 top-12 w-20 h-20 rounded-full bg-white/5" />
        
        <div className="relative px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Smart Calculators</h2>
              <p className="text-white/70 text-sm">
                Get instant recommendations for your workouts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 pb-8">
        {/* Warmup Calculator Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-warning to-warning/80 shadow-lg animate-fade-in">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10" />
          <div className="relative p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Warm-up Sets</h3>
                <p className="text-sm text-white/80">Calculate your warm-up progression</p>
              </div>
            </div>
          </div>
        </div>
        <WarmupCalculator />

        {/* Progressive Overload Calculator Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 shadow-lg animate-fade-in mt-6">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10" />
          <div className="relative p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Progressive Overload</h3>
                <p className="text-sm text-white/80">Calculate your next weight target</p>
              </div>
            </div>
          </div>
        </div>
        <ProgressiveOverloadCalculator />
      </div>
    </div>
  );
}

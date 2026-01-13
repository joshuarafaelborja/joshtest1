import { ArrowLeft, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressiveOverloadCalculator } from './ProgressiveOverloadCalculator';
import { WarmupCalculator } from './WarmupCalculator';
import coachLogo from '@/assets/coach-logo.svg';

interface CalculatorsScreenProps {
  onBack: () => void;
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
          <img src={coachLogo} alt="Coach" className="w-8 h-8 object-contain" />
          <div>
            <h1 className="text-xl font-bold">Calculators</h1>
            <p className="text-sm text-muted-foreground">Fitness tools</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 pb-8">
        <ProgressiveOverloadCalculator />
        <WarmupCalculator />
      </div>
    </div>
  );
}

import { Flame, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import spotLogo from '@/assets/spot-ai-logo.svg';

interface OnboardingFlowProps {
  onComplete: (userName?: string, goToCalculator?: boolean) => void;
  onSkip: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background px-6 py-12 animate-fade-in">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img src={spotLogo} alt="Spot.AI" className="w-36 h-auto object-contain" />
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-black tracking-tight text-center text-foreground uppercase mb-12">
          Your AI Gym Buddy
        </h1>

        {/* Value props */}
        <div className="space-y-5 mb-14">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">
              Smart warm-ups tailored to your lifts
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">
              Know exactly when to increase weight
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">
              Train with friends, not alone
            </p>
          </div>
        </div>

        {/* CTA */}
        <Button
          size="xl"
          onClick={() => onComplete()}
          className="w-full font-black uppercase tracking-wide"
        >
          Start Training
        </Button>
      </div>
    </div>
  );
}

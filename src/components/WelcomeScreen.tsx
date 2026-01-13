import { TrendingUp, Target, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import coachLogo from '@/assets/coach-logo.svg';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background px-6 py-12 animate-fade-in">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        {/* Logo & Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-28 h-28 mb-6">
            <img src={coachLogo} alt="Coach mascot" className="w-28 h-28 object-contain drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Welcome to Coach
          </h1>
          <p className="text-lg text-muted-foreground">
            Your gym buddy for smart weight progression
          </p>
        </div>

        {/* Features */}
        <div className="space-y-6 mb-12">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Set Your Goals</h3>
              <p className="text-muted-foreground">
                Define your target rep range for each exercise
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Track Progress</h3>
              <p className="text-muted-foreground">
                Log your weight and reps after each set
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Get Smart Advice</h3>
              <p className="text-muted-foreground">
                Receive personalized recommendations based on your last 3 sessions
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button
          size="lg"
          onClick={onGetStarted}
          className="w-full h-14 text-lg font-semibold touch-target"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}

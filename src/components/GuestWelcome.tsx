import { Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import spotLogo from '@/assets/spot-ai-logo.svg';

interface GuestWelcomeProps {
  onCreateAccount: () => void;
  onStartTraining: () => void;
}

export function GuestWelcome({ onCreateAccount, onStartTraining }: GuestWelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <img 
        src={spotLogo} 
        alt="Spot.AI" 
        className="w-48 h-auto object-contain mb-6"
      />
      
      <h1 className="text-3xl font-bold mb-3 text-foreground">
        Welcome to <span className="text-primary">Spot.AI</span>
      </h1>
      
      <p className="text-muted-foreground mb-8 max-w-sm">
        Your workouts will be saved on this device. Create an account to sync across devices and back up your progress.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          size="lg"
          onClick={onCreateAccount}
          className="w-full h-12 text-base font-semibold"
        >
          Create Account
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={onStartTraining}
          className="w-full h-12 text-base font-semibold"
        >
          <Dumbbell className="w-5 h-5 mr-2" />
          Start Training
        </Button>
      </div>
    </div>
  );
}

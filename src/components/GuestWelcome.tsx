import { Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import coachLogo from '@/assets/coach-logo.svg';

interface GuestWelcomeProps {
  onCreateAccount: () => void;
  onStartTraining: () => void;
}

export function GuestWelcome({ onCreateAccount, onStartTraining }: GuestWelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <img 
        src={coachLogo} 
        alt="Coach" 
        className="w-24 h-24 object-contain mb-6"
      />
      
      <h1 className="text-2xl font-bold mb-3">Welcome to Coach!</h1>
      
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

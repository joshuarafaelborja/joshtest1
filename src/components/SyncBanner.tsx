import { useState } from 'react';
import { CloudUpload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SyncBannerProps {
  workoutCount: number;
  onCreateAccount: () => void;
}

export function SyncBanner({ workoutCount, onCreateAccount }: SyncBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || workoutCount < 5) return null;

  return (
    <div className="mx-4 mb-4 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <CloudUpload className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm">Save your progress</p>
          <p className="text-xs text-muted-foreground truncate">
            Create an account to sync across devices
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          size="sm"
          onClick={onCreateAccount}
          className="h-8 px-3 text-xs font-semibold"
        >
          Sign Up
        </Button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

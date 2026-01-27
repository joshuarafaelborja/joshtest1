import { useState } from 'react';
import { Cloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SyncBannerProps {
  onCreateAccount: () => void;
}

export function SyncBanner({ onCreateAccount }: SyncBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mx-4 mt-4 p-3 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Cloud className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          <span className="hidden sm:inline">Your workouts are saved locally. </span>
          <button 
            onClick={onCreateAccount}
            className="text-primary hover:underline font-medium"
          >
            Create an account
          </button>
          <span className="hidden sm:inline"> to access from other devices.</span>
          <span className="sm:hidden"> to sync.</span>
        </p>
      </div>
      
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
}

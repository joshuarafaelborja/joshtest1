import { useState } from 'react';
import { CloudUpload, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { migrateLocalWorkoutsToSupabase } from '@/lib/workoutService';

interface MigrationModalProps {
  isOpen: boolean;
  workoutCount: number;
  onClose: () => void;
  onMigrationComplete: () => void;
}

export function MigrationModal({ isOpen, workoutCount, onClose, onMigrationComplete }: MigrationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [migrated, setMigrated] = useState(false);

  if (!isOpen) return null;

  const handleMigrate = async () => {
    setIsLoading(true);
    const result = await migrateLocalWorkoutsToSupabase();
    setIsLoading(false);
    
    if (result.success) {
      setMigrated(true);
      setTimeout(() => {
        onMigrationComplete();
      }, 2000);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-background rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95 duration-200">
        {migrated ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Progress Backed Up!</h2>
            <p className="text-muted-foreground">
              Your {workoutCount} workouts are now synced to your account.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <CloudUpload className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Migrate Your Workouts?</h2>
              <p className="text-muted-foreground text-sm mt-2">
                You have <span className="font-bold text-foreground">{workoutCount} workout{workoutCount !== 1 ? 's' : ''}</span> saved on this device.
                Would you like to back them up to your account?
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleMigrate}
                className="w-full h-12 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Migrating...
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-4 h-4 mr-2" />
                    Migrate {workoutCount} Workout{workoutCount !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="w-full h-10 text-muted-foreground"
                disabled={isLoading}
              >
                Skip for Now
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Your local data will be cleared after migration.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { X, Mail, CheckCircle, Loader2, Eye, EyeOff, Dumbbell, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { migrateLocalWorkoutsToSupabase, getLocalWorkoutCount } from '@/lib/workoutService';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

type AuthMode = 'signup' | 'login';
type AuthStep = 'form' | 'migrating' | 'success';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: AuthMode;
}

export function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [step, setStep] = useState<AuthStep>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [migratedCount, setMigratedCount] = useState(0);
  const [profileLink, setProfileLink] = useState<string | null>(null);
  const { signUp, signIn, getProfileLink, profile } = useAuth();

  const localWorkoutCount = getLocalWorkoutCount();

  // Update profile link when profile changes
  useEffect(() => {
    if (profile && step === 'success') {
      setProfileLink(getProfileLink());
    }
  }, [profile, step, getProfileLink]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setError(emailResult.error.errors[0].message);
      return;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      setError(passwordResult.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    if (mode === 'signup') {
      const { error: authError, user } = await signUp(email, password);
      
      if (authError) {
        setIsLoading(false);
        if (authError.message.includes('already registered')) {
          setError('This email is already registered. Try logging in instead.');
        } else {
          setError(authError.message);
        }
        return;
      }

      // If there are local workouts, migrate them
      if (localWorkoutCount > 0 && user) {
        setStep('migrating');
        const result = await migrateLocalWorkoutsToSupabase();
        setMigratedCount(result.count);
      }

      setIsLoading(false);
      setStep('success');
    } else {
      const { error: authError } = await signIn(email, password);
      
      setIsLoading(false);

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(authError.message);
        }
        return;
      }

      onSuccess?.();
      handleClose();
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    setStep('form');
    setMode(initialMode);
    setMigratedCount(0);
    setProfileLink(null);
    onClose();
  };

  const copyLink = () => {
    if (profileLink) {
      navigator.clipboard.writeText(profileLink);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-background rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {step === 'success' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Account Created!</h2>
            <p className="text-muted-foreground mb-4">
              {migratedCount > 0 
                ? `${migratedCount} workout${migratedCount !== 1 ? 's' : ''} synced to your account.`
                : 'Your workouts are now synced across devices.'
              }
            </p>
            
            {profileLink && (
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Access your workouts anytime at:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-background px-3 py-2 rounded border truncate">
                    {profileLink}
                  </code>
                  <Button size="sm" variant="outline" onClick={copyLink}>
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <Button onClick={handleClose} className="w-full h-12">
              Start Training
            </Button>
          </div>
        ) : step === 'migrating' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-bold mb-2">Syncing Workouts</h2>
            <p className="text-muted-foreground">
              Migrating {localWorkoutCount} workout{localWorkoutCount !== 1 ? 's' : ''} to your account...
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                {mode === 'signup' ? (
                  <Dumbbell className="w-6 h-6 text-primary" />
                ) : (
                  <Mail className="w-6 h-6 text-primary" />
                )}
              </div>
              <h2 className="text-xl font-bold">
                {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {mode === 'signup' 
                  ? localWorkoutCount > 0 
                    ? `Sync your ${localWorkoutCount} workout${localWorkoutCount !== 1 ? 's' : ''} across devices`
                    : 'Sync your workouts across devices'
                  : 'Sign in to access your workouts'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base"
                  autoFocus
                  disabled={isLoading}
                />
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-base pr-12"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  mode === 'signup' ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground text-center mt-4">
              {mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button 
                    onClick={() => { setMode('login'); setError(''); }}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => { setMode('signup'); setError(''); }}
                    className="text-primary hover:underline font-medium"
                  >
                    Create one
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

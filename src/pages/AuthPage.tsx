import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Eye, EyeOff, Loader2, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { migrateLocalWorkoutsToSupabase, getLocalWorkoutCount } from '@/lib/workoutService';
import { z } from 'zod';
import coachLogo from '@/assets/coach-logo.svg';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

type AuthMode = 'signup' | 'login';

export default function AuthPage() {
  const navigate = useNavigate();
  const { isAuthenticated, signUp, signIn, loading } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const localWorkoutCount = getLocalWorkoutCount();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

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

      // Migrate local workouts if any
      if (localWorkoutCount > 0 && user) {
        await migrateLocalWorkoutsToSupabase();
      }

      setIsLoading(false);
      navigate('/');
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

      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src={coachLogo} 
              alt="Coach" 
              className="w-16 h-16 mx-auto mb-4 object-contain"
            />
            <h2 className="text-2xl font-bold">
              {mode === 'signup' ? 'Join Coach' : 'Welcome Back'}
            </h2>
            <p className="text-muted-foreground mt-1">
              {mode === 'signup' 
                ? localWorkoutCount > 0 
                  ? `Sync your ${localWorkoutCount} workout${localWorkoutCount !== 1 ? 's' : ''} across devices`
                  : 'Track your progress everywhere'
                : 'Access your synced workouts'
              }
            </p>
          </div>

          {/* Form */}
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

          {/* Switch mode */}
          <p className="text-sm text-muted-foreground text-center mt-6">
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
        </div>
      </div>
    </div>
  );
}

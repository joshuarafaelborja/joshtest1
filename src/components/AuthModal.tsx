import { useState } from 'react';
import { X, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signInWithMagicLink } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    const { error: authError } = await signInWithMagicLink(email);

    setIsLoading(false);

    if (authError) {
      if (authError.message.includes('already registered')) {
        setError('This email is already registered. Check your inbox for the magic link.');
      } else {
        setError(authError.message);
      }
      return;
    }

    setEmailSent(true);
    onSuccess?.();
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setEmailSent(false);
    onClose();
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

        {emailSent ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Check your email</h2>
            <p className="text-muted-foreground mb-6">
              We sent a magic link to <span className="font-medium text-foreground">{email}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Click the link in your email to sign in. You can close this window.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Create Account</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Sync your workouts across devices
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base"
                  autoFocus
                  disabled={isLoading}
                />
                {error && (
                  <p className="text-sm text-destructive mt-2">{error}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Magic Link'
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-4">
              No password needed. We'll email you a secure link.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { User, LogOut, Link as LinkIcon, Copy, Check, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface AccountMenuProps {
  onCreateAccount: () => void;
}

export function AccountMenu({ onCreateAccount }: AccountMenuProps) {
  const { user, isAuthenticated, signOut, getProfileLink } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowMenu(false);
    setShowLogoutConfirm(false);
  };

  const handleCopyLink = () => {
    const link = getProfileLink();
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isAuthenticated) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onCreateAccount}
        className="h-9 px-3"
      >
        <User className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  const profileLink = getProfileLink();

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
        </button>

        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowMenu(false)} 
            />
            <div className="absolute right-0 top-12 z-50 w-72 bg-background rounded-xl shadow-lg border p-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2 border-b mb-2">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Synced across devices</p>
              </div>

              {profileLink && (
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left mb-1"
                >
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">Share Profile</p>
                    <p className="text-xs text-muted-foreground truncate">{profileLink}</p>
                  </div>
                  {copied ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              )}
              
              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-background rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <LogOut className="w-6 h-6 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold">Sign Out?</h2>
              <p className="text-muted-foreground text-sm mt-2">
                Your workouts will stay synced to your account. You can continue as a guest or log back in.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={onCreateAccount}
                variant="outline"
                className="w-full h-12 text-base font-semibold"
              >
                <User className="w-4 h-4 mr-2" />
                Switch Account
              </Button>
              
              <Button
                onClick={handleSignOut}
                variant="secondary"
                className="w-full h-12 text-base font-semibold"
              >
                <Dumbbell className="w-4 h-4 mr-2" />
                Continue as Guest
              </Button>

              <Button
                variant="ghost"
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full h-10 text-muted-foreground"
              >
                Cancel
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Guest workouts are saved locally on this device only.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

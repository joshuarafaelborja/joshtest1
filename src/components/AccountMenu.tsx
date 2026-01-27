import { useState } from 'react';
import { User, LogOut, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface AccountMenuProps {
  onCreateAccount: () => void;
}

export function AccountMenu({ onCreateAccount }: AccountMenuProps) {
  const { user, isAuthenticated, signOut, getProfileLink } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowMenu(false);
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
              <p className="text-xs text-muted-foreground">Signed in</p>
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
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
            >
              <LogOut className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

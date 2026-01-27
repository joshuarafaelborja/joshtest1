import { useState } from 'react';
import { User, LogOut, Settings, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface AccountMenuProps {
  onCreateAccount: () => void;
}

export function AccountMenu({ onCreateAccount }: AccountMenuProps) {
  const { user, isAuthenticated, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowMenu(false);
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
          <div className="absolute right-0 top-12 z-50 w-64 bg-background rounded-xl shadow-lg border p-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-2 border-b mb-2">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Signed in</p>
            </div>
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
            >
              <LogOut className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Sign Out</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

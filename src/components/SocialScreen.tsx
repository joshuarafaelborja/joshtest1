import { useState } from 'react';
import { Users, Activity, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FriendsList } from './FriendsList';
import { ActivityFeed } from './ActivityFeed';
import { useAuth } from '@/hooks/useAuth';
import coachLogo from '@/assets/coach-logo.svg';
import { AccountMenu } from './AccountMenu';

interface SocialScreenProps {
  onBack: () => void;
  onOpenAuth: () => void;
}

export function SocialScreen({ onBack, onOpenAuth }: SocialScreenProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'friends'>('feed');
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <img src={coachLogo} alt="Coach" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold text-foreground">Social</h1>
          </div>
          <AccountMenu onCreateAccount={onOpenAuth} />
        </div>
      </header>

      {!isAuthenticated ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-bold mb-2 text-foreground">Sign in to connect</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs">
            Create an account to add friends and see their workout activity.
          </p>
          <Button onClick={onOpenAuth}>Sign In</Button>
        </div>
      ) : (
        <>
          {/* Tab Bar */}
          <div className="border-b border-border">
            <div className="max-w-4xl mx-auto flex">
              <button
                onClick={() => setActiveTab('feed')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === 'feed'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Activity className="w-4 h-4" />
                Activity
              </button>
              <button
                onClick={() => setActiveTab('friends')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === 'friends'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Users className="w-4 h-4" />
                Friends
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'feed' ? <ActivityFeed /> : <FriendsList />}
          </div>
        </>
      )}
    </div>
  );
}

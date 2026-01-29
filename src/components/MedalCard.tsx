import { useState } from 'react';
import { Lock, Check, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export type MedalTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface MedalData {
  id: string;
  tier: MedalTier;
  icon: string;
  title: string;
  description: string;
  current: number;
  target: number;
  earned: boolean;
  earnedDate?: string;
  motivationalText: string;
}

interface MedalCardProps {
  medal: MedalData;
}

const tierColors: Record<MedalTier, { bg: string; border: string; glow: string; icon: string }> = {
  bronze: {
    bg: 'bg-gradient-to-br from-amber-600/20 to-amber-800/20',
    border: 'border-amber-600/50',
    glow: 'shadow-amber-500/30',
    icon: 'from-amber-600 to-amber-800'
  },
  silver: {
    bg: 'bg-gradient-to-br from-slate-300/20 to-slate-500/20',
    border: 'border-slate-400/50',
    glow: 'shadow-slate-400/30',
    icon: 'from-slate-300 to-slate-500'
  },
  gold: {
    bg: 'bg-gradient-to-br from-yellow-400/20 to-yellow-600/20',
    border: 'border-yellow-500/50',
    glow: 'shadow-yellow-500/30',
    icon: 'from-yellow-400 to-yellow-600'
  },
  diamond: {
    bg: 'bg-gradient-to-br from-cyan-300/20 to-purple-500/20',
    border: 'border-cyan-400/50',
    glow: 'shadow-cyan-400/30',
    icon: 'from-cyan-300 via-blue-400 to-purple-500'
  }
};

function formatEarnedDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

export function MedalCard({ medal }: MedalCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const colors = tierColors[medal.tier];
  const progress = Math.min((medal.current / medal.target) * 100, 100);

  return (
    <>
      <button
        onClick={() => setShowDetails(true)}
        className={`
          relative w-full p-3 rounded-xl border text-left
          transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
          ${medal.earned 
            ? `${colors.bg} ${colors.border} shadow-lg ${colors.glow}` 
            : 'bg-muted/30 border-border/50 opacity-70'
          }
        `}
      >
        {/* Earned glow animation */}
        {medal.earned && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_ease-in-out_infinite] overflow-hidden" />
        )}
        
        <div className="relative flex items-center gap-3">
          {/* Medal Icon */}
          <div className={`
            relative w-10 h-10 rounded-xl flex items-center justify-center text-2xl
            ${medal.earned 
              ? `bg-gradient-to-br ${colors.icon} shadow-md` 
              : 'bg-muted'
            }
          `}>
            {medal.earned ? (
              <span className="drop-shadow-md">{medal.icon}</span>
            ) : (
              <Lock className="w-4 h-4 text-muted-foreground" />
            )}
            
            {/* Earned check badge */}
            {medal.earned && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`text-xs font-bold truncate ${medal.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
              {medal.title}
            </h4>
            
            {/* Progress bar for locked medals */}
            {!medal.earned && (
              <div className="mt-1.5">
                <Progress 
                  value={progress} 
                  className="h-1.5 bg-muted"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  {medal.current}/{medal.target}
                </p>
              </div>
            )}
            
            {/* Earned status */}
            {medal.earned && (
              <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-500" />
                Earned!
              </p>
            )}
          </div>

          <ChevronRight className={`w-4 h-4 flex-shrink-0 ${medal.earned ? 'text-foreground/50' : 'text-muted-foreground/50'}`} />
        </div>
      </button>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-xs rounded-2xl">
          <DialogHeader className="text-center pb-2">
            <div className={`
              w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-5xl mb-3
              ${medal.earned 
                ? `bg-gradient-to-br ${colors.icon} shadow-lg ${colors.glow}` 
                : 'bg-muted'
              }
            `}>
              {medal.earned ? (
                <span className="drop-shadow-lg">{medal.icon}</span>
              ) : (
                <Lock className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <DialogTitle className="text-lg">{medal.title}</DialogTitle>
            <DialogDescription className="text-sm">
              {medal.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {medal.earned ? (
              <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Check className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Achievement Unlocked!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Earned on {medal.earnedDate ? formatEarnedDate(medal.earnedDate) : 'recently'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-bold text-primary">
                      {medal.current}/{medal.target}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <p className="text-center text-sm font-medium text-primary">
                  {medal.motivationalText}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

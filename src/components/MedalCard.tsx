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

const tierColors: Record<MedalTier, { bg: string; border: string; iconBg: string }> = {
  bronze: {
    bg: 'bg-amber-900/10',
    border: 'border-amber-700',
    iconBg: 'bg-amber-700/20'
  },
  silver: {
    bg: 'bg-slate-300/10',
    border: 'border-slate-400',
    iconBg: 'bg-slate-400/20'
  },
  gold: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500',
    iconBg: 'bg-yellow-500/20'
  },
  diamond: {
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400',
    iconBg: 'bg-cyan-400/20'
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
          relative w-full p-3 rounded-lg border-[2px] text-left
          transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
          ${medal.earned 
            ? `${colors.bg} ${colors.border}` 
            : 'bg-muted/30 border-border opacity-60 hover:opacity-80'
          }
        `}
      >
        {/* Shimmer effect for earned medals */}
        {medal.earned && (
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        )}
        
        <div className="relative flex items-center gap-3">
          {/* Medal Icon */}
          <div className={`
            relative w-10 h-10 rounded flex items-center justify-center text-2xl
            ${medal.earned ? colors.iconBg : 'bg-muted'}
          `}>
            {medal.earned ? (
              <span>{medal.icon}</span>
            ) : (
              <Lock className="w-4 h-4 text-muted-foreground" />
            )}
            
            {/* Earned check badge */}
            {medal.earned && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded bg-success flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`label-bold truncate ${medal.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
              {medal.title}
            </h4>
            
            {/* Progress bar for locked medals */}
            {!medal.earned && (
              <div className="mt-1.5">
                <div className="h-1.5 rounded-sm bg-muted-foreground/20 overflow-hidden">
                  <div 
                    className="h-full rounded-sm bg-muted-foreground/40 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">
                  {medal.current}/{medal.target}
                </p>
              </div>
            )}
            
            {/* Earned status */}
            {medal.earned && (
              <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1 uppercase tracking-wide">
                <Check className="w-3 h-3 text-success" />
                EARNED
              </p>
            )}
          </div>

          <ChevronRight className={`w-4 h-4 flex-shrink-0 ${medal.earned ? 'text-foreground/50' : 'text-muted-foreground/50'}`} />
        </div>
      </button>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-xs rounded-lg border-[3px]">
          <DialogHeader className="text-center pb-2">
            <div className={`
              w-20 h-20 mx-auto rounded-lg flex items-center justify-center text-5xl mb-3 border-[2px]
              ${medal.earned ? `${colors.iconBg} ${colors.border}` : 'bg-muted border-border'}
            `}>
              {medal.earned ? (
                <span>{medal.icon}</span>
              ) : (
                <Lock className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <DialogTitle className="heading-card text-center">{medal.title}</DialogTitle>
            <DialogDescription className="text-sm text-center">
              {medal.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {medal.earned ? (
              <div className="text-center p-4 rounded-lg bg-success/10 border-[2px] border-success/20">
                <Check className="w-6 h-6 text-success mx-auto mb-2" />
                <p className="text-sm font-bold text-foreground uppercase tracking-wide">Achievement Unlocked!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Earned on {medal.earnedDate ? formatEarnedDate(medal.earnedDate) : 'recently'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-muted/50 border-[2px] border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="label-bold text-muted-foreground">PROGRESS</span>
                    <span className="text-sm font-bold text-primary">
                      {medal.current}/{medal.target}
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>
                
                <p className="text-center text-sm font-bold text-primary uppercase tracking-wide">
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

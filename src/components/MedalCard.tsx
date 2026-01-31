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

const tierColors: Record<MedalTier, { bg: string; border: string; iconBg: string; glow: string }> = {
  bronze: {
    bg: 'bg-amber-900/20',
    border: 'border-amber-600/50',
    iconBg: 'bg-amber-600/20',
    glow: 'shadow-amber-500/20'
  },
  silver: {
    bg: 'bg-zinc-400/10',
    border: 'border-zinc-400/50',
    iconBg: 'bg-zinc-400/20',
    glow: 'shadow-zinc-400/20'
  },
  gold: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/50',
    iconBg: 'bg-yellow-500/20',
    glow: 'shadow-yellow-400/30'
  },
  diamond: {
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/50',
    iconBg: 'bg-cyan-400/20',
    glow: 'shadow-cyan-400/30'
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
          transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]
          ${medal.earned 
            ? `${colors.bg} ${colors.border} shadow-lg ${colors.glow}` 
            : 'bg-secondary/30 border-border opacity-60 hover:opacity-80'
          }
        `}
      >
        {/* Shimmer effect for earned medals */}
        {medal.earned && (
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        )}
        
        <div className="relative flex items-center gap-3">
          {/* Medal Icon */}
          <div className={`
            relative w-10 h-10 rounded-lg flex items-center justify-center text-2xl
            ${medal.earned ? colors.iconBg : 'bg-secondary'}
          `}>
            {medal.earned ? (
              <span>{medal.icon}</span>
            ) : (
              <Lock className="w-4 h-4 text-muted-foreground" />
            )}
            
            {/* Earned check badge */}
            {medal.earned && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`text-xs font-semibold truncate ${medal.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
              {medal.title}
            </h4>
            
            {/* Progress bar for locked medals */}
            {!medal.earned && (
              <div className="mt-1.5">
                <div className="h-1 rounded-full bg-secondary overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-muted-foreground/40 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {medal.current}/{medal.target}
                </p>
              </div>
            )}
            
            {/* Earned status */}
            {medal.earned && (
              <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-500" />
                Earned
              </p>
            )}
          </div>

          <ChevronRight className={`w-4 h-4 flex-shrink-0 ${medal.earned ? 'text-foreground/50' : 'text-muted-foreground/50'}`} />
        </div>
      </button>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-xs rounded-xl border border-border bg-card">
          <DialogHeader className="text-center pb-2">
            <div className={`
              w-20 h-20 mx-auto rounded-xl flex items-center justify-center text-5xl mb-3 border
              ${medal.earned ? `${colors.iconBg} ${colors.border}` : 'bg-secondary border-border'}
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
              <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <Check className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">Achievement Unlocked!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Earned on {medal.earnedDate ? formatEarnedDate(medal.earnedDate) : 'recently'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="label-bold text-muted-foreground">Progress</span>
                    <span className="text-sm font-semibold text-primary">
                      {medal.current}/{medal.target}
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>
                
                <p className="text-center text-sm font-semibold text-primary">
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

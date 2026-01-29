import { useState, useEffect, useMemo } from 'react';
import { X, TrendingUp, Target, Zap, Calculator } from 'lucide-react';
import { MedalCard } from './MedalCard';
import { calculateMedals } from '@/lib/medalCalculations';
import { AppData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import mascotNotification from '@/assets/mascot-notification.svg';

interface AICoachPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCalculators?: () => void;
  data?: AppData;
}

const howCoachWorks = [
  {
    icon: TrendingUp,
    title: "ANALYZES PERFORMANCE",
    description: "Tracks reps, sets, consistency and recovery",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Target,
    title: "CALCULATES PROGRESSION",
    description: "Uses 5-10% rule based on your readiness",
    color: "text-destructive",
    bgColor: "bg-destructive/10"
  },
  {
    icon: Zap,
    title: "OPTIMIZES RECOVERY",
    description: "Smart recommendations keep you progressing safely",
    color: "text-warning",
    bgColor: "bg-warning/10"
  }
];

// Default empty data for when data isn't provided
const defaultData: AppData = {
  exercises: [],
  userPreferences: {
    defaultUnit: 'lbs',
    hasSeenWelcome: false,
    hasCompletedOnboarding: false
  },
  metadata: {
    firstLogDate: null,
    lastDeloadDate: null
  }
};

export function AICoachPanel({ isOpen, onClose, onOpenCalculators, data = defaultData }: AICoachPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const medals = useMemo(() => calculateMedals(data), [data]);
  const earnedCount = medals.filter(m => m.earned).length;

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setIsVisible(true);
        setIsExiting(false);
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const handleOpenCalculators = () => {
    handleClose();
    setTimeout(() => {
      onOpenCalculators?.();
    }, 350);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`
        fixed inset-0 z-50 flex items-end sm:items-center justify-center
        transition-opacity duration-300
        ${isVisible && !isExiting ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Panel */}
      <div 
        className={`
          relative w-full max-w-md mx-4 max-h-[90vh] overflow-hidden
          transition-all duration-300 ease-out
          ${isVisible && !isExiting 
            ? 'translate-y-0 scale-100' 
            : 'translate-y-8 scale-95'
          }
        `}
      >
        {/* Main Card - Bold athletic style */}
        <div className="bg-primary rounded-lg border-[3px] border-primary overflow-hidden">
          {/* Geometric decorative shapes */}
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rotate-45" />
          <div className="absolute -right-4 top-12 w-20 h-20 bg-white/5 rotate-12" />
          
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <div className="flex items-center gap-4">
              <img 
                src={mascotNotification} 
                alt="Coach mascot" 
                className="w-16 h-16 object-contain"
              />
              <div>
                <h2 className="heading-section text-white">READY TO LEVEL UP?</h2>
                <p className="text-white/70 text-xs uppercase tracking-wider font-bold mt-1">Your AI Coach is here</p>
              </div>
            </div>
          </div>

          {/* Content Section - Scrollable */}
          <div className="bg-card rounded-t-lg px-4 py-4 mx-2 mb-2 rounded-b-lg space-y-4 max-h-[60vh] overflow-y-auto">
            
            {/* Achievement Medals Section */}
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="heading-card text-foreground">YOUR ACHIEVEMENTS</h3>
                <span className="label-bold text-muted-foreground">
                  {earnedCount}/{medals.length} EARNED
                </span>
              </div>
              
              {/* Medal Grid */}
              <div className="grid grid-cols-2 gap-2">
                {medals.map((medal, index) => (
                  <div 
                    key={medal.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <MedalCard medal={medal} />
                  </div>
                ))}
              </div>

              {/* Motivational message based on progress */}
              {earnedCount === 0 && (
                <p className="text-xs text-center text-muted-foreground mt-3 px-4 uppercase tracking-wide">
                  🎯 Start logging to unlock your first achievement!
                </p>
              )}
              {earnedCount > 0 && earnedCount < medals.length && (
                <p className="text-xs text-center text-primary font-bold mt-3 px-4 uppercase tracking-wide">
                  🔥 Keep pushing to unlock more medals!
                </p>
              )}
              {earnedCount === medals.length && (
                <p className="text-xs text-center text-success font-bold mt-3 px-4 uppercase tracking-wide">
                  🏆 All achievements unlocked!
                </p>
              )}
            </div>

            {/* Calculator Link */}
            <Button
              variant="outline"
              onClick={handleOpenCalculators}
              className="w-full animate-fade-in"
              style={{ animationDelay: '200ms' }}
            >
              <Calculator className="w-4 h-4" />
              OPEN CALCULATORS
            </Button>

            {/* Divider */}
            <div className="h-1 bg-border" />

            {/* How Coach Works */}
            <div className="animate-fade-in" style={{ animationDelay: '250ms' }}>
              <h3 className="heading-card text-foreground mb-3">HOW COACH WORKS</h3>
              <div className="space-y-3">
                {howCoachWorks.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border-[2px] border-border"
                  >
                    <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${item.bgColor} border-[2px] border-current/20`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-foreground uppercase tracking-wide">{item.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

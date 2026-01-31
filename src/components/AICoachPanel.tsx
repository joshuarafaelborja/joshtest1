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
    title: "Analyzes Performance",
    description: "Tracks reps, sets, consistency and recovery",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30"
  },
  {
    icon: Target,
    title: "Calculates Progression",
    description: "Uses 5-10% rule based on your readiness",
    color: "text-rose-400",
    bgColor: "bg-rose-400/10",
    borderColor: "border-rose-400/30"
  },
  {
    icon: Zap,
    title: "Optimizes Recovery",
    description: "Smart recommendations keep you progressing safely",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/30"
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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
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
        {/* Main Card - Industrial style with cyan accent */}
        <div className="concrete-overlay-strong bg-gradient-to-br from-primary to-cyan-600 rounded-xl overflow-hidden border border-primary/50 shadow-2xl shadow-primary/20">
          
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <div className="flex items-center gap-4">
              <img 
                src={mascotNotification} 
                alt="Coach mascot" 
                className="w-14 h-14 object-contain"
              />
              <div>
                <h2 className="text-2xl font-bold text-white">Ready to Level Up?</h2>
                <p className="text-white/70 text-sm mt-0.5">Your AI Coach is here</p>
              </div>
            </div>
          </div>

          {/* Content Section - Scrollable */}
          <div className="bg-card rounded-t-xl px-4 py-4 mx-2 mb-2 rounded-b-lg space-y-4 max-h-[60vh] overflow-y-auto">
            
            {/* Achievement Medals Section */}
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="heading-card text-foreground">Your Achievements</h3>
                <span className="label-bold text-muted-foreground">
                  {earnedCount}/{medals.length} earned
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
                <p className="text-xs text-center text-muted-foreground mt-3 px-4">
                  🎯 Start logging to unlock your first achievement!
                </p>
              )}
              {earnedCount > 0 && earnedCount < medals.length && (
                <p className="text-xs text-center text-primary font-semibold mt-3 px-4">
                  🔥 Keep pushing to unlock more medals!
                </p>
              )}
              {earnedCount === medals.length && (
                <p className="text-xs text-center text-emerald-500 font-semibold mt-3 px-4">
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
              Open Calculators
            </Button>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* How Coach Works */}
            <div className="animate-fade-in" style={{ animationDelay: '250ms' }}>
              <h3 className="heading-card text-foreground mb-3">How Coach Works</h3>
              <div className="space-y-3">
                {howCoachWorks.map((item, index) => (
                  <div 
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-xl bg-secondary/50 border ${item.borderColor}`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${item.bgColor}`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
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

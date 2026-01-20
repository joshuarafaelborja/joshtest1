import { useState, useEffect } from 'react';
import { X, TrendingUp, Target, Zap, Calculator } from 'lucide-react';
import mascotNotification from '@/assets/mascot-notification.svg';

interface AICoachPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCalculators?: () => void;
}

const howCoachWorks = [
  {
    icon: TrendingUp,
    title: "Analyzes your performance",
    description: "Tracks reps, sets, consistency and recovery",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Target,
    title: "Calculates optimal progression",
    description: "Uses 5-10% rule based on your readiness",
    color: "text-destructive",
    bgColor: "bg-destructive/10"
  },
  {
    icon: Zap,
    title: "Recovery rate: Excellent",
    description: "Smart recommendations keep you progressing safely",
    color: "text-warning",
    bgColor: "bg-warning/10"
  }
];

export function AICoachPanel({ isOpen, onClose, onOpenCalculators }: AICoachPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

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
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Panel */}
      <div 
        className={`
          relative w-full max-w-md mx-4
          transition-all duration-300 ease-out
          ${isVisible && !isExiting 
            ? 'translate-y-0 scale-100' 
            : 'translate-y-8 scale-95'
          }
        `}
      >
        {/* Main Card */}
        <div className="bg-primary rounded-2xl shadow-2xl overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -right-4 top-12 w-20 h-20 rounded-full bg-white/5" />
          
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
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
                <h2 className="text-xl font-bold text-white">Ready to Level Up?</h2>
                <p className="text-white/70 text-sm">Your AI Coach is here to help</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-card/95 backdrop-blur-sm rounded-t-2xl px-4 py-4 mx-2 mb-2 rounded-b-xl space-y-4">
            {/* Calculator CTA */}
            <button
              onClick={handleOpenCalculators}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg animate-fade-in"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-bold text-base">Open Calculators</h4>
                <p className="text-sm text-white/80">Warm-up sets & progressive overload</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white text-lg">→</span>
              </div>
            </button>

            {/* How Coach Works */}
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h3 className="text-base font-bold text-foreground mb-3">How Coach works</h3>
              <div className="space-y-3">
                {howCoachWorks.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
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

import { useState, useEffect } from 'react';
import { X, TrendingUp, Dumbbell, Flame } from 'lucide-react';
import mascotNotification from '@/assets/mascot-notification.svg';

interface AICoachPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const coachTips = [
  {
    icon: TrendingUp,
    title: "Progressive Overload",
    description: "Gradually increase weight or reps each session to build strength.",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Dumbbell,
    title: "Consistency is Key",
    description: "Aim for 3-4 workouts per week for optimal muscle growth.",
    color: "text-success",
    bgColor: "bg-success/10"
  },
  {
    icon: Flame,
    title: "Rest & Recovery",
    description: "Muscles grow during rest. Get 7-8 hours of sleep.",
    color: "text-warning",
    bgColor: "bg-warning/10"
  }
];

export function AICoachPanel({ isOpen, onClose }: AICoachPanelProps) {
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

          {/* Tips Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-t-2xl px-4 py-4 mx-2 mb-2 rounded-b-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <span className="text-sm font-medium text-foreground/80">
                Your ready to progress tips
              </span>
            </div>
            
            <div className="space-y-2">
              {coachTips.map((tip, index) => (
                <div 
                  key={index}
                  className={`
                    flex items-start gap-3 p-3 rounded-xl bg-card/80 border border-border/50
                    transition-all duration-300 hover:shadow-md hover:scale-[1.02]
                    animate-fade-in
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl ${tip.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <tip.icon className={`w-5 h-5 ${tip.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

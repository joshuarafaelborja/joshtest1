import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { RecommendationType } from '@/lib/types';
import mascotNotification from '@/assets/mascot-notification.svg';

interface ProgressNotificationProps {
  type: RecommendationType;
  title: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
  showMascot?: boolean;
}

export function ProgressNotification({
  type,
  title,
  message,
  onClose,
  autoClose = true,
  duration = 4000,
  showMascot = true
}: ProgressNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getIconColor = () => {
    switch (type) {
      case 'progressive_overload':
      case 'acclimation':
        return 'text-primary';
      case 'maintain':
        return 'text-success';
      case 'acute_deload':
      case 'scheduled_deload':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'progressive_overload':
      case 'acclimation':
        return 'border-primary';
      case 'maintain':
        return 'border-success';
      case 'acute_deload':
      case 'scheduled_deload':
        return 'border-warning';
      default:
        return 'border-border';
    }
  };

  const getMascotOrIcon = () => {
    if (showMascot) {
      return (
        <img 
          src={mascotNotification} 
          alt="Spot.AI" 
          className="w-12 h-12 object-contain flex-shrink-0"
        />
      );
    }
    
    const colorClass = getIconColor();
    return (
      <div className={`relative w-10 h-10 flex items-center justify-center flex-shrink-0`}>
        <svg
          className={`absolute inset-0 w-10 h-10 ${colorClass}`}
          viewBox="0 0 40 40"
          fill="none"
        >
          <circle
            cx="20"
            cy="20"
            r="15"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        <div className={`w-3 h-3 rounded-full bg-current ${colorClass}`} />
      </div>
    );
  };

  return (
    <div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-50
        w-[calc(100%-2rem)] max-w-sm
        transition-all duration-300 ease-out
        ${isVisible && !isExiting 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-4'
        }
      `}
    >
      <div
        className={`
          bg-card rounded-xl border-2 ${getBorderColor()}
          shadow-lg p-4
          flex items-start gap-4
        `}
      >
        {/* Mascot or Icon */}
        {getMascotOrIcon()}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground text-sm leading-tight">
            {title}
          </h4>
          <p className="text-muted-foreground text-sm mt-0.5 leading-snug">
            {message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="p-1 rounded-full hover:bg-secondary transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

import { useState, ReactNode } from 'react';
import { Dumbbell, Calculator } from 'lucide-react';

type TabKey = 'workouts' | 'calculator';

interface ScreenToggleProps {
  calculatorContent: ReactNode;
  workoutContent: ReactNode;
}

export function ScreenToggle({ calculatorContent, workoutContent }: ScreenToggleProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('workouts');

  return (
    <div className="flex flex-col bg-background overflow-hidden" style={{ height: '100dvh' }}>
      {/* Screen content area */}
      <div className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0 overflow-y-auto"
          style={{
            opacity: activeTab === 'workouts' ? 1 : 0,
            pointerEvents: activeTab === 'workouts' ? 'auto' : 'none',
            transition: 'opacity 200ms ease',
          }}
        >
          <div className="pb-20">{workoutContent}</div>
        </div>
        <div
          className="absolute inset-0 overflow-y-auto"
          style={{
            opacity: activeTab === 'calculator' ? 1 : 0,
            pointerEvents: activeTab === 'calculator' ? 'auto' : 'none',
            transition: 'opacity 200ms ease',
          }}
        >
          <div className="pb-20">{calculatorContent}</div>
        </div>
      </div>

      {/* Floating bottom tab bar */}
      <div
        className="fixed left-1/2 z-50"
        style={{
          bottom: `calc(env(safe-area-inset-bottom, 0px) + 24px)`,
          transform: 'translateX(-50%)',
        }}
      >
        <div
          className="flex items-center rounded-full p-1.5 gap-2 shadow-lg"
          style={{
            background: '#FFFFFF',
            border: '2px solid #3B82F6',
          }}
        >
          {/* Workouts Tab */}
          <button
            onClick={() => setActiveTab('workouts')}
            className={`
              flex flex-col items-center gap-1 rounded-[20px] px-5 py-2.5 transition-colors duration-200
              ${activeTab === 'workouts' ? 'bg-[#CCE0FF]' : 'bg-white'}
            `}
            style={{ minWidth: 100 }}
          >
            <Dumbbell className="w-5 h-5" style={{ color: '#3B82F6' }} />
            <span className="font-semibold text-xs tracking-wide" style={{ color: '#3B82F6' }}>
              Workouts
            </span>
          </button>

          {/* Calculator Tab */}
          <button
            onClick={() => setActiveTab('calculator')}
            className={`
              flex flex-col items-center gap-1 rounded-[20px] px-5 py-2.5 transition-colors duration-200
              ${activeTab === 'calculator' ? 'bg-[#CCE0FF]' : 'bg-white'}
            `}
            style={{ minWidth: 100 }}
          >
            <Calculator className="w-5 h-5" style={{ color: '#3B82F6' }} />
            <span className="font-semibold text-xs tracking-wide" style={{ color: '#3B82F6' }}>
              Calculator
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

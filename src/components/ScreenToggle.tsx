import { useState, ReactNode } from 'react';

type TabKey = 'workouts' | 'calculator';

interface ScreenToggleProps {
  calculatorContent: ReactNode;
  workoutContent: ReactNode;
}

function WorkoutsIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="5" width="20" height="18" rx="3" stroke="#3B82F6" strokeWidth="2" fill="none" />
      <line x1="8" y1="10" x2="20" y2="10" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="14" x2="20" y2="14" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="18" x2="16" y2="18" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="4" width="18" height="20" rx="3" stroke="#3B82F6" strokeWidth="2" fill="none" />
      <rect x="8" y="7" width="12" height="5" rx="1" fill="#3B82F6" opacity="0.3" stroke="#3B82F6" strokeWidth="1.5" />
      <circle cx="9.5" cy="17" r="1.2" fill="#3B82F6" />
      <circle cx="14" cy="17" r="1.2" fill="#3B82F6" />
      <circle cx="18.5" cy="17" r="1.2" fill="#3B82F6" />
      <circle cx="9.5" cy="21" r="1.2" fill="#3B82F6" />
      <circle cx="14" cy="21" r="1.2" fill="#3B82F6" />
      <circle cx="18.5" cy="21" r="1.2" fill="#3B82F6" />
    </svg>
  );
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
          <div className="pb-28">{workoutContent}</div>
        </div>
        <div
          className="absolute inset-0 overflow-y-auto"
          style={{
            opacity: activeTab === 'calculator' ? 1 : 0,
            pointerEvents: activeTab === 'calculator' ? 'auto' : 'none',
            transition: 'opacity 200ms ease',
          }}
        >
          <div className="pb-28">{calculatorContent}</div>
        </div>
      </div>

      {/* Floating bottom pill nav */}
      <div
        className="fixed left-1/2 z-50"
        style={{
          bottom: `calc(env(safe-area-inset-bottom, 0px) + 24px)`,
          transform: 'translateX(-50%)',
        }}
      >
        <div
          className="relative flex items-center rounded-full p-1 gap-1 shadow-sm"
          style={{
            background: '#FFFFFF',
            border: '2px solid #3B82F6',
          }}
        >
          {/* Sliding background pill */}
          <div
            className="absolute top-1 bottom-1 rounded-full transition-transform duration-300 ease-in-out"
            style={{
              width: 'calc(50% - 4px)',
              background: '#CCE0FF',
              border: '2px solid #3B82F6',
              transform: activeTab === 'workouts' ? 'translateX(0)' : 'translateX(calc(100% + 4px))',
              pointerEvents: 'none',
            }}
          />

          {/* Workouts Tab */}
          <button
            onClick={() => setActiveTab('workouts')}
            className="relative z-10 flex flex-col items-center justify-center gap-1.5 px-0 py-3 rounded-full cursor-pointer select-none transition-colors duration-200 bg-transparent border-none"
            style={{ minWidth: 120, marginLeft: 2, marginRight: 2 }}
          >
            <WorkoutsIcon />
            <span className="font-semibold text-sm tracking-wide" style={{ color: '#3B82F6' }}>
              Workouts
            </span>
          </button>

          {/* Calculator Tab */}
          <button
            onClick={() => setActiveTab('calculator')}
            className="relative z-10 flex flex-col items-center justify-center gap-1.5 px-0 py-3 rounded-full cursor-pointer select-none transition-colors duration-200 bg-transparent border-none"
            style={{ minWidth: 120, marginLeft: 2, marginRight: 2 }}
          >
            <CalculatorIcon />
            <span className="font-semibold text-sm tracking-wide" style={{ color: '#3B82F6' }}>
              Calculator
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

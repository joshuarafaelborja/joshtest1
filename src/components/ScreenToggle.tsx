import { useState, ReactNode } from 'react';

type TabKey = 'workout' | 'calculator';

interface ScreenToggleProps {
  calculatorContent: ReactNode;
  workoutContent: ReactNode;
}

const WorkoutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.4 14.4 9.6 9.6" />
    <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
    <path d="m21.5 21.5-1.4-1.4" />
    <path d="M3.9 3.9 2.5 2.5" />
    <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
  </svg>
);

const CalcIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <circle cx="8" cy="10" r="0.5" fill="currentColor" />
    <circle cx="12" cy="10" r="0.5" fill="currentColor" />
    <circle cx="16" cy="10" r="0.5" fill="currentColor" />
    <circle cx="8" cy="14" r="0.5" fill="currentColor" />
    <circle cx="12" cy="14" r="0.5" fill="currentColor" />
    <circle cx="16" cy="14" r="0.5" fill="currentColor" />
    <circle cx="8" cy="18" r="0.5" fill="currentColor" />
    <line x1="12" y1="18" x2="16" y2="18" />
  </svg>
);

const TABS: { key: TabKey; icon: ReactNode }[] = [
  { key: 'workout', icon: <WorkoutIcon /> },
  { key: 'calculator', icon: <CalcIcon /> },
];

const BUTTON_SIZE = 48;
const PILL_PADDING = 4;

export function ScreenToggle({ calculatorContent, workoutContent }: ScreenToggleProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('workout');
  const activeIndex = TABS.findIndex(t => t.key === activeTab);

  return (
    <div className="flex flex-col bg-background overflow-hidden" style={{ height: '100dvh' }}>
      {/* Screen content area */}
      <div className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0 overflow-y-auto"
          style={{
            opacity: activeTab === 'workout' ? 1 : 0,
            pointerEvents: activeTab === 'workout' ? 'auto' : 'none',
            transition: 'opacity 200ms ease',
          }}
        >
          <div className="pb-28">
            {workoutContent}
          </div>
        </div>

        <div
          className="absolute inset-0 overflow-y-auto"
          style={{
            opacity: activeTab === 'calculator' ? 1 : 0,
            pointerEvents: activeTab === 'calculator' ? 'auto' : 'none',
            transition: 'opacity 200ms ease',
          }}
        >
          <div className="pb-28">
            {calculatorContent}
          </div>
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
          className="relative flex items-center"
          style={{
            background: '#FFFFFF',
            padding: PILL_PADDING,
            borderRadius: 28,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)',
            gap: 0,
          }}
        >
          {/* Sliding active indicator */}
          <div
            style={{
              position: 'absolute',
              top: PILL_PADDING,
              bottom: PILL_PADDING,
              left: PILL_PADDING,
              width: BUTTON_SIZE,
              borderRadius: BUTTON_SIZE / 2,
              background: '#CCE0FF',
              border: '2px solid #0066FF',
              transition: 'transform 300ms ease',
              pointerEvents: 'none',
              transform: `translateX(${activeIndex * BUTTON_SIZE}px)`,
            }}
          />

          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="relative z-10 flex items-center justify-center border-none bg-transparent cursor-pointer"
              style={{
                width: BUTTON_SIZE,
                height: BUTTON_SIZE,
                borderRadius: BUTTON_SIZE / 2,
                color: '#0066FF',
                padding: 0,
              }}
            >
              {tab.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

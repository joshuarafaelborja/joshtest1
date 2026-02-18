import { useState, ReactNode } from 'react';

type TabKey = 'calculator' | 'workout';

interface ScreenToggleProps {
  calculatorContent: ReactNode;
  workoutContent: ReactNode;
}

const CalcIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <rect x="4" y="2" width="16" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="8" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="8" cy="10" r="1" fill="currentColor" />
    <circle cx="12" cy="10" r="1" fill="currentColor" />
    <circle cx="16" cy="10" r="1" fill="currentColor" />
    <circle cx="8" cy="14" r="1" fill="currentColor" />
    <circle cx="12" cy="14" r="1" fill="currentColor" />
    <circle cx="16" cy="14" r="1" fill="currentColor" />
    <circle cx="8" cy="18" r="1" fill="currentColor" />
    <line x1="12" y1="18" x2="16" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const DumbbellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.4 14.4 9.6 9.6" />
    <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
    <path d="m21.5 21.5-1.4-1.4" />
    <path d="M3.9 3.9 2.5 2.5" />
    <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
  </svg>
);

const TABS: { key: TabKey; label: string; icon: ReactNode }[] = [
  { key: 'calculator', label: 'Calculator', icon: <CalcIcon /> },
  { key: 'workout', label: 'Workout Log', icon: <DumbbellIcon /> },
];

export function ScreenToggle({ calculatorContent, workoutContent }: ScreenToggleProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('calculator');
  const activeIndex = TABS.findIndex(t => t.key === activeTab);

  return (
    <div className="flex flex-col bg-background overflow-hidden" style={{ height: '100dvh' }}>
      {/* Fixed Toggle Bar */}
      <div
        className="shrink-0 flex justify-center"
        style={{
          paddingTop: `calc(env(safe-area-inset-top, 0px) + 12px)`,
          paddingBottom: '12px',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        <div
          className="relative flex"
          style={{
            background: '#F0F4FF',
            padding: '3px',
            borderRadius: '9999px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Sliding pill */}
          <div
            style={{
              position: 'absolute',
              top: 3,
              bottom: 3,
              left: 3,
              width: 'calc(50% - 3px)',
              background: '#0066FF',
              borderRadius: '9999px',
              transition: 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: 'none',
              transform: `translateX(${activeIndex * 100}%)`,
            }}
          />

          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative z-10 flex items-center justify-center gap-2 border-none bg-transparent cursor-pointer"
                style={{
                  flex: 1,
                  height: 50,
                  padding: '0 20px',
                  borderRadius: '9999px',
                  color: isActive ? '#FFFFFF' : '#0066FF',
                  transition: 'color 280ms ease',
                  fontSize: '16px',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Screen content area */}
      <div className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0 overflow-y-auto"
          style={{
            opacity: activeTab === 'calculator' ? 1 : 0,
            pointerEvents: activeTab === 'calculator' ? 'auto' : 'none',
            transition: 'opacity 200ms ease',
          }}
        >
          <div className="pb-8">
            {calculatorContent}
          </div>
        </div>

        <div
          className="absolute inset-0 overflow-y-auto"
          style={{
            opacity: activeTab === 'workout' ? 1 : 0,
            pointerEvents: activeTab === 'workout' ? 'auto' : 'none',
            transition: 'opacity 200ms ease',
          }}
        >
          <div className="pb-8">
            {workoutContent}
          </div>
        </div>
      </div>
    </div>
  );
}

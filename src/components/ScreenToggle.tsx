import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TabKey = 'calculator' | 'workout';

interface ScreenToggleProps {
  calculatorContent: ReactNode;
  workoutContent: ReactNode;
}

const CalcIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="8" y2="10.01" />
    <line x1="12" y1="10" x2="12" y2="10.01" />
    <line x1="16" y1="10" x2="16" y2="10.01" />
    <line x1="8" y1="14" x2="8" y2="14.01" />
    <line x1="12" y1="14" x2="12" y2="14.01" />
    <line x1="16" y1="14" x2="16" y2="14.01" />
    <line x1="8" y1="18" x2="8" y2="18.01" />
    <line x1="12" y1="18" x2="16" y2="18" />
  </svg>
);

const DumbbellIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.4 14.4 9.6 9.6" />
    <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
    <path d="m21.5 21.5-1.4-1.4" />
    <path d="M3.9 3.9 2.5 2.5" />
    <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
  </svg>
);

const TABS: { key: TabKey; label: string }[] = [
  { key: 'calculator', label: 'Calculator' },
  { key: 'workout', label: 'Workout Log' },
];

function TabIcon({ tab, size = 18, color = 'currentColor' }: { tab: TabKey; size?: number; color?: string }) {
  return tab === 'calculator'
    ? <CalcIcon size={size} color={color} />
    : <DumbbellIcon size={size} color={color} />;
}

export function ScreenToggle({ calculatorContent, workoutContent }: ScreenToggleProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('calculator');

  const inactiveTab = activeTab === 'calculator' ? 'workout' : 'calculator';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Fixed Toggle Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center"
        style={{
          paddingTop: `calc(env(safe-area-inset-top, 0px) + 12px)`,
          paddingBottom: '12px',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        <div
          className="flex items-center gap-2"
          style={{
            background: '#F0F4FF',
            padding: '3px',
            borderRadius: '9999px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;

            if (isActive) {
              return (
                <motion.button
                  key={tab.key}
                  layout
                  onClick={() => setActiveTab(tab.key)}
                  className="flex items-center justify-center gap-3 overflow-hidden"
                  style={{
                    height: '50px',
                    minWidth: '184px',
                    padding: '0 20px',
                    borderRadius: '9999px',
                    background: '#0066FF',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                >
                  <TabIcon tab={tab.key} size={18} color="#FFFFFF" />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.06, duration: 0.18, ease: 'easeOut' }}
                    style={{
                      color: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tab.label}
                  </motion.span>
                </motion.button>
              );
            }

            return null;
          })}

          {/* Inactive button: shows the OTHER tab's icon */}
          <motion.button
            key={`inactive-${inactiveTab}`}
            layout
            onClick={() => setActiveTab(inactiveTab)}
            className="flex items-center justify-center"
            style={{
              height: '44px',
              width: '49px',
              borderRadius: '9999px',
              background: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
          >
            <TabIcon tab={inactiveTab} size={24} color="#0066FF" />
          </motion.button>
        </div>
      </div>

      {/* Screen content area */}
      <div
        className="flex-1 relative"
        style={{ paddingTop: `calc(env(safe-area-inset-top, 0px) + 74px)` }}
      >
        {/* Calculator Screen */}
        <div
          className="absolute inset-0"
          style={{
            paddingTop: `calc(env(safe-area-inset-top, 0px) + 74px)`,
            opacity: activeTab === 'calculator' ? 1 : 0,
            pointerEvents: activeTab === 'calculator' ? 'auto' : 'none',
            transition: 'opacity 200ms ease',
            overflow: 'auto',
            height: '100vh',
          }}
        >
          {calculatorContent}
        </div>

        {/* Workout Screen */}
        <div
          className="absolute inset-0"
          style={{
            paddingTop: `calc(env(safe-area-inset-top, 0px) + 74px)`,
            opacity: activeTab === 'workout' ? 1 : 0,
            pointerEvents: activeTab === 'workout' ? 'auto' : 'none',
            transition: 'opacity 200ms ease',
            overflow: 'auto',
            height: '100vh',
          }}
        >
          {workoutContent}
        </div>
      </div>
    </div>
  );
}

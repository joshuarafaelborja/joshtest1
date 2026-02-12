import { useState, useRef, useEffect, ReactNode } from 'react';

type ModeValue = 'manual' | 'ai';

interface ModeToggleProps {
  value: ModeValue;
  onChange: (mode: ModeValue) => void;
  manualLabel?: ReactNode;
  aiLabel?: ReactNode;
}

export function ModeToggle({ value, onChange, manualLabel = 'Standard', aiLabel = 'AI' }: ModeToggleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const manualRef = useRef<HTMLButtonElement>(null);
  const aiRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ width: number; x: number }>({ width: 0, x: 0 });

  const updateIndicator = () => {
    const activeRef = value === 'manual' ? manualRef.current : aiRef.current;
    const container = containerRef.current;
    if (activeRef && container) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeRef.getBoundingClientRect();
      setIndicatorStyle({
        width: activeRect.width,
        x: activeRect.left - containerRect.left,
      });
    }
  };

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex p-1 rounded-[28px] gap-1 transition-shadow duration-150 ease-in-out hover:shadow-[0_0_12px_2px_rgba(37,99,235,0.4)] active:shadow-[0_0_12px_2px_rgba(37,99,235,0.4)]"
      style={{ background: '#27272A' }}
    >
      {/* Sliding indicator */}
      <div
        className="absolute top-1 bottom-1 rounded-[24px] transition-all duration-200 ease-in-out"
        style={{
          width: indicatorStyle.width,
          transform: `translateX(${indicatorStyle.x - 4}px)`,
          background: '#1E3A8A',
        }}
      />

      <button
        ref={manualRef}
        onClick={() => onChange('manual')}
        className="relative z-10 min-w-[48px] px-4 py-1.5 rounded-[24px] text-sm font-bold tracking-wide transition-colors duration-200 text-center leading-5 flex items-center justify-center"
        style={{ color: value === 'manual' ? '#FFFFFF' : '#A1A1AA' }}
      >
        {manualLabel}
      </button>
      <button
        ref={aiRef}
        onClick={() => onChange('ai')}
        className="relative z-10 min-w-[48px] px-4 py-1.5 rounded-[24px] text-sm font-bold tracking-wide transition-colors duration-200 text-center leading-5 flex items-center justify-center"
        style={{ color: value === 'ai' ? '#FFFFFF' : '#A1A1AA' }}
      >
        {aiLabel}
      </button>
    </div>
  );
}

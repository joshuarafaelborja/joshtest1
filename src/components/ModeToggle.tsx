import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type ModeValue = 'manual' | 'ai';

interface ModeToggleProps {
  value: ModeValue;
  onChange: (mode: ModeValue) => void;
  manualLabel?: ReactNode;
  aiLabel?: ReactNode;
}

export function ModeToggle({ value, onChange, manualLabel = 'Manual', aiLabel = 'AI' }: ModeToggleProps) {
  return (
    <div
      className="relative inline-flex p-1 rounded-[28px] gap-1 group"
      style={{ background: '#CCE0FF' }}
      role="group"
      aria-label="Mode selection"
    >
      <button
        onClick={() => onChange('manual')}
        aria-pressed={value === 'manual'}
        className="relative min-w-[80px] px-4 py-1.5 rounded-[24px] text-sm font-bold tracking-wide transition-colors duration-200 text-center leading-5 flex items-center justify-center"
        style={{ color: value === 'manual' ? '#FFFFFF' : '#0066FF' }}
      >
        <span className="relative z-10">{manualLabel}</span>
        <motion.div
          layoutId="mode-pill"
          className="absolute inset-0 rounded-[24px]"
          style={{ background: value === 'manual' ? '#0066FF' : 'transparent' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </button>
      <button
        onClick={() => onChange('ai')}
        aria-pressed={value === 'ai'}
        className="relative min-w-[80px] px-4 py-1.5 rounded-[24px] text-sm font-bold tracking-wide transition-colors duration-200 text-center leading-5 flex items-center justify-center"
        style={{ color: value === 'ai' ? '#FFFFFF' : '#0066FF' }}
      >
        <span className="relative z-10">{aiLabel}</span>
        <motion.div
          layoutId="mode-pill"
          className="absolute inset-0 rounded-[24px]"
          style={{ background: value === 'ai' ? '#0066FF' : 'transparent' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </button>
    </div>
  );
}

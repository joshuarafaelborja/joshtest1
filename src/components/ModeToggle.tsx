import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type ModeValue = 'manual' | 'ai';

interface ModeToggleProps {
  value: ModeValue;
  onChange: (mode: ModeValue) => void;
  manualLabel?: ReactNode;
  aiLabel?: ReactNode;
}

export function ModeToggle({ value, onChange, manualLabel = 'Standard', aiLabel = 'AI' }: ModeToggleProps) {
  return (
    <div
      className="relative inline-flex p-1 rounded-[28px] gap-1 group"
      style={{ background: '#27272A' }}
      role="group"
      aria-label="Mode selection"
    >
      <button
        onClick={() => onChange('manual')}
        aria-pressed={value === 'manual'}
        className="relative z-10 min-w-[48px] px-4 py-1.5 rounded-[24px] text-sm font-bold tracking-wide transition-colors duration-200 text-center leading-5 flex items-center justify-center"
        style={{ color: value === 'manual' ? '#FFFFFF' : '#A1A1AA' }}
      >
        <span className="relative z-10">{manualLabel}</span>
        {value === 'manual' && (
          <motion.div
            layoutId="mode-pill"
            className="absolute inset-0 rounded-[24px] shadow-none group-hover:shadow-[0_0_12px_2px_rgba(37,99,235,0.4)] group-active:shadow-[0_0_12px_2px_rgba(37,99,235,0.4)]"
            style={{ background: '#1E3A8A' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </button>
      <button
        onClick={() => onChange('ai')}
        aria-pressed={value === 'ai'}
        className="relative z-10 min-w-[48px] px-4 py-1.5 rounded-[24px] text-sm font-bold tracking-wide transition-colors duration-200 text-center leading-5 flex items-center justify-center"
        style={{ color: value === 'ai' ? '#FFFFFF' : '#A1A1AA' }}
      >
        <span className="relative z-10">{aiLabel}</span>
        {value === 'ai' && (
          <motion.div
            layoutId="mode-pill"
            className="absolute inset-0 rounded-[24px] shadow-none group-hover:shadow-[0_0_12px_2px_rgba(37,99,235,0.4)] group-active:shadow-[0_0_12px_2px_rgba(37,99,235,0.4)]"
            style={{ background: '#1E3A8A' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </button>
    </div>
  );
}

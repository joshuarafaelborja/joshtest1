import { motion } from 'framer-motion';

type WeightUnit = 'lbs' | 'kg';

interface UnitToggleProps {
  value: WeightUnit;
  onChange: (unit: WeightUnit) => void;
}

export function UnitToggle({ value, onChange }: UnitToggleProps) {
  return (
    <div
      className="relative inline-flex p-1 rounded-[28px] gap-1 group"
      style={{ background: '#27272A' }}
      role="group"
      aria-label="Unit selection"
    >
      <button
        onClick={() => onChange('lbs')}
        aria-pressed={value === 'lbs'}
        className="relative z-10 min-w-[48px] px-4 py-1.5 rounded-[24px] text-sm font-bold tracking-wide transition-colors duration-200 text-center leading-5"
        style={{ color: value === 'lbs' ? '#FFFFFF' : '#A1A1AA' }}
      >
        <span className="relative z-10">LBS</span>
        {value === 'lbs' && (
          <motion.div
            layoutId="unit-pill"
            className="absolute inset-0 rounded-[24px] shadow-none group-hover:shadow-[0_0_12px_2px_rgba(37,99,235,0.4)] group-active:shadow-[0_0_12px_2px_rgba(37,99,235,0.4)]"
            style={{ background: '#1E3A8A' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </button>
      <button
        onClick={() => onChange('kg')}
        aria-pressed={value === 'kg'}
        className="relative z-10 min-w-[48px] px-4 py-1.5 rounded-[24px] text-sm font-bold tracking-wide transition-colors duration-200 text-center leading-5"
        style={{ color: value === 'kg' ? '#FFFFFF' : '#A1A1AA' }}
      >
        <span className="relative z-10">KG</span>
        {value === 'kg' && (
          <motion.div
            layoutId="unit-pill"
            className="absolute inset-0 rounded-[24px] shadow-none group-hover:shadow-[0_0_12px_2px_rgba(37,99,235,0.4)] group-active:shadow-[0_0_12px_2px_rgba(37,99,235,0.4)]"
            style={{ background: '#1E3A8A' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </button>
    </div>
  );
}

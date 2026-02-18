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
      style={{ background: '#CCE0FF' }}
      role="group"
      aria-label="Unit selection"
    >
      <button
        onClick={() => onChange('lbs')}
        aria-pressed={value === 'lbs'}
        className="relative min-w-[80px] px-4 py-1.5 rounded-[24px] text-sm font-bold tracking-wide transition-colors duration-200 text-center leading-5"
        style={{ color: value === 'lbs' ? '#FFFFFF' : '#0066FF' }}
      >
        <span className="relative z-10">LBS</span>
        <motion.div
          layoutId="unit-pill"
          className="absolute inset-0 rounded-[24px]"
          style={{ background: value === 'lbs' ? '#0066FF' : 'transparent' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </button>
      <button
        onClick={() => onChange('kg')}
        aria-pressed={value === 'kg'}
        className="relative min-w-[80px] px-4 py-1.5 rounded-[24px] text-sm font-bold tracking-wide transition-colors duration-200 text-center leading-5"
        style={{ color: value === 'kg' ? '#FFFFFF' : '#0066FF' }}
      >
        <span className="relative z-10">KG</span>
        <motion.div
          layoutId="unit-pill"
          className="absolute inset-0 rounded-[24px]"
          style={{ background: value === 'kg' ? '#0066FF' : 'transparent' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </button>
    </div>
  );
}

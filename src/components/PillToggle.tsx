import { ReactNode } from 'react';

interface PillToggleProps {
  options: (string | ReactNode)[];
  activeIndex: number;
  onChange: (index: number) => void;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
}

export function PillToggle({
  options,
  activeIndex,
  onChange,
  size = 'sm',
  fullWidth = false,
}: PillToggleProps) {
  return (
    <div
      className={`inline-flex rounded-full p-1 ${fullWidth ? 'w-full' : ''}`}
      style={{ background: '#F0F0F0', height: size === 'sm' ? 32 : 38 }}
      role="group"
    >
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onChange(index)}
          className={`
            flex-1 flex items-center justify-center rounded-full px-4 font-medium transition-all
            ${size === 'sm' ? 'text-xs' : 'text-sm'}
            ${activeIndex === index ? 'bg-[#CCE0FF] text-[#2563EB] shadow-sm' : 'bg-transparent text-gray-400'}
          `}
          style={{ height: '100%', minWidth: 80 }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

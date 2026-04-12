import { ReactNode } from 'react';

export type PillOption =
  | string
  | ReactNode
  | {
      label: string;
      icon?: ReactNode;
    };

interface PillToggleProps {
  options: PillOption[];
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
      {options.map((opt, index) => {
        const isObject = typeof opt === 'object' && opt !== null && 'label' in (opt as any) && typeof (opt as any).label === 'string';
        const label = isObject ? (opt as { label: string }).label : null;
        const icon = isObject ? (opt as { label: string; icon?: ReactNode }).icon : null;

        return (
          <button
            key={index}
            onClick={() => onChange(index)}
            className={`
              flex-1 flex items-center justify-center gap-1.5 rounded-full px-4 font-medium transition-all
              ${size === 'sm' ? 'text-xs' : 'text-sm'}
              ${activeIndex === index
                ? 'border border-[#3B82F6] bg-[#CCE0FF] text-[#2563EB] shadow-sm'
                : 'border border-transparent bg-transparent text-gray-400'}
            `}
            style={{ height: '100%', minWidth: 80 }}
          >
            {isObject ? (
              <>
                {icon && <span className="flex items-center">{icon}</span>}
                {label}
              </>
            ) : (
              opt
            )}
          </button>
        );
      })}
    </div>
  );
}

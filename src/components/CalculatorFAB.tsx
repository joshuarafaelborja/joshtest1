import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalculatorFABProps {
  onClick: () => void;
  className?: string;
}

export function CalculatorFAB({ onClick, className = '' }: CalculatorFABProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={`fixed z-50 w-14 h-14 rounded-full shadow-lg shadow-primary/30 bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-110 active:scale-95 ${className}`}
      aria-label="Open Calculator"
    >
      <Calculator className="w-6 h-6" />
    </Button>
  );
}

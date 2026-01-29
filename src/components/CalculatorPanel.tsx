import { Calculator } from 'lucide-react';
import { WarmupCalculator } from './WarmupCalculator';
import { ProgressiveOverloadCalculator } from './ProgressiveOverloadCalculator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CalculatorPanelProps {
  showHeader?: boolean;
}

export function CalculatorPanel({ showHeader = true }: CalculatorPanelProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      {showHeader && (
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">CALCULATORS</h1>
              <p className="text-sm text-muted-foreground">Smart tools for your training</p>
            </div>
          </div>
        </header>
      )}

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-6 space-y-8">
          <WarmupCalculator />
          
          <div className="section-divider" />
          
          <ProgressiveOverloadCalculator />
        </div>
      </ScrollArea>
    </div>
  );
}

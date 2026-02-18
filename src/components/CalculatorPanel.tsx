import { Calculator } from 'lucide-react';
import { WarmupCalculator } from './WarmupCalculator';
import { ProgressiveOverloadCalculator } from './ProgressiveOverloadCalculator';
import { DeloadPlanner } from './DeloadPlanner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CalculatorPanelProps {
  showHeader?: boolean;
}

export function CalculatorPanel({ showHeader = true }: CalculatorPanelProps) {
  return (
    <div className="h-full flex flex-col" style={{ background: '#FFFFFF' }}>
      {/* Header */}
      {showHeader && (
        <header className="sticky top-0 z-10 backdrop-blur-sm px-6 py-4" style={{ background: 'rgba(255,255,255,0.95)', borderBottom: '1px solid #CCE0FF' }}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#0066FF' }}>
              <Calculator className="w-5 h-5" style={{ color: '#FFFFFF' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight" style={{ color: '#0066FF' }}>CALCULATORS</h1>
              <p className="text-sm" style={{ color: '#0066FF', opacity: 0.6 }}>Smart tools for your training</p>
            </div>
          </div>
        </header>
      )}

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-6 space-y-8">
          <WarmupCalculator />
          
          <div className="section-divider" style={{ background: '#CCE0FF' }} />
          
          <DeloadPlanner />
          
          <div className="section-divider" style={{ background: '#CCE0FF' }} />
          
          <ProgressiveOverloadCalculator />
        </div>
      </ScrollArea>
    </div>
  );
}

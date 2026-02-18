import { WarmupCalculator } from './WarmupCalculator';
import { ProgressiveOverloadCalculator } from './ProgressiveOverloadCalculator';

export function CalculatorScreenContent() {
  return (
    <div className="px-4 py-6 space-y-8 max-w-4xl mx-auto" style={{ background: '#FFFFFF' }}>
      <WarmupCalculator />
      <div className="h-px" style={{ background: '#CCE0FF' }} />
      <ProgressiveOverloadCalculator />
    </div>
  );
}

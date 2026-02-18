import { WarmupCalculator } from './WarmupCalculator';
import { ProgressiveOverloadCalculator } from './ProgressiveOverloadCalculator';
import { DeloadPlanner } from './DeloadPlanner';

export function CalculatorScreenContent() {
  return (
    <div className="px-4 py-6 space-y-8 max-w-4xl mx-auto">
      <WarmupCalculator />
      <div className="h-px bg-border" />
      <DeloadPlanner />
      <div className="h-px bg-border" />
      <ProgressiveOverloadCalculator />
    </div>
  );
}

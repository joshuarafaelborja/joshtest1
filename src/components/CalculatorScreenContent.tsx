import { useState } from 'react';
import { WarmupCalculator } from './WarmupCalculator';
import { ProgressiveOverloadCalculator } from './ProgressiveOverloadCalculator';
import { DogLogo } from './DogLogo';
import { PillToggle } from './PillToggle';

export function CalculatorScreenContent() {
  const [activeTab, setActiveTab] = useState(0); // 0 = Warm-Up, 1 = Progression

  return (
    <div className="min-h-full" style={{ background: '#FFFFFF' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <DogLogo size={40} />
        <div>
          <h1 className="text-lg font-bold tracking-tight" style={{ color: '#3B82F6' }}>
            Calculator
          </h1>
          <p className="text-xs" style={{ color: '#3B82F6', opacity: 0.6 }}>
            Warm-up & progression
          </p>
        </div>
      </div>

      {/* Sub-tab Switcher */}
      <div className="px-5 pb-4">
        <PillToggle
          options={['Warm-Up', 'Progression']}
          activeIndex={activeTab}
          onChange={setActiveTab}
          size="md"
        />
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-6">
        {activeTab === 0 ? <WarmupCalculator /> : <ProgressiveOverloadCalculator />}
      </div>
    </div>
  );
}

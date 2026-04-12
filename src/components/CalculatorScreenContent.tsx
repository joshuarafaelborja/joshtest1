import { useState } from 'react';
import { Flame, BarChart2, Wrench, Sparkles } from 'lucide-react';
import { WarmupCalculator } from './WarmupCalculator';
import { ProgressiveOverloadCalculator } from './ProgressiveOverloadCalculator';
import { DogLogo } from './DogLogo';
import { PillToggle } from './PillToggle';

export function CalculatorScreenContent() {
  const [activeTab, setActiveTab] = useState(0); // 0 = Warm-Up, 1 = Overload
  const [mode, setMode] = useState(0); // 0 = Manual, 1 = AI

  const tabOptions = [
    { label: 'Warm-up', icon: <Flame className="w-4 h-4" /> },
    { label: 'Overload', icon: <BarChart2 className="w-4 h-4" /> },
  ];

  const modeOptions = [
    { label: 'Manual', icon: <Wrench className="w-4 h-4" /> },
    { label: 'AI', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col min-h-full" style={{ background: '#FFFFFF' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <DogLogo size={40} />
        <div>
          <h1 className="text-lg font-bold tracking-tight" style={{ color: '#3B82F6' }}>
            Coach
          </h1>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>
            Warm-up & progression calculator
          </p>
        </div>
      </div>

      {/* Toggles */}
      <div className="px-5 pb-4 space-y-2">
        <PillToggle
          options={tabOptions}
          activeIndex={activeTab}
          onChange={setActiveTab}
          size="md"
          fullWidth
        />
        <PillToggle
          options={modeOptions}
          activeIndex={mode}
          onChange={setMode}
          size="md"
          fullWidth
        />
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-4 pb-6">
        {activeTab === 0 ? (
          <WarmupCalculator mode={mode === 0 ? 'manual' : 'ai'} />
        ) : (
          <ProgressiveOverloadCalculator mode={mode === 0 ? 'manual' : 'ai'} />
        )}
      </div>
    </div>
  );
}

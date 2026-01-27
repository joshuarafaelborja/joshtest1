import { useState } from 'react';
import { Flame, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WarmupSet {
  setNumber: number;
  percentage: number;
  weight: number;
  reps: number;
}

type WeightUnit = 'lbs' | 'kg';

export function WarmupCalculator() {
  const [workingWeight, setWorkingWeight] = useState<string>('');
  const [unit, setUnit] = useState<WeightUnit>('lbs');
  const [warmupSets, setWarmupSets] = useState<WarmupSet[] | null>(null);

  const calculateWarmup = () => {
    const weight = parseFloat(workingWeight);
    if (isNaN(weight) || weight <= 0) return;

    const sets: WarmupSet[] = [
      { setNumber: 1, percentage: 50, weight: Math.round(weight * 0.5), reps: 10 },
      { setNumber: 2, percentage: 70, weight: Math.round(weight * 0.7), reps: 5 },
      { setNumber: 3, percentage: 85, weight: Math.round(weight * 0.85), reps: 3 },
    ];

    setWarmupSets(sets);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkingWeight(e.target.value);
    if (warmupSets) setWarmupSets(null);
  };

  const handleUnitChange = (newUnit: WeightUnit) => {
    if (newUnit === unit) return;
    
    // Convert the current weight value
    if (workingWeight) {
      const currentWeight = parseFloat(workingWeight);
      if (!isNaN(currentWeight)) {
        const convertedWeight = newUnit === 'kg' 
          ? Math.round(currentWeight / 2.205)
          : Math.round(currentWeight * 2.205);
        setWorkingWeight(convertedWeight.toString());
      }
    }
    
    // Convert warmup sets if they exist
    if (warmupSets) {
      const convertedSets = warmupSets.map(set => ({
        ...set,
        weight: newUnit === 'kg'
          ? Math.round(set.weight / 2.205)
          : Math.round(set.weight * 2.205)
      }));
      setWarmupSets(convertedSets);
    }
    
    setUnit(newUnit);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Flame className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">WARM-UP SETS</h2>
            <p className="text-sm text-muted-foreground">Calculate your warm-up progression</p>
          </div>
        </div>
      </div>

      {/* Unit Toggle */}
      <div className="flex items-center gap-1 p-1 bg-secondary rounded-full w-fit">
        <button
          onClick={() => handleUnitChange('lbs')}
          className={`pill-button ${unit === 'lbs' ? 'pill-button-active' : 'pill-button-inactive'}`}
        >
          LBS
        </button>
        <button
          onClick={() => handleUnitChange('kg')}
          className={`pill-button ${unit === 'kg' ? 'pill-button-active' : 'pill-button-inactive'}`}
        >
          KG
        </button>
      </div>

      {/* Input Section */}
      <div className="space-y-2">
        <label className="calc-label">
          <Scale className="w-3.5 h-3.5" />
          WORKING WEIGHT ({unit.toUpperCase()})
        </label>
        <div className="relative">
          <input
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={workingWeight}
            onChange={handleInputChange}
            className="calc-input pr-12"
          />
          <span className="absolute right-0 top-1/2 -translate-y-1/2 calc-unit">
            {unit.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Calculate Button */}
      <Button
        onClick={calculateWarmup}
        disabled={!workingWeight || parseFloat(workingWeight) <= 0}
        className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm tracking-wide"
      >
        CALCULATE WARM-UP
      </Button>

      {/* Results */}
      {warmupSets && (
        <div className="calc-result-card space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="calc-result-label">WARM-UP SETS</span>
            <div className="live-indicator">
              <span className="live-dot" />
              LIVE CALC
            </div>
          </div>

          <div className="space-y-3">
            {warmupSets.map((set) => (
              <div
                key={set.setNumber}
                className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
                    <span className="text-sm font-bold text-foreground">{set.setNumber}</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {set.percentage}% • {set.reps} reps
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-foreground tabular-nums">
                    {set.weight}
                  </span>
                  <span className="calc-result-unit">{unit}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground pt-2">
            Complete these sets before your working weight to prepare muscles and nervous system.
          </p>
        </div>
      )}
    </div>
  );
}

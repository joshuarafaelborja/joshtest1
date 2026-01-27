import { useState } from 'react';
import { TrendingUp, Dumbbell, Target, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalculatorResult {
  status: 'increase' | 'maintain' | 'decrease';
  message: string;
  newWeight?: number;
  percentChange?: number;
}

type WeightUnit = 'lbs' | 'kg';

export function ProgressiveOverloadCalculator() {
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [targetReps, setTargetReps] = useState<string>('');
  const [repsCompleted, setRepsCompleted] = useState<string>('');
  const [unit, setUnit] = useState<WeightUnit>('lbs');
  const [result, setResult] = useState<CalculatorResult | null>(null);

  const calculateProgression = () => {
    const weight = parseFloat(currentWeight);
    const target = parseInt(targetReps);
    const completed = parseInt(repsCompleted);

    if (isNaN(weight) || isNaN(target) || isNaN(completed)) return;

    let calcResult: CalculatorResult;

    if (completed >= target) {
      const percentIncrease = 7.5;
      const newWeight = Math.round(weight * 1.075);
      calcResult = {
        status: 'increase',
        message: 'Ready to progress',
        newWeight,
        percentChange: percentIncrease,
      };
    } else if (completed >= target - 2) {
      calcResult = {
        status: 'maintain',
        message: 'Keep current weight',
        newWeight: weight,
      };
    } else {
      const newWeight = Math.max(weight - 5, 0);
      calcResult = {
        status: 'decrease',
        message: 'Focus on form',
        newWeight,
      };
    }

    setResult(calcResult);
  };

  const handleUnitChange = (newUnit: WeightUnit) => {
    if (newUnit === unit) return;
    
    // Convert the current weight value
    if (currentWeight) {
      const weight = parseFloat(currentWeight);
      if (!isNaN(weight)) {
        const convertedWeight = newUnit === 'kg' 
          ? Math.round(weight / 2.205)
          : Math.round(weight * 2.205);
        setCurrentWeight(convertedWeight.toString());
      }
    }
    
    // Convert result if it exists
    if (result && result.newWeight) {
      const convertedNewWeight = newUnit === 'kg'
        ? Math.round(result.newWeight / 2.205)
        : Math.round(result.newWeight * 2.205);
      setResult({
        ...result,
        newWeight: convertedNewWeight
      });
    }
    
    setUnit(newUnit);
  };

  const clearInputs = () => {
    setCurrentWeight('');
    setTargetReps('');
    setRepsCompleted('');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">PROGRESSIVE OVERLOAD</h2>
            <p className="text-sm text-muted-foreground">Calculate your next weight target</p>
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

      {/* Input Fields */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="calc-label">
            <Dumbbell className="w-3.5 h-3.5" />
            WEIGHT
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              className="calc-input text-2xl pr-1"
            />
            <span className="absolute right-0 bottom-2 calc-unit text-[10px]">{unit.toUpperCase()}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="calc-label">
            <Target className="w-3.5 h-3.5" />
            TARGET
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={targetReps}
              onChange={(e) => setTargetReps(e.target.value)}
              className="calc-input text-2xl pr-1"
            />
            <span className="absolute right-0 bottom-2 calc-unit text-[10px]">REPS</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="calc-label">
            <CheckCircle2 className="w-3.5 h-3.5" />
            DONE
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={repsCompleted}
              onChange={(e) => setRepsCompleted(e.target.value)}
              className="calc-input text-2xl pr-1"
            />
            <span className="absolute right-0 bottom-2 calc-unit text-[10px]">REPS</span>
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <Button
        onClick={calculateProgression}
        disabled={!currentWeight || !targetReps || !repsCompleted}
        className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm tracking-wide"
      >
        CALCULATE PROGRESSION
      </Button>

      {/* Results */}
      {result && (
        <div className="calc-result-card animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <span className="calc-result-label">RECOMMENDATION</span>
            <div className="live-indicator">
              <span className="live-dot" />
              LIVE CALC
            </div>
          </div>

          <div className="text-center py-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {result.status === 'increase' ? 'NEXT WEIGHT' : 
               result.status === 'maintain' ? 'KEEP AT' : 'REDUCE TO'}
            </p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="calc-result-value">{result.newWeight}</span>
              <span className="calc-result-unit">{unit}</span>
            </div>
            {result.percentChange && (
              <p className="text-sm text-success mt-2 font-medium">
                +{result.percentChange}% increase
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{result.message}</span>
              <span className={`font-medium ${
                result.status === 'increase' ? 'text-success' :
                result.status === 'maintain' ? 'text-foreground' : 'text-warning'
              }`}>
                {result.status === 'increase' ? '↑ Progress' :
                 result.status === 'maintain' ? '→ Maintain' : '↓ Deload'}
              </span>
            </div>
          </div>

          <button
            onClick={clearInputs}
            className="w-full mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear & recalculate
          </button>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Based on progressive overload principles. Adjust based on recovery and form quality.
      </p>
    </div>
  );
}

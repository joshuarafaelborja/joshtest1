import { useState } from 'react';
import { TrendingUp, Dumbbell, Target, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnitToggle } from '@/components/UnitToggle';

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
    
    if (currentWeight) {
      const weight = parseFloat(currentWeight);
      if (!isNaN(weight)) {
        const convertedWeight = newUnit === 'kg' 
          ? Math.round(weight / 2.205)
          : Math.round(weight * 2.205);
        setCurrentWeight(convertedWeight.toString());
      }
    }
    
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
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#0066FF' }}>
            <TrendingUp className="w-4 h-4" style={{ color: '#FFFFFF' }} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight" style={{ color: '#0066FF' }}>PROGRESSIVE OVERLOAD</h2>
            <p className="text-sm" style={{ color: '#0066FF', opacity: 0.6 }}>Calculate your next weight target</p>
          </div>
        </div>
      </div>

      {/* Unit Toggle */}
      <UnitToggle value={unit} onChange={handleUnitChange} />

      {/* Input Fields */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5" style={{ color: '#0066FF' }}>
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
              style={{ borderColor: '#0066FF', color: '#0066FF' }}
            />
            <span className="absolute right-0 bottom-2 text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#0066FF' }}>{unit.toUpperCase()}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5" style={{ color: '#0066FF' }}>
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
              style={{ borderColor: '#0066FF', color: '#0066FF' }}
            />
            <span className="absolute right-0 bottom-2 text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#0066FF' }}>REPS</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5" style={{ color: '#0066FF' }}>
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
              style={{ borderColor: '#0066FF', color: '#0066FF' }}
            />
            <span className="absolute right-0 bottom-2 text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#0066FF' }}>REPS</span>
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <Button
        onClick={calculateProgression}
        disabled={!currentWeight || !targetReps || !repsCompleted}
        className="w-full h-12 rounded-full font-semibold text-sm tracking-wide"
        style={{ background: '#0066FF', color: '#FFFFFF' }}
      >
        CALCULATE PROGRESSION
      </Button>

      {/* Results */}
      {result && (
        <div className="rounded-xl p-5 animate-fade-in" style={{ background: '#CCE0FF', border: '1px solid #0066FF' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#0066FF' }}>RECOMMENDATION</span>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold" style={{ color: '#0066FF' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#0066FF' }} />
              LIVE CALC
            </div>
          </div>

          <div className="text-center py-4">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#0066FF', opacity: 0.6 }}>
              {result.status === 'increase' ? 'NEXT WEIGHT' : 
               result.status === 'maintain' ? 'KEEP AT' : 'REDUCE TO'}
            </p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl sm:text-5xl font-bold tabular-nums tracking-tighter" style={{ color: '#0066FF' }}>{result.newWeight}</span>
              <span className="text-sm font-semibold uppercase ml-1" style={{ color: '#0066FF' }}>{unit}</span>
            </div>
            {result.percentChange && (
              <p className="text-sm mt-2 font-medium" style={{ color: '#0066FF' }}>
                +{result.percentChange}% increase
              </p>
            )}
          </div>

          <div className="pt-4" style={{ borderTop: '1px solid rgba(0,102,255,0.2)' }}>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: '#0066FF', opacity: 0.6 }}>{result.message}</span>
              <span className="font-medium" style={{ color: '#0066FF' }}>
                {result.status === 'increase' ? '↑ Progress' :
                 result.status === 'maintain' ? '→ Maintain' : '↓ Deload'}
              </span>
            </div>
          </div>

          <button
            onClick={clearInputs}
            className="w-full mt-4 text-xs transition-colors"
            style={{ color: '#0066FF', opacity: 0.6 }}
          >
            Clear & recalculate
          </button>
        </div>
      )}

      <p className="text-xs text-center" style={{ color: '#0066FF', opacity: 0.6 }}>
        Based on progressive overload principles. Adjust based on recovery and form quality.
      </p>
    </div>
  );
}

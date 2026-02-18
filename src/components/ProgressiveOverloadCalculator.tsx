import { useState } from 'react';
import { TrendingUp, Dumbbell, Target, CheckCircle2, Sparkles, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnitToggle } from '@/components/UnitToggle';
import { ModeToggle } from '@/components/ModeToggle';
import { supabase } from '@/integrations/supabase/client';

interface CalculatorResult {
  status: 'increase' | 'maintain' | 'decrease';
  message: string;
  newWeight?: number;
  percentChange?: number;
}

type WeightUnit = 'lbs' | 'kg';
type CalculationMode = 'manual' | 'ai';

export function ProgressiveOverloadCalculator() {
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [targetReps, setTargetReps] = useState<string>('');
  const [repsCompleted, setRepsCompleted] = useState<string>('');
  const [unit, setUnit] = useState<WeightUnit>('lbs');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('manual');
  const [aiReasoning, setAiReasoning] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string>('');

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
    setAiReasoning('');
  };

  const calculateAIProgression = async () => {
    const weight = parseFloat(currentWeight);
    const target = parseInt(targetReps);
    const completed = parseInt(repsCompleted);

    if (isNaN(weight) || isNaN(target) || isNaN(completed)) return;

    setAiLoading(true);
    setAiError('');

    try {
      const { data, error } = await supabase.functions.invoke('progression-recommendation', {
        body: {
          exercise: 'Exercise',
          currentWeight: weight,
          targetReps: target,
          repsCompleted: completed,
          unit,
        },
      });

      if (error) throw error;

      // Use the AI response for reasoning, but still compute the result locally
      let calcResult: CalculatorResult;
      if (completed >= target) {
        calcResult = { status: 'increase', message: 'Ready to progress', newWeight: Math.round(weight * 1.075), percentChange: 7.5 };
      } else if (completed >= target - 2) {
        calcResult = { status: 'maintain', message: 'Keep current weight', newWeight: weight };
      } else {
        calcResult = { status: 'decrease', message: 'Focus on form', newWeight: Math.max(weight - 5, 0) };
      }

      // Override with AI-suggested weight if available
      if (data?.recommendation?.newWeight) {
        calcResult.newWeight = data.recommendation.newWeight;
      }

      setResult(calcResult);
      setAiReasoning(data?.recommendation?.reasoning || data?.reasoning || '');
    } catch (err) {
      console.error('AI progression error:', err);
      setAiError('AI calculation failed. Using manual calculation.');
      calculateProgression();
    } finally {
      setAiLoading(false);
    }
  };

  const handleCalculate = () => {
    if (calculationMode === 'ai') {
      calculateAIProgression();
    } else {
      calculateProgression();
    }
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

  const hasResults = result !== null;
  const isValidInputs = currentWeight && targetReps && repsCompleted;

  const statusLabel = result
    ? result.status === 'increase' ? '↑ Progress'
      : result.status === 'maintain' ? '→ Maintain'
      : '↓ Deload'
    : '';

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #CCE0FF' }}>
      {/* Card Header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#CCE0FF' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#0066FF' }}>
            <TrendingUp className="w-5 h-5" style={{ color: '#FFFFFF' }} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight uppercase" style={{ color: '#0066FF' }}>
              Progressive Overload
            </h2>
            <p className="text-xs" style={{ color: '#0066FF', opacity: 0.7 }}>
              {hasResults
                ? `Based on ${currentWeight} ${unit} working weight`
                : 'Calculate your next weight target'}
            </p>
          </div>
        </div>
        {hasResults && result?.newWeight && (
          <span
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: '#0066FF', color: '#FFFFFF' }}
          >
            {result.newWeight} {unit}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-5">
        {/* Toggle Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <UnitToggle value={unit} onChange={handleUnitChange} />
          <ModeToggle
            value={calculationMode}
            onChange={setCalculationMode}
            aiLabel={<><Sparkles className="w-3 h-3 mr-1" />AI</>}
          />
        </div>

        {/* AI Mode Tip */}
        {calculationMode === 'ai' && (
          <div className="p-3 rounded-lg animate-fade-in" style={{ background: '#CCE0FF', border: '1px solid #0066FF' }}>
            <p className="text-xs leading-relaxed" style={{ color: '#0066FF' }}>
              <span className="font-semibold">AI Mode</span> analyzes your performance to recommend optimal weight adjustments based on progressive overload principles.
            </p>
          </div>
        )}

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
                onChange={(e) => { setCurrentWeight(e.target.value); if (result) setResult(null); }}
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
                onChange={(e) => { setTargetReps(e.target.value); if (result) setResult(null); }}
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
                onChange={(e) => { setRepsCompleted(e.target.value); if (result) setResult(null); }}
                className="calc-input text-2xl pr-1"
                style={{ borderColor: '#0066FF', color: '#0066FF' }}
              />
              <span className="absolute right-0 bottom-2 text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#0066FF' }}>REPS</span>
            </div>
          </div>
        </div>

        {/* Placeholder message when no results */}
        {!hasResults && (
          <p className="text-center text-xs py-3" style={{ color: '#0066FF', opacity: 0.4 }}>
            Enter your details above to see your progression recommendation
          </p>
        )}

        {/* Error */}
        {aiError && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {aiError}
          </div>
        )}

        {/* Results */}
        {hasResults && result && (
          <>
            <div className="h-px" style={{ background: '#CCE0FF' }} />

            <div className="space-y-4 animate-fade-in">
              <span className="text-xs uppercase tracking-wider font-semibold flex items-center gap-2" style={{ color: '#0066FF' }}>
                {calculationMode === 'ai' && <Brain className="w-4 h-4" />}
                RESULT
              </span>

              <div
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: '#FFFFFF', border: '1px solid #CCE0FF' }}
              >
                {/* Badge */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#0066FF' }}
                >
                  <TrendingUp className="w-4 h-4" style={{ color: '#FFFFFF' }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: '#0066FF' }}>
                    Next Working Weight
                  </p>
                  <p className="text-xs" style={{ color: '#0066FF', opacity: 0.6 }}>
                    {result.message} · {statusLabel}
                    {result.percentChange ? ` · +${result.percentChange}%` : ''}
                  </p>
                </div>

                {/* Weight */}
                <div className="text-right flex-shrink-0">
                  <span className="text-xl font-black tabular-nums" style={{ color: '#0066FF' }}>
                    {result.newWeight}
                  </span>
                  <span className="ml-1 text-xs font-semibold uppercase" style={{ color: '#0066FF', opacity: 0.6 }}>
                    {unit}
                  </span>
                </div>
              </div>

              {/* AI Reasoning */}
              {aiReasoning && calculationMode === 'ai' && (
                <div className="p-4 rounded-lg" style={{ background: '#CCE0FF', border: '1px solid #0066FF' }}>
                  <h4 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: '#0066FF' }}>
                    <Brain className="w-4 h-4" />
                    Coach's Analysis
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#0066FF', opacity: 0.8 }}>{aiReasoning}</p>
                </div>
              )}

              {/* Summary */}
              <p className="text-xs" style={{ color: '#0066FF', opacity: 0.5 }}>
                Based on progressive overload principles. Adjust based on recovery and form quality.
              </p>
            </div>
          </>
        )}

        {/* Calculate / Recalculate Button */}
        <Button
          onClick={handleCalculate}
          disabled={!isValidInputs || aiLoading}
          className="w-full h-12 rounded-full font-semibold text-sm tracking-wide"
          style={{ background: '#0066FF', color: '#FFFFFF' }}
        >
          {calculationMode === 'ai' && <Sparkles className="w-4 h-4 mr-2" />}
          {aiLoading ? 'CALCULATING...' : hasResults ? 'RECALCULATE' : 'CALCULATE PROGRESSION'}
        </Button>
      </div>
    </div>
  );
}

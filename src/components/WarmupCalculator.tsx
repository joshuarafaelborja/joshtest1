import { useState } from 'react';
import { Scale, Dumbbell, Sparkles, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PillToggle } from '@/components/PillToggle';
import { getClaudeRecommendation } from '@/lib/claudeAI';
import { WarmUpIcon } from '@/components/WarmUpIcon';

interface WarmupSet {
  setNumber: number;
  percentage: number;
  weight: number;
  reps: number;
  sets: number;
  notes: string;
}

type WeightUnit = 'lbs' | 'kg';
type CalculationMode = 'manual' | 'ai';

// Round to nearest plate-friendly weight (5lb/2.5kg increments)
function roundToPlate(weight: number, unit: WeightUnit): number {
  const increment = unit === 'lbs' ? 5 : 2.5;
  return Math.round(weight / increment) * increment;
}

// Set label based on percentage

// Set label based on percentage
function getSetLabel(percentage: number): string {
  if (percentage <= 50) return 'Activation';
  if (percentage <= 70) return 'Ramp-Up';
  if (percentage <= 85) return 'Primer';
  return 'Heavy Prep';
}

export function WarmupCalculator() {
  const [workingWeight, setWorkingWeight] = useState<string>('');
  const [exerciseName, setExerciseName] = useState<string>('');
  const [workingReps, setWorkingReps] = useState<string>('5');
  const [unit, setUnit] = useState<WeightUnit>('lbs');
  const [warmupSets, setWarmupSets] = useState<WarmupSet[] | null>(null);
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('manual');
  const [aiReasoning, setAiReasoning] = useState<string>('');

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const calculateStaticWarmup = () => {
    const weight = parseFloat(workingWeight);
    if (isNaN(weight) || weight <= 0) return;

    const sets: WarmupSet[] = [
      { setNumber: 1, percentage: 50, weight: roundToPlate(weight * 0.5, unit), reps: 8, sets: 1, notes: 'Light weight, focus on form & range of motion' },
      { setNumber: 2, percentage: 70, weight: roundToPlate(weight * 0.7, unit), reps: 5, sets: 1, notes: 'Moderate load, controlled tempo' },
      { setNumber: 3, percentage: 85, weight: roundToPlate(weight * 0.85, unit), reps: 2, sets: 1, notes: 'Heavy prep, prime nervous system' },
    ];

    setWarmupSets(sets);
    setAiReasoning('');
  };

  const calculateAIWarmup = async () => {
    const weight = parseFloat(workingWeight);
    const reps = parseInt(workingReps);
    if (isNaN(weight) || weight <= 0 || isNaN(reps) || reps <= 0) return;

    setAiLoading(true);
    setAiError(null);

    try {
      const name = exerciseName.trim() || 'Exercise';
      // Use working reps as AMRAP default, and a standard 8-12 range
      const result = await getClaudeRecommendation(name, weight, reps, reps, unit, 8, 12);

      const convertedSets: WarmupSet[] = result.warmup.map((s, i) => ({
        setNumber: s.set,
        percentage: Math.round((s.weight / weight) * 100),
        weight: roundToPlate(s.weight, unit),
        reps: s.reps,
        sets: 1,
        notes: i === 0 ? 'Light weight, focus on form' : i === 1 ? 'Moderate load, controlled tempo' : 'Heavy prep, prime nervous system',
      }));

      setWarmupSets(convertedSets);
      setAiReasoning(result.reasoning || '');
    } catch (err) {
      console.error('Claude AI warmup error:', err);
      setAiError(err instanceof Error ? err.message : 'AI calculation failed');
      // Fallback to manual
      calculateStaticWarmup();
    } finally {
      setAiLoading(false);
    }
  };

  const handleCalculate = () => {
    if (calculationMode === 'ai') {
      calculateAIWarmup();
    } else {
      calculateStaticWarmup();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkingWeight(e.target.value);
    if (warmupSets) setWarmupSets(null);
  };

  const handleUnitChange = (newUnit: WeightUnit) => {
    if (newUnit === unit) return;
    
    if (workingWeight) {
      const currentWeight = parseFloat(workingWeight);
      if (!isNaN(currentWeight)) {
        const convertedWeight = newUnit === 'kg' 
          ? Math.round(currentWeight / 2.205)
          : Math.round(currentWeight * 2.205);
        setWorkingWeight(convertedWeight.toString());
      }
    }
    
    if (warmupSets) {
      const convertedSets = warmupSets.map(set => ({
        ...set,
        weight: roundToPlate(
          newUnit === 'kg' ? set.weight / 2.205 : set.weight * 2.205, 
          newUnit
        )
      }));
      setWarmupSets(convertedSets);
    }
    
    setUnit(newUnit);
  };

  const hasResults = warmupSets !== null;
  const parsedWeight = parseFloat(workingWeight);
  const isValidWeight = !isNaN(parsedWeight) && parsedWeight > 0;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'transparent' }}>
      {/* Card Header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ background: 'transparent' }}>
        <div className="flex items-center gap-3">
          <WarmUpIcon size={48} />
          <div>
            <h2 className="text-base font-bold tracking-tight uppercase" style={{ color: '#0066FF' }}>
              Warm-Up Sets
            </h2>
            <p className="text-xs" style={{ color: '#0066FF', opacity: 0.7 }}>
              {hasResults
                ? `Based on ${workingWeight} ${unit} working weight`
                : 'Enter your working weight to begin'}
            </p>
          </div>
        </div>
        {hasResults && isValidWeight && (
          <span
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: '#FFFFFF', color: '#0066FF' }}
          >
            {workingWeight} {unit}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-5">
        {/* Manual/AI Toggle */}
        <div>
          <PillToggle
            options={['Manual', <><Sparkles className="w-3 h-3 mr-1" />AI</>]}
            activeIndex={calculationMode === 'manual' ? 0 : 1}
            onChange={(i) => setCalculationMode(i === 0 ? 'manual' : 'ai')}
          />
        </div>

        {/* Exercise Name Input */}
        <div className="space-y-2">
          <label className="calc-label" style={{ color: '#0066FF' }}>
            <Dumbbell className="w-3.5 h-3.5" />
            EXERCISE NAME
          </label>
          <input
            type="text"
            placeholder="e.g., Squat, Bench Press, Deadlift"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            className="calc-input w-full"
            style={{ borderColor: '#0066FF', color: '#0066FF' }}
          />
        </div>

        {/* Working Weight Input with inline LBS/KG toggle */}
        <div className="space-y-2">
          <label className="calc-label" style={{ color: '#0066FF' }}>
            <Scale className="w-3.5 h-3.5" />
            WORKING WEIGHT
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={workingWeight}
                onChange={handleInputChange}
                className="calc-input w-full"
                style={{ borderColor: '#0066FF', color: '#0066FF' }}
              />
            </div>
            <PillToggle
              options={['LBS', 'KG']}
              activeIndex={unit === 'lbs' ? 0 : 1}
              onChange={(i) => handleUnitChange(i === 0 ? 'lbs' : 'kg')}
            />
          </div>
        </div>

        {/* AI Mode: Working Reps Input */}
        {calculationMode === 'ai' && (
          <div className="space-y-2 animate-fade-in">
            <label className="calc-label" style={{ color: '#0066FF' }}>
              WORKING REPS
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="5"
              value={workingReps}
              onChange={(e) => setWorkingReps(e.target.value)}
              className="calc-input w-full"
              style={{ borderColor: '#0066FF', color: '#0066FF' }}
            />
          </div>
        )}

        {/* Placeholder message when no results */}
        {!hasResults && (
          <p className="text-center text-xs py-3" style={{ color: '#0066FF', opacity: 0.4 }}>
            Enter weight above to see your warm-up sets
          </p>
        )}

        {/* Error */}
        {aiError && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {aiError}
          </div>
        )}


        {/* Results: Set Progression */}
        {hasResults && warmupSets && (
          <>
            <div className="h-px" style={{ background: '#CCE0FF' }} />

            <div className="space-y-4 animate-fade-in">
              <span className="text-xs uppercase tracking-wider font-semibold flex items-center gap-2" style={{ color: '#0066FF' }}>
                {calculationMode === 'ai' && <Brain className="w-4 h-4" />}
                SET PROGRESSION
              </span>

              <div className="space-y-3">
                {warmupSets.map((set, index) => {
                  const isLast = index === warmupSets.length - 1;
                  return (
                    <div
                      key={set.setNumber}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: '#FFFFFF', border: '1px solid #CCE0FF' }}
                    >
                      {/* Numbered badge */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: isLast ? '#0066FF' : '#CCE0FF',
                          color: isLast ? '#FFFFFF' : '#0066FF',
                        }}
                      >
                        <span className="text-sm font-bold">{set.setNumber}</span>
                      </div>

                      {/* Set info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold" style={{ color: '#0066FF' }}>
                          {set.percentage > 0 ? `${set.percentage}%` : ''} · {getSetLabel(set.percentage)}
                        </p>
                        <p className="text-xs" style={{ color: '#0066FF', opacity: 0.6 }}>
                          {set.sets} × {set.reps} reps
                          {set.notes && ` — ${set.notes}`}
                        </p>
                      </div>

                      {/* Weight */}
                      <div className="text-right flex-shrink-0">
                        <span className="text-xl font-black tabular-nums" style={{ color: '#0066FF' }}>
                          {set.weight}
                        </span>
                        <span className="ml-1 text-xs font-semibold uppercase" style={{ color: '#0066FF', opacity: 0.6 }}>
                          {unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Reasoning */}
              {aiReasoning && calculationMode === 'ai' && (
                <div className="p-4 rounded-lg" style={{ background: '#CCE0FF', border: '1px solid #0066FF' }}>
                  <h4 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: '#0066FF' }}>
                    <Brain className="w-4 h-4" />
                    Coach's Strategy
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#0066FF', opacity: 0.8 }}>{aiReasoning}</p>
                </div>
              )}

              {/* Summary */}
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#0066FF', opacity: 0.6 }}>
                <Dumbbell className="w-3.5 h-3.5" />
                {warmupSets.reduce((acc, s) => acc + s.sets, 0)} sets before working weight · Rounded to nearest {unit === 'lbs' ? '5 lbs' : '2.5 kg'}
              </div>
            </div>
          </>
        )}

        {/* Calculate / Recalculate Button */}
        <Button
          onClick={handleCalculate}
          disabled={!isValidWeight || aiLoading}
          className="w-full h-12 rounded-full font-semibold text-sm tracking-wide"
          style={{ background: '#0066FF', color: '#FFFFFF' }}
        >
          {calculationMode === 'ai' && <Sparkles className="w-4 h-4 mr-2" />}
          {aiLoading ? 'CALCULATING...' : hasResults ? 'RECALCULATE' : 'CALCULATE WARM-UP'}
        </Button>
      </div>
    </div>
  );
}

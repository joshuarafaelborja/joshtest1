import { useState } from 'react';
import { Scale, Dumbbell, Sparkles, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnitToggle } from '@/components/UnitToggle';
import { ModeToggle } from '@/components/ModeToggle';
import { useWarmupCalculation, AIWarmupSet } from '@/hooks/useWarmupCalculation';
import { useAuth } from '@/hooks/useAuth';

const WarmupMascotIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" width="30" height="30" rx="15" fill="#0066FF"/>
    <g clipPath="url(#clip0_warmup_card)">
      <path opacity="0.1" d="M16 24.8C20.8601 24.8 24.8 20.8601 24.8 16C24.8 11.1399 20.8601 7.2 16 7.2C11.1398 7.2 7.19995 11.1399 7.19995 16C7.19995 20.8601 11.1398 24.8 16 24.8Z" fill="#3B82F6"/>
      <path d="M16 24C19.314 24 22 21.314 22 18C22 14.686 19.314 12 16 12C12.686 12 10 14.686 10 18C10 21.314 12.686 24 16 24Z" fill="#F1F5F9"/>
      <path d="M16 22.56C18.32 22.56 20.2 21.056 20.2 19.2C20.2 17.344 18.32 15.84 16 15.84C13.68 15.84 11.8 17.344 11.8 19.2C11.8 21.056 13.68 22.56 16 22.56Z" fill="#E2E8F0"/>
      <path d="M14.2 18.24C14.664 18.24 15.04 17.864 15.04 17.4C15.04 16.936 14.664 16.56 14.2 16.56C13.736 16.56 13.36 16.936 13.36 17.4C13.36 17.864 13.736 18.24 14.2 18.24Z" fill="#1E293B"/>
      <path d="M17.8 18.24C18.264 18.24 18.64 17.864 18.64 17.4C18.64 16.936 18.264 16.56 17.8 16.56C17.336 16.56 16.96 16.936 16.96 17.4C16.96 17.864 17.336 18.24 17.8 18.24Z" fill="#1E293B"/>
      <path d="M14.2 20.16C15.4 20.72 16.6 20.72 17.8 20.16" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round"/>
    </g>
    <defs>
      <clipPath id="clip0_warmup_card">
        <rect width="32" height="32" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

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

// Convert AI warmup sets to our format
function convertAIWarmupSets(aiSets: AIWarmupSet[], unit: WeightUnit): WarmupSet[] {
  return aiSets.map(set => ({
    setNumber: set.setNumber,
    percentage: set.percentage || 0,
    weight: roundToPlate(set.weight, unit),
    reps: set.reps,
    sets: 1,
    notes: set.notes || '',
  }));
}

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

  const { calculateWarmups, loading: aiLoading, error: aiError } = useWarmupCalculation();
  const { isAuthenticated } = useAuth();

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

    const name = exerciseName.trim() || 'Exercise';
    const result = await calculateWarmups(name, weight, reps, unit, isAuthenticated);

    if (result) {
      if (result.warmupSets && Array.isArray(result.warmupSets)) {
        setWarmupSets(convertAIWarmupSets(result.warmupSets, unit));
        setAiReasoning(result.reasoning || '');
      } else {
        console.error('Invalid warmup response structure:', result);
      }
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
    <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #CCE0FF' }}>
      {/* Card Header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#CCE0FF' }}>
        <div className="flex items-center gap-3">
          <WarmupMascotIcon />
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
              <span className="font-semibold">AI Mode</span> tailors warm-up sets to your specific exercise, considering movement patterns and optimal rep schemes for performance.
            </p>
          </div>
        )}

        {/* AI Mode: Exercise Name Input */}
        {calculationMode === 'ai' && (
          <div className="space-y-2 animate-fade-in">
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
        )}

        {/* Working Weight Input */}
        <div className="space-y-2">
          <label className="calc-label" style={{ color: '#0066FF' }}>
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
              style={{ borderColor: '#0066FF', color: '#0066FF' }}
            />
            <span className="absolute right-0 top-1/2 -translate-y-1/2 calc-unit" style={{ color: '#0066FF' }}>
              {unit.toUpperCase()}
            </span>
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

        {calculationMode === 'ai' && !isAuthenticated && (
          <p className="text-xs text-center" style={{ color: '#0066FF', opacity: 0.6 }}>
            Sign in to save your warm-up calculations to the cloud
          </p>
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

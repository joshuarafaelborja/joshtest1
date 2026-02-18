import { useState } from 'react';
import { Scale, Dumbbell, Sparkles, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnitToggle } from '@/components/UnitToggle';
import { ModeToggle } from '@/components/ModeToggle';
import { useWarmupCalculation, AIWarmupSet } from '@/hooks/useWarmupCalculation';
import { useAuth } from '@/hooks/useAuth';

const WarmupMascotIcon = () => (
  <svg width="48" height="48" viewBox="0 0 34 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" width="30" height="30" rx="15" fill="#0066FF"/>
    <path d="M27.2397 16.3756C27.0452 17.4619 26.5226 18.4625 25.7422 19.2428C24.9618 20.023 23.961 20.5454 22.8747 20.7397C22.8334 20.7463 22.7918 20.7497 22.75 20.75C22.5619 20.75 22.3806 20.6792 22.2422 20.5518C22.1038 20.4244 22.0183 20.2496 22.0028 20.0621C21.9872 19.8746 22.0426 19.6881 22.1581 19.5396C22.2736 19.3911 22.4407 19.2914 22.6262 19.2603C24.1797 18.9987 25.4978 17.6806 25.7612 16.1244C25.7946 15.9282 25.9045 15.7533 26.0667 15.6381C26.229 15.523 26.4304 15.477 26.6266 15.5103C26.8227 15.5436 26.9976 15.6535 27.1128 15.8158C27.228 15.9781 27.2739 16.1794 27.2406 16.3756H27.2397ZM30.25 15.5C30.25 17.688 29.3808 19.7865 27.8336 21.3336C26.2865 22.8808 24.188 23.75 22 23.75C19.812 23.75 17.7135 22.8808 16.1664 21.3336C14.6192 19.7865 13.75 17.688 13.75 15.5C13.75 12.8825 14.7813 10.2059 16.8119 7.54531C16.8762 7.46107 16.9576 7.3914 17.0507 7.34089C17.1439 7.29039 17.2467 7.26021 17.3523 7.25232C17.458 7.24444 17.5642 7.25904 17.6638 7.29516C17.7634 7.33128 17.8542 7.3881 17.9303 7.46188L20.1916 9.65656L22.2541 3.99313C22.2953 3.88017 22.363 3.77878 22.4516 3.69749C22.5402 3.61621 22.6471 3.55742 22.7632 3.52608C22.8792 3.49474 23.0011 3.49177 23.1186 3.51741C23.2361 3.54306 23.3457 3.59657 23.4381 3.67344C25.4884 5.375 30.25 9.92656 30.25 15.5ZM28.75 15.5C28.75 11.1791 25.3947 7.445 23.2928 5.53156L21.205 11.2569C21.1621 11.3745 21.0906 11.4795 20.9967 11.5623C20.9029 11.6451 20.7899 11.7032 20.6679 11.7311C20.5459 11.7591 20.4188 11.7561 20.2983 11.7224C20.1778 11.6887 20.0676 11.6253 19.9778 11.5381L17.5056 9.14C16.0084 11.3009 15.25 13.4375 15.25 15.5C15.25 17.2902 15.9612 19.0071 17.227 20.273C18.4929 21.5388 20.2098 22.25 22 22.25C23.7902 22.25 25.5071 21.5388 26.773 20.273C28.0388 19.0071 28.75 17.2902 28.75 15.5Z" fill="white"/>
    <g clipPath="url(#clip0_warmup_header)">
      <path opacity="0.1" d="M12 26.6C15.645 26.6 18.6 23.645 18.6 20C18.6 16.355 15.645 13.4 12 13.4C8.355 13.4 5.4 16.355 5.4 20C5.4 23.645 8.355 26.6 12 26.6Z" fill="#3B82F6"/>
      <path d="M12 26C15.314 26 18 23.314 18 20C18 16.686 15.314 14 12 14C8.686 14 6 16.686 6 20C6 23.314 8.686 26 12 26Z" fill="#F1F5F9"/>
      <path d="M12 24.56C14.32 24.56 16.2 23.056 16.2 21.2C16.2 19.344 14.32 17.84 12 17.84C9.68 17.84 7.8 19.344 7.8 21.2C7.8 23.056 9.68 24.56 12 24.56Z" fill="#E2E8F0"/>
      <path d="M10.2 20.24C10.664 20.24 11.04 19.864 11.04 19.4C11.04 18.936 10.664 18.56 10.2 18.56C9.736 18.56 9.36 18.936 9.36 19.4C9.36 19.864 9.736 20.24 10.2 20.24Z" fill="#1E293B"/>
      <path d="M13.8 20.24C14.264 20.24 14.64 19.864 14.64 19.4C14.64 18.936 14.264 18.56 13.8 18.56C13.336 18.56 12.96 18.936 12.96 19.4C12.96 19.864 13.336 20.24 13.8 20.24Z" fill="#1E293B"/>
      <path d="M10.2 22.16C11.4 22.72 12.6 22.72 13.8 22.16" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round"/>
    </g>
    <defs><clipPath id="clip0_warmup_header"><rect width="24" height="24" fill="white" transform="translate(0 8)"/></clipPath></defs>
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

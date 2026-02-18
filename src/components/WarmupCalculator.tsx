import { useState } from 'react';
import { Scale, Dumbbell, Sparkles, Brain } from 'lucide-react';

const WarmupMascotIcon = () => (
  <svg width="48" height="48" viewBox="0 0 34 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" width="30" height="30" rx="15" fill="#0066FF"/>
    <path d="M27.2397 16.3756C27.0452 17.4619 26.5226 18.4625 25.7422 19.2428C24.9618 20.023 23.961 20.5454 22.8747 20.7397C22.8334 20.7463 22.7918 20.7497 22.75 20.75C22.5619 20.75 22.3806 20.6792 22.2422 20.5518C22.1038 20.4244 22.0183 20.2496 22.0028 20.0621C21.9872 19.8746 22.0426 19.6881 22.1581 19.5396C22.2736 19.3911 22.4407 19.2914 22.6262 19.2603C24.1797 18.9987 25.4978 17.6806 25.7612 16.1244C25.7946 15.9282 25.9045 15.7533 26.0667 15.6381C26.229 15.523 26.4304 15.477 26.6266 15.5103C26.8227 15.5436 26.9976 15.6535 27.1128 15.8158C27.228 15.9781 27.2739 16.1794 27.2406 16.3756H27.2397ZM30.25 15.5C30.25 17.688 29.3808 19.7865 27.8336 21.3336C26.2865 22.8808 24.188 23.75 22 23.75C19.812 23.75 17.7135 22.8808 16.1664 21.3336C14.6192 19.7865 13.75 17.688 13.75 15.5C13.75 12.8825 14.7813 10.2059 16.8119 7.54531C16.8762 7.46107 16.9576 7.3914 17.0507 7.34089C17.1439 7.29039 17.2467 7.26021 17.3523 7.25232C17.458 7.24444 17.5642 7.25904 17.6638 7.29516C17.7634 7.33128 17.8542 7.3881 17.9303 7.46188L20.1916 9.65656L22.2541 3.99313C22.2953 3.88017 22.363 3.77878 22.4516 3.69749C22.5402 3.61621 22.6471 3.55742 22.7632 3.52608C22.8792 3.49474 23.0011 3.49177 23.1186 3.51741C23.2361 3.54306 23.3457 3.59657 23.4381 3.67344C25.4884 5.375 30.25 9.92656 30.25 15.5ZM28.75 15.5C28.75 11.1791 25.3947 7.445 23.2928 5.53156L21.205 11.2569C21.1621 11.3745 21.0906 11.4795 20.9967 11.5623C20.9029 11.6451 20.7899 11.7032 20.6679 11.7311C20.5459 11.7591 20.4188 11.7561 20.2983 11.7224C20.1778 11.6887 20.0676 11.6253 19.9778 11.5381L17.5056 9.14C16.0084 11.3009 15.25 13.4375 15.25 15.5C15.25 17.2902 15.9612 19.0071 17.227 20.273C18.4929 21.5388 20.2098 22.25 22 22.25C23.7902 22.25 25.5071 21.5388 26.773 20.273C28.0388 19.0071 28.75 17.2902 28.75 15.5Z" fill="white"/>
    <g clipPath="url(#clip0_496_185)"><path opacity="0.1" d="M11.9999 26.6C15.645 26.6 18.5999 23.6451 18.5999 20C18.5999 16.3549 15.645 13.4 11.9999 13.4C8.35482 13.4 5.3999 16.3549 5.3999 20C5.3999 23.6451 8.35482 26.6 11.9999 26.6Z" fill="#3B82F6"/><path d="M12 26C15.3137 26 18 23.3137 18 20C18 16.6863 15.3137 14 12 14C8.68629 14 6 16.6863 6 20C6 23.3137 8.68629 26 12 26Z" fill="#F1F5F9"/><path d="M12 24.56C14.3196 24.56 16.2 23.0557 16.2 21.2C16.2 19.3443 14.3196 17.84 12 17.84C9.68045 17.84 7.80005 19.3443 7.80005 21.2C7.80005 23.0557 9.68045 24.56 12 24.56Z" fill="#E2E8F0"/><path opacity="0.6" d="M8.39998 22.88C9.46037 22.88 10.32 22.0204 10.32 20.96C10.32 19.8996 9.46037 19.04 8.39998 19.04C7.33959 19.04 6.47998 19.8996 6.47998 20.96C6.47998 22.0204 7.33959 22.88 8.39998 22.88Z" fill="#CBD5E1"/><path opacity="0.6" d="M15.5999 22.88C16.6603 22.88 17.5199 22.0204 17.5199 20.96C17.5199 19.8996 16.6603 19.04 15.5999 19.04C14.5395 19.04 13.6799 19.8996 13.6799 20.96C13.6799 22.0204 14.5395 22.88 15.5999 22.88Z" fill="#CBD5E1"/><path opacity="0.6" d="M14.3436 20.807C15.404 20.807 16.2636 19.9474 16.2636 18.887C16.2636 17.8267 15.404 16.967 14.3436 16.967C13.2832 16.967 12.4236 17.8267 12.4236 18.887C12.4236 19.9474 13.2832 20.807 14.3436 20.807Z" fill="#1E3A8A"/><path d="M10.2001 20.24C10.664 20.24 11.0401 19.8639 11.0401 19.4C11.0401 18.9361 10.664 18.56 10.2001 18.56C9.73619 18.56 9.36011 18.9361 9.36011 19.4C9.36011 19.8639 9.73619 20.24 10.2001 20.24Z" fill="#1E293B"/><path d="M13.8 20.24C14.2639 20.24 14.64 19.8639 14.64 19.4C14.64 18.9361 14.2639 18.56 13.8 18.56C13.336 18.56 12.96 18.9361 12.96 19.4C12.96 19.8639 13.336 20.24 13.8 20.24Z" fill="#1E293B"/><path d="M10.4399 19.46C10.6056 19.46 10.7399 19.3257 10.7399 19.16C10.7399 18.9943 10.6056 18.86 10.4399 18.86C10.2742 18.86 10.1399 18.9943 10.1399 19.16C10.1399 19.3257 10.2742 19.46 10.4399 19.46Z" fill="white"/><path d="M14.04 19.46C14.2057 19.46 14.34 19.3257 14.34 19.16C14.34 18.9943 14.2057 18.86 14.04 18.86C13.8743 18.86 13.74 18.9943 13.74 19.16C13.74 19.3257 13.8743 19.46 14.04 19.46Z" fill="white"/><path d="M9.31758 17.606C9.99098 17.6462 10.607 17.8351 11.1657 18.1726" stroke="#475569" strokeLinecap="round"/><path d="M12.756 18.5416C13.2933 18.172 13.8975 17.9471 14.5686 17.8667" stroke="#475569" strokeLinecap="round"/><path d="M11.9999 21.8C12.5964 21.8 13.0799 21.4239 13.0799 20.96C13.0799 20.4961 12.5964 20.12 11.9999 20.12C11.4035 20.12 10.9199 20.4961 10.9199 20.96C10.9199 21.4239 11.4035 21.8 11.9999 21.8Z" fill="#64748B"/><path d="M12 21.44C12.3977 21.44 12.72 21.2251 12.72 20.96C12.72 20.6949 12.3977 20.48 12 20.48C11.6024 20.48 11.28 20.6949 11.28 20.96C11.28 21.2251 11.6024 21.44 12 21.44Z" fill="#475569"/><path d="M10.2 22.16C11.4 22.72 12.6 22.72 13.8 22.16Z" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round"/><path d="M7.75942 17.9479C8.66549 17.6333 9.10478 15.9504 8.74061 14.1891C8.37644 12.4278 7.34671 11.2551 6.44063 11.5697C5.53456 11.8843 5.09527 13.5672 5.45944 15.3285C5.82361 17.0898 6.85335 18.2625 7.75942 17.9479Z" fill="#CBD5E1"/><path d="M7.53956 16.8849C8.10586 16.6882 8.36812 15.5769 8.12534 14.4027C7.88255 13.2285 7.22667 12.4361 6.66038 12.6327C6.09408 12.8294 5.83182 13.9406 6.0746 15.1148C6.31738 16.289 6.97327 17.0815 7.53956 16.8849Z" fill="#E2E8F0"/><path d="M16.1605 17.9479C15.2544 17.6333 14.8151 15.9504 15.1793 14.1891C15.5435 12.4278 16.5732 11.2551 17.4793 11.5697C18.3854 11.8843 18.8247 13.5672 18.4605 15.3285C18.0963 17.0898 17.0666 18.2625 16.1605 17.9479Z" fill="#CBD5E1"/><path d="M16.3804 16.8849C15.8141 16.6882 15.5518 15.5769 15.7946 14.4027C16.0374 13.2285 16.6933 12.4361 17.2595 12.6327C17.8258 12.8294 18.0881 13.9406 17.8453 15.1148C17.6025 16.289 16.9467 17.0815 16.3804 16.8849Z" fill="#E2E8F0"/><path d="M12.9337 23.3532C12.9578 24.7957 14.1096 25.9467 15.5062 25.924C16.9029 25.9013 18.0155 24.7136 17.9914 23.2712C17.9673 21.8287 16.8156 20.6777 15.4189 20.7004C14.0223 20.723 12.9096 21.9107 12.9337 23.3532Z" fill="#475569"/><path d="M13.4757 23.3444C13.4946 24.4778 14.3996 25.3821 15.4969 25.3643C16.5943 25.3465 17.4685 24.4133 17.4496 23.28C17.4306 22.1466 16.5257 21.2422 15.4283 21.26C14.331 21.2779 13.4567 22.2111 13.4757 23.3444Z" fill="#64748B"/><path d="M14.1983 23.3327C14.2104 24.0539 14.7862 24.6294 15.4846 24.6181C16.1829 24.6068 16.7392 24.0129 16.7271 23.2917C16.7151 22.5704 16.1392 21.9949 15.4409 22.0063C14.7426 22.0176 14.1862 22.6115 14.1983 23.3327Z" fill="#94A3B8"/><path d="M14.9188 23.8254C15.2209 23.8208 15.4619 23.5775 15.4569 23.282C15.452 22.9864 15.2031 22.7505 14.9009 22.7551L9.61263 22.8351C9.31049 22.8397 9.06956 23.083 9.0745 23.3786C9.07943 23.6741 9.32837 23.91 9.6305 23.9055L14.9188 23.8254Z" fill="#64748B"/><path d="M6.53991 23.3894C6.56402 24.8319 7.71577 25.9828 9.11241 25.9602C10.5091 25.9375 11.6217 24.7498 11.5976 23.3074C11.5735 21.8649 10.4218 20.7139 9.02511 20.7366C7.62846 20.7592 6.51581 21.9469 6.53991 23.3894Z" fill="#475569"/><path d="M7.08188 23.3806C7.10082 24.514 8.00577 25.4183 9.10313 25.4005C10.2005 25.3827 11.0747 24.4495 11.0558 23.3161C11.0368 22.1828 10.1319 21.2784 9.03453 21.2962C7.93717 21.314 7.06294 22.2472 7.08188 23.3806Z" fill="#64748B"/><path d="M7.80426 23.3689C7.81631 24.0901 8.39219 24.6656 9.09051 24.6543C9.78883 24.643 10.3452 24.0491 10.3331 23.3279C10.3211 22.6066 9.74518 22.0311 9.04686 22.0425C8.34853 22.0538 7.7922 22.6477 7.80426 23.3689Z" fill="#94A3B8"/></g>
    <defs><clipPath id="clip0_496_185"><rect width="24" height="24" fill="white" transform="translate(0 8)"/></clipPath></defs>
  </svg>
);
import { Button } from '@/components/ui/button';
import { UnitToggle } from '@/components/UnitToggle';
import { ModeToggle } from '@/components/ModeToggle';
import { useWarmupCalculation, AIWarmupSet } from '@/hooks/useWarmupCalculation';
import { useAuth } from '@/hooks/useAuth';

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

    // Progressive warmup scheme for plate-based lifting (3 total sets)
    const sets: WarmupSet[] = [
      { 
        setNumber: 1, 
        percentage: 50, 
        weight: roundToPlate(weight * 0.5, unit), 
        reps: 8, 
        sets: 1,
        notes: 'Light weight, focus on form & range of motion'
      },
      { 
        setNumber: 2, 
        percentage: 70, 
        weight: roundToPlate(weight * 0.7, unit), 
        reps: 5, 
        sets: 1,
        notes: 'Moderate load, controlled tempo'
      },
      { 
        setNumber: 3, 
        percentage: 85, 
        weight: roundToPlate(weight * 0.85, unit), 
        reps: 2, 
        sets: 1,
        notes: 'Heavy prep, prime nervous system'
      },
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
        weight: roundToPlate(
          newUnit === 'kg' ? set.weight / 2.205 : set.weight * 2.205, 
          newUnit
        )
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
          <WarmupMascotIcon />
          <div>
            <h2 className="text-lg font-bold tracking-tight" style={{ color: '#0066FF' }}>WARM-UP SETS</h2>
            <p className="text-sm" style={{ color: '#0066FF', opacity: 0.6 }}>Calculate your warm-up progression</p>
          </div>
        </div>
      </div>

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

      {/* Input Section */}
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

      {/* Calculate Button */}
      <Button
        onClick={handleCalculate}
        disabled={!workingWeight || parseFloat(workingWeight) <= 0 || aiLoading}
        className="w-full h-12 rounded-full font-semibold text-sm tracking-wide"
        style={{ background: '#0066FF', color: '#FFFFFF' }}
      >
        {calculationMode === 'ai' && <Sparkles className="w-4 h-4 mr-2" />}
        {aiLoading ? 'CALCULATING...' : 'CALCULATE WARM-UP'}
      </Button>

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

      {/* Results */}
      {warmupSets && (
        <div className="rounded-xl p-5 space-y-4 animate-fade-in" style={{ background: '#CCE0FF', border: '1px solid #0066FF' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold flex items-center gap-2" style={{ color: '#0066FF' }}>
              {calculationMode === 'ai' && <Brain className="w-4 h-4" />}
              {calculationMode === 'ai' ? 'AI WARM-UP PROTOCOL' : 'WARM-UP PROTOCOL'}
            </span>
          </div>

          <div className="space-y-4">
            {warmupSets.map((set) => (
              <div
                key={set.setNumber}
                className="p-4 rounded-xl"
                style={{ background: '#FFFFFF', border: '1px solid #CCE0FF' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#CCE0FF' }}>
                      <span className="text-sm font-bold" style={{ color: '#0066FF' }}>{set.setNumber}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#0066FF' }}>
                        {set.sets} × {set.reps} reps {set.percentage > 0 && `@ ${set.percentage}%`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black tabular-nums" style={{ color: '#0066FF' }}>
                      {set.weight}
                    </span>
                    <span className="ml-1 text-sm font-semibold uppercase" style={{ color: '#0066FF' }}>{unit}</span>
                  </div>
                </div>
                {set.notes && (
                  <p className="text-xs pl-11" style={{ color: '#0066FF', opacity: 0.6 }}>
                    {set.notes}
                  </p>
                )}
              </div>
            ))}
          </div>

          {aiReasoning && calculationMode === 'ai' && (
            <div className="p-4 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #0066FF' }}>
              <h4 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: '#0066FF' }}>
                <Brain className="w-4 h-4" />
                Coach's Strategy
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: '#0066FF', opacity: 0.8 }}>{aiReasoning}</p>
            </div>
          )}

          <div className="p-3 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #0066FF' }}>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#0066FF' }}>
              <Dumbbell className="w-4 h-4" />
              Total: {warmupSets.reduce((acc, s) => acc + s.sets, 0)} sets before working weight
            </div>
          </div>

          <p className="text-xs" style={{ color: '#0066FF', opacity: 0.6 }}>
            Weights rounded to nearest {unit === 'lbs' ? '5 lbs' : '2.5 kg'} for easy plate loading.
          </p>
        </div>
      )}
    </div>
  );
}

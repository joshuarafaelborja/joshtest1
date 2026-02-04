import { useState } from 'react';
import { Flame, Scale, Dumbbell, Sparkles, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
type CalculationMode = 'static' | 'ai';

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
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('static');
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
      setWarmupSets(convertAIWarmupSets(result.warmupSets, unit));
      setAiReasoning(result.reasoning);
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
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Flame className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">WARM-UP SETS</h2>
            <p className="text-sm text-muted-foreground">Calculate your warm-up progression</p>
          </div>
        </div>
      </div>

      {/* Toggle Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Unit Toggle */}
        <div className="flex items-center gap-1 p-1 bg-secondary rounded-full">
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

        {/* Calculation Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-secondary rounded-full">
          <button
            onClick={() => setCalculationMode('static')}
            className={`pill-button ${calculationMode === 'static' ? 'pill-button-active' : 'pill-button-inactive'}`}
          >
            Standard
          </button>
          <button
            onClick={() => setCalculationMode('ai')}
            className={`pill-button ${calculationMode === 'ai' ? 'pill-button-active' : 'pill-button-inactive'}`}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            AI
          </button>
        </div>
      </div>

      {/* AI Mode Tip */}
      {calculationMode === 'ai' && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 animate-fade-in">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-primary">AI Mode</span> tailors warm-up sets to your specific exercise, considering movement patterns and optimal rep schemes for performance.
          </p>
        </div>
      )}

      {/* AI Mode: Exercise Name Input */}
      {calculationMode === 'ai' && (
        <div className="space-y-2 animate-fade-in">
          <label className="calc-label">
            <Dumbbell className="w-3.5 h-3.5" />
            EXERCISE NAME
          </label>
          <input
            type="text"
            placeholder="e.g., Squat, Bench Press, Deadlift"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            className="calc-input w-full"
          />
        </div>
      )}

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

      {/* AI Mode: Working Reps Input */}
      {calculationMode === 'ai' && (
        <div className="space-y-2 animate-fade-in">
          <label className="calc-label">
            WORKING REPS
          </label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="5"
            value={workingReps}
            onChange={(e) => setWorkingReps(e.target.value)}
            className="calc-input w-full"
          />
        </div>
      )}

      {/* Calculate Button */}
      <Button
        onClick={handleCalculate}
        disabled={!workingWeight || parseFloat(workingWeight) <= 0 || aiLoading}
        className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm tracking-wide"
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
        <p className="text-xs text-muted-foreground text-center">
          Sign in to save your warm-up calculations to the cloud
        </p>
      )}

      {/* Results */}
      {warmupSets && (
        <div className="calc-result-card space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="calc-result-label flex items-center gap-2">
              {calculationMode === 'ai' && <Brain className="w-4 h-4" />}
              {calculationMode === 'ai' ? 'AI WARM-UP PROTOCOL' : 'WARM-UP PROTOCOL'}
            </span>
          </div>

          <div className="space-y-4">
            {warmupSets.map((set) => (
              <div
                key={set.setNumber}
                className="p-4 rounded-xl bg-background/50 border border-border/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{set.setNumber}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {set.sets} × {set.reps} reps {set.percentage > 0 && `@ ${set.percentage}%`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-foreground tabular-nums">
                      {set.weight}
                    </span>
                    <span className="calc-result-unit ml-1">{unit}</span>
                  </div>
                </div>
                {set.notes && (
                  <p className="text-xs text-muted-foreground pl-11">
                    {set.notes}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* AI Reasoning */}
          {aiReasoning && calculationMode === 'ai' && (
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Coach's Strategy
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed">{aiReasoning}</p>
            </div>
          )}

          {/* Total Warmup Summary */}
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
            <div className="flex items-center gap-2 text-sm text-primary font-semibold">
              <Dumbbell className="w-4 h-4" />
              Total: {warmupSets.reduce((acc, s) => acc + s.sets, 0)} sets before working weight
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Weights rounded to nearest {unit === 'lbs' ? '5 lbs' : '2.5 kg'} for easy plate loading.
          </p>
        </div>
      )}
    </div>
  );
}

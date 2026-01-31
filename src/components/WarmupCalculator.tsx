import { useState } from 'react';
import { Flame, Scale, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WarmupSet {
  setNumber: number;
  percentage: number;
  weight: number;
  reps: number;
  sets: number;
  notes: string;
}

type WeightUnit = 'lbs' | 'kg';
type LiftType = 'barbell' | 'dumbbell';

// Round to nearest plate-friendly weight (barbell: 5lb/2.5kg increments, dumbbell: 5lb/2.5kg)
function roundToPlate(weight: number, unit: WeightUnit, liftType: LiftType): number {
  const increment = unit === 'lbs' ? 5 : 2.5;
  return Math.round(weight / increment) * increment;
}

export function WarmupCalculator() {
  const [workingWeight, setWorkingWeight] = useState<string>('');
  const [unit, setUnit] = useState<WeightUnit>('lbs');
  const [liftType, setLiftType] = useState<LiftType>('barbell');
  const [warmupSets, setWarmupSets] = useState<WarmupSet[] | null>(null);

  const calculateWarmup = () => {
    const weight = parseFloat(workingWeight);
    if (isNaN(weight) || weight <= 0) return;

    // Progressive warmup scheme for plate-based lifting
    const sets: WarmupSet[] = [
      { 
        setNumber: 1, 
        percentage: 40, 
        weight: roundToPlate(weight * 0.4, unit, liftType), 
        reps: 10, 
        sets: 2,
        notes: 'Light weight, focus on form & range of motion'
      },
      { 
        setNumber: 2, 
        percentage: 60, 
        weight: roundToPlate(weight * 0.6, unit, liftType), 
        reps: 6, 
        sets: 2,
        notes: 'Moderate load, controlled tempo'
      },
      { 
        setNumber: 3, 
        percentage: 80, 
        weight: roundToPlate(weight * 0.8, unit, liftType), 
        reps: 3, 
        sets: 1,
        notes: 'Heavy prep, prime nervous system'
      },
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
        weight: roundToPlate(
          newUnit === 'kg' ? set.weight / 2.205 : set.weight * 2.205, 
          newUnit, 
          liftType
        )
      }));
      setWarmupSets(convertedSets);
    }
    
    setUnit(newUnit);
  };

  const handleLiftTypeChange = (newType: LiftType) => {
    if (newType === liftType) return;
    setLiftType(newType);
    if (warmupSets) setWarmupSets(null);
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

        {/* Lift Type Toggle */}
        <div className="flex items-center gap-1 p-1 bg-secondary rounded-full">
          <button
            onClick={() => handleLiftTypeChange('barbell')}
            className={`pill-button ${liftType === 'barbell' ? 'pill-button-active' : 'pill-button-inactive'}`}
          >
            BARBELL
          </button>
          <button
            onClick={() => handleLiftTypeChange('dumbbell')}
            className={`pill-button ${liftType === 'dumbbell' ? 'pill-button-active' : 'pill-button-inactive'}`}
          >
            DUMBBELL
          </button>
        </div>
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
            <span className="calc-result-label">WARM-UP PROTOCOL</span>
            <div className="live-indicator">
              <span className="live-dot" />
              {liftType.toUpperCase()}
            </div>
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
                        {set.sets} × {set.reps} reps @ {set.percentage}%
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
                <p className="text-xs text-muted-foreground pl-11">
                  {set.notes}
                </p>
              </div>
            ))}
          </div>

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

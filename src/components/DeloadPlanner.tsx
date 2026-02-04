import { useState } from 'react';
import { Battery, Brain, Dumbbell, Calendar, AlertCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useDeloadCalculation, DeloadWeekResult } from '@/hooks/useDeloadCalculation';
import { useAuth } from '@/hooks/useAuth';
import { usePreviousExercises } from '@/hooks/usePreviousExercises';

type WeightUnit = 'lbs' | 'kg';

export function DeloadPlanner() {
  const [unit, setUnit] = useState<WeightUnit>('lbs');
  const [trainingFrequency, setTrainingFrequency] = useState(4);
  const [fatigueLevel, setFatigueLevel] = useState(5);
  const [weeksOfTraining, setWeeksOfTraining] = useState(8);
  const [recentInjuries, setRecentInjuries] = useState('');
  const [deloadPlan, setDeloadPlan] = useState<DeloadWeekResult | null>(null);
  const [showForm, setShowForm] = useState(true);

  const { calculateDeload, loading, error } = useDeloadCalculation();
  const { isAuthenticated } = useAuth();
  const { exercises: previousExercises } = usePreviousExercises();

  const handleUnitChange = (newUnit: WeightUnit) => {
    setUnit(newUnit);
  };

  const handleCalculate = async () => {
    // Use previous exercises from workout history
    const exercisesToUse = previousExercises.map(ex => ({
      name: ex.name,
      workingWeight: unit === 'kg' && ex.lastUnit === 'lbs' 
        ? Math.round(ex.lastWeight / 2.205) 
        : unit === 'lbs' && ex.lastUnit === 'kg'
        ? Math.round(ex.lastWeight * 2.205)
        : ex.lastWeight,
      workingSets: 3,
      workingReps: ex.lastReps,
      unit,
    }));

    if (exercisesToUse.length === 0) {
      // Create sample exercises if no history
      exercisesToUse.push(
        { name: 'Squat', workingWeight: 185, workingSets: 3, workingReps: 5, unit },
        { name: 'Bench Press', workingWeight: 135, workingSets: 3, workingReps: 5, unit },
        { name: 'Deadlift', workingWeight: 225, workingSets: 3, workingReps: 5, unit }
      );
    }

    const result = await calculateDeload(
      exercisesToUse,
      trainingFrequency,
      fatigueLevel,
      weeksOfTraining,
      recentInjuries || undefined,
      isAuthenticated
    );

    if (result) {
      setDeloadPlan(result);
      setShowForm(false);
    }
  };

  const getFatigueLabel = (level: number) => {
    if (level <= 3) return 'Fresh';
    if (level <= 5) return 'Moderate';
    if (level <= 7) return 'Fatigued';
    return 'Exhausted';
  };

  const getFatigueColor = (level: number) => {
    if (level <= 3) return 'text-green-500';
    if (level <= 5) return 'text-yellow-500';
    if (level <= 7) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Battery className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">DELOAD PLANNER</h2>
            <p className="text-sm text-muted-foreground">AI-powered recovery week planning</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowForm(!showForm)}
          className="shrink-0"
        >
          {showForm ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </Button>
      </div>

      {showForm && (
        <div className="space-y-5 animate-fade-in">
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

          {/* Training Frequency */}
          <div className="space-y-2">
            <label className="calc-label">
              <Calendar className="w-3.5 h-3.5" />
              TRAINING FREQUENCY
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={7}
                value={trainingFrequency}
                onChange={(e) => setTrainingFrequency(parseInt(e.target.value) || 1)}
                className="calc-input w-20 text-center"
              />
              <span className="text-sm text-muted-foreground">days per week</span>
            </div>
          </div>

          {/* Fatigue Level */}
          <div className="space-y-3">
            <label className="calc-label">
              <Battery className="w-3.5 h-3.5" />
              FATIGUE LEVEL
            </label>
            <Slider
              value={[fatigueLevel]}
              onValueChange={(value) => setFatigueLevel(value[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs">
              <span className="text-green-500">Fresh (1)</span>
              <span className={`font-bold ${getFatigueColor(fatigueLevel)}`}>
                {getFatigueLabel(fatigueLevel)} ({fatigueLevel})
              </span>
              <span className="text-red-500">Exhausted (10)</span>
            </div>
          </div>

          {/* Weeks of Training */}
          <div className="space-y-2">
            <label className="calc-label">
              <Dumbbell className="w-3.5 h-3.5" />
              WEEKS OF CONTINUOUS TRAINING
            </label>
            <input
              type="number"
              min={1}
              value={weeksOfTraining}
              onChange={(e) => setWeeksOfTraining(parseInt(e.target.value) || 1)}
              className="calc-input w-full"
              placeholder="8"
            />
          </div>

          {/* Recent Injuries */}
          <div className="space-y-2">
            <label className="calc-label">
              <AlertCircle className="w-3.5 h-3.5" />
              RECENT INJURIES OR CONCERNS (OPTIONAL)
            </label>
            <textarea
              value={recentInjuries}
              onChange={(e) => setRecentInjuries(e.target.value)}
              placeholder="e.g., Minor lower back tightness, sore shoulders..."
              rows={2}
              className="calc-input w-full resize-none"
            />
          </div>

          {/* Calculate Button */}
          <Button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm tracking-wide"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {loading ? 'CALCULATING...' : 'GENERATE DELOAD PLAN'}
          </Button>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}

          {!isAuthenticated && (
            <p className="text-xs text-muted-foreground text-center">
              Sign in to save your deload plans to the cloud
            </p>
          )}
        </div>
      )}

      {/* Results */}
      {deloadPlan && (
        <div className="calc-result-card space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="calc-result-label flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI DELOAD PLAN
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(deloadPlan.startDate).toLocaleDateString()} - {new Date(deloadPlan.endDate).toLocaleDateString()}
            </span>
          </div>

          {/* Reductions Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-background/50 border border-border/30">
              <p className="text-xs text-muted-foreground mb-1">Intensity Reduction</p>
              <p className="text-2xl font-black text-primary tabular-nums">{deloadPlan.intensityReduction}%</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50 border border-border/30">
              <p className="text-xs text-muted-foreground mb-1">Volume Reduction</p>
              <p className="text-2xl font-black text-primary tabular-nums">{deloadPlan.volumeReduction}%</p>
            </div>
          </div>

          {/* Exercise Breakdown */}
          <div className="space-y-3">
            {deloadPlan.exercises.map((exercise, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-background/50 border border-border/30"
              >
                <h4 className="font-bold text-foreground mb-3">{exercise.name}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Regular</p>
                    <p className="font-mono text-foreground">
                      {exercise.originalWeight}{unit} × {exercise.originalSets}×{exercise.originalReps}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Deload</p>
                    <p className="font-mono font-bold text-primary">
                      {exercise.deloadWeight}{unit} × {exercise.deloadSets}×{exercise.deloadReps}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Coach's Notes */}
          {deloadPlan.reasoning && (
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Coach's Notes
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed">{deloadPlan.reasoning}</p>
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => {
              setDeloadPlan(null);
              setShowForm(true);
            }}
            className="w-full"
          >
            Calculate New Plan
          </Button>
        </div>
      )}
    </div>
  );
}

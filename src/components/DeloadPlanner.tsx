import { useState } from 'react';
import { Battery, Brain, Dumbbell, Calendar, AlertCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { UnitToggle } from '@/components/UnitToggle';
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
    if (level <= 3) return '#0066FF';
    if (level <= 5) return '#0066FF';
    if (level <= 7) return '#0066FF';
    return '#0066FF';
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#0066FF' }}>
            <Battery className="w-4 h-4" style={{ color: '#FFFFFF' }} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight" style={{ color: '#0066FF' }}>DELOAD PLANNER</h2>
            <p className="text-sm" style={{ color: '#0066FF', opacity: 0.6 }}>AI-powered recovery week planning</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowForm(!showForm)}
          className="shrink-0"
          style={{ color: '#0066FF' }}
        >
          {showForm ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </Button>
      </div>

      {showForm && (
        <div className="space-y-5 animate-fade-in">
          <UnitToggle value={unit} onChange={handleUnitChange} />

          {/* Training Frequency */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5" style={{ color: '#0066FF' }}>
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
                style={{ borderColor: '#0066FF', color: '#0066FF' }}
              />
              <span className="text-sm" style={{ color: '#0066FF', opacity: 0.6 }}>days per week</span>
            </div>
          </div>

          {/* Fatigue Level */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5" style={{ color: '#0066FF' }}>
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
            <div className="flex justify-between text-xs" style={{ color: '#0066FF' }}>
              <span>Fresh (1)</span>
              <span className="font-bold" style={{ color: getFatigueColor(fatigueLevel) }}>
                {getFatigueLabel(fatigueLevel)} ({fatigueLevel})
              </span>
              <span>Exhausted (10)</span>
            </div>
          </div>

          {/* Weeks of Training */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5" style={{ color: '#0066FF' }}>
              <Dumbbell className="w-3.5 h-3.5" />
              WEEKS OF CONTINUOUS TRAINING
            </label>
            <input
              type="number"
              min={1}
              value={weeksOfTraining}
              onChange={(e) => setWeeksOfTraining(parseInt(e.target.value) || 1)}
              className="calc-input w-full"
              style={{ borderColor: '#0066FF', color: '#0066FF' }}
              placeholder="8"
            />
          </div>

          {/* Recent Injuries */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5" style={{ color: '#0066FF' }}>
              <AlertCircle className="w-3.5 h-3.5" />
              RECENT INJURIES OR CONCERNS (OPTIONAL)
            </label>
            <textarea
              value={recentInjuries}
              onChange={(e) => setRecentInjuries(e.target.value)}
              placeholder="e.g., Minor lower back tightness, sore shoulders..."
              rows={2}
              className="calc-input w-full resize-none"
              style={{ borderColor: '#0066FF', color: '#0066FF' }}
            />
          </div>

          {/* Calculate Button */}
          <Button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full h-12 rounded-full font-semibold text-sm tracking-wide"
            style={{ background: '#0066FF', color: '#FFFFFF' }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {loading ? 'CALCULATING...' : 'GENERATE DELOAD PLAN'}
          </Button>

          {error && (
            <div className="p-3 rounded-lg text-sm" style={{ background: '#CCE0FF', border: '1px solid #0066FF', color: '#0066FF' }}>
              {error}
            </div>
          )}

          {!isAuthenticated && (
            <p className="text-xs text-center" style={{ color: '#0066FF', opacity: 0.6 }}>
              Sign in to save your deload plans to the cloud
            </p>
          )}
        </div>
      )}

      {/* Results */}
      {deloadPlan && (
        <div className="rounded-xl p-5 space-y-4 animate-fade-in" style={{ background: '#CCE0FF', border: '1px solid #0066FF' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold flex items-center gap-2" style={{ color: '#0066FF' }}>
              <Brain className="w-4 h-4" />
              AI DELOAD PLAN
            </span>
            <span className="text-xs" style={{ color: '#0066FF', opacity: 0.6 }}>
              {new Date(deloadPlan.startDate).toLocaleDateString()} - {new Date(deloadPlan.endDate).toLocaleDateString()}
            </span>
          </div>

          {/* Reductions Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #CCE0FF' }}>
              <p className="text-xs mb-1" style={{ color: '#0066FF', opacity: 0.6 }}>Intensity Reduction</p>
              <p className="text-2xl font-black tabular-nums" style={{ color: '#0066FF' }}>{deloadPlan.intensityReduction}%</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #CCE0FF' }}>
              <p className="text-xs mb-1" style={{ color: '#0066FF', opacity: 0.6 }}>Volume Reduction</p>
              <p className="text-2xl font-black tabular-nums" style={{ color: '#0066FF' }}>{deloadPlan.volumeReduction}%</p>
            </div>
          </div>

          {/* Exercise Breakdown */}
          <div className="space-y-3">
            {deloadPlan.exercises.map((exercise, index) => (
              <div
                key={index}
                className="p-4 rounded-xl"
                style={{ background: '#FFFFFF', border: '1px solid #CCE0FF' }}
              >
                <h4 className="font-bold mb-3" style={{ color: '#0066FF' }}>{exercise.name}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#0066FF', opacity: 0.6 }}>Regular</p>
                    <p className="font-mono" style={{ color: '#0066FF' }}>
                      {exercise.originalWeight}{unit} × {exercise.originalSets}×{exercise.originalReps}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#0066FF', opacity: 0.6 }}>Deload</p>
                    <p className="font-mono font-bold" style={{ color: '#0066FF' }}>
                      {exercise.deloadWeight}{unit} × {exercise.deloadSets}×{exercise.deloadReps}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Coach's Notes */}
          {deloadPlan.reasoning && (
            <div className="p-4 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #0066FF' }}>
              <h4 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: '#0066FF' }}>
                <Brain className="w-4 h-4" />
                Coach's Notes
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: '#0066FF', opacity: 0.8 }}>{deloadPlan.reasoning}</p>
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => {
              setDeloadPlan(null);
              setShowForm(true);
            }}
            className="w-full"
            style={{ borderColor: '#0066FF', color: '#0066FF' }}
          >
            Calculate New Plan
          </Button>
        </div>
      )}
    </div>
  );
}

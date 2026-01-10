import { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppData } from '@/lib/types';
import { getExerciseNames } from '@/lib/storage';

interface LogEntryFormProps {
  data: AppData;
  onSubmit: (exerciseName: string, weight: number, unit: 'lbs' | 'kg', reps: number) => void;
  onBack: () => void;
}

export function LogEntryForm({ data, onSubmit, onBack }: LogEntryFormProps) {
  const [exerciseName, setExerciseName] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'lbs' | 'kg'>(data.userPreferences.defaultUnit);
  const [reps, setReps] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const exerciseNames = useMemo(() => getExerciseNames(data), [data]);
  
  const filteredSuggestions = useMemo(() => {
    if (!exerciseName.trim()) return [];
    return exerciseNames.filter((name) =>
      name.toLowerCase().includes(exerciseName.toLowerCase())
    );
  }, [exerciseName, exerciseNames]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!exerciseName.trim()) {
      newErrors.exerciseName = 'Exercise name is required';
    }
    if (!weight.trim() || isNaN(parseFloat(weight)) || parseFloat(weight) <= 0) {
      newErrors.weight = 'Enter a valid weight';
    }
    if (!reps.trim() || isNaN(parseInt(reps)) || parseInt(reps) <= 0) {
      newErrors.reps = 'Enter a valid rep count';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(exerciseName.trim(), parseFloat(weight), unit, parseInt(reps));
  };

  const selectSuggestion = (name: string) => {
    setExerciseName(name);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-secondary touch-target"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Log New Set</h1>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 p-4 space-y-6">
        {/* Exercise Name */}
        <div className="relative">
          <Label htmlFor="exerciseName" className="text-base font-medium">
            Exercise Name
          </Label>
          <Input
            id="exerciseName"
            type="text"
            placeholder="e.g., Bench Press"
            value={exerciseName}
            onChange={(e) => {
              setExerciseName(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="h-14 text-lg mt-2"
          />
          {errors.exerciseName && (
            <p className="text-destructive text-sm mt-1">{errors.exerciseName}</p>
          )}
          
          {/* Autocomplete suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-card border rounded-lg shadow-lg overflow-hidden">
              {filteredSuggestions.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => selectSuggestion(name)}
                  className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Weight & Unit */}
        <div>
          <Label className="text-base font-medium">Weight</Label>
          <div className="flex gap-3 mt-2">
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="h-14 text-lg flex-1"
            />
            <div className="flex bg-secondary rounded-lg p-1">
              <button
                type="button"
                onClick={() => setUnit('lbs')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  unit === 'lbs'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                lbs
              </button>
              <button
                type="button"
                onClick={() => setUnit('kg')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  unit === 'kg'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                kg
              </button>
            </div>
          </div>
          {errors.weight && (
            <p className="text-destructive text-sm mt-1">{errors.weight}</p>
          )}
        </div>

        {/* Reps */}
        <div>
          <Label htmlFor="reps" className="text-base font-medium">
            Reps
          </Label>
          <Input
            id="reps"
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="h-14 text-lg mt-2"
          />
          {errors.reps && (
            <p className="text-destructive text-sm mt-1">{errors.reps}</p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4">
          <Button type="submit" className="w-full h-14 text-lg font-semibold touch-target">
            Log Entry
          </Button>
        </div>
      </form>
    </div>
  );
}

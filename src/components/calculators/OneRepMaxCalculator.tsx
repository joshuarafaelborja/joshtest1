import { useState } from 'react';
import { Target, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface OneRepMaxResult {
  oneRepMax: number;
  percentages: { percent: number; weight: number }[];
}

interface OneRepMaxCalculatorProps {
  onSaveToWorkout?: (exerciseName: string, weight: number, reps: number) => void;
}

export function OneRepMaxCalculator({ onSaveToWorkout }: OneRepMaxCalculatorProps) {
  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [result, setResult] = useState<OneRepMaxResult | null>(null);

  const calculate1RM = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    if (isNaN(w) || isNaN(r) || r < 1 || r > 15) return;

    // Epley formula: 1RM = weight × (1 + reps/30)
    const oneRepMax = Math.round(w * (1 + r / 30));

    const percentages = [100, 95, 90, 85, 80, 75, 70, 65, 60].map(percent => ({
      percent,
      weight: Math.round(oneRepMax * (percent / 100)),
    }));

    setResult({ oneRepMax, percentages });
  };

  const handleSave = () => {
    if (result && onSaveToWorkout) {
      onSaveToWorkout('Estimated 1RM', result.oneRepMax, 1);
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">1RM Calculator</CardTitle>
            <CardDescription className="text-sm">Estimate your one-rep max</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label htmlFor="1rm-weight" className="text-base font-semibold">
              Weight Lifted
            </Label>
            <Input
              id="1rm-weight"
              type="number"
              inputMode="decimal"
              placeholder="135"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="h-14 text-xl font-bold text-center rounded-xl border-2 focus:border-primary transition-all duration-200"
            />
            <span className="text-sm text-muted-foreground text-center block">lbs</span>
          </div>
          <div className="space-y-3">
            <Label htmlFor="1rm-reps" className="text-base font-semibold">
              Reps Performed
            </Label>
            <Input
              id="1rm-reps"
              type="number"
              inputMode="numeric"
              placeholder="5"
              min="1"
              max="15"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="h-14 text-xl font-bold text-center rounded-xl border-2 focus:border-primary transition-all duration-200"
            />
            <span className="text-sm text-muted-foreground text-center block">1-15 reps</span>
          </div>
        </div>

        <Button
          onClick={calculate1RM}
          className="w-full h-14 text-lg font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          disabled={!weight || !reps}
        >
          Calculate 1RM
        </Button>

        {result && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-6 rounded-2xl bg-primary text-primary-foreground text-center">
              <p className="text-sm font-medium opacity-80 mb-1">Estimated 1 Rep Max</p>
              <p className="text-5xl font-black">{result.oneRepMax}</p>
              <p className="text-lg font-semibold opacity-80">lbs</p>
            </div>

            {onSaveToWorkout && (
              <Button
                onClick={handleSave}
                variant="outline"
                className="w-full h-12 text-base font-semibold rounded-xl border-2 gap-2"
              >
                <Save className="w-5 h-5" />
                Save to Workout
              </Button>
            )}

            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">Training Percentages</p>
              <div className="grid grid-cols-3 gap-2">
                {result.percentages.map(({ percent, weight }) => (
                  <div
                    key={percent}
                    className="p-3 rounded-xl bg-secondary/50 text-center transition-all hover:bg-secondary"
                  >
                    <p className="text-xs text-muted-foreground">{percent}%</p>
                    <p className="text-lg font-bold">{weight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

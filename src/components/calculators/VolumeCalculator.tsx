import { useState } from 'react';
import { BarChart3, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SetEntry {
  id: string;
  weight: string;
  reps: string;
}

interface VolumeResult {
  totalVolume: number;
  totalSets: number;
  totalReps: number;
  avgWeight: number;
}

interface VolumeCalculatorProps {
  onSaveToWorkout?: (exerciseName: string, weight: number, reps: number) => void;
}

export function VolumeCalculator({ onSaveToWorkout }: VolumeCalculatorProps) {
  const [sets, setSets] = useState<SetEntry[]>([
    { id: '1', weight: '', reps: '' },
  ]);
  const [result, setResult] = useState<VolumeResult | null>(null);

  const addSet = () => {
    setSets([...sets, { id: Date.now().toString(), weight: '', reps: '' }]);
  };

  const removeSet = (id: string) => {
    if (sets.length > 1) {
      setSets(sets.filter(s => s.id !== id));
    }
  };

  const updateSet = (id: string, field: 'weight' | 'reps', value: string) => {
    setSets(sets.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const calculateVolume = () => {
    const validSets = sets.filter(s => s.weight && s.reps);
    if (validSets.length === 0) return;

    let totalVolume = 0;
    let totalReps = 0;
    let totalWeight = 0;

    validSets.forEach(set => {
      const weight = parseFloat(set.weight);
      const reps = parseInt(set.reps);
      if (!isNaN(weight) && !isNaN(reps)) {
        totalVolume += weight * reps;
        totalReps += reps;
        totalWeight += weight;
      }
    });

    setResult({
      totalVolume: Math.round(totalVolume),
      totalSets: validSets.length,
      totalReps,
      avgWeight: Math.round(totalWeight / validSets.length),
    });
  };

  return (
    <Card className="border-2 border-success/20 bg-gradient-to-br from-card to-success/5 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-success" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Volume Calculator</CardTitle>
            <CardDescription className="text-sm">Total volume lifted in a workout</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Sets</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSet}
              className="gap-1 h-8"
            >
              <Plus className="w-4 h-4" />
              Add Set
            </Button>
          </div>

          <div className="space-y-2">
            {sets.map((set, index) => (
              <div
                key={set.id}
                className="flex items-center gap-2 p-3 rounded-xl bg-secondary/30 animate-fade-in"
              >
                <span className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-sm font-bold text-success">
                  {index + 1}
                </span>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="Weight"
                  value={set.weight}
                  onChange={(e) => updateSet(set.id, 'weight', e.target.value)}
                  className="h-12 text-lg font-bold text-center rounded-xl flex-1"
                />
                <span className="text-muted-foreground font-medium">×</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="Reps"
                  value={set.reps}
                  onChange={(e) => updateSet(set.id, 'reps', e.target.value)}
                  className="h-12 text-lg font-bold text-center rounded-xl w-20"
                />
                {sets.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSet(set.id)}
                    className="h-10 w-10 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={calculateVolume}
          className="w-full h-14 text-lg font-bold rounded-xl bg-success hover:bg-success/90 text-success-foreground transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          disabled={!sets.some(s => s.weight && s.reps)}
        >
          Calculate Volume
        </Button>

        {result && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-6 rounded-2xl bg-success text-success-foreground text-center">
              <p className="text-sm font-medium opacity-80 mb-1">Total Volume</p>
              <p className="text-4xl font-black">{result.totalVolume.toLocaleString()}</p>
              <p className="text-lg font-semibold opacity-80">lbs</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-card border border-border text-center">
                <p className="text-xs text-muted-foreground">Sets</p>
                <p className="text-xl font-bold">{result.totalSets}</p>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border text-center">
                <p className="text-xs text-muted-foreground">Total Reps</p>
                <p className="text-xl font-bold">{result.totalReps}</p>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border text-center">
                <p className="text-xs text-muted-foreground">Avg Weight</p>
                <p className="text-xl font-bold">{result.avgWeight}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

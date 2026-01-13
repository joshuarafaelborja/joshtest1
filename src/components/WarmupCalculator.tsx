import { useState } from 'react';
import { Flame, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WarmupSet {
  percentage: number;
  weight: number;
  reps: number;
}

export function WarmupCalculator() {
  const [workingWeight, setWorkingWeight] = useState<string>('');
  const [warmupSets, setWarmupSets] = useState<WarmupSet[] | null>(null);

  const calculateWarmup = () => {
    const weight = parseFloat(workingWeight);
    if (isNaN(weight)) return;

    const sets: WarmupSet[] = [
      { percentage: 50, weight: Math.round(weight * 0.5), reps: 10 },
      { percentage: 70, weight: Math.round(weight * 0.7), reps: 5 },
      { percentage: 85, weight: Math.round(weight * 0.85), reps: 3 },
    ];

    setWarmupSets(sets);
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Flame className="w-5 h-5 text-warning" />
          Warm-up Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="workingWeight" className="text-sm text-muted-foreground">
            Working Weight (lbs)
          </Label>
          <Input
            id="workingWeight"
            type="number"
            inputMode="decimal"
            placeholder="Enter your working weight"
            value={workingWeight}
            onChange={(e) => setWorkingWeight(e.target.value)}
            className="h-12 text-lg rounded-xl"
          />
        </div>

        <Button
          onClick={calculateWarmup}
          className="w-full h-12 text-base font-semibold rounded-xl"
          disabled={!workingWeight}
        >
          Calculate Warm-up Sets
        </Button>

        {warmupSets && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Complete these warm-up sets before your working sets to prepare your muscles and nervous system.
            </p>
            
            <div className="space-y-2">
              {warmupSets.map((set, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Dumbbell className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Set {index + 1}</p>
                      <p className="text-sm text-muted-foreground">{set.percentage}% of working weight</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{set.weight} lbs</p>
                    <p className="text-sm text-muted-foreground">× {set.reps} reps</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

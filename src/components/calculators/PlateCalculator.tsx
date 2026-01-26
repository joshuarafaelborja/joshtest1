import { useState } from 'react';
import { Circle, Weight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface PlateResult {
  targetWeight: number;
  barWeight: number;
  plates: { weight: number; count: number }[];
  achievableWeight: number;
}

const STANDARD_PLATES = [45, 35, 25, 10, 5, 2.5];
const BAR_WEIGHT = 45;

export function PlateCalculator() {
  const [targetWeight, setTargetWeight] = useState<string>('');
  const [result, setResult] = useState<PlateResult | null>(null);

  const calculatePlates = () => {
    const target = parseFloat(targetWeight);
    if (isNaN(target) || target < BAR_WEIGHT) return;

    const weightPerSide = (target - BAR_WEIGHT) / 2;
    let remaining = weightPerSide;
    const plates: { weight: number; count: number }[] = [];

    for (const plate of STANDARD_PLATES) {
      const count = Math.floor(remaining / plate);
      if (count > 0) {
        plates.push({ weight: plate, count });
        remaining -= count * plate;
      }
    }

    const achievableWeight = BAR_WEIGHT + (weightPerSide - remaining) * 2;

    setResult({
      targetWeight: target,
      barWeight: BAR_WEIGHT,
      plates,
      achievableWeight,
    });
  };

  const getPlateColor = (weight: number) => {
    switch (weight) {
      case 45: return 'bg-primary text-primary-foreground';
      case 35: return 'bg-warning text-warning-foreground';
      case 25: return 'bg-success text-success-foreground';
      case 10: return 'bg-secondary text-secondary-foreground border-2 border-border';
      case 5: return 'bg-destructive/80 text-destructive-foreground';
      case 2.5: return 'bg-muted text-muted-foreground border-2 border-border';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card className="border-2 border-warning/20 bg-gradient-to-br from-card to-warning/5 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center">
            <Circle className="w-6 h-6 text-warning" strokeWidth={3} />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Plate Calculator</CardTitle>
            <CardDescription className="text-sm">What plates to load on the bar</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="plate-target" className="text-base font-semibold">
            Target Weight
          </Label>
          <div className="relative">
            <Input
              id="plate-target"
              type="number"
              inputMode="decimal"
              placeholder="225"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              className="h-14 text-xl font-bold text-center rounded-xl border-2 focus:border-warning transition-all duration-200"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              lbs
            </span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Assumes 45 lb Olympic bar
          </p>
        </div>

        <Button
          onClick={calculatePlates}
          className="w-full h-14 text-lg font-bold rounded-xl bg-warning hover:bg-warning/90 text-warning-foreground transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          disabled={!targetWeight || parseFloat(targetWeight) < BAR_WEIGHT}
        >
          Calculate Plates
        </Button>

        {result && (
          <div className="space-y-4 animate-fade-in">
            {result.achievableWeight !== result.targetWeight && (
              <div className="p-3 rounded-xl bg-warning/10 border border-warning/20 text-center">
                <p className="text-sm text-warning font-medium">
                  Closest achievable: {result.achievableWeight} lbs
                </p>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
              <p className="text-sm font-semibold text-muted-foreground mb-3 text-center">
                Load on each side of the bar:
              </p>
              
              {result.plates.length === 0 ? (
                <p className="text-center text-muted-foreground">Just the bar!</p>
              ) : (
                <div className="flex flex-wrap justify-center gap-2">
                  {result.plates.map(({ weight, count }) => (
                    Array.from({ length: count }).map((_, i) => (
                      <div
                        key={`${weight}-${i}`}
                        className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-md ${getPlateColor(weight)}`}
                      >
                        {weight}
                      </div>
                    ))
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-card border border-border text-center">
                <p className="text-xs text-muted-foreground">Bar Weight</p>
                <p className="text-lg font-bold">{result.barWeight} lbs</p>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border text-center">
                <p className="text-xs text-muted-foreground">Total Weight</p>
                <p className="text-lg font-bold">{result.achievableWeight} lbs</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

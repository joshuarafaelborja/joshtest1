import { useState } from 'react';
import { TrendingUp, Minus, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CalculatorResult {
  status: 'increase' | 'maintain' | 'decrease';
  message: string;
  newWeight?: number;
  rationale: string;
}

export function ProgressiveOverloadCalculator() {
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [targetReps, setTargetReps] = useState<string>('');
  const [repsCompleted, setRepsCompleted] = useState<string>('');
  const [result, setResult] = useState<CalculatorResult | null>(null);

  const calculateProgression = () => {
    const weight = parseFloat(currentWeight);
    const target = parseInt(targetReps);
    const completed = parseInt(repsCompleted);

    if (isNaN(weight) || isNaN(target) || isNaN(completed)) return;

    let calcResult: CalculatorResult;

    if (completed >= target) {
      const newWeight = Math.round(weight * 1.075); // 7.5% increase (middle of 5-10%)
      calcResult = {
        status: 'increase',
        message: `Great job! Try ${newWeight} lbs next time`,
        newWeight,
        rationale: `You completed ${completed} reps, which is above your target of ${target}. Progressive overload works by gradually increasing demand on your muscles.`,
      };
    } else if (completed >= target - 2) {
      calcResult = {
        status: 'maintain',
        message: `Stay at ${weight} lbs and aim for more reps`,
        rationale: `You completed ${completed} reps, which is within range of your target of ${target}. Progressive overload works by gradually increasing demand on your muscles.`,
      };
    } else {
      const lowerWeight = Math.max(weight - 5, 0);
      calcResult = {
        status: 'decrease',
        message: `Focus on form. Stay at ${weight} lbs or try ${lowerWeight} lbs`,
        newWeight: lowerWeight,
        rationale: `You completed ${completed} reps, which is below your target of ${target}. Progressive overload works by gradually increasing demand on your muscles.`,
      };
    }

    setResult(calcResult);
  };

  const getStatusColor = () => {
    if (!result) return '';
    switch (result.status) {
      case 'increase':
        return 'bg-success/10 border-success/20 text-success';
      case 'maintain':
        return 'bg-primary/10 border-primary/20 text-primary';
      case 'decrease':
        return 'bg-warning/10 border-warning/20 text-warning';
    }
  };

  const getStatusIcon = () => {
    if (!result) return null;
    switch (result.status) {
      case 'increase':
        return <TrendingUp className="w-6 h-6" />;
      case 'maintain':
        return <Minus className="w-6 h-6" />;
      case 'decrease':
        return <ChevronUp className="w-6 h-6 rotate-180" />;
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Progressive Overload Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label htmlFor="currentWeight" className="text-sm text-muted-foreground">
              Current Weight
            </Label>
            <Input
              id="currentWeight"
              type="number"
              inputMode="decimal"
              placeholder="135"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              className="h-12 text-lg rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetReps" className="text-sm text-muted-foreground">
              Target Reps
            </Label>
            <Input
              id="targetReps"
              type="number"
              inputMode="numeric"
              placeholder="8"
              value={targetReps}
              onChange={(e) => setTargetReps(e.target.value)}
              className="h-12 text-lg rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repsCompleted" className="text-sm text-muted-foreground">
              Reps Done
            </Label>
            <Input
              id="repsCompleted"
              type="number"
              inputMode="numeric"
              placeholder="10"
              value={repsCompleted}
              onChange={(e) => setRepsCompleted(e.target.value)}
              className="h-12 text-lg rounded-xl"
            />
          </div>
        </div>

        <Button
          onClick={calculateProgression}
          className="w-full h-12 text-base font-semibold rounded-xl"
          disabled={!currentWeight || !targetReps || !repsCompleted}
        >
          Calculate Recommendation
        </Button>

        {result && (
          <div className={`mt-4 p-4 rounded-xl border-2 ${getStatusColor()}`}>
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon()}
              <span className="font-bold text-lg">{result.message}</span>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">{result.rationale}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

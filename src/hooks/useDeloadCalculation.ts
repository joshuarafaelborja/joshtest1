import { useState } from 'react';
import { useAuth } from './useAuth';

export interface DeloadExercise {
  name: string;
  originalWeight: number;
  deloadWeight: number;
  originalSets: number;
  deloadSets: number;
  originalReps: number;
  deloadReps: number;
}

export interface DeloadWeekResult {
  id?: string;
  startDate: string;
  endDate: string;
  intensityReduction: number;
  volumeReduction: number;
  exercises: DeloadExercise[];
  reasoning: string;
}

interface ExerciseInput {
  name: string;
  workingWeight: number;
  workingSets: number;
  workingReps: number;
  unit: string;
}

export function useDeloadCalculation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const calculateDeload = async (
    exercises: ExerciseInput[],
    trainingFrequency: number,
    fatigueLevel: number,
    weeksOfTraining: number,
    recentInjuries?: string,
    saveToDb: boolean = true
  ): Promise<DeloadWeekResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      };

      // Add auth header if authenticated
      if (isAuthenticated && saveToDb) {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calculate-deload`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            exercises,
            trainingFrequency,
            fatigueLevel,
            weeksOfTraining,
            recentInjuries,
            saveToDb: isAuthenticated && saveToDb,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to calculate deload week');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { calculateDeload, loading, error };
}

import { useState } from 'react';
import { useAuth } from './useAuth';

export interface AIWarmupSet {
  setNumber: number;
  weight: number;
  reps: number;
  percentage?: number;
  notes?: string;
}

export interface WarmupCalculationResult {
  warmupSets: AIWarmupSet[];
  reasoning: string;
}

export function useWarmupCalculation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const calculateWarmups = async (
    exerciseName: string,
    workingWeight: number,
    workingReps: number,
    unit: string,
    saveToDb: boolean = true
  ): Promise<WarmupCalculationResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { session } } = await supabase.auth.getSession();
      
      // Use user's access token if authenticated, otherwise use anon key
      const authToken = session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        'Authorization': `Bearer ${authToken}`,
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calculate-warmup`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            exerciseName,
            workingWeight,
            workingReps,
            unit,
            saveToDb: isAuthenticated && saveToDb,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to calculate warm-ups');
      }

      const data = await response.json();
      console.log('Warmup API response:', data);
      return data as WarmupCalculationResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { calculateWarmups, loading, error };
}

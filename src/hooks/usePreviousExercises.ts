import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PreviousExercise {
  name: string;
  lastWeight: number;
  lastReps: number;
  lastUnit: 'lbs' | 'kg';
  lastUsed: string;
}

export function usePreviousExercises() {
  const [exercises, setExercises] = useState<PreviousExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function fetchExercises() {
      setLoading(true);
      
      if (isAuthenticated) {
        // Fetch from Supabase - get unique exercises with their latest workout
        const { data, error } = await supabase
          .from('workouts')
          .select('exercise_name, weight, reps, unit, timestamp')
          .order('timestamp', { ascending: false });
        
        if (!error && data) {
          // Group by exercise name and get the latest for each
          const exerciseMap = new Map<string, PreviousExercise>();
          
          for (const workout of data) {
            if (!exerciseMap.has(workout.exercise_name)) {
              exerciseMap.set(workout.exercise_name, {
                name: workout.exercise_name,
                lastWeight: Number(workout.weight),
                lastReps: workout.reps,
                lastUnit: workout.unit as 'lbs' | 'kg',
                lastUsed: workout.timestamp,
              });
            }
          }
          
          setExercises(Array.from(exerciseMap.values()));
        }
      } else {
        // Fetch from localStorage for guests
        try {
          const stored = localStorage.getItem('coach-guest-workouts');
          if (stored) {
            const workouts = JSON.parse(stored);
            const exerciseMap = new Map<string, PreviousExercise>();
            
            // Sort by timestamp descending
            workouts.sort((a: any, b: any) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            
            for (const workout of workouts) {
              if (!exerciseMap.has(workout.exercise_name)) {
                exerciseMap.set(workout.exercise_name, {
                  name: workout.exercise_name,
                  lastWeight: Number(workout.weight),
                  lastReps: workout.reps,
                  lastUnit: workout.unit as 'lbs' | 'kg',
                  lastUsed: workout.timestamp,
                });
              }
            }
            
            setExercises(Array.from(exerciseMap.values()));
          }
        } catch {
          setExercises([]);
        }
      }
      
      setLoading(false);
    }
    
    fetchExercises();
  }, [isAuthenticated]);

  const exerciseNames = useMemo(() => 
    exercises.map(e => e.name), 
    [exercises]
  );

  return { exercises, exerciseNames, loading };
}

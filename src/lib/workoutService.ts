import { supabase } from '@/integrations/supabase/client';

export interface Workout {
  id: string;
  exercise_name: string;
  weight: number;
  unit: 'lbs' | 'kg';
  reps: number;
  sets: number;
  timestamp: string;
  notes?: string;
  rir?: number | null;
  goal_min_reps?: number | null;
  goal_max_reps?: number | null;
}

const LOCAL_STORAGE_KEY = 'coach-guest-workouts';

// Local storage operations
function getLocalWorkouts(): Workout[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveLocalWorkouts(workouts: Workout[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(workouts));
}

export function clearLocalWorkouts(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

export function getLocalWorkoutCount(): number {
  return getLocalWorkouts().length;
}

// Unified data service
export async function getWorkouts(): Promise<Workout[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Error fetching workouts:', error);
      return [];
    }
    
    return (data || []).map(w => ({
      id: w.id,
      exercise_name: w.exercise_name,
      weight: Number(w.weight),
      unit: w.unit as 'lbs' | 'kg',
      reps: w.reps,
      sets: w.sets,
      timestamp: w.timestamp,
      notes: w.notes || undefined,
      rir: w.rir ?? null,
      goal_min_reps: w.goal_min_reps ?? null,
      goal_max_reps: w.goal_max_reps ?? null,
    }));
  }
  
  return getLocalWorkouts().sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export async function addWorkout(workout: Omit<Workout, 'id'>): Promise<Workout | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const { data, error } = await supabase
      .from('workouts')
      .insert({
        user_id: user.id,
        exercise_name: workout.exercise_name,
        weight: workout.weight,
        unit: workout.unit,
        reps: workout.reps,
        sets: workout.sets,
        timestamp: workout.timestamp,
        notes: workout.notes || null,
        rir: workout.rir ?? null,
        goal_min_reps: workout.goal_min_reps ?? null,
        goal_max_reps: workout.goal_max_reps ?? null,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding workout:', error);
      return null;
    }
    
    return {
      id: data.id,
      exercise_name: data.exercise_name,
      weight: Number(data.weight),
      unit: data.unit as 'lbs' | 'kg',
      reps: data.reps,
      sets: data.sets,
      timestamp: data.timestamp,
      notes: data.notes || undefined,
      rir: data.rir ?? null,
      goal_min_reps: data.goal_min_reps ?? null,
      goal_max_reps: data.goal_max_reps ?? null,
    };
  }
  
  // Guest mode - save to localStorage
  const newWorkout: Workout = {
    ...workout,
    id: crypto.randomUUID(),
  };
  
  const workouts = getLocalWorkouts();
  workouts.push(newWorkout);
  saveLocalWorkouts(workouts);
  
  return newWorkout;
}

export async function updateWorkout(id: string, updates: Partial<Omit<Workout, 'id'>>): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const { error } = await supabase
      .from('workouts')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating workout:', error);
      return false;
    }
    return true;
  }
  
  const workouts = getLocalWorkouts();
  const index = workouts.findIndex(w => w.id === id);
  if (index !== -1) {
    workouts[index] = { ...workouts[index], ...updates };
    saveLocalWorkouts(workouts);
    return true;
  }
  return false;
}

export async function deleteWorkout(id: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting workout:', error);
      return false;
    }
    return true;
  }
  
  const workouts = getLocalWorkouts();
  const filtered = workouts.filter(w => w.id !== id);
  saveLocalWorkouts(filtered);
  return true;
}

export async function migrateLocalWorkoutsToSupabase(): Promise<{ success: boolean; count: number }> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, count: 0 };
  }
  
  const localWorkouts = getLocalWorkouts();
  
  if (localWorkouts.length === 0) {
    return { success: true, count: 0 };
  }
  
  const workoutsToInsert = localWorkouts.map(w => ({
    user_id: user.id,
    exercise_name: w.exercise_name,
    weight: w.weight,
    unit: w.unit,
    reps: w.reps,
    sets: w.sets,
    timestamp: w.timestamp,
    notes: w.notes || null,
  }));
  
  const { error } = await supabase
    .from('workouts')
    .insert(workoutsToInsert);
  
  if (error) {
    console.error('Error migrating workouts:', error);
    return { success: false, count: 0 };
  }
  
  clearLocalWorkouts();
  return { success: true, count: localWorkouts.length };
}

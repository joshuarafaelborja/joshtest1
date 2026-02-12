
-- Add RIR (Reps In Reserve) column to workouts table
ALTER TABLE public.workouts ADD COLUMN rir integer DEFAULT NULL;

-- Add goal_min_reps and goal_max_reps to track per-exercise rep range goals
ALTER TABLE public.workouts ADD COLUMN goal_min_reps integer DEFAULT NULL;
ALTER TABLE public.workouts ADD COLUMN goal_max_reps integer DEFAULT NULL;

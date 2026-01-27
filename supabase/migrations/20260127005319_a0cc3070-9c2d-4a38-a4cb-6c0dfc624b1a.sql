-- Create workouts table for storing user workout data
CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_name TEXT NOT NULL,
  weight NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'lbs' CHECK (unit IN ('lbs', 'kg')),
  reps INTEGER NOT NULL,
  sets INTEGER NOT NULL DEFAULT 1,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own workouts
CREATE POLICY "Users can view their own workouts"
ON public.workouts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workouts"
ON public.workouts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts"
ON public.workouts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts"
ON public.workouts FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries by user
CREATE INDEX idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX idx_workouts_timestamp ON public.workouts(timestamp DESC);
-- Create warmup_sets table for storing AI-generated warmup sets
CREATE TABLE public.warmup_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exercise_name TEXT NOT NULL,
  working_weight NUMERIC NOT NULL,
  working_reps INTEGER NOT NULL,
  unit TEXT NOT NULL DEFAULT 'lbs',
  set_number INTEGER NOT NULL,
  weight NUMERIC NOT NULL,
  reps INTEGER NOT NULL,
  percentage INTEGER,
  notes TEXT,
  reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create deload_weeks table for storing AI-generated deload plans
CREATE TABLE public.deload_weeks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  intensity_reduction INTEGER NOT NULL,
  volume_reduction INTEGER NOT NULL,
  fatigue_level INTEGER,
  weeks_of_training INTEGER,
  training_frequency INTEGER,
  exercises JSONB NOT NULL,
  reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.warmup_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deload_weeks ENABLE ROW LEVEL SECURITY;

-- RLS policies for warmup_sets
CREATE POLICY "Users can view their own warmup sets"
ON public.warmup_sets
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own warmup sets"
ON public.warmup_sets
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own warmup sets"
ON public.warmup_sets
FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for deload_weeks
CREATE POLICY "Users can view their own deload weeks"
ON public.deload_weeks
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deload weeks"
ON public.deload_weeks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deload weeks"
ON public.deload_weeks
FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_warmup_sets_user_id ON public.warmup_sets(user_id);
CREATE INDEX idx_warmup_sets_exercise_name ON public.warmup_sets(exercise_name);
CREATE INDEX idx_deload_weeks_user_id ON public.deload_weeks(user_id);
CREATE INDEX idx_deload_weeks_start_date ON public.deload_weeks(start_date);
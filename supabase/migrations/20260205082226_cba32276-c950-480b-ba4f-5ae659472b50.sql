-- Add UPDATE policy to warmup_sets table
CREATE POLICY "Users can update their own warmup sets"
ON public.warmup_sets
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add UPDATE policy to deload_weeks table (also missing)
CREATE POLICY "Users can update their own deload weeks"
ON public.deload_weeks
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
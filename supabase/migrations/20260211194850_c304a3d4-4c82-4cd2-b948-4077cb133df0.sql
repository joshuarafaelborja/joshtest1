
-- Add last_active column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_active timestamp with time zone DEFAULT now();

-- Create friendships table
CREATE TABLE public.friendships (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  friend_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- Users can see friendships they're involved in
CREATE POLICY "Users can view their friendships"
ON public.friendships FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Users can send friend requests
CREATE POLICY "Users can create friend requests"
ON public.friendships FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update friendships they received (accept)
CREATE POLICY "Users can accept friend requests"
ON public.friendships FOR UPDATE
USING (auth.uid() = friend_id);

-- Users can delete friendships they're part of
CREATE POLICY "Users can delete friendships"
ON public.friendships FOR DELETE
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Create activities table
CREATE TABLE public.activities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  workout_type text NOT NULL,
  duration integer,
  summary text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Users can view their own activities
CREATE POLICY "Users can view own activities"
ON public.activities FOR SELECT
USING (auth.uid() = user_id);

-- Friends can view activities (using a function to avoid complex joins in policies)
CREATE OR REPLACE FUNCTION public.are_friends(user1 uuid, user2 uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.friendships
    WHERE status = 'accepted'
    AND (
      (user_id = user1 AND friend_id = user2)
      OR (user_id = user2 AND friend_id = user1)
    )
  )
$$;

-- Friends can view each other's activities
CREATE POLICY "Friends can view activities"
ON public.activities FOR SELECT
USING (public.are_friends(auth.uid(), user_id));

-- Users can insert their own activities
CREATE POLICY "Users can insert own activities"
ON public.activities FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own activities
CREATE POLICY "Users can delete own activities"
ON public.activities FOR DELETE
USING (auth.uid() = user_id);

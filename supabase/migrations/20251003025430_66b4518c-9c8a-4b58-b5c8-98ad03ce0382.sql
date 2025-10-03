-- Create pinned_goals table for manual goal pinning
CREATE TABLE IF NOT EXISTS public.pinned_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, goal_id)
);

-- Enable Row Level Security
ALTER TABLE public.pinned_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for pinned goals
CREATE POLICY "Users can view their own pinned goals" 
ON public.pinned_goals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pinned goals" 
ON public.pinned_goals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pinned goals" 
ON public.pinned_goals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_pinned_goals_user_id ON public.pinned_goals(user_id);
-- Create user_favorites table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  track_id bigint NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Harden schema
ALTER TABLE public.user_favorites
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN track_id SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS user_fav_user_track_uniq
  ON public.user_favorites (user_id, track_id);

-- Enable RLS (deny by default without policies)
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Clean old policies if any
DROP POLICY IF EXISTS favorites_select_own ON public.user_favorites;
DROP POLICY IF EXISTS favorites_insert_own ON public.user_favorites;
DROP POLICY IF EXISTS favorites_update_own ON public.user_favorites;
DROP POLICY IF EXISTS favorites_delete_own ON public.user_favorites;

-- Only the owner can read their rows
CREATE POLICY favorites_select_own
ON public.user_favorites FOR SELECT
USING (auth.uid() = user_id);

-- Only the owner can insert their rows
CREATE POLICY favorites_insert_own
ON public.user_favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Only the owner can update their rows
CREATE POLICY favorites_update_own
ON public.user_favorites FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Only the owner can delete their rows
CREATE POLICY favorites_delete_own
ON public.user_favorites FOR DELETE
USING (auth.uid() = user_id);

-- Tighten privileges
REVOKE ALL ON public.user_favorites FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_favorites TO authenticated;
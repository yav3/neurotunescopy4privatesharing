-- 1) Harden schema (optional but recommended)
ALTER TABLE public.user_favorites
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN track_id SET NOT NULL;

-- Prevent dupes per user/track
CREATE UNIQUE INDEX IF NOT EXISTS user_favorites_user_track_uniq
  ON public.user_favorites (user_id, track_id);

-- 2) Enable RLS (deny by default)
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- 3) Row-level policies
DROP POLICY IF EXISTS "read all favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "insert any favorite" ON public.user_favorites;
DROP POLICY IF EXISTS "delete any favorite" ON public.user_favorites;
DROP POLICY IF EXISTS "update any favorite" ON public.user_favorites;

-- READ: only my rows
CREATE POLICY "favorites_select_own"
ON public.user_favorites
FOR SELECT
USING (auth.uid() = user_id);

-- INSERT: I can only insert for myself
CREATE POLICY "favorites_insert_own"
ON public.user_favorites
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- DELETE: I can only delete my rows
CREATE POLICY "favorites_delete_own"
ON public.user_favorites
FOR DELETE
USING (auth.uid() = user_id);

-- UPDATE: (only if you support updates)
CREATE POLICY "favorites_update_own"
ON public.user_favorites
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
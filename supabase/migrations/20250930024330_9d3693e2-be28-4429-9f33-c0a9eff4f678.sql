-- Add public read access to favorites table
-- This allows anyone to see all favorited tracks (useful for social features and analytics)
DROP POLICY IF EXISTS "Public can view all favorites" ON public.favorites;
CREATE POLICY "Public can view all favorites" 
ON public.favorites 
FOR SELECT 
USING (true);

-- Keep existing policies for insert/update/delete
-- Users can still only manage their own favorites
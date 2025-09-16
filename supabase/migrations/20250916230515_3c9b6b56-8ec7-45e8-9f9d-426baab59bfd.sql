-- Create working edge collection for reliable music playback
CREATE TABLE public.working_edge_collection (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  storage_bucket TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_played_at TIMESTAMP WITH TIME ZONE,
  play_count INTEGER NOT NULL DEFAULT 0,
  reliability_score DECIMAL(3,2) NOT NULL DEFAULT 1.0,
  genre TEXT,
  therapeutic_goal TEXT,
  bpm INTEGER,
  energy_level INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(track_id)
);

-- Enable RLS
ALTER TABLE public.working_edge_collection ENABLE ROW LEVEL SECURITY;

-- Create policies - this is a system table, readable by all, writable by admins
CREATE POLICY "Working edge collection is readable by everyone" 
ON public.working_edge_collection 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage working edge collection" 
ON public.working_edge_collection 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Create indexes for performance
CREATE INDEX idx_working_edge_collection_genre ON public.working_edge_collection(genre);
CREATE INDEX idx_working_edge_collection_therapeutic_goal ON public.working_edge_collection(therapeutic_goal);
CREATE INDEX idx_working_edge_collection_reliability ON public.working_edge_collection(reliability_score DESC);
CREATE INDEX idx_working_edge_collection_last_played ON public.working_edge_collection(last_played_at);

-- Create trigger for updated_at
CREATE TRIGGER update_working_edge_collection_updated_at
BEFORE UPDATE ON public.working_edge_collection
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to add track to working collection
CREATE OR REPLACE FUNCTION public.add_to_working_collection(
  _track_id UUID,
  _reliability_score DECIMAL(3,2) DEFAULT 1.0
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Get track details and add to working collection
  INSERT INTO public.working_edge_collection (
    track_id, storage_bucket, storage_key, reliability_score, 
    genre, therapeutic_goal, bpm, energy_level
  )
  SELECT 
    t.id, t.storage_bucket, t.storage_key, _reliability_score,
    t.genre, t.therapeutic_goal, t.bpm, t.energy_level
  FROM public.tracks t
  WHERE t.id = _track_id 
    AND t.audio_status = 'working'
  ON CONFLICT (track_id) 
  DO UPDATE SET 
    reliability_score = GREATEST(working_edge_collection.reliability_score, _reliability_score),
    verified_at = now(),
    updated_at = now();
    
  RETURN FOUND;
END;
$$;

-- Function to get working edge tracks by criteria
CREATE OR REPLACE FUNCTION public.get_working_edge_tracks(
  _genre TEXT DEFAULT NULL,
  _therapeutic_goal TEXT DEFAULT NULL,
  _limit INTEGER DEFAULT 10
) RETURNS TABLE(
  track_id UUID,
  storage_bucket TEXT,
  storage_key TEXT,
  title TEXT,
  reliability_score DECIMAL,
  play_count INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    wec.track_id,
    wec.storage_bucket,
    wec.storage_key,
    t.title,
    wec.reliability_score,
    wec.play_count
  FROM public.working_edge_collection wec
  JOIN public.tracks t ON t.id = wec.track_id
  WHERE (_genre IS NULL OR wec.genre = _genre)
    AND (_therapeutic_goal IS NULL OR wec.therapeutic_goal = _therapeutic_goal)
    AND wec.reliability_score >= 0.8
  ORDER BY 
    wec.reliability_score DESC,
    wec.last_played_at ASC NULLS FIRST,
    wec.play_count ASC
  LIMIT _limit;
$$;

-- Function to update play stats
CREATE OR REPLACE FUNCTION public.update_working_edge_play_stats(
  _track_id UUID
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.working_edge_collection 
  SET 
    last_played_at = now(),
    play_count = play_count + 1,
    updated_at = now()
  WHERE track_id = _track_id;
END;
$$;
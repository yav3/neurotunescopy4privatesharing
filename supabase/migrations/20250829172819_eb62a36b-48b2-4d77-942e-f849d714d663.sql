-- Create streaming analytics table for the new stream-audio edge function
CREATE TABLE IF NOT EXISTS streaming_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL,
  quality_requested TEXT NOT NULL CHECK (quality_requested IN ('low', 'medium', 'high')),
  start_time INTEGER DEFAULT 0,
  user_agent TEXT,
  ip_address TEXT,
  streamed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_streaming_analytics_track_id ON streaming_analytics(track_id);
CREATE INDEX IF NOT EXISTS idx_streaming_analytics_streamed_at ON streaming_analytics(streamed_at);

-- Enable RLS
ALTER TABLE streaming_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access
CREATE POLICY "Allow public read access on streaming_analytics" 
ON streaming_analytics FOR SELECT USING (true);

CREATE POLICY "Allow public insert on streaming_analytics" 
ON streaming_analytics FOR INSERT WITH CHECK (true);
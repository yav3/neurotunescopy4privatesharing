-- Safe UUID migration for tracks table
-- Step 1: Create new UUID column and populate with UUIDs
ALTER TABLE tracks ADD COLUMN new_id UUID DEFAULT gen_random_uuid();

-- Step 2: Create mapping table to preserve relationships  
CREATE TABLE IF NOT EXISTS tracks_id_mapping (
  old_id BIGINT PRIMARY KEY,
  new_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Populate mapping table
INSERT INTO tracks_id_mapping (old_id, new_id)
SELECT id, new_id FROM tracks
ON CONFLICT (old_id) DO NOTHING;

-- Step 4: Drop old ID column and rename new_id to id
ALTER TABLE tracks DROP COLUMN id CASCADE;
ALTER TABLE tracks RENAME COLUMN new_id TO id;
ALTER TABLE tracks ADD PRIMARY KEY (id);

-- Step 5: Add indexes with IF NOT EXISTS equivalent (using CREATE IF NOT EXISTS pattern)
DO $$
BEGIN
    -- Create index for API queries if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tracks_tags_gin') THEN
        CREATE INDEX idx_tracks_tags_gin ON tracks USING GIN(tags) WHERE tags IS NOT NULL;
    END IF;
    
    -- Create valence/arousal composite index
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tracks_vad') THEN
        CREATE INDEX idx_tracks_vad ON tracks(valence, arousal, dominance);
    END IF;
END $$;
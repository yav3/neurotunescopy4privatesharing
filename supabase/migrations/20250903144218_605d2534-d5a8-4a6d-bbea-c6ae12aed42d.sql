-- Step 1: Create new UUID column and populate with UUIDs
ALTER TABLE tracks ADD COLUMN new_id UUID DEFAULT gen_random_uuid();

-- Step 2: Create mapping table to preserve relationships  
CREATE TABLE tracks_id_mapping (
  old_id BIGINT PRIMARY KEY,
  new_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Populate mapping table
INSERT INTO tracks_id_mapping (old_id, new_id)
SELECT id, new_id FROM tracks;

-- Step 4: Update any foreign key references (check if needed)
-- Note: We'll need to update any tables that reference tracks.id

-- Step 5: Drop old ID column and rename new_id to id
ALTER TABLE tracks DROP COLUMN id CASCADE;
ALTER TABLE tracks RENAME COLUMN new_id TO id;
ALTER TABLE tracks ADD PRIMARY KEY (id);

-- Step 6: Add index for performance
CREATE INDEX idx_tracks_id ON tracks(id);
CREATE INDEX idx_tracks_audio_status ON tracks(audio_status);
CREATE INDEX idx_tracks_valence_arousal ON tracks(valence, arousal);

-- Step 7: Update sequence ownership (cleanup)
-- The old sequence tracks_id_seq will be automatically dropped with CASCADE

-- Add helpful indexes for API queries
CREATE INDEX idx_tracks_tags_camelot ON tracks USING GIN(tags) WHERE tags IS NOT NULL;
CREATE INDEX idx_tracks_genre ON tracks(genre) WHERE genre IS NOT NULL;
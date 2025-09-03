-- Remove the obsolete music_tracks table to prevent confusion
-- The tracks table is the current source of truth

-- First check if any critical data exists only in music_tracks
DO $$
BEGIN
  -- Drop music_tracks table as it's obsolete and causing API conflicts
  -- The tracks table (7,406 records) is the authoritative source
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'music_tracks') THEN
    DROP TABLE IF EXISTS music_tracks CASCADE;
    RAISE NOTICE 'Removed obsolete music_tracks table - using tracks table as single source of truth';
  END IF;
END $$;
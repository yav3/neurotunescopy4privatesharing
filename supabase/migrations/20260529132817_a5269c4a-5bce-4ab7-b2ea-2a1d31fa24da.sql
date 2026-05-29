-- Storage hardening: make audio buckets private so anonymous users
-- can no longer enumerate or directly download files. All audio reads
-- now flow through the storage-access / storage-list edge functions
-- which mint short-lived signed URLs using the service role key.
--
-- Image, landing-page, and artwork buckets remain public.

UPDATE storage.buckets
SET public = false
WHERE id IN (
  'all music',
  'audio',
  'Chopin',
  'classicalfocus',
  'countryandamericana',
  'curated-music-collection',
  'ENERGYBOOST',
  'energyboostfocus',
  'focus-music',
  'gentleclassicalforpain',
  'HIIT',
  'jamband',
  'meditation',
  'moodboostremixesworlddance',
  'neuralpositivemusic',
  'NewAgeandWorldFocus',
  'newageworldstressanxietyreduction',
  'Nocturnes',
  'opera',
  'painreducingworld',
  'pop',
  'reggaeton',
  'samba',
  'sambajazznocturnes',
  'sonatasforstress',
  'tropicalhouse',
  'WorldHouseFocus'
);

-- Remove the old neuralpositivemusic-only policies from bucket-hardening.sql
-- if they exist, then create a single uniform set of policies for ALL
-- now-private audio buckets. Anonymous SELECTs are NOT granted — anon
-- traffic must go through edge functions that sign URLs with the
-- service role key.
DROP POLICY IF EXISTS "Authenticated users can download audio files" ON storage.objects;
DROP POLICY IF EXISTS "Service role can manage audio files" ON storage.objects;

-- Service role has full control (edge functions use this to sign URLs).
CREATE POLICY "Service role manages private audio buckets"
ON storage.objects
FOR ALL
TO service_role
USING (
  bucket_id IN (
    'all music','audio','Chopin','classicalfocus','countryandamericana',
    'curated-music-collection','ENERGYBOOST','energyboostfocus','focus-music',
    'gentleclassicalforpain','HIIT','jamband','meditation',
    'moodboostremixesworlddance','neuralpositivemusic','NewAgeandWorldFocus',
    'newageworldstressanxietyreduction','Nocturnes','opera','painreducingworld',
    'pop','reggaeton','samba','sambajazznocturnes','sonatasforstress',
    'tropicalhouse','WorldHouseFocus'
  )
)
WITH CHECK (
  bucket_id IN (
    'all music','audio','Chopin','classicalfocus','countryandamericana',
    'curated-music-collection','ENERGYBOOST','energyboostfocus','focus-music',
    'gentleclassicalforpain','HIIT','jamband','meditation',
    'moodboostremixesworlddance','neuralpositivemusic','NewAgeandWorldFocus',
    'newageworldstressanxietyreduction','Nocturnes','opera','painreducingworld',
    'pop','reggaeton','samba','sambajazznocturnes','sonatasforstress',
    'tropicalhouse','WorldHouseFocus'
  )
);
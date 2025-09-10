-- First delete all objects from the trendingnow bucket
DELETE FROM storage.objects WHERE bucket_id = 'trendingnow';

-- Then delete the bucket itself
DELETE FROM storage.buckets WHERE id = 'trendingnow';
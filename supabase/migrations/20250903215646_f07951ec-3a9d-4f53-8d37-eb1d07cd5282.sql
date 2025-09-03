-- Update specific tracks that are likely in the audio bucket based on storage key patterns
UPDATE tracks 
SET storage_bucket = 'audio' 
WHERE storage_key LIKE '%house%' 
   OR storage_key LIKE '%ambient%' 
   OR storage_key LIKE '%shall_i_compare_thee%';
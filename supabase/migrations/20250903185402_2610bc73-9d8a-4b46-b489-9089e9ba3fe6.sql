-- Fix the tracks table to use actual files from storage
-- First, let's update existing tracks to point to actual storage files
UPDATE tracks 
SET 
  storage_key = 'Amped-Instrumental-Blues-Rock-2010s-Re-Energize-HIIT-1.mp3',
  file_path = 'Amped-Instrumental-Blues-Rock-2010s-Re-Energize-HIIT-1.mp3',
  file_name = 'Amped-Instrumental-Blues-Rock-2010s-Re-Energize-HIIT-1.mp3'
WHERE id = '2e89f66c-05a8-4caa-be9b-6ba32c6935eb';

UPDATE tracks 
SET 
  storage_key = 'Artic-Kitties-Alternative-Rock-2010s-HIIT-Re-Energize-Remix-1-1.mp3',
  file_path = 'Artic-Kitties-Alternative-Rock-2010s-HIIT-Re-Energize-Remix-1-1.mp3', 
  file_name = 'Artic-Kitties-Alternative-Rock-2010s-HIIT-Re-Energize-Remix-1-1.mp3'
WHERE id = '61d0058f-6a30-40b8-8466-ac97c55acdba';

UPDATE tracks 
SET 
  storage_key = 'Artic-Kitties-Band-Indie-Pop-2020s-HIIT-Re-Energize-Remix-1.mp3',
  file_path = 'Artic-Kitties-Band-Indie-Pop-2020s-HIIT-Re-Energize-Remix-1.mp3',
  file_name = 'Artic-Kitties-Band-Indie-Pop-2020s-HIIT-Re-Energize-Remix-1.mp3'  
WHERE id = 'a7583510-f1f0-4d7a-a270-85ef73ba4193';

UPDATE tracks 
SET 
  storage_key = 'Autumn-Gentle-Light-Instrumental-Electronic-Baroque-Relaxation-Remix-1.mp3',
  file_path = 'Autumn-Gentle-Light-Instrumental-Electronic-Baroque-Relaxation-Remix-1.mp3',
  file_name = 'Autumn-Gentle-Light-Instrumental-Electronic-Baroque-Relaxation-Remix-1.mp3'
WHERE id = '49ed1b71-d9ac-4ebc-bd3a-4d0da708e62a';

UPDATE tracks 
SET 
  storage_key = 'Azure-EDM-Classical-Re-Energize-1.mp3',
  file_path = 'Azure-EDM-Classical-Re-Energize-1.mp3',
  file_name = 'Azure-EDM-Classical-Re-Energize-1.mp3'
WHERE id = 'd6cd8835-c133-4323-b4ab-199af2767ae2';
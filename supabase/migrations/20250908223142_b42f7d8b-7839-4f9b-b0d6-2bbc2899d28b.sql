-- Fix mismatched track titles to match their actual audio content

UPDATE tracks 
SET title = 'Malaga My Love, Flamenco, Classical, Focus'
WHERE id = '1dd74545-35cb-48be-bca1-6814729992f0' 
AND storage_key = 'tracks/malaga_my_love_flamenco_-_classical_focus_.mp3';

UPDATE tracks 
SET title = 'Santorini, Flamenco, Classical, Focus (Cover)'
WHERE id = 'abeb6f06-7f3a-4723-bf7f-37c209abb729' 
AND storage_key = 'tracks/santorini_flamenco_-_classical_focus_cover.mp3';

UPDATE tracks 
SET title = 'Seville My Love, Flamenco, Classical, Focus (Cover)'
WHERE id = 'dd6d692c-5df3-457a-911b-b5ebc22bbecb' 
AND storage_key = 'tracks/seville_my_love_flamenco_-_classical_focus_cover.mp3';

UPDATE tracks 
SET title = 'Focus On It, Indie Pop, Focus (Remix)'
WHERE title = 'focus on it'
AND storage_key LIKE '%focus-on-it-indie-pop-focus-remix%';

UPDATE tracks 
SET title = 'Focus On The Sands, Focus, World Music'
WHERE title = 'focus on the sands'
AND storage_key LIKE '%focus-on-the-sands-focus-world-music%';

UPDATE tracks 
SET title = 'Focus On Air, Focus, World'
WHERE title = 'focus on air'
AND storage_key LIKE '%focus-on-air-focus-world%';

UPDATE tracks 
SET title = 'My Father, Instrumental, Funk, Samba, Jam Band, Focus, 100 BPM'
WHERE title LIKE 'Samba - Jam Band, Focus%'
AND storage_key LIKE '%my_father_instrumental_funk_-_samba_-_jam_band_focus_100_bpm%';
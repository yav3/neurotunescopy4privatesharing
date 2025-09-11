interface StorageTrack {
  id: string;
  title: string;
  storage_bucket: string;
  storage_key: string;
  stream_url?: string;
  file_size?: number;
  last_modified?: string;
}

export async function getTracksFromServiceStorage(
  goal: string = 'mood-boost',
  count: number = 50,
  buckets?: string[]
): Promise<{ tracks: StorageTrack[]; error?: string }> {
  
  // Determine buckets based on goal
  if (!buckets) {
    const normalizedGoal = goal.trim().toLowerCase();
    
    if (normalizedGoal === 'focus-enhancement') {
      buckets = ['classicalfocus', 'Chopin', 'focus-music', 'neuralpositivemusic'];
    } else if (normalizedGoal === 'mood-boost') {
      buckets = ['ENERGYBOOST'];
    } else if (normalizedGoal === 'sleep') {
      buckets = ['neuralpositivemusic'];
    } else {
      buckets = ['neuralpositivemusic'];
    }
  }
  
  try {
    console.log(`🎯 Fetching tracks for goal: ${goal} from buckets:`, buckets);
    
    let allTracks: StorageTrack[] = [];

    // Process buckets using the service edge function
    for (const bucket of buckets) {
      try {
        console.log(`🗂️ Processing bucket: ${bucket} via service function`);
        
        const response = await fetch(
          `https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/storage-access?bucket=${bucket}&limit=1000`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE'}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          console.error(`❌ HTTP error for bucket ${bucket}:`, response.status, response.statusText);
          continue;
        }

        const result = await response.json();
        
        if (result.error) {
          console.error(`❌ Service error for bucket ${bucket}:`, result.error);
          continue;
        }

        if (result.tracks && result.tracks.length > 0) {
          allTracks.push(...result.tracks);
          console.log(`✅ Added ${result.tracks.length} tracks from bucket: ${bucket}`);
        } else {
          console.log(`📂 No tracks found in bucket: ${bucket}`);
        }

      } catch (error) {
        console.error(`❌ Error processing bucket ${bucket}:`, error);
        continue;
      }
    }

    console.log(`🎯 Total tracks found across all buckets: ${allTracks.length}`);

    if (allTracks.length === 0) {
      return { 
        tracks: [], 
        error: `No audio files found in buckets: ${buckets.join(', ')}` 
      };
    }

    // Shuffle and limit results
    const shuffledTracks = allTracks.sort(() => Math.random() - 0.5);
    const limitedTracks = shuffledTracks.slice(0, count);
    
    console.log(`✅ Returning ${limitedTracks.length} tracks for goal: ${goal}`);
    return { tracks: limitedTracks };

  } catch (error) {
    console.error('❌ Error in getTracksFromServiceStorage:', error);
    return { 
      tracks: [], 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}
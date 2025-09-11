import { supabase } from '@/integrations/supabase/client';

interface StorageTrack {
  id: string;
  title: string;
  storage_bucket: string;
  storage_key: string;
  stream_url?: string;
  file_size?: number;
  last_modified?: string;
}

export async function getTracksFromStorageOptimized(
  goal: string = 'mood-boost',
  count: number = 50,
  buckets?: string[]
): Promise<{ tracks: StorageTrack[]; error?: string }> {
  
  // Determine buckets based on goal
  if (!buckets) {
    const normalizedGoal = goal.trim().toLowerCase();
    
    if (normalizedGoal === 'focus-enhancement') {
      buckets = ['focus-music', 'classicalfocus', 'Chopin', 'neuralpositivemusic'];
    } else if (normalizedGoal === 'mood-boost') {
      buckets = ['ENERGYBOOST'];
    } else if (normalizedGoal === 'stress-anxiety-support' || normalizedGoal === 'anxiety' || normalizedGoal === 'stress') {
      buckets = ['samba'];
    } else if (normalizedGoal === 'sleep') {
      buckets = ['neuralpositivemusic'];
    } else {
      buckets = ['neuralpositivemusic'];
    }
  }
  
  try {
    let allTracks: StorageTrack[] = [];

    // Process buckets in parallel for better performance
    const bucketPromises = buckets.map(async (bucket) => {
      console.log(`🗂️ Processing bucket: ${bucket}`);
      
      try {
        // Use regular client for all operations since buckets are public
        const { data: files, error: listError } = await supabase.storage
          .from(bucket)
          .list('', {
            limit: 1000,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (listError) {
          console.error(`❌ Error listing files in bucket ${bucket}:`, listError);
          return [];
        }

        if (!files || files.length === 0) {
          console.log(`📂 No files found in bucket ${bucket}`);
          return [];
        }

        console.log(`📁 Found ${files.length} files in bucket: ${bucket}`);
        
        // Filter for audio files
        const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
        const audioFiles = files.filter(file => 
          audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
        );
        
        console.log(`🎵 Found ${audioFiles.length} audio files in bucket: ${bucket}`);

        // Create track objects without additional API calls
        const tracks: StorageTrack[] = audioFiles.map(file => {
          // Generate public URL directly
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(file.name);
          
          return {
            id: `${bucket}-${file.name}`,
            title: cleanTitle(file.name),
            storage_bucket: bucket,
            storage_key: file.name,
            stream_url: urlData.publicUrl,
            file_size: file.metadata?.size,
            last_modified: file.updated_at || file.created_at
          };
        });

        return tracks;
      } catch (error) {
        console.error(`❌ Error processing bucket ${bucket}:`, error);
        return [];
      }
    });

    // Wait for all bucket processing to complete
    const bucketResults = await Promise.all(bucketPromises);
    allTracks = bucketResults.flat();

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
    console.error('❌ Error in getTracksFromStorageOptimized:', error);
    return { 
      tracks: [], 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

function cleanTitle(filename: string): string {
  // Remove file extension
  let title = filename.replace(/\.[^/.]+$/, '');
  
  // Replace underscores and hyphens with spaces
  title = title.replace(/[_-]/g, ' ');
  
  // Clean up multiple spaces
  title = title.replace(/\s+/g, ' ');
  
  // Capitalize first letter of each word
  title = title.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
    
  return title.trim();
}
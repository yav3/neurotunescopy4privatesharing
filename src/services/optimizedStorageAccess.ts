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
  
  // Determine buckets based on goal using therapeutic goals configuration
  if (!buckets) {
    console.log(`🎯 Goal received: "${goal}"`);
    
    // Import and use the proper therapeutic goals mapping  
    const { getBucketsForGoal } = await import('../config/therapeuticGoals');
    buckets = getBucketsForGoal(goal);
    
    console.log(`🗂️ Using therapeutic goals mapping: ${buckets.join(', ')} for goal "${goal}"`);
  }
  
  try {
    let allTracks: StorageTrack[] = [];

    // Process buckets in parallel for better performance
    const bucketPromises = buckets.map(async (bucketPath) => {
      console.log(`🗂️ Processing bucket path: ${bucketPath}`);
      
      // Handle bucket/folder syntax (e.g., "neuralpositivemusic/EDM")
      const pathParts = bucketPath.split('/');
      const bucket = pathParts[0];
      const folder = pathParts.length > 1 ? pathParts.slice(1).join('/') : '';
      
      console.log(`📂 Bucket: ${bucket}, Folder: ${folder || 'root'}`);
      
      try {
        // Use regular client for all operations since buckets are public
        const { data: files, error: listError } = await supabase.storage
          .from(bucket)
          .list(folder, {
            limit: 1000,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (listError) {
          console.error(`❌ Error listing files in bucket ${bucket}/${folder}:`, listError);
          return [];
        }

        if (!files || files.length === 0) {
          console.log(`📂 No files found in bucket ${bucket}/${folder}`);
          return [];
        }

        console.log(`📁 Found ${files.length} files in bucket: ${bucket}/${folder}`);
        
        // Filter for audio files
        const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
        const audioFiles = files.filter(file => 
          audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
        );
        
        console.log(`🎵 Found ${audioFiles.length} audio files in bucket: ${bucket}/${folder}`);

        // Create track objects without additional API calls
        const tracks: StorageTrack[] = audioFiles.map(file => {
          // Build the full storage path
          const fullPath = folder ? `${folder}/${file.name}` : file.name;
          
          // Generate public URL with full path
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fullPath);
          
          return {
            id: `${bucketPath}-${file.name}`,
            title: cleanTitle(file.name),
            storage_bucket: bucket,
            storage_key: fullPath,
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
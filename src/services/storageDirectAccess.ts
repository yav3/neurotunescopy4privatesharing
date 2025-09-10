import { supabase } from '@/integrations/supabase/client';
import { serviceSupabase } from '@/integrations/supabase/service-client';

interface StorageTrack {
  id: string;
  title: string;
  storage_bucket: string;
  storage_key: string;
  stream_url?: string;
  file_size?: number;
  last_modified?: string;
}

// Helper function to format filenames into human-readable titles
function cleanTitle(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove file extension
    .replace(/[_-]/g, ' ') // Replace underscores and dashes with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

// Filter tracks based on therapeutic goal keywords
function filterByGoal(tracks: StorageTrack[], goal: string): StorageTrack[] {
  const goalKeywords: Record<string, string[]> = {
    'focus-enhancement': ['focus', 'concentration', 'study', 'work', 'productivity', 'attention', 'classical', 'instrumental'],
    'stress-anxiety-support': ['calm', 'relax', 'peace', 'tranquil', 'soothe', 'meditation', 'zen', 'ambient'],
    'mood-boost': ['energy', 'upbeat', 'happy', 'positive', 'boost', 'motivate', 'dance', 'pop'],
    'pain-support': ['healing', 'therapy', 'gentle', 'soft', 'comfort', 'relief', 'nature'],
    'sleep-aid': ['sleep', 'dream', 'night', 'lullaby', 'peaceful', 'quiet', 'rest']
  };

  const keywords = goalKeywords[goal];
  if (!keywords) {
    console.log(`🎯 No specific keywords for goal "${goal}", returning all tracks`);
    return tracks;
  }

  const filtered = tracks.filter(track => {
    const titleLower = track.title.toLowerCase();
    return keywords.some(keyword => titleLower.includes(keyword));
  });

  console.log(`🎯 Filtered ${tracks.length} tracks to ${filtered.length} for goal "${goal}"`);
  
  // If filtering results in too few tracks, return original set
  if (filtered.length < 10 && tracks.length >= 10) {
    console.log(`🔄 Too few filtered tracks (${filtered.length}), returning all ${tracks.length} tracks`);
    return tracks;
  }
  
  return filtered;
}

// Main function to get tracks from storage buckets
export async function getTracksFromStorage(
  goal: string = 'mood-boost',
  count: number = 50,
  buckets?: string[]
): Promise<{ tracks: StorageTrack[]; error?: string }> {
  // Determine buckets based on goal - direct mapping
  if (!buckets) {
    console.log(`🎯 Goal received: "${goal}"`);
    
    // Use trim() and toLowerCase() for comparison to handle any whitespace/case issues
    const normalizedGoal = goal.trim().toLowerCase();
    
    if (normalizedGoal === 'focus-enhancement') {
      // Try focus-music first, then classicalfocus, fallback to neuralpositivemusic if auth issues
      buckets = ['focus-music', 'classicalfocus', 'neuralpositivemusic'];
      console.log(`🎯 Using focus-music, classicalfocus, and neuralpositivemusic buckets for focus enhancement`);
    } else if (normalizedGoal === 'mood-boost') {
      buckets = ['ENERGYBOOST'];
      console.log(`🎯 Using ENERGYBOOST bucket for mood boost`);
    } else if (normalizedGoal === 'sleep') {
      buckets = ['neuralpositivemusic'];
      console.log(`🎯 Using neuralpositivemusic bucket for sleep`);
    } else {
      buckets = ['neuralpositivemusic'];
      console.log(`🎯 Using neuralpositivemusic bucket for other goals`);
    }
    
    console.log(`🗂️ Selected buckets:`, buckets);
  }
  
  try {
    let allTracks: StorageTrack[] = [];

    for (const bucket of buckets) {
      console.log(`🗂️ Processing bucket: ${bucket}`);
      
      try {
        // Try service client first, fallback to regular client if auth issues
        let client = serviceSupabase;
        let bucketInfo = await client.storage.getBucket(bucket);
        
        if (bucketInfo.error && bucketInfo.error.message?.includes('signature verification failed')) {
          console.log(`⚠️ Service client auth failed for ${bucket}, trying regular client...`);
          client = supabase;
          bucketInfo = await client.storage.getBucket(bucket);
        }
        
        console.log(`🔍 Bucket info for ${bucket}:`, bucketInfo);
        
        if (bucketInfo.error) {
          console.error(`❌ Error accessing bucket ${bucket}:`, bucketInfo.error);
          console.error(`❌ Error details:`, { 
            message: bucketInfo.error.message, 
            name: bucketInfo.error.name,
            stack: bucketInfo.error.stack 
          });
          
          // If bucket not found, let's try to get more info about available buckets
          if (bucketInfo.error.message?.includes('not found') || bucketInfo.error.message?.includes('Bucket not found')) {
            console.log('🔍 Trying to list all available buckets...');
            const allBuckets = await client.storage.listBuckets();
            console.log('🔍 Available buckets:', allBuckets.data?.map(b => b.name) || 'none');
            console.log('🔍 Bucket list error (if any):', allBuckets.error);
          }
          continue; // Skip this bucket and try the next one
        }

        // List files in bucket using the same client that worked for bucket info
        const { data: files, error: listError } = await client.storage.from(bucket).list('', {
          limit: 1000,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });

        if (listError) {
          console.error(`❌ Error listing files in bucket ${bucket}:`, listError);
          continue;
        }

        if (!files || files.length === 0) {
          console.log(`📂 No files found in bucket ${bucket}`);
          continue;
        }

        console.log(`📁 Found ${files.length} files in bucket: ${bucket}`);
        
        // Filter for audio files and create track objects
        const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
        const audioFiles = files.filter(file => 
          audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
        );
        
        console.log(`🎵 Found ${audioFiles.length} audio files in bucket: ${bucket}`);

        for (const file of audioFiles) {
          try {
            // Generate public URL using the same client
            const { data: urlData } = client.storage.from(bucket).getPublicUrl(file.name);
            
            if (!urlData?.publicUrl) {
              console.warn(`⚠️ Could not generate URL for ${file.name}`);
              continue;
            }

            const track: StorageTrack = {
              id: `${bucket}-${file.name.replace(/[^a-zA-Z0-9]/g, '-')}`,
              title: cleanTitle(file.name),
              storage_bucket: bucket,
              storage_key: file.name,
              stream_url: urlData.publicUrl,
              file_size: file.metadata?.size,
              last_modified: file.metadata?.lastModified
            };
            
            allTracks.push(track);
            
            // Enhanced debugging for first few tracks
            if (allTracks.length <= 3) {
              console.log(`🎵 Sample track from ${bucket}:`, {
                id: track.id,
                title: track.title,
                url: track.stream_url,
                size: track.file_size
              });
            }
          } catch (fileError) {
            console.warn(`⚠️ Failed to process file ${file.name}:`, fileError);
          }
        }
        
        // If we got tracks from this bucket, we can stop trying other buckets for focus-enhancement
        if (allTracks.length > 0 && goal === 'focus-enhancement') {
          console.log(`✅ Got ${allTracks.length} tracks from ${bucket}, stopping here for focus-enhancement`);
          break;
        }
        
      } catch (bucketError) {
        console.error(`❌ Error processing bucket ${bucket}:`, bucketError);
        continue;
      }
    }

    console.log(`📦 Total tracks found across all buckets: ${allTracks.length}`);

    if (allTracks.length === 0) {
      return { tracks: [], error: 'No audio files found in storage buckets' };
    }

    // Filter by goal (skip filtering for manually curated buckets)
    let filteredTracks = allTracks;
    if (goal === 'focus-enhancement' || goal === 'mood-boost') {
      console.log(`🎯 Using all tracks from curated ${buckets[0]} bucket: ${allTracks.length} tracks`);
      filteredTracks = allTracks;
    } else {
      filteredTracks = filterByGoal(allTracks, goal);
      console.log(`🎯 After goal filtering (${goal}): ${filteredTracks.length} tracks`);
      
      // If no matches for specific goal, fall back to all tracks
      if (filteredTracks.length === 0) {
        console.log(`🔄 No matches for ${goal}, using all available tracks`);
        filteredTracks = allTracks;
      }
    }

    // Shuffle and limit
    const shuffled = filteredTracks.sort(() => Math.random() - 0.5);
    const finalTracks = shuffled.slice(0, count);

    console.log(`✅ Returning ${finalTracks.length} tracks directly from storage`);
    console.log('🎵 Sample tracks:', finalTracks.slice(0, 3).map(t => ({ 
      title: t.title, 
      bucket: t.storage_bucket,
      hasUrl: !!t.stream_url 
    })));

    return { tracks: finalTracks };

  } catch (error) {
    console.error('❌ Error fetching tracks from storage:', error);
    return { 
      tracks: [], 
      error: error instanceof Error ? error.message : 'Unknown storage error' 
    };
  }
}
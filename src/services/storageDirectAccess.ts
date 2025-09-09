import { supabase } from "@/integrations/supabase/client";
import { useSupabaseStorage } from "@/hooks/useSupabaseStorage";

export interface StorageTrack {
  id: string;
  title: string;
  storage_bucket: string;
  storage_key: string;
  stream_url: string;
  file_size?: number;
  last_modified?: string;
}

// Extract title from filename
function cleanTitle(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Filter tracks by therapeutic goal based on filename/title keywords
function filterByGoal(tracks: StorageTrack[], goal: string): StorageTrack[] {
  const keywords: Record<string, string[]> = {
    'meditation-support': ['meditation', 'zen', 'mindful', 'peaceful', 'calm', 'serene'],
    'focus-enhancement': ['focus', 'concentration', 'study', 'work', 'productivity', 'attention'],
    'stress-reduction': ['relax', 'stress', 'relief', 'unwind', 'sooth', 'comfort'],
    'mood-boost': ['happy', 'upbeat', 'positive', 'joy', 'energy', 'boost', 'mood'],
    'anxiety-relief': ['anxiety', 'relief', 'comfort', 'peace', 'tranquil', 'gentle']
  };

  const goalKeywords = keywords[goal] || [];
  
  if (goalKeywords.length === 0) {
    return tracks; // Return all if no specific keywords
  }

  return tracks.filter(track => {
    const titleLower = track.title.toLowerCase();
    return goalKeywords.some(keyword => titleLower.includes(keyword));
  });
}

export async function getTracksFromStorage(
  goal: string = 'mood-boost',
  count: number = 50,
  buckets: string[] = ['neuralpositivemusic', 'audio']
): Promise<{ tracks: StorageTrack[]; error?: string }> {
  try {
    console.log(`🗂️ Fetching ${count} tracks directly from storage buckets:`, buckets);
    
    const allTracks: StorageTrack[] = [];
    
    for (const bucket of buckets) {
      console.log(`📁 Scanning bucket: ${bucket}`);
      
      // List all files in the bucket
      const { data: files, error } = await supabase.storage
        .from(bucket)
        .list('', {
          limit: 1000,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) {
        console.error(`❌ Error listing files in bucket ${bucket}:`, error);
        continue;
      }

      if (!files || files.length === 0) {
        console.log(`📁 No files found in bucket: ${bucket}`);
        continue;
      }

      console.log(`📁 Found ${files.length} files in bucket: ${bucket}`);

      // Filter for audio files and create track objects
      const audioFiles = files.filter(file => {
        const ext = file.name.toLowerCase().split('.').pop();
        return ['mp3', 'wav', 'm4a', 'flac', 'ogg', 'aac'].includes(ext || '');
      });

      console.log(`🎵 Found ${audioFiles.length} audio files in bucket: ${bucket}`);

      for (const file of audioFiles) {
        try {
          // Generate signed URL
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(file.name);

          if (urlData?.publicUrl) {
            const track: StorageTrack = {
              id: `${bucket}-${file.name}`,
              title: cleanTitle(file.name),
              storage_bucket: bucket,
              storage_key: file.name,
              stream_url: urlData.publicUrl,
              file_size: file.metadata?.size,
              last_modified: file.metadata?.lastModified
            };
            
            allTracks.push(track);
          }
        } catch (fileError) {
          console.warn(`⚠️ Failed to process file ${file.name}:`, fileError);
        }
      }
    }

    console.log(`📦 Total tracks found across all buckets: ${allTracks.length}`);

    if (allTracks.length === 0) {
      return { tracks: [], error: 'No audio files found in storage buckets' };
    }

    // Filter by goal
    let filteredTracks = filterByGoal(allTracks, goal);
    console.log(`🎯 After goal filtering (${goal}): ${filteredTracks.length} tracks`);

    // If no matches for specific goal, fall back to all tracks
    if (filteredTracks.length === 0) {
      console.log(`🔄 No matches for ${goal}, using all available tracks`);
      filteredTracks = allTracks;
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
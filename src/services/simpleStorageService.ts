import { supabase } from '@/integrations/supabase/client';
import { Track, cleanTitle } from '@/types/simpleTrack';

// Simple storage service - direct bucket access only
export class SimpleStorageService {
  private static audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];

  static async getTracksFromBuckets(bucketNames: string[], maxTracks: number = 100): Promise<Track[]> {
    console.log(`🎵 Loading tracks from buckets: ${bucketNames.join(', ')}`);
    
    let allTracks: Track[] = [];

    for (const bucketName of bucketNames) {
      try {
        console.log(`📂 Processing bucket: ${bucketName}`);
        
        // List files in bucket
        const { data: files, error } = await supabase.storage
          .from(bucketName)
          .list('', {
            limit: 1000,
            offset: 0,
          });

        if (error) {
          console.error(`❌ Error listing files in bucket ${bucketName}:`, error);
          // Try to be more specific about the error
          if (error.message?.includes('not found') || error.message?.includes('does not exist')) {
            console.warn(`📂 Bucket ${bucketName} does not exist - skipping`);
          } else if (error.message?.includes('permission') || error.message?.includes('access')) {
            console.warn(`📂 No access to bucket ${bucketName} - skipping`);
          }
          continue;
        }

        if (!files || files.length === 0) {
          console.log(`📂 No files found in bucket ${bucketName}`);
          continue;
        }

        // Filter for audio files
        const audioFiles = files.filter(file => 
          this.audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
        );

        console.log(`🎵 Found ${audioFiles.length} audio files in ${bucketName} (${files.length} total files)`);
        
        if (audioFiles.length === 0) {
          console.warn(`⚠️ No audio files found in bucket ${bucketName}`);
          console.log(`🔍 File types in bucket:`, [...new Set(files.map(f => f.name.split('.').pop()?.toLowerCase() || 'no-ext'))]);
          continue;
        }

        // Convert to Track objects
        for (const file of audioFiles) {
          const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(file.name);

          if (urlData?.publicUrl) {
          const track: Track = {
            id: `${bucketName}-${file.id || file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: cleanTitle(file.name),
            url: urlData.publicUrl,
            bucket: bucketName,
            folder: '',
            duration: file.metadata?.size ? Math.floor(file.metadata.size / 1000) : undefined
          };

            allTracks.push(track);
          }
        }

      } catch (error) {
        console.error(`❌ Error processing bucket ${bucketName}:`, error);
      }
    }

    // Shuffle and limit
    const shuffled = allTracks.sort(() => Math.random() - 0.5);
    const finalTracks = shuffled.slice(0, maxTracks);

    console.log(`✅ Returning ${finalTracks.length} tracks from ${bucketNames.length} buckets`);
    
    return finalTracks;
  }

  static async getTracksFromCategory(categoryId: string, maxTracks: number = 100): Promise<Track[]> {
    const { getBucketsForGoal } = await import('@/config/therapeuticGoals');
    const buckets = getBucketsForGoal(categoryId);
    
    if (buckets.length === 0) {
      console.warn(`No buckets found for category: ${categoryId}`);
      return [];
    }

    return this.getTracksFromBuckets(buckets, maxTracks);
  }
}
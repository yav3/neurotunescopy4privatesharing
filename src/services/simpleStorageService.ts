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

        console.log(`🎵 Found ${audioFiles.length} audio files in ${bucketName}`);

        // Convert to Track objects
        for (const file of audioFiles) {
          const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(file.name);

          if (urlData?.publicUrl) {
            const track: Track = {
              id: `${bucketName}-${file.name.replace(/[^a-zA-Z0-9]/g, '-')}`,
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
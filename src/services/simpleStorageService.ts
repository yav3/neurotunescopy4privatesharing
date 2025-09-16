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
        
        // List files in bucket - try different approaches
        let files: any[] = [];
        let error: any = null;
        
        // First attempt: list with empty path
        const result1 = await supabase.storage
          .from(bucketName)
          .list('', {
            limit: 1000,
            offset: 0,
          });
        
        if (result1.error) {
          console.warn(`⚠️ Method 1 failed for ${bucketName}:`, result1.error.message);
          
          // Second attempt: list with null path
          const result2 = await supabase.storage
            .from(bucketName)
            .list();
          
          if (result2.error) {
            console.error(`❌ Method 2 also failed for ${bucketName}:`, result2.error.message);
            error = result2.error;
          } else {
            files = result2.data || [];
            console.log(`✅ Method 2 succeeded for ${bucketName}`);
          }
        } else {
          files = result1.data || [];
          console.log(`✅ Method 1 succeeded for ${bucketName}`);
        }

        if (error) {
          console.error(`❌ Error listing files in bucket ${bucketName}:`, error);
          continue;
        }

        console.log(`📋 Raw files in ${bucketName}:`, files.map(f => ({ name: f.name, size: f.metadata?.size })));

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
          // Use the direct public URL format that works
          const publicUrl = `https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/${bucketName}/${file.name}`;

          const track: Track = {
            id: `${bucketName}-${file.id || file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: cleanTitle(file.name),
            url: publicUrl,
            bucket: bucketName,
            folder: '',
            duration: file.metadata?.size ? Math.floor(file.metadata.size / 1000) : undefined
          };

          allTracks.push(track);
          console.log(`✅ Added track: ${track.title} -> ${publicUrl}`);
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
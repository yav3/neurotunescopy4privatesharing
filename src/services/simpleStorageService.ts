import { supabase } from '@/integrations/supabase/client';
import { Track, cleanTitle } from '@/types/simpleTrack';
import { expandBucketsWithFallbacks, isBucketEmpty } from '@/utils/bucketFallbacks';
import { storageRequestManager } from '@/services/storageRequestManager';

// Simple storage service - direct bucket access only
export class SimpleStorageService {
  private static audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];

  static async getTracksFromBuckets(bucketNames: string[], maxTracks: number = 100): Promise<Track[]> {
    console.log(`🎵 Loading tracks from buckets: ${bucketNames.join(', ')}`);
    
    // Expand buckets with fallbacks for empty buckets
    const expandedBuckets = expandBucketsWithFallbacks(bucketNames);
    const hasEmptyBuckets = bucketNames.some(bucket => isBucketEmpty(bucket));
    
    if (hasEmptyBuckets) {
      console.log(`🔄 Original buckets contain empty ones, expanded to: ${expandedBuckets.join(', ')}`);
    }
    
    let allTracks: Track[] = [];

    for (const bucketName of expandedBuckets) {
      try {
        console.log(`📂 Processing bucket: ${bucketName}`);
        
        // List files in bucket using throttled request manager
        let files: any[] = [];
        let error: any = null;
        
        try {
          console.log(`🔄 Using throttled storage request for bucket: ${bucketName}`);
          files = await storageRequestManager.listStorage(bucketName, {
            limit: 1000,
            offset: 0,
          });
          console.log(`✅ Throttled request succeeded for ${bucketName}`);
        } catch (requestError) {
          console.error(`❌ Throttled request failed for ${bucketName}:`, requestError);
          error = requestError;
        }

        if (error) {
          console.error(`❌ Error listing files in bucket ${bucketName}:`, error);
          continue;
        }

        console.log(`📋 Raw files in ${bucketName}:`, files.map(f => ({ name: f.name, size: f.metadata?.size })));

        if (!files || files.length === 0) {
          console.log(`📂 No files found in bucket ${bucketName}`);
          
          // If this was an originally requested bucket (not a fallback), log it as empty
          if (bucketNames.includes(bucketName)) {
            console.warn(`⚠️ Originally requested bucket ${bucketName} is empty`);
          }
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
          
          // If this was an originally requested bucket (not a fallback), log it as empty
          if (bucketNames.includes(bucketName)) {
            console.warn(`⚠️ Originally requested bucket ${bucketName} has no audio files`);
          }
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

    console.log(`✅ Returning ${finalTracks.length} tracks from ${expandedBuckets.length} buckets (${bucketNames.length} original, ${expandedBuckets.length - bucketNames.length} fallbacks)`);
    
    if (hasEmptyBuckets && finalTracks.length > 0) {
      console.log(`🎵 Successfully used fallback buckets to provide music for empty genres`);
    }
    
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
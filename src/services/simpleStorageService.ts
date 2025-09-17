import { supabase } from '@/integrations/supabase/client';
import { Track, cleanTitle } from '@/types/simpleTrack';
import { expandBucketsWithFallbacks, isBucketEmpty } from '@/utils/bucketFallbacks';
import { storageRequestManager } from '@/services/storageRequestManager';
import { StorageManifestService } from '@/services/storageManifestService';

// Simple storage service - direct bucket access only
export class SimpleStorageService {
  private static audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];

  static async getTracksFromBuckets(bucketNames: string[], maxTracks: number = 100): Promise<Track[]> {
    console.log(`🎵 Loading tracks from buckets using manifest service: ${bucketNames.join(', ')}`);
    
    // Expand buckets with fallbacks for empty buckets
    const expandedBuckets = expandBucketsWithFallbacks(bucketNames);
    const hasEmptyBuckets = bucketNames.some(bucket => isBucketEmpty(bucket));
    
    if (hasEmptyBuckets) {
      console.log(`🔄 Original buckets contain empty ones, expanded to: ${expandedBuckets.join(', ')}`);
    }

    // Use manifest service to get only real, accessible tracks
    const manifestTracks = await StorageManifestService.fetchMultipleBucketManifests(expandedBuckets);
    
    // Convert manifest tracks to Track objects
    const allTracks: Track[] = manifestTracks.map(manifestTrack => {
      // Use signed URL if available, fallback to public URL
      const url = manifestTrack.signed_url || manifestTrack.public_url;
      
      const track: Track = {
        id: `${manifestTrack.bucket}-${manifestTrack.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: cleanTitle(manifestTrack.name),
        url: url,
        bucket: manifestTrack.bucket,
        folder: '',
        duration: undefined // Could be enhanced with metadata from storage
      };

      return track;
    });

    // Shuffle and limit
    const shuffled = allTracks.sort(() => Math.random() - 0.5);
    const finalTracks = shuffled.slice(0, maxTracks);

    console.log(`✅ Returning ${finalTracks.length} verified playable tracks from ${expandedBuckets.length} buckets`);
    
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
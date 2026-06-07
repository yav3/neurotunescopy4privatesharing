import { supabase } from '@/integrations/supabase/client';
import { expandBucketsWithFallbacks } from '@/utils/bucketFallbacks';

// Direct bucket access service - ONLY bucket roots, NO subfolders
export class DirectBucketAccess {
  private static audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
  
  // Race condition protection - request deduplication
  private static pendingRequests = new Map<string, Promise<any[]>>();

  // Get all audio files directly from bucket root - no folders, no prefixes
  static async getAudioFilesFromBucketRoot(bucketName: string): Promise<any[]> {
    console.log(`🎯 DIRECT ROOT ACCESS: ${bucketName}`);
    
    try {
      // Use edge function for service-level access instead of direct client access
      console.log(`🔄 Using edge function for bucket access: ${bucketName}`);
      const response = await fetch(`https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/storage-access?bucket=${bucketName}&limit=1000`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`❌ Edge function failed for ${bucketName}:`, response.status, response.statusText);
        return [];
      }

      const result = await response.json();
      
      if (result.error) {
        console.error(`❌ Edge function error for ${bucketName}:`, result.error);
        return [];
      }

      const tracks = result.tracks || [];
      console.log(`🎵 Found ${tracks.length} audio files via edge function in ${bucketName}`);
      
      // Convert edge function response to expected format
      return tracks.map((track: any) => ({
        name: track.storage_key,
        metadata: { size: track.file_size }
      }));

    } catch (error) {
      console.error(`❌ Exception accessing ${bucketName} via edge function:`, error);
      return [];
    }
  }

  // Get tracks from multiple bucket roots
  static async getTracksFromBucketRoots(bucketNames: string[]): Promise<any[]> {
    // Create unique request key for race condition protection
    const requestKey = `roots:${bucketNames.sort().join(',')}`; 
    
    // Return existing request if already in progress
    if (this.pendingRequests.has(requestKey)) {
      console.log(`🔄 Returning existing request for buckets: ${bucketNames.join(', ')}`);
      return this.pendingRequests.get(requestKey)!;
    }
    
    console.log(`🎯 DIRECT ROOT ACCESS for buckets: ${bucketNames.join(', ')}`);
    console.log(`🔍 Bucket names received:`, bucketNames);
    
    // Create and cache the request promise
    const requestPromise = this._getTracksFromBucketRootsInternal(bucketNames);
    this.pendingRequests.set(requestKey, requestPromise);
    
    // Clean up when request completes
    requestPromise.finally(() => {
      this.pendingRequests.delete(requestKey);
    });
    
    return requestPromise;
  }

  // Internal implementation without race protection
  private static async _getTracksFromBucketRootsInternal(bucketNames: string[]): Promise<any[]> {
    // Apply fallback system for empty buckets
    const expandedBuckets = expandBucketsWithFallbacks(bucketNames);
    console.log(`🔄 Original buckets: ${bucketNames.join(', ')}`);
    console.log(`📈 Expanded with fallbacks: ${expandedBuckets.join(', ')}`);
    
    const allTracks: any[] = [];
    
    for (const bucketName of expandedBuckets) {
      console.log(`🚀 Processing bucket: ${bucketName}`);
      
      try {
        // Use edge function for service-level access
        console.log(`🔄 Using edge function for bucket access: ${bucketName}`);
        const response = await fetch(`https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/storage-access?bucket=${bucketName}&limit=1000`, {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          console.error(`❌ Edge function failed for ${bucketName}:`, response.status, response.statusText);
          continue;
        }

        const result = await response.json();
        
        if (result.error) {
          console.error(`❌ Edge function error for ${bucketName}:`, result.error);
          continue;
        }

        const tracks = result.tracks || [];
        console.log(`🎵 Found ${tracks.length} tracks via edge function in ${bucketName}`);
        
        // Convert edge function response to DirectBucketAccess format
        for (const track of tracks) {
          const convertedTrack = {
            id: `${bucketName}-root-${track.storage_key}`,
            title: track.title,
            url: track.stream_url,
            bucket: bucketName,
            folder: '', // Always empty for root access
            filename: track.storage_key,
            size: track.file_size
          };
          
          allTracks.push(convertedTrack);
          console.log(`✅ ROOT track: ${convertedTrack.title}`);
        }
        
      } catch (error) {
        console.error(`❌ Exception accessing ${bucketName} via edge function:`, error);
      }
    }

    console.log(`✅ Total tracks from ${bucketNames.length} original buckets (${expandedBuckets.length} with fallbacks): ${allTracks.length}`);
    console.log(`📋 Final tracks:`, allTracks.map(t => ({ bucket: t.bucket, title: t.title })));
    return allTracks;
  }

  private static cleanTitle(filename: string): string {
    // Remove file extension
    let title = filename.replace(/\.[^/.]+$/, '');
    
    // Replace underscores and hyphens with spaces
    title = title.replace(/[_-]/g, ' ');
    
    // Clean up multiple spaces
    title = title.replace(/\s+/g, ' ').trim();
    
    // Capitalize first letter of each word
    return title.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
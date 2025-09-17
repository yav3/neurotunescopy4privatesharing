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
      // Access bucket root directly with empty string path
      const { data: files, error } = await supabase.storage
        .from(bucketName)
        .list('', {  // Empty string = root directory only
          limit: 1000,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) {
        console.error(`❌ Direct root access failed for ${bucketName}:`, error);
        return [];
      }

      if (!files || files.length === 0) {
        console.log(`📂 Bucket ${bucketName} root is empty`);
        return [];
      }

      console.log(`📋 Found ${files.length} total files in ${bucketName} root`);

      // Filter for audio files only
      const audioFiles = files.filter(file => 
        this.audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
      );

      console.log(`🎵 Found ${audioFiles.length} audio files in ${bucketName} root`);
      
      if (audioFiles.length === 0) {
        console.log(`🔍 File types in ${bucketName} root:`, 
          [...new Set(files.map(f => f.name.split('.').pop()?.toLowerCase() || 'no-ext'))]
        );
      }

      return audioFiles;

    } catch (error) {
      console.error(`❌ Exception accessing ${bucketName} root:`, error);
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
      const audioFiles = await this.getAudioFilesFromBucketRoot(bucketName);
      
      for (const file of audioFiles) {
        const track = {
          id: `${bucketName}-root-${file.name}`,
          title: this.cleanTitle(file.name),
          url: `https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/${bucketName}/${file.name}`,
          bucket: bucketName,
          folder: '', // Always empty for root access
          filename: file.name,
          size: file.metadata?.size
        };
        
        allTracks.push(track);
        console.log(`✅ ROOT track: ${track.title}`);
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
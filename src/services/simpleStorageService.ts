import { supabase } from '@/integrations/supabase/client';
import { Track, cleanTitle } from '@/types/simpleTrack';
import { expandBucketsWithFallbacks, isBucketEmpty } from '@/utils/bucketFallbacks';
import { storageRequestManager } from '@/services/storageRequestManager';

// Simple storage service - direct bucket access only
export class SimpleStorageService {
  private static audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
  
  // Request deduplication and queuing to prevent race conditions
  private static pendingRequests = new Map<string, Promise<Track[]>>();
  private static requestSequence = 0;
  private static requestQueue: (() => Promise<void>)[] = [];
  private static isProcessingQueue = false;
  private static readonly MAX_CONCURRENT_REQUESTS = 2;

  static async getTracksFromBuckets(bucketNames: string[], maxTracks: number = 100): Promise<Track[]> {
    // Create unique request key for deduplication
    const requestKey = `${bucketNames.sort().join(',')}-${maxTracks}`;
    
    // Return existing request if already in progress
    if (this.pendingRequests.has(requestKey)) {
      console.log(`🔄 Returning existing request for buckets: ${bucketNames.join(', ')}`);
      return this.pendingRequests.get(requestKey)!;
    }
    
    // Queue the request to prevent simultaneous bucket access
    const requestPromise = new Promise<Track[]>((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await this._getTracksFromBucketsInternal(bucketNames, maxTracks);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
    
    this.pendingRequests.set(requestKey, requestPromise);
    
    // Clean up request when done
    requestPromise.finally(() => {
      this.pendingRequests.delete(requestKey);
    });
    
    return requestPromise;
  }

  private static async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }
    
    this.isProcessingQueue = true;
    
    while (this.requestQueue.length > 0) {
      const batch = this.requestQueue.splice(0, this.MAX_CONCURRENT_REQUESTS);
      console.log(`🔄 Processing ${batch.length} queued storage requests`);
      
      try {
        await Promise.all(batch.map(request => request()));
        // Small delay between batches to prevent overwhelming storage
        if (this.requestQueue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error('❌ Error processing request batch:', error);
      }
    }
    
    this.isProcessingQueue = false;
  }

  private static async _getTracksFromBucketsInternal(bucketNames: string[], maxTracks: number = 100): Promise<Track[]> {
    console.log(`🎵 Loading tracks from BUCKET ROOTS ONLY: ${bucketNames.join(', ')}`);
    
    // Debug: Log which genre/route is requesting which bucket
    console.log(`🐛 DEBUG: Bucket request - buckets: ${bucketNames.join(', ')}, maxTracks: ${maxTracks}`);
    console.log(`🐛 DEBUG: Current URL: ${typeof window !== 'undefined' ? window.location.pathname : 'N/A'}`);
    
    // Apply fallback system for empty buckets
    const expandedBuckets = expandBucketsWithFallbacks(bucketNames);
    console.log(`🔄 Original buckets: ${bucketNames.join(', ')}`);
    console.log(`📈 Expanded with fallbacks: ${expandedBuckets.join(', ')}`);
    
    let allTracks: Track[] = [];

    for (const bucketName of expandedBuckets) {
      try {
        console.log(`📂 Processing bucket ROOT: ${bucketName}`);
        
        // List files in bucket ROOT ONLY using throttled request manager
        let files: any[] = [];
        let error: any = null;
        
        try {
          console.log(`🔄 Accessing bucket ROOT directly: ${bucketName}`);
          const startTime = performance.now();
          files = await storageRequestManager.listStorage(bucketName);
          const endTime = performance.now();
          console.log(`✅ Got ${files?.length || 0} files from ${bucketName} ROOT in ${Math.round(endTime - startTime)}ms`);
        } catch (requestError) {
          console.error(`❌ Failed to access ${bucketName} ROOT:`, requestError);
          error = requestError;
        }

        if (error) {
          console.error(`❌ Error listing files in bucket ${bucketName} ROOT:`, error);
          continue;
        }

        console.log(`📋 Raw files in ${bucketName} ROOT:`, files?.map(f => ({ name: f.name, size: f.metadata?.size })) || []);

        if (!files || files.length === 0) {
          console.log(`📂 No files found in bucket ${bucketName} ROOT`);
          continue;
        }

        // Filter for audio files - ONLY in bucket root
        const audioFiles = files.filter(file => 
          this.audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
        );

        console.log(`🎵 Found ${audioFiles.length} audio files in ${bucketName} ROOT (${files.length} total files)`);
        
        if (audioFiles.length === 0) {
          console.warn(`⚠️ No audio files found in bucket ${bucketName} ROOT`);
          console.log(`🔍 File types in bucket ROOT:`, [...new Set(files.map(f => f.name.split('.').pop()?.toLowerCase() || 'no-ext'))]);
          continue;
        }

        // Convert to Track objects - ALL from bucket root
        for (const file of audioFiles) {
          // Use Supabase client to get properly encoded public URL
          const { data } = supabase.storage.from(bucketName).getPublicUrl(file.name);
          const publicUrl = data.publicUrl;

          // Generate deterministic ID to prevent duplicates and race conditions
          const sequence = ++this.requestSequence;
          const track: Track = {
            id: `${bucketName}-root-${file.name}-${sequence}`,
            title: cleanTitle(file.name),
            url: publicUrl,
            bucket: bucketName,
            folder: '', // Always empty - root level only
            duration: file.metadata?.size ? Math.floor(file.metadata.size / 1000) : undefined
          };

          allTracks.push(track);
          console.log(`✅ Added ROOT track: ${track.title} -> ${publicUrl}`);
        }

      } catch (error) {
        console.error(`❌ Error processing bucket ${bucketName} ROOT:`, error);
      }
    }

    // Shuffle and limit
    const shuffled = allTracks.sort(() => Math.random() - 0.5);
    const finalTracks = shuffled.slice(0, maxTracks);

    console.log(`✅ Returning ${finalTracks.length} tracks from ${bucketNames.length} original buckets (${expandedBuckets.length} with fallbacks)`);
    
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
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
          // Use service client for elevated permissions to access all buckets
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

    // Shuffle and limit BEFORE fetching artwork (for performance)
    const shuffled = allTracks.sort(() => Math.random() - 0.5);
    const finalTracks = shuffled.slice(0, maxTracks);

    // Fetch artwork URLs from database for the selected tracks
    const tracksWithArtwork = await this.enrichTracksWithArtwork(finalTracks);

    console.log(`✅ Returning ${tracksWithArtwork.length} tracks from ${bucketNames.length} original buckets (${expandedBuckets.length} with fallbacks)`);
    
    return tracksWithArtwork;
  }

  // Fetch artwork URLs from music_tracks table and enrich tracks
  private static async enrichTracksWithArtwork(tracks: Track[]): Promise<Track[]> {
    if (tracks.length === 0) return tracks;

    try {
      // Query database for all tracks with artwork (we'll match by file_path)
      const { data: dbTracks, error } = await supabase
        .from('music_tracks')
        .select('file_path, artwork_url')
        .not('artwork_url', 'is', null);

      if (error) {
        console.warn('⚠️ Failed to fetch artwork from database:', error.message);
        return tracks;
      }

      if (!dbTracks || dbTracks.length === 0) {
        console.log('ℹ️ No artwork found in database');
        return tracks;
      }

      // Create maps for fast lookup - by file_path (normalized)
      const artworkByPath = new Map<string, string>();
      const artworkByName = new Map<string, string>();
      
      for (const dbTrack of dbTracks) {
        if (dbTrack.artwork_url && dbTrack.file_path) {
          // Normalize: lowercase, no extension
          const normalizedPath = dbTrack.file_path.toLowerCase().replace(/\.[^/.]+$/, '').trim();
          artworkByPath.set(normalizedPath, dbTrack.artwork_url);
          
          // Also create a simplified name key (remove hyphens, underscores, spaces)
          const simplifiedName = normalizedPath.replace(/[-_\s]/g, '');
          artworkByName.set(simplifiedName, dbTrack.artwork_url);
        }
      }

      console.log(`🎨 Loaded ${artworkByPath.size} artwork URLs from database`);

      // Enrich tracks with artwork - match by multiple strategies
      let matchCount = 0;
      const enrichedTracks = tracks.map(track => {
        // Strategy 1: Extract filename from track ID (format: bucket-root-filename.ext-seq)
        // e.g. "sambajazznocturnes-root-the-spartan-age.mp3-123"
        const idParts = track.id.split('-root-');
        let filename = idParts.length > 1 
          ? idParts[1].replace(/-\d+$/, '').replace(/\.[^/.]+$/, '') // Remove sequence and extension
          : track.title;
        
        const normalizedFilename = filename.toLowerCase().replace(/[-_\s]/g, '').trim();
        const normalizedTitle = track.title.toLowerCase().replace(/[-_\s]/g, '').trim();
        
        // Try matching by simplified filename first
        let artwork_url = artworkByName.get(normalizedFilename);
        
        // Try matching by title if filename didn't work
        if (!artwork_url) {
          artwork_url = artworkByName.get(normalizedTitle);
        }
        
        // Try partial match - look for database entries that contain our title
        if (!artwork_url) {
          for (const [key, url] of artworkByName) {
            if (key.includes(normalizedTitle) || normalizedTitle.includes(key)) {
              artwork_url = url;
              break;
            }
          }
        }
        
        if (artwork_url) {
          matchCount++;
          return { ...track, artwork_url };
        }
        return track;
      });

      console.log(`🎨 Matched ${matchCount}/${tracks.length} tracks with artwork`);
      return enrichedTracks;

    } catch (error) {
      console.error('❌ Error enriching tracks with artwork:', error);
      return tracks;
    }
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
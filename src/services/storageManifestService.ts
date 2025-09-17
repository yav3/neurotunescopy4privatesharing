import { supabase } from '@/integrations/supabase/client';

export interface ManifestTrack {
  name: string;
  storage_key: string;
  signed_url: string;
  public_url: string;
  bucket: string;
  accessible: boolean;
  content_type?: string;
}

/**
 * Storage Manifest Service - fetches real objects from storage buckets
 * and generates working URLs, avoiding 400 errors from hardcoded filenames
 */
export class StorageManifestService {
  private static readonly audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
  private static readonly manifestCache = new Map<string, ManifestTrack[]>();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch manifest of all playable tracks from a bucket
   * Returns only objects that actually exist and are accessible
   */
  static async fetchBucketManifest(bucketName: string, prefix: string = ''): Promise<ManifestTrack[]> {
    const cacheKey = `${bucketName}:${prefix}`;
    
    // Check cache first
    if (this.manifestCache.has(cacheKey)) {
      const cached = this.manifestCache.get(cacheKey)!;
      console.log(`📋 Using cached manifest for ${bucketName} (${cached.length} tracks)`);
      return cached;
    }

    console.log(`🔍 Fetching manifest for bucket: ${bucketName}${prefix ? ` with prefix: ${prefix}` : ''}`);

    try {
      // List actual objects in the bucket
      const { data: files, error } = await supabase.storage
        .from(bucketName)
        .list(prefix, {
          limit: 1000,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) {
        console.error(`❌ Failed to list files in ${bucketName}:`, error);
        return [];
      }

      if (!files || files.length === 0) {
        console.log(`📂 No files found in bucket ${bucketName}`);
        return [];
      }

      // Filter for audio files only
      const audioFiles = files.filter(file => 
        this.audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
      );

      console.log(`🎵 Found ${audioFiles.length} audio files in ${bucketName} (${files.length} total files)`);

      // Generate URLs for each audio file
      const manifest: ManifestTrack[] = [];
      
      for (const file of audioFiles) {
        const storageKey = prefix ? `${prefix}/${file.name}` : file.name;
        
        // Generate both signed and public URLs
        const { data: signedData, error: signedError } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(storageKey, 24 * 60 * 60); // 24 hours

        const publicUrl = `https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/${bucketName}/${storageKey}`;
        
        // Prefer signed URL if available, fallback to public
        const primaryUrl = signedData?.signedUrl || publicUrl;
        
        // Test URL accessibility
        let accessible = false;
        let contentType: string | undefined;
        
        try {
          const response = await fetch(primaryUrl, { method: 'HEAD' });
          accessible = response.ok;
          contentType = response.headers.get('content-type') || undefined;
          
          if (!accessible) {
            console.warn(`❌ URL not accessible: ${file.name} (${response.status})`);
          }
        } catch (error) {
          console.warn(`❌ URL test failed: ${file.name}`, error);
          accessible = false;
        }

        manifest.push({
          name: file.name,
          storage_key: storageKey,
          signed_url: signedData?.signedUrl || '',
          public_url: publicUrl,
          bucket: bucketName,
          accessible,
          content_type: contentType
        });

        if (accessible) {
          console.log(`✅ Verified playable: ${file.name}`);
        }
      }

      // Filter to only accessible tracks
      const playableTracks = manifest.filter(track => track.accessible);
      
      console.log(`✅ Manifest complete: ${playableTracks.length}/${manifest.length} tracks are playable in ${bucketName}`);
      
      // Cache the results
      this.manifestCache.set(cacheKey, playableTracks);
      setTimeout(() => this.manifestCache.delete(cacheKey), this.CACHE_TTL);
      
      return playableTracks;

    } catch (error) {
      console.error(`❌ Error fetching manifest for ${bucketName}:`, error);
      return [];
    }
  }

  /**
   * Fetch manifests from multiple buckets and combine them
   */
  static async fetchMultipleBucketManifests(bucketNames: string[]): Promise<ManifestTrack[]> {
    console.log(`🔍 Fetching manifests from ${bucketNames.length} buckets: ${bucketNames.join(', ')}`);
    
    const manifestPromises = bucketNames.map(bucket => 
      this.fetchBucketManifest(bucket).catch(error => {
        console.error(`❌ Failed to fetch manifest for ${bucket}:`, error);
        return [];
      })
    );

    const manifests = await Promise.all(manifestPromises);
    const allTracks = manifests.flat();
    
    console.log(`✅ Combined manifest: ${allTracks.length} playable tracks from ${bucketNames.length} buckets`);
    
    return allTracks;
  }

  /**
   * Clear all cached manifests (useful for debugging or forcing refresh)
   */
  static clearCache(): void {
    this.manifestCache.clear();
    console.log('🗑️ Cleared manifest cache');
  }
}

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).StorageManifestService = StorageManifestService;
}
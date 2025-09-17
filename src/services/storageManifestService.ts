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
   * Fetch manifest of all playable tracks from a bucket using SERVICE ROLE
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

    console.log(`🔍 Fetching manifest for bucket: ${bucketName} using SERVICE ROLE${prefix ? ` with prefix: ${prefix}` : ''}`);

    try {
      // Use the storage-list edge function with SERVICE ROLE access via POST
      const { data, error } = await supabase.functions.invoke('storage-list', {
        body: {
          bucket: bucketName,
          prefix: prefix, // Empty string for root directory
          limit: 1000,
          offset: 0,
          strict: 1 // Only return .mp3 files
        }
      });

      if (error) {
        console.error(`❌ Failed to fetch from storage-list edge function:`, error);
        return [];
      }

      if (!data?.ok || !data.results) {
        console.error(`❌ Storage-list edge function returned error:`, data?.error);
        return [];
      }

      console.log(`🔑 SERVICE ROLE: Found ${data.results.length} files in ${bucketName}`);
      console.log(`📊 Stats: ${data.totals.mp3} MP3s, ${data.totals.ok} working, ${data.totals.bad} bad`);

      // Convert edge function results to ManifestTrack format
      const manifest: ManifestTrack[] = data.results
        .filter((result: any) => result.audio_ok) // Only include working audio files
        .map((result: any) => ({
          name: result.name,
          storage_key: result.storage_key,
          signed_url: result.url,
          public_url: `https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/${bucketName}/${result.storage_key}`,
          bucket: bucketName,
          accessible: result.audio_ok,
          content_type: result.content_type
        }));

      console.log(`✅ SERVICE ROLE Manifest: ${manifest.length} verified playable tracks from ${bucketName}`);
      
      // Cache the results
      this.manifestCache.set(cacheKey, manifest);
      setTimeout(() => this.manifestCache.delete(cacheKey), this.CACHE_TTL);
      
      return manifest;

    } catch (error) {
      console.error(`❌ Error fetching manifest for ${bucketName} with SERVICE ROLE:`, error);
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
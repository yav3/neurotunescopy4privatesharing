import { supabase } from '@/integrations/supabase/client';
import { SimpleCacheManager } from '@/utils/simpleCacheManager';
import { headOk } from '@/lib/stream';

export interface CachedAudioTrack {
  id: string;
  title: string;
  url: string;
  bucket: string;
  filename: string;
  verified: number; // timestamp when last verified
  genre?: string;
  goal?: string;
  // Enhanced metadata
  fileSize?: number;
  contentType?: string;
  duration?: number;
  audioFingerprint?: string; // Audio hash/checksum
  etag?: string; // File version identifier
}

export interface GenreFallbacks {
  [genreKey: string]: CachedAudioTrack[];
}

/**
 * Audio Cache Service - Pre-validates and stores working audio URLs locally
 */
export class AudioCacheService {
  private static getStorageKey(): string {
    // Make storage key user-specific to prevent session bleeding
    try {
      const supabaseAuth = JSON.parse(localStorage.getItem('sb-pbtgvcjniayedqlajjzz-auth-token') || '{}');
      const userId = supabaseAuth.user?.id;
      return userId ? `audio_cache_validated_tracks_${userId.substring(0, 8)}` : 'audio_cache_validated_tracks_anon';
    } catch {
      return 'audio_cache_validated_tracks_anon';
    }
  }
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly MAX_TRACKS_PER_GENRE = 20;
  
  private static cache = new SimpleCacheManager<GenreFallbacks>();
  
  /**
   * Get all cached validated tracks organized by genre
   */
  static getCachedTracks(): GenreFallbacks {
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      if (!stored) return {};
      
      const parsed = JSON.parse(stored);
      
      // Check if cache is still valid
      const now = Date.now();
      const validTracks: GenreFallbacks = {};
      
      for (const [genre, tracks] of Object.entries(parsed) as [string, CachedAudioTrack[]][]) {
        const validGenreTracks = tracks.filter(track => 
          now - track.verified < this.CACHE_DURATION
        );
        
        if (validGenreTracks.length > 0) {
          validTracks[genre] = validGenreTracks;
        }
      }
      
      return validTracks;
    } catch (error) {
      console.warn('Failed to load cached tracks:', error);
      return {};
    }
  }
  
  /**
   * Save validated tracks to local storage
   */
  static saveCachedTracks(tracks: GenreFallbacks): void {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(tracks));
      console.log('💾 Saved cached tracks:', Object.keys(tracks).length, 'genres');
    } catch (error) {
      console.error('Failed to save cached tracks:', error);
    }
  }
  
  /**
   * Get fallback tracks for a specific genre/goal
   */
  static getFallbackTracks(genreKey: string, goalKey?: string): CachedAudioTrack[] {
    const cached = this.getCachedTracks();
    
    // Try exact match first
    let tracks = cached[genreKey] || [];
    
    // If no tracks or goal specified, try goal-specific fallbacks
    if ((!tracks.length || goalKey) && goalKey) {
      const goalTracks = cached[`${genreKey}-${goalKey}`] || [];
      tracks = [...tracks, ...goalTracks];
    }
    
    // If still no tracks, try related genres
    if (!tracks.length) {
      const fallbackGenres = this.getRelatedGenres(genreKey);
      for (const fallback of fallbackGenres) {
        const fallbackTracks = cached[fallback] || [];
        if (fallbackTracks.length > 0) {
          tracks = fallbackTracks.slice(0, 10); // Limit fallback tracks
          console.log(`🔄 Using fallback genre "${fallback}" for "${genreKey}"`);
          break;
        }
      }
    }
    
    return tracks.slice(0, this.MAX_TRACKS_PER_GENRE);
  }
  
  /**
   * Get related genres for fallbacks
   */
  private static getRelatedGenres(genreKey: string): string[] {
    const fallbackMap: Record<string, string[]> = {
      'pop': ['energyboost', 'neuralpositivemusic'],
      // HIIT removed from fallbacks - should only use HIIT bucket
      'country': ['neuralpositivemusic', 'energyboost'],
      'classical': ['chopin', 'newageworldstressanxietyreduction'],
      'nocturnes': ['chopin'], // Nocturnes should ONLY fallback to classical Chopin music
      'pain-management': ['chopin', 'newageworldstressanxietyreduction'],
      'stress-anxiety': ['newageworldstressanxietyreduction', 'chopin'],
      'sleep': ['newageworldstressanxietyreduction', 'chopin'],
      'focus': ['chopin', 'neuralpositivemusic'], // Focus prioritizes classical before EDM
    };
    
    // Find the best match
    for (const [pattern, fallbacks] of Object.entries(fallbackMap)) {
      if (genreKey.toLowerCase().includes(pattern)) {
        return fallbacks;
      }
    }
    
    // Default fallbacks
    return ['neuralpositivemusic', 'chopin', 'newageworldstressanxietyreduction'];
  }
  
  /**
   * Scan and validate audio tracks from storage buckets
   */
  static async scanAndCacheAudioTracks(): Promise<void> {
    console.log('🔍 Starting audio cache scan...');
    
    const buckets = [
      'neuralpositivemusic',
      'chopin', 
      'newageworldstressanxietyreduction',
      'energyboost',
      'newageandworldfocus',
      'HIIT' // Added HIIT bucket for proper scanning
    ];
    
    const validatedTracks: GenreFallbacks = {};
    let totalScanned = 0;
    let totalValidated = 0;
    
    for (const bucket of buckets) {
      console.log(`📂 Scanning bucket: ${bucket}`);
      
      try {
        const { data: files, error } = await supabase.storage
          .from(bucket)
          .list('', { limit: 100 });
        
        if (error) {
          console.warn(`❌ Failed to list files in ${bucket}:`, error);
          continue;
        }
        
        if (!files || files.length === 0) {
          console.log(`📭 No files found in ${bucket}`);
          continue;
        }
        
        const audioFiles = files.filter(file => 
          file.name.toLowerCase().endsWith('.mp3') ||
          file.name.toLowerCase().endsWith('.wav') ||
          file.name.toLowerCase().endsWith('.m4a')
        );
        
        console.log(`🎵 Found ${audioFiles.length} audio files in ${bucket}`);
        
        const bucketTracks: CachedAudioTrack[] = [];
        
        // Test each audio file (limit to prevent overwhelming)
        const filesToTest = audioFiles.slice(0, this.MAX_TRACKS_PER_GENRE);
        
        for (const file of filesToTest) {
          totalScanned++;
          
          try {
            const { data } = supabase.storage
              .from(bucket)
              .getPublicUrl(file.name);
            
            const url = data.publicUrl;
            
            // Test if URL is accessible and get metadata
            const isWorking = await headOk(url, 3000);
            
            if (isWorking) {
              totalValidated++;
              
              // Get enhanced metadata
              const audioFingerprint = await this.generateAudioFingerprint(url);
              
              const track: CachedAudioTrack = {
                id: file.id || `${bucket}-${file.name}`,
                title: this.cleanTitle(file.name),
                url,
                bucket,
                filename: file.name,
                verified: Date.now(),
                genre: this.mapBucketToGenre(bucket),
                // Enhanced metadata
                fileSize: file.metadata?.size,
                contentType: file.metadata?.mimetype,
                etag: file.metadata?.eTag,
                audioFingerprint
              };
              
              bucketTracks.push(track);
              console.log(`✅ Validated: ${track.title}`);
            } else {
              console.log(`❌ Failed to validate: ${file.name}`);
            }
          } catch (error) {
            console.warn(`⚠️ Error testing ${file.name}:`, error);
          }
        }
        
        if (bucketTracks.length > 0) {
          const genreKey = this.mapBucketToGenre(bucket);
          validatedTracks[genreKey] = bucketTracks;
          
          // Also store by bucket name for direct access
          validatedTracks[bucket] = bucketTracks;
        }
        
      } catch (error) {
        console.error(`💥 Error scanning bucket ${bucket}:`, error);
      }
    }
    
    // Save the validated tracks
    this.saveCachedTracks(validatedTracks);
    
    console.log(`✨ Cache scan complete! ${totalValidated}/${totalScanned} tracks validated across ${Object.keys(validatedTracks).length} categories`);
  }
  
  /**
   * Clean filename to create a display title
   */
  private static cleanTitle(filename: string): string {
    return filename
      .replace(/\.(mp3|wav|m4a)$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  }
  
  /**
   * Map storage bucket names to genre keys
   */
  private static mapBucketToGenre(bucket: string): string {
    const mapping: Record<string, string> = {
      'neuralpositivemusic': 'positive-energy',
      'chopin': 'classical-piano',
      'newageworldstressanxietyreduction': 'stress-anxiety',
      'energyboost': 'energy-boost',
      'newageandworldfocus': 'focus-concentration'
    };
    
    return mapping[bucket] || bucket;
  }
  
  /**
   * Check if cache needs refresh
   */
  static needsRefresh(): boolean {
    const cached = this.getCachedTracks();
    const totalTracks = Object.values(cached).reduce((sum, tracks) => sum + tracks.length, 0);
    
    return totalTracks < 20; // Refresh if we have fewer than 20 total cached tracks
  }
  
  /**
   * Get cache statistics
   */
  static getCacheStats() {
    const cached = this.getCachedTracks();
    const stats = {
      totalGenres: Object.keys(cached).length,
      totalTracks: Object.values(cached).reduce((sum, tracks) => sum + tracks.length, 0),
      genres: {} as Record<string, number>
    };
    
    for (const [genre, tracks] of Object.entries(cached)) {
      stats.genres[genre] = tracks.length;
    }
    
    return stats;
  }
  
  /**
   * Generate audio fingerprint (simplified hash based on file metadata)
   */
  private static async generateAudioFingerprint(url: string): Promise<string | undefined> {
    try {
      // Create a simple fingerprint based on URL and timestamp
      // In a full implementation, this would involve audio analysis
      const response = await fetch(url, { method: 'HEAD' });
      const lastModified = response.headers.get('last-modified');
      const contentLength = response.headers.get('content-length');
      const etag = response.headers.get('etag');
      
      // Simple hash combination of metadata
      const fingerprint = btoa(`${url}-${lastModified}-${contentLength}-${etag}`).substring(0, 16);
      return fingerprint;
    } catch (error) {
      console.warn('Failed to generate audio fingerprint:', error);
      return undefined;
    }
  }
  
  /**
   * Get detailed track info by fingerprint
   */
  static getTrackByFingerprint(fingerprint: string): CachedAudioTrack | null {
    const cached = this.getCachedTracks();
    for (const tracks of Object.values(cached)) {
      const track = tracks.find(t => t.audioFingerprint === fingerprint);
      if (track) return track;
    }
    return null;
  }
  
  /**
   * Force refresh the cache
   */
  static async forceRefresh(): Promise<void> {
    localStorage.removeItem(this.getStorageKey());
    await this.scanAndCacheAudioTracks();
  }
}

// Auto-scan disabled to prevent mass HEAD requests on app load
if (typeof window !== 'undefined') {
  console.log('📦 AudioCache auto-scan disabled to prevent network spam');
}
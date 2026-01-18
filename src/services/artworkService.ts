import { supabase } from '@/integrations/supabase/client';
import { albumArtPool } from '@/utils/albumArtPool';
import { getAlbumArtworkUrl } from '@/utils/imageUtils';

// Centralized artwork service to prevent race conditions
export class ArtworkService {
  private static cache = new Map<string, string>();
  private static loadingPromises = new Map<string, Promise<string>>();
  
  // Cached list of available artwork files from the bucket
  private static availableArtwork: string[] = [];
  private static artworkListLoaded = false;
  private static artworkListLoading: Promise<void> | null = null;

  // Supported artwork file extensions (including animated formats)
  private static readonly ARTWORK_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|mp4|mov|webm)$/i;

  // Initialize artwork list from Supabase albumart bucket using direct storage API
  private static async loadAvailableArtwork(): Promise<void> {
    if (this.artworkListLoaded) return;
    
    if (this.artworkListLoading) {
      await this.artworkListLoading;
      return;
    }

    this.artworkListLoading = (async () => {
      try {
        console.log('🎨 ArtworkService: Loading available artwork from albumart bucket...');

        // Use Edge Function (service role) to bypass Storage listing RLS
        const { data, error } = await supabase.functions.invoke('storage-access', {
          body: {
            bucket: 'albumart',
            mode: 'artwork',
            recursive: true,
            limit: 2000,
          },
        });

        if (error) {
          console.warn('❌ ArtworkService: Failed to load artwork via edge function:', error.message);
          this.availableArtwork = [];
          this.artworkListLoaded = true;
          return;
        }

        const names: string[] = (data?.files || []).map((f: any) => f.name).filter(Boolean);

        if (names.length > 0) {
          this.availableArtwork = names
            .filter((name: string) => this.ARTWORK_EXTENSIONS.test(name))
            .filter((name: string) => !name.startsWith('.') && name !== '.emptyFolderPlaceholder');

          console.log(
            `✅ ArtworkService: Loaded ${this.availableArtwork.length} artwork files from albumart bucket (edge function)`,
            this.availableArtwork.slice(0, 5)
          );
        } else {
          console.log('📂 ArtworkService: No files found in albumart bucket (edge function)');
          this.availableArtwork = [];
        }

        this.artworkListLoaded = true;
      } catch (error) {
        console.error('❌ ArtworkService: Error loading artwork list:', error);
        this.availableArtwork = [];
        this.artworkListLoaded = true;
      }
    })();

    await this.artworkListLoading;
    this.artworkListLoading = null;
  }

  // Get consistent artwork for a track (prevents race conditions)
  static async getTrackArtwork(track: any): Promise<string> {
    // Ensure artwork list is loaded
    await this.loadAvailableArtwork();
    
    const cacheKey = `track:${track.id}`;
    
    // Return cached result if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Return existing loading promise to prevent duplicate requests
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)!;
    }

    // Create new loading promise
    const loadingPromise = this._loadTrackArtworkInternal(track);
    this.loadingPromises.set(cacheKey, loadingPromise);

    // Clean up promise when done
    loadingPromise.finally(() => {
      this.loadingPromises.delete(cacheKey);
    });

    return loadingPromise;
  }

  private static async _loadTrackArtworkInternal(track: any): Promise<string> {
    const cacheKey = `track:${track.id}`;
    
    try {
      console.log('🎨 Loading artwork for track:', track.id);
      
      // Use pre-loaded artwork list if available
      if (this.availableArtwork.length > 0) {
        // Use track ID for consistent selection
        const hash = Math.abs(track.id.toString().split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0));
        const chosen = this.availableArtwork[hash % this.availableArtwork.length];
        
        console.log('✅ Selected artwork file:', chosen, 'for track', track.id);
        
        const artworkUrl = getAlbumArtworkUrl(chosen);
        
        console.log('🔗 Generated artwork URL:', artworkUrl);
        
        this.cache.set(cacheKey, artworkUrl);
        return artworkUrl;
      }
      
      // Fallback: try to load artwork list now
      await this.loadAvailableArtwork();
      
      if (this.availableArtwork.length > 0) {
        const hash = Math.abs(track.id.toString().split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0));
        const chosen = this.availableArtwork[hash % this.availableArtwork.length];
        
        console.log('✅ Selected artwork file (fallback path):', chosen, 'for track', track.id);
        
        const artworkUrl = getAlbumArtworkUrl(chosen);
        
        console.log('🔗 Generated artwork URL:', artworkUrl);
        
        this.cache.set(cacheKey, artworkUrl);
        return artworkUrl;
      } else {
        console.log('📂 No files in albumart bucket, using local fallback');
      }
    } catch (error) {
      console.warn('❌ Failed to load artwork from bucket:', error);
    }

    // Fallback to local album art pool with consistent selection
    const fallbackArt = this._getLocalFallbackArt(track);
    console.log('🎭 Using fallback art:', fallbackArt, 'for track', track.id);
    this.cache.set(cacheKey, fallbackArt);
    return fallbackArt;
  }

  // Get therapeutic artwork based on frequency band (consistent algorithm)
  // This method dynamically uses whatever artwork is available in the bucket
  static getTherapeuticArtwork(frequencyBand: string, trackId: string): { url: string; gradient: string } {
    console.log('🎨 ArtworkService.getTherapeuticArtwork called:', { frequencyBand, trackId });
    
    // Trigger async loading of artwork list (won't block)
    this.loadAvailableArtwork().catch(console.error);
    
    let selectedFilename: string;
    
    // Use dynamically loaded artwork if available
    if (this.availableArtwork.length > 0) {
      // Create a deterministic hash from trackId + frequencyBand for consistent selection
      const combinedKey = `${trackId}:${frequencyBand}`;
      const hash = Math.abs(combinedKey.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
      selectedFilename = this.availableArtwork[hash % this.availableArtwork.length];
      
      console.log('🖼️ Using dynamic artwork from bucket:', selectedFilename, `(${this.availableArtwork.length} available)`);
    } else {
      // Fallback to local album art pool if bucket hasn't loaded yet
      const hash = Math.abs(`${trackId}:${frequencyBand}`.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
      const fallbackUrl = albumArtPool[hash % albumArtPool.length];
      
      console.log('🎭 Using local fallback art (bucket not loaded yet):', fallbackUrl);
      
      // Return local fallback directly with Tailwind gradient classes
      const gradients = {
        delta: 'from-blue-900/70 via-slate-800/50 to-blue-800/70',
        theta: 'from-amber-700/70 via-yellow-600/50 to-orange-700/70',
        alpha: 'from-blue-800/70 via-cyan-600/50 to-teal-700/70',
        beta: 'from-green-700/70 via-emerald-600/50 to-teal-700/70',
        gamma: 'from-yellow-600/70 via-orange-500/50 to-red-600/70',
        default: 'from-blue-800/70 via-cyan-600/50 to-teal-700/70'
      };
      
      return {
        url: fallbackUrl,
        gradient: gradients[frequencyBand as keyof typeof gradients] || gradients.default
      };
    }

    const url = getAlbumArtworkUrl(selectedFilename);
    console.log('🔗 Final artwork URL:', url);

    // Tailwind gradient classes based on frequency band for therapeutic visual cues
    const gradients = {
      delta: 'from-blue-900/70 via-slate-800/50 to-blue-800/70',
      theta: 'from-amber-700/70 via-yellow-600/50 to-orange-700/70',
      alpha: 'from-blue-800/70 via-cyan-600/50 to-teal-700/70',
      beta: 'from-green-700/70 via-emerald-600/50 to-teal-700/70',
      gamma: 'from-yellow-600/70 via-orange-500/50 to-red-600/70',
      default: 'from-blue-800/70 via-cyan-600/50 to-teal-700/70'
    };

    return {
      url,
      gradient: gradients[frequencyBand as keyof typeof gradients] || gradients.default
    };
  }

  private static _getLocalFallbackArt(track: any): string {
    // Use album art pool with consistent selection
    const hash = Math.abs(track.id.toString().split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0));
    return albumArtPool[hash % albumArtPool.length];
  }

  // Clear cache (useful for debugging)
  static clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }
  
  // Force reload artwork list from bucket
  static async reloadArtworkList(): Promise<void> {
    this.artworkListLoaded = false;
    this.availableArtwork = [];
    await this.loadAvailableArtwork();
  }

  // Preload artwork list (call early in app lifecycle)
  static preloadArtwork(): void {
    this.loadAvailableArtwork().catch(console.error);
  }

  // Force cache refresh on page load
  static {
    if (typeof window !== 'undefined') {
      this.clearCache();
      // Preload artwork list on initialization
      this.preloadArtwork();
    }
  }

  // Get cache stats for debugging
  static getCacheStats() {
    return {
      cacheSize: this.cache.size,
      loadingRequests: this.loadingPromises.size,
      availableArtwork: this.availableArtwork.length,
      artworkListLoaded: this.artworkListLoaded
    };
  }
}
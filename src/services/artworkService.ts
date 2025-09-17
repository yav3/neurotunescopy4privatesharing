import { supabase } from '@/integrations/supabase/client';
import { storageRequestManager } from '@/services/storageRequestManager';
import { albumArtPool } from '@/utils/albumArtPool';

// Centralized artwork service to prevent race conditions
export class ArtworkService {
  private static cache = new Map<string, string>();
  private static loadingPromises = new Map<string, Promise<string>>();
  
  // Therapeutic artwork mapping with consistent selection
  private static therapeuticArtwork = {
    delta: ['/lovable-uploads/sleep-artwork.jpg'],
    theta: ['/lovable-uploads/stress-anxiety-artwork.jpg'],
    alpha: ['/lovable-uploads/focus-enhancement-artwork.jpg'],
    beta: ['/lovable-uploads/mood-boost-artwork.jpg'],
    gamma: ['/lovable-uploads/energy-boost-artwork.jpg'],
    default: ['/lovable-uploads/focus-enhancement-artwork.jpg']
  };

  // Get consistent artwork for a track (prevents race conditions)
  static async getTrackArtwork(track: any): Promise<string> {
    // Prioritize track-provided artwork
    if (track?.album_art_url || track?.artwork_url) {
      return track.album_art_url || track.artwork_url;
    }

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
      // Try to load from Supabase albumart bucket (only once per track)
      const artFiles = await storageRequestManager.listStorage('albumart');
      
      if (artFiles && artFiles.length > 0) {
        // Use track ID for consistent selection
        const hash = Math.abs(track.id.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0));
        const chosen = artFiles[hash % artFiles.length];
        
        const { data: urlData } = supabase.storage.from('albumart').getPublicUrl(chosen.name);
        const artworkUrl = urlData.publicUrl;
        
        this.cache.set(cacheKey, artworkUrl);
        return artworkUrl;
      }
    } catch (error) {
      console.warn('Failed to load artwork from bucket:', error);
    }

    // Fallback to local album art pool with consistent selection
    const fallbackArt = this._getLocalFallbackArt(track);
    this.cache.set(cacheKey, fallbackArt);
    return fallbackArt;
  }

  // Get therapeutic artwork based on frequency band (consistent algorithm)
  static getTherapeuticArtwork(frequencyBand: string, trackId: string): { url: string; gradient: string } {
    const artworks = this.therapeuticArtwork[frequencyBand as keyof typeof this.therapeuticArtwork] 
      || this.therapeuticArtwork.default;
    
    // Consistent selection based on track ID
    const hash = Math.abs(trackId.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
    const selectedArtwork = artworks[hash % artworks.length];

    // Consistent gradient based on frequency band
    const gradients = {
      delta: 'linear-gradient(135deg, hsl(240 100% 20% / 0.9), hsl(240 100% 10% / 0.8))',
      theta: 'linear-gradient(135deg, hsl(280 60% 40% / 0.9), hsl(280 60% 20% / 0.8))',
      alpha: 'linear-gradient(135deg, hsl(217 91% 60% / 0.9), hsl(217 91% 25% / 0.8))',
      beta: 'linear-gradient(135deg, hsl(45 100% 60% / 0.9), hsl(45 100% 35% / 0.8))',
      gamma: 'linear-gradient(135deg, hsl(0 84% 60% / 0.9), hsl(0 84% 35% / 0.8))',
      default: 'linear-gradient(135deg, hsl(217 91% 60% / 0.9), hsl(217 91% 25% / 0.8))'
    };

    return {
      url: selectedArtwork,
      gradient: gradients[frequencyBand as keyof typeof gradients] || gradients.default
    };
  }

  private static _getLocalFallbackArt(track: any): string {
    // Use album art pool with consistent selection
    const hash = Math.abs(track.id.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0));
    return albumArtPool[hash % albumArtPool.length];
  }

  // Clear cache (useful for debugging)
  static clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  // Force cache refresh on page load
  static {
    if (typeof window !== 'undefined') {
      this.clearCache();
    }
  }

  // Get cache stats for debugging
  static getCacheStats() {
    return {
      cacheSize: this.cache.size,
      loadingRequests: this.loadingPromises.size
    };
  }
}
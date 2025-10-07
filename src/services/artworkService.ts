import { supabase } from '@/integrations/supabase/client';
import { serviceSupabase } from '@/integrations/supabase/service-client';
import { storageRequestManager } from '@/services/storageRequestManager';
import { albumArtPool } from '@/utils/albumArtPool';
import { getAlbumArtworkUrl } from '@/utils/imageUtils';

// Centralized artwork service to prevent race conditions
export class ArtworkService {
  private static cache = new Map<string, string>();
  private static loadingPromises = new Map<string, Promise<string>>();
  
  // Therapeutic artwork mapping with GIF files from Supabase albumart bucket
  private static therapeuticArtwork = {
    delta: [
      'Fluid_Abstract_Slowed.gif',
      '20251001_1251_New Video_simple_compose_01k6gayr31fn8t7h8g322kf79q.gif'
    ],
    theta: [
      '20251001_1251_New Video_simple_compose_01k6gayr31fn8t7h8g322kf79q (2).gif',
      '20251002_1414_New Video_simple_compose_01k6k239sbf0nsqdrhaq80hm8s.gif'
    ],
    alpha: [
      '20251002_1413_Remix Video_remix_01k6k21x3aedwscmtkkjp6h0mw (1).gif',
      '20251002_1413_Remix Video_remix_01k6k21rn8f0vsngkhek65sawk (1).gif'
    ],
    beta: [
      '20251002_1414_New Video_simple_compose_01k6k23x45efrv5azcjsyxws71.gif',
      '20251002_1408_New Video_simple_compose_01k6k1rk2hfkass71h90rb48n9 (1).gif'
    ],
    gamma: [
      '20250914_1227_Serene Coastal Beauty_simple_compose_01k54gv56revhs6btr2h7abneb.gif',
      '20251003_1533_New Video_simple_compose_01k6ns06m4eh0apvaqarecnjn9.gif'
    ],
    default: [
      'Fluid_Abstract_Slowed.gif',
      '20251002_1413_Remix Video_remix_01k6k2110eee7bvrh2r0nz06pq (1).gif'
    ]
  };

  // Get consistent artwork for a track (prevents race conditions)
  static async getTrackArtwork(track: any): Promise<string> {
    // Skip database-stored artwork URLs since they might point to deleted files
    // Always use consistent fallback system instead
    
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
      
      // Clear storage cache to force fresh request
      storageRequestManager.clearCache('albumart');
      
      // Try to load from Supabase albumart bucket (only once per track)
      const artFiles = await storageRequestManager.listStorage('albumart');
      
      console.log('🖼️ Found albumart files:', artFiles?.length || 0, artFiles);
      
      if (artFiles && artFiles.length > 0) {
        // Use track ID for consistent selection
        const hash = Math.abs(track.id.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0));
        const chosen = artFiles[hash % artFiles.length];
        
        console.log('✅ Selected artwork file:', chosen.name, 'for track', track.id);
        
        const { data: urlData } = serviceSupabase.storage.from('albumart').getPublicUrl(chosen.name);
        const artworkUrl = urlData.publicUrl;
        
        console.log('🔗 Generated artwork URL:', artworkUrl);
        
        this.cache.set(cacheKey, artworkUrl);
        return artworkUrl;
      } else {
        console.log('📂 No files in albumart bucket, using fallback');
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
  static getTherapeuticArtwork(frequencyBand: string, trackId: string): { url: string; gradient: string } {
    console.log('🎨 ArtworkService.getTherapeuticArtwork called:', { frequencyBand, trackId });
    
    const artworks = this.therapeuticArtwork[frequencyBand as keyof typeof this.therapeuticArtwork] 
      || this.therapeuticArtwork.default;
    
    console.log('🖼️ Available artworks for', frequencyBand, ':', artworks);
    
    // Consistent selection based on track ID
    const hash = Math.abs(trackId.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
    const selectedFilename = artworks[hash % artworks.length];

    console.log('🎯 Selected filename:', selectedFilename, 'for trackId:', trackId);

    const url = getAlbumArtworkUrl(selectedFilename);
    console.log('🔗 Final artwork URL:', url);

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
      url,
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
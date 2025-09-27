import { supabase } from '@/integrations/supabase/client';
import { serviceSupabase } from '@/integrations/supabase/service-client';
import { storageRequestManager } from '@/services/storageRequestManager';
import { albumArtPool } from '@/utils/albumArtPool';
import { getAlbumArtworkUrl } from '@/utils/imageUtils';

// Centralized artwork service to prevent race conditions
export class ArtworkService {
  private static cache = new Map<string, string>();
  private static loadingPromises = new Map<string, Promise<string>>();
  
  // Therapeutic artwork mapping with consistent selection using actual albumart files
  private static therapeuticArtwork = {
    delta: [
      '0376232F-FE92-48B6-A567-7C41465B4FC9.jpeg',
      '0567F220-7680-45A5-8A8F-2FBECEB7897A.png'
    ],
    theta: [
      '060CF7F4-0364-413A-B67C-918425A65E00.png',
      '0952E3E2-B28A-40C3-A8FC-8DF06B1FEE8C.png'
    ],
    alpha: [
      '1C6EE324-F72C-4A71-B3FF-D95CAA0213AA.png',
      '20250923_1807_Raindrops on Flowers_remix_01k5w9sreqfr09xb2z6weqharz.png'
    ],
    beta: [
      '23BBBDD8-DEFE-4E5E-ACE8-3AD7236A8DB4.png',
      '2ACA42CF-B561-4B75-9791-6CBCFA027324.png'
    ],
    gamma: [
      '4908E73D-F244-481F-AF7D-07C2B940A896.png',
      '4FAB6938-003B-495E-8F76-E023ECFE3FED.png'
    ],
    default: [
      '5117186C-B343-411F-B723-7D81AE9CFCFC.png',
      '6B3C9F3D-1E42-4DCB-8842-6A839A0D1522.png'
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
    const artworks = this.therapeuticArtwork[frequencyBand as keyof typeof this.therapeuticArtwork] 
      || this.therapeuticArtwork.default;
    
    // Consistent selection based on track ID
    const hash = Math.abs(trackId.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
    const selectedFilename = artworks[hash % artworks.length];

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
      url: getAlbumArtworkUrl(selectedFilename),
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
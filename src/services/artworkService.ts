import { supabase } from '@/integrations/supabase/client';
import { serviceSupabase } from '@/integrations/supabase/service-client';
import { storageRequestManager } from '@/services/storageRequestManager';
import { albumArtPool } from '@/utils/albumArtPool';
import { getAlbumArtworkUrl } from '@/utils/imageUtils';

// Import local artwork assets
import moodBoostArtwork from "@/assets/mood-boost-artwork.jpg";
import focusArtwork from "@/assets/focus-enhancement-artwork.jpg";
import stressAnxietyArtwork from "@/assets/stress-anxiety-artwork.jpg";
import sleepArtwork from "@/assets/sleep-artwork.jpg";
import painSupportArtwork from "@/assets/pain-support-artwork.jpg";
import crossoverClassicalArt from '@/assets/crossover-classical-artwork.jpg';
import acousticArtwork from "@/assets/acoustic-artwork.jpg";
import energyBoostArtwork from "@/assets/energy-boost-artwork.jpg";

// Centralized artwork service to prevent race conditions
export class ArtworkService {
  private static cache = new Map<string, string>();
  private static loadingPromises = new Map<string, Promise<string>>();
  
  // Therapeutic artwork mapping with local assets
  private static therapeuticArtwork = {
    delta: [sleepArtwork, stressAnxietyArtwork],
    theta: [stressAnxietyArtwork, painSupportArtwork],
    alpha: [focusArtwork, acousticArtwork],
    beta: [energyBoostArtwork, moodBoostArtwork],
    gamma: [energyBoostArtwork, crossoverClassicalArt],
    default: [focusArtwork, acousticArtwork]
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
    const url = artworks[hash % artworks.length];

    console.log('🎯 Selected artwork:', url, 'for trackId:', trackId);

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
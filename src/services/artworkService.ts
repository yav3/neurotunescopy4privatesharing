import { supabase } from '@/integrations/supabase/client';

interface ArtworkItem {
  url: string;
  type: 'image' | 'video';
  label: string;
}

// Centralized artwork service - uses only database artwork, no local fallbacks
export class ArtworkService {
  private static cache = new Map<string, ArtworkItem>();
  private static availableArtwork: ArtworkItem[] = [];
  private static artworkListLoaded = false;
  private static artworkListLoading: Promise<void> | null = null;

  // Load artwork list from animated_artworks table
  private static async loadAvailableArtwork(): Promise<void> {
    if (this.artworkListLoaded) return;
    
    if (this.artworkListLoading) {
      await this.artworkListLoading;
      return;
    }

    this.artworkListLoading = (async () => {
      try {
        console.log('🎨 ArtworkService: Loading artwork from animated_artworks table...');

        const { data: artworks, error } = await supabase
          .from('animated_artworks')
          .select('artwork_url, artwork_type, artwork_semantic_label')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) {
          console.warn('❌ ArtworkService: Failed to load artwork:', error.message);
          this.artworkListLoaded = true;
          return;
        }

        if (artworks && artworks.length > 0) {
          this.availableArtwork = artworks
            .filter(a => a.artwork_url)
            .map(a => ({
              url: a.artwork_url!,
              type: a.artwork_type === 'mp4' || a.artwork_type === 'video' ? 'video' : 'image',
              label: a.artwork_semantic_label || 'Artwork'
            }));

          console.log(`✅ ArtworkService: Loaded ${this.availableArtwork.length} artworks`);
        } else {
          console.log('📂 ArtworkService: No active artworks found');
        }

        this.artworkListLoaded = true;
      } catch (error) {
        console.error('❌ ArtworkService: Error loading artwork:', error);
        this.artworkListLoaded = true;
      }
    })();

    await this.artworkListLoading;
    this.artworkListLoading = null;
  }

  // Get artwork for a track - uses database artwork only
  static getArtworkForTrack(trackId: string): ArtworkItem | null {
    // Trigger async loading
    this.loadAvailableArtwork().catch(console.error);
    
    // Check cache first
    const cacheKey = `track:${trackId}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    // Use available artwork with consistent selection based on track ID
    if (this.availableArtwork.length > 0) {
      const hash = Math.abs(trackId.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
      const artwork = this.availableArtwork[hash % this.availableArtwork.length];
      this.cache.set(cacheKey, artwork);
      return artwork;
    }
    
    // No artwork available yet
    return null;
  }

  // Get therapeutic artwork based on frequency band and track ID
  static getTherapeuticArtwork(frequencyBand: string, trackId: string): { url: string | null; gradient: string; type: 'image' | 'video' | null } {
    // Trigger async loading
    this.loadAvailableArtwork().catch(console.error);
    
    // Tailwind gradient classes based on frequency band
    const gradients: Record<string, string> = {
      delta: 'from-blue-900/70 via-slate-800/50 to-blue-800/70',
      theta: 'from-amber-700/70 via-yellow-600/50 to-orange-700/70',
      alpha: 'from-blue-800/70 via-cyan-600/50 to-teal-700/70',
      beta: 'from-green-700/70 via-emerald-600/50 to-teal-700/70',
      gamma: 'from-yellow-600/70 via-orange-500/50 to-red-600/70',
      default: 'from-blue-800/70 via-cyan-600/50 to-teal-700/70'
    };
    
    const gradient = gradients[frequencyBand] || gradients.default;
    
    // Use available artwork with consistent selection
    if (this.availableArtwork.length > 0) {
      const combinedKey = `${trackId}:${frequencyBand}`;
      const hash = Math.abs(combinedKey.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
      const artwork = this.availableArtwork[hash % this.availableArtwork.length];
      
      return {
        url: artwork.url,
        gradient,
        type: artwork.type
      };
    }
    
    // No artwork loaded yet - return null, UI should handle this
    return { url: null, gradient, type: null };
  }

  // Check if artwork is loaded
  static isLoaded(): boolean {
    return this.artworkListLoaded && this.availableArtwork.length > 0;
  }

  // Get artwork count
  static getArtworkCount(): number {
    return this.availableArtwork.length;
  }

  // Force reload artwork from database
  static async reloadArtwork(): Promise<void> {
    this.artworkListLoaded = false;
    this.availableArtwork = [];
    this.cache.clear();
    await this.loadAvailableArtwork();
  }

  // Preload artwork on app start
  static preloadArtwork(): void {
    this.loadAvailableArtwork().catch(console.error);
  }

  // Initialize on module load
  static {
    if (typeof window !== 'undefined') {
      this.preloadArtwork();
    }
  }
}

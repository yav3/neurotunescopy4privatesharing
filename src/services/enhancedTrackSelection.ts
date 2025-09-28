import { UserFavoritesService } from '@/services/userFavorites';
import { SimpleStorageService } from '@/services/simpleStorageService';
import type { Track } from '@/services/therapeuticDatabase';

interface EnhancedTrack extends Track {
  variety_score?: number;
  is_favorite?: boolean;
  last_played?: string;
}

// Track recently played tracks per user to avoid repetition
const recentlyPlayed = new Map<string, Set<string>>();
const RECENT_TRACKS_LIMIT = 50; // Remember last 50 tracks per user

export class EnhancedTrackSelectionService {
  
  /**
   * Get diverse tracks with user favorites mixed in
   */
  static async getEnhancedTracks(
    goal: string,
    count: number = 50,
    userId?: string
  ): Promise<Track[]> {
    console.log(`🎯 Enhanced track selection for goal: ${goal}, count: ${count}, user: ${userId?.substring(0, 8)}...`);
    
    try {
      // Get base tracks from category
      const baseTracks = await SimpleStorageService.getTracksFromCategory(goal, count * 2); // Get more for variety
      
      // Get user favorites if authenticated
      let favorites: any[] = [];
      if (userId) {
        try {
          favorites = await UserFavoritesService.getUserFavorites();
          console.log(`🤍 Found ${favorites.length} user favorites`);
        } catch (error) {
          console.warn('Could not load user favorites:', error);
        }
      }
      
      // Enhance tracks with variety scores and favorite flags
      const enhancedTracks = await this.enhanceTracksWithVariety(baseTracks, favorites);
      
      // Apply anti-repetition filter
      const filteredTracks = this.filterRecentlyPlayed(enhancedTracks, userId);
      
      // Create diverse selection
      const selectedTracks = this.createDiverseSelection(filteredTracks, favorites, count);
      
      // Update recently played list
      if (userId) {
        this.updateRecentlyPlayed(userId, selectedTracks);
      }
      
      console.log(`✅ Selected ${selectedTracks.length} diverse tracks with ${selectedTracks.filter(t => (t as EnhancedTrack).is_favorite).length} favorites`);
      
      return selectedTracks;
      
    } catch (error) {
      console.error('❌ Error in enhanced track selection:', error);
      // Fallback to simple selection
      return SimpleStorageService.getTracksFromCategory(goal, count);
    }
  }
  
  /**
   * Enhance tracks with variety scores based on audio features
   */
  private static async enhanceTracksWithVariety(
    tracks: Track[],
    favorites: any[]
  ): Promise<EnhancedTrack[]> {
    const favoriteTrackIds = new Set(favorites.map(f => f.track_id));
    
    return tracks.map(track => {
      const enhanced: EnhancedTrack = {
        ...track,
        is_favorite: favoriteTrackIds.has(track.id),
        variety_score: this.calculateVarietyScore(track)
      };
      
      return enhanced;
    });
  }
  
  /**
   * Calculate variety score based on audio features
   */
  private static calculateVarietyScore(track: Track): number {
    let score = Math.random(); // Base randomness
    
    // Boost score for variety in BPM ranges
    if (track.bpm) {
      if (track.bpm < 80 || track.bpm > 140) score += 0.2; // Unusual tempos get variety boost
    }
    
    // Boost score for variety in energy levels
    if (track.energy_level) {
      if (track.energy_level < 3 || track.energy_level > 7) score += 0.2; // Extreme energy gets variety boost
    }
    
    // Boost score for tracks with unique characteristics
    if (track.camelot_key) score += 0.1; // Harmonic information adds variety
    if (track.valence && (track.valence < 0.3 || track.valence > 0.8)) score += 0.1; // Extreme moods
    
    return Math.min(score, 1); // Cap at 1.0
  }
  
  /**
   * Filter out recently played tracks to avoid repetition
   */
  private static filterRecentlyPlayed(tracks: EnhancedTrack[], userId?: string): EnhancedTrack[] {
    if (!userId) return tracks;
    
    const recentTracks = recentlyPlayed.get(userId) || new Set();
    
    // Always include favorites even if recently played
    const filtered = tracks.filter(track => 
      track.is_favorite || !recentTracks.has(track.id)
    );
    
    console.log(`🔄 Filtered ${tracks.length - filtered.length} recently played tracks (keeping ${tracks.filter(t => t.is_favorite).length} favorites)`);
    
    return filtered.length > 0 ? filtered : tracks; // Fallback to all tracks if too many filtered
  }
  
  /**
   * Create diverse selection with favorites mixed in
   */
  private static createDiverseSelection(
    tracks: EnhancedTrack[],
    favorites: any[],
    count: number
  ): Track[] {
    const favoriteCount = Math.min(Math.ceil(count * 0.3), favorites.length); // 30% favorites
    const varietyCount = count - favoriteCount;
    
    // Sort by variety score for non-favorites
    const nonFavorites = tracks.filter(t => !t.is_favorite);
    const favoritesTracks = tracks.filter(t => t.is_favorite);
    
    // Select high-variety non-favorites
    const selectedNonFavorites = nonFavorites
      .sort((a, b) => (b.variety_score || 0) - (a.variety_score || 0))
      .slice(0, varietyCount);
    
    // Select favorites
    const selectedFavorites = favoritesTracks
      .sort(() => Math.random() - 0.5) // Randomize favorites
      .slice(0, favoriteCount);
    
    // Combine and shuffle
    const finalSelection = [...selectedNonFavorites, ...selectedFavorites]
      .sort(() => Math.random() - 0.5);
    
    console.log(`🎵 Final selection: ${selectedNonFavorites.length} variety tracks + ${selectedFavorites.length} favorites`);
    
    return finalSelection;
  }
  
  /**
   * Update recently played tracks for user
   */
  private static updateRecentlyPlayed(userId: string, tracks: Track[]): void {
    if (!recentlyPlayed.has(userId)) {
      recentlyPlayed.set(userId, new Set());
    }
    
    const userRecent = recentlyPlayed.get(userId)!;
    
    // Add new tracks
    tracks.forEach(track => userRecent.add(track.id));
    
    // Keep only recent tracks (prevent memory bloat)
    if (userRecent.size > RECENT_TRACKS_LIMIT) {
      const trackArray = Array.from(userRecent);
      const toKeep = trackArray.slice(-RECENT_TRACKS_LIMIT);
      recentlyPlayed.set(userId, new Set(toKeep));
    }
    
    console.log(`📝 Updated recently played: ${userRecent.size} tracks for user ${userId.substring(0, 8)}...`);
  }
  
  /**
   * Clear recently played tracks for user (for testing or reset)
   */
  static clearRecentlyPlayed(userId: string): void {
    recentlyPlayed.delete(userId);
    console.log(`🗑️ Cleared recently played tracks for user ${userId.substring(0, 8)}...`);
  }
}

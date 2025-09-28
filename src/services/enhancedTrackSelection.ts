import { UserFavoritesService } from '@/services/userFavorites';
import { SimpleStorageService } from '@/services/simpleStorageService';
import { MusicalSimilarityService } from '@/services/musicalSimilarityDetection';
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
    
    // Filter by recently played AND musical similarity
    const filtered = tracks.filter(track => {
      // Always include favorites even if recently played (but check similarity)
      if (track.is_favorite) {
        return !MusicalSimilarityService.isTooSimilar(track, userId, 0.8); // Stricter threshold for favorites
      }
      
      // For non-favorites, check both recently played and similarity
      return !recentTracks.has(track.id) && !MusicalSimilarityService.isTooSimilar(track, userId, 0.7);
    });
    
    console.log(`🔄 Filtered ${tracks.length - filtered.length} tracks: ${tracks.length - filtered.length - (tracks.filter(t => !recentTracks.has(t.id)).length - filtered.length)} for similarity, rest for recency`);
    
    return filtered.length > 0 ? filtered : tracks.slice(0, Math.ceil(tracks.length * 0.3)); // Fallback to 30% if too aggressive
  }
  
  /**
   * Create diverse selection with strategic spacing to avoid back-to-back similar tracks
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
    
    // Combine tracks and strategically space them to avoid similar tracks back-to-back
    const allTracks = [...selectedNonFavorites, ...selectedFavorites];
    const spacedTracks = this.createOptimalSpacing(allTracks);
    
    console.log(`🎵 Final selection: ${selectedNonFavorites.length} variety tracks + ${selectedFavorites.length} favorites with optimal spacing`);
    
    return spacedTracks;
  }

  /**
   * Create optimal spacing between similar tracks to avoid back-to-back remixes
   */
  private static createOptimalSpacing(tracks: Track[]): Track[] {
    if (tracks.length <= 2) return tracks;

    const result: Track[] = [];
    const remaining = [...tracks];
    
    // Start with a random track
    const firstIndex = Math.floor(Math.random() * remaining.length);
    result.push(remaining.splice(firstIndex, 1)[0]);
    
    // For each subsequent position, find the track that's least similar to recent tracks
    while (remaining.length > 0) {
      let bestTrack: Track | null = null;
      let bestIndex = -1;
      let lowestSimilarity = Infinity;
      
      for (let i = 0; i < remaining.length; i++) {
        const candidate = remaining[i];
        
        // Check similarity to last 3 tracks (or all if fewer)
        const recentTracks = result.slice(-3);
        let maxSimilarity = 0;
        
        for (const recentTrack of recentTracks) {
          const similarity = this.calculateTrackSimilarity(candidate, recentTrack);
          maxSimilarity = Math.max(maxSimilarity, similarity);
        }
        
        // Add variety bonus based on position (encourage different types throughout)
        const positionVariety = this.calculatePositionVariety(candidate, result);
        const adjustedSimilarity = maxSimilarity - (positionVariety * 0.2);
        
        if (adjustedSimilarity < lowestSimilarity) {
          lowestSimilarity = adjustedSimilarity;
          bestTrack = candidate;
          bestIndex = i;
        }
      }
      
      if (bestTrack && bestIndex >= 0) {
        result.push(bestTrack);
        remaining.splice(bestIndex, 1);
      }
    }
    
    console.log(`🎼 Applied optimal spacing to ${result.length} tracks`);
    return result;
  }

  /**
   * Calculate similarity between two tracks for spacing purposes
   */
  private static calculateTrackSimilarity(track1: Track, track2: Track): number {
    let similarity = 0;
    let factors = 0;

    // Title similarity (catch remixes, edits, versions)
    const title1Words = this.extractMeaningfulWords(track1.title);
    const title2Words = this.extractMeaningfulWords(track2.title);
    const intersection = title1Words.filter(word => title2Words.includes(word));
    
    if (title1Words.length > 0 && title2Words.length > 0) {
      const titleSimilarity = intersection.length / Math.max(title1Words.length, title2Words.length);
      similarity += titleSimilarity * 0.7; // High weight for title similarity
      factors++;
    }

    // BPM similarity
    if (track1.bpm && track2.bpm) {
      const bpmDiff = Math.abs(track1.bpm - track2.bpm);
      const bpmSimilarity = Math.max(0, 1 - (bpmDiff / 30)); // Similar if within 30 BPM
      similarity += bpmSimilarity * 0.2;
      factors++;
    }

    // Energy similarity
    if (track1.energy_level && track2.energy_level) {
      const energyDiff = Math.abs(track1.energy_level - track2.energy_level);
      const energySimilarity = Math.max(0, 1 - (energyDiff / 4)); // Similar if within 4 energy levels
      similarity += energySimilarity * 0.1;
      factors++;
    }

    return factors > 0 ? similarity / factors : 0;
  }

  /**
   * Calculate variety bonus based on track position and playlist diversity
   */
  private static calculatePositionVariety(candidate: Track, existingTracks: Track[]): number {
    if (existingTracks.length === 0) return 0;

    let varietyScore = 0;

    // Energy level variety
    const recentEnergies = existingTracks.slice(-5).map(t => t.energy_level).filter(Boolean);
    if (candidate.energy_level && recentEnergies.length > 0) {
      const avgRecentEnergy = recentEnergies.reduce((a, b) => a + b, 0) / recentEnergies.length;
      const energyDiff = Math.abs(candidate.energy_level - avgRecentEnergy);
      varietyScore += energyDiff / 10; // Normalize energy difference
    }

    // BPM variety
    const recentBPMs = existingTracks.slice(-5).map(t => t.bpm).filter(Boolean);
    if (candidate.bpm && recentBPMs.length > 0) {
      const avgRecentBPM = recentBPMs.reduce((a, b) => a + b, 0) / recentBPMs.length;
      const bpmDiff = Math.abs(candidate.bpm - avgRecentBPM);
      varietyScore += bpmDiff / 50; // Normalize BPM difference
    }

    return Math.min(varietyScore, 1); // Cap at 1
  }

  /**
   * Extract meaningful words from track title for similarity comparison
   */
  private static extractMeaningfulWords(title: string): string[] {
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'against', 'within', 'without', 'throughout', 'towards', 'upon', 'concerning']);
    
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.has(word));
  }
  
  /**
   * Update recently played tracks for user
   */
  private static updateRecentlyPlayed(userId: string, tracks: Track[]): void {
    if (!recentlyPlayed.has(userId)) {
      recentlyPlayed.set(userId, new Set());
    }
    
    const userRecent = recentlyPlayed.get(userId)!;
    
    // Add new tracks to both recency and musical similarity tracking
    tracks.forEach(track => {
      userRecent.add(track.id);
      MusicalSimilarityService.addToHistory(track, userId);
    });
    
    // Keep only recent tracks (prevent memory bloat)
    if (userRecent.size > RECENT_TRACKS_LIMIT) {
      const trackArray = Array.from(userRecent);
      const toKeep = trackArray.slice(-RECENT_TRACKS_LIMIT);
      recentlyPlayed.set(userId, new Set(toKeep));
    }
    
    console.log(`📝 Updated tracking: ${userRecent.size} recent tracks, musical similarity for user ${userId.substring(0, 8)}...`);
  }
  
  /**
   * Clear recently played tracks for user (for testing or reset)
   */
  static clearRecentlyPlayed(userId: string): void {
    recentlyPlayed.delete(userId);
    MusicalSimilarityService.clearHistory(userId);
    console.log(`🗑️ Cleared recently played tracks and musical history for user ${userId.substring(0, 8)}...`);
  }
  
  /**
   * Get debugging information for track selection
   */
  static getDebugInfo(userId: string): any {
    const userRecent = recentlyPlayed.get(userId) || new Set();
    return {
      recentlyPlayed: Array.from(userRecent),
      musicalSimilarity: MusicalSimilarityService.getSimilarityReport(userId)
    };
  }
}

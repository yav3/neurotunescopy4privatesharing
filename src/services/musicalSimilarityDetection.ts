import type { Track } from '@/services/therapeuticDatabase';

interface MusicalFingerprint {
  trackId: string;
  title: string;
  titleWords: Set<string>;
  bpm?: number;
  energy?: number;
  key?: string;
  similarityScore?: number;
}

// Track musical fingerprints to detect similar melodies/motifs
const recentFingerprints = new Map<string, MusicalFingerprint[]>();
const FINGERPRINT_HISTORY_LIMIT = 20; // Remember last 20 tracks per user

export class MusicalSimilarityService {
  
  /**
   * Check if a track is too similar to recently played tracks
   */
  static isTooSimilar(track: Track, userId?: string, threshold: number = 0.7): boolean {
    if (!userId) return false;
    
    const userHistory = recentFingerprints.get(userId) || [];
    if (userHistory.length === 0) return false;
    
    const currentFingerprint = this.createFingerprint(track);
    
    for (const historyItem of userHistory) {
      const similarity = this.calculateSimilarity(currentFingerprint, historyItem);
      if (similarity >= threshold) {
        console.log(`🎵 High similarity detected: ${track.title} vs ${historyItem.title} (${Math.round(similarity * 100)}%)`);
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Add track to user's musical history
   */
  static addToHistory(track: Track, userId?: string): void {
    if (!userId) return;
    
    const fingerprint = this.createFingerprint(track);
    
    if (!recentFingerprints.has(userId)) {
      recentFingerprints.set(userId, []);
    }
    
    const userHistory = recentFingerprints.get(userId)!;
    userHistory.push(fingerprint);
    
    // Keep only recent history
    if (userHistory.length > FINGERPRINT_HISTORY_LIMIT) {
      userHistory.shift();
    }
    
    console.log(`🎵 Added musical fingerprint for ${track.title} (history size: ${userHistory.length})`);
  }
  
  /**
   * Create musical fingerprint for a track
   */
  private static createFingerprint(track: Track): MusicalFingerprint {
    // Extract meaningful words from title (remove common words)
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'against', 'within', 'without', 'throughout', 'towards', 'upon', 'concerning', 'remix', 'version', 'edit', 'mix', 'remaster']);
    
    const titleWords = new Set(
      track.title
        .toLowerCase()
        .replace(/[^\\w\\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !commonWords.has(word))
    );
    
    return {
      trackId: track.id,
      title: track.title,
      titleWords,
      bpm: track.bpm || track.bpm_est,
      energy: track.energy_level || track.energy,
      key: track.camelot_key
    };
  }
  
  /**
   * Calculate similarity between two musical fingerprints
   */
  private static calculateSimilarity(fp1: MusicalFingerprint, fp2: MusicalFingerprint): number {
    let score = 0;
    let factors = 0;
    
    // Title word similarity (most important for detecting same melody with different titles)
    const intersection = new Set([...fp1.titleWords].filter(word => fp2.titleWords.has(word)));
    const union = new Set([...fp1.titleWords, ...fp2.titleWords]);
    
    if (union.size > 0) {
      const titleSimilarity = intersection.size / union.size;
      score += titleSimilarity * 0.6; // 60% weight for title similarity
      factors++;
      
      // If we have very high title similarity, it's likely the same melody
      if (titleSimilarity > 0.5) {
        score += 0.3; // Bonus for high word overlap
      }
    }
    
    // BPM similarity
    if (fp1.bpm && fp2.bpm) {
      const bpmDiff = Math.abs(fp1.bpm - fp2.bpm);
      const bpmSimilarity = Math.max(0, 1 - (bpmDiff / 20)); // Similar if within 20 BPM
      score += bpmSimilarity * 0.2; // 20% weight
      factors++;
    }
    
    // Energy similarity
    if (fp1.energy && fp2.energy) {
      const energyDiff = Math.abs(fp1.energy - fp2.energy);
      const energySimilarity = Math.max(0, 1 - (energyDiff / 5)); // Similar if within 5 energy levels
      score += energySimilarity * 0.1; // 10% weight
      factors++;
    }
    
    // Key similarity
    if (fp1.key && fp2.key) {
      const keySimilarity = fp1.key === fp2.key ? 1 : 0;
      score += keySimilarity * 0.1; // 10% weight
      factors++;
    }
    
    return factors > 0 ? score / factors : 0;
  }
  
  /**
   * Clear musical history for user (for testing or reset)
   */
  static clearHistory(userId: string): void {
    recentFingerprints.delete(userId);
    console.log(`🗑️ Cleared musical history for user ${userId.substring(0, 8)}...`);
  }
  
  /**
   * Get similarity report for debugging
   */
  static getSimilarityReport(userId: string): any {
    const userHistory = recentFingerprints.get(userId) || [];
    return {
      historySize: userHistory.length,
      recentTracks: userHistory.slice(-5).map(fp => ({
        title: fp.title,
        words: Array.from(fp.titleWords),
        bpm: fp.bpm,
        energy: fp.energy
      }))
    };
  }
}

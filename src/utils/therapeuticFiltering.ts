import { GoalSlug } from '@/domain/goals';

// VAD Therapeutic Engine - Precise BPM targeting for psychological states
const THERAPEUTIC_BPM_RANGES = {
  "focus-enhancement": { min: 78, max: 100, optimal: 85 },
  "anxiety-relief": { min: 40, max: 80, optimal: 60 },
  "stress-reduction": { min: 40, max: 80, optimal: 65 },
  "sleep-preparation": { min: 40, max: 60, optimal: 45 },
  "mood-boost": { min: 90, max: 140, optimal: 120 },
  "meditation-support": { min: 50, max: 75, optimal: 60 },
} as const;

// VAD (Valence-Arousal-Dominance) psychological profiling
interface VADProfile {
  valence: number; // Emotional positivity (-1 to 1)
  arousal: number; // Energy/activation (-1 to 1) 
  dominance: number; // Control/power (-1 to 1)
}

const GOAL_VAD_PROFILES: Record<GoalSlug, VADProfile> = {
  "focus-enhancement": { valence: 0.2, arousal: 0.6, dominance: 0.8 },
  "anxiety-relief": { valence: 0.3, arousal: -0.4, dominance: -0.2 },
  "stress-reduction": { valence: 0.4, arousal: -0.3, dominance: 0.1 },
  "sleep-preparation": { valence: 0.1, arousal: -0.8, dominance: -0.6 },
  "mood-boost": { valence: 0.8, arousal: 0.7, dominance: 0.5 },
  "meditation-support": { valence: 0.2, arousal: -0.2, dominance: 0.3 },
};

interface TherapeuticTrack {
  id: number;
  bpm?: number;
  valence?: number;
  energy_level?: number;
  musical_key_est?: string;
  camelot?: string;
}

/**
 * Enhanced therapeutic filtering using VAD engine and BPM targeting
 */
export function filterTracksForGoal(tracks: TherapeuticTrack[], goal: GoalSlug): TherapeuticTrack[] {
  const bpmRange = THERAPEUTIC_BPM_RANGES[goal];
  const vadProfile = GOAL_VAD_PROFILES[goal];
  
  return tracks.filter(track => {
    // Primary filter: BPM therapeutic range
    if (!track.bpm || track.bpm < bpmRange.min || track.bpm > bpmRange.max) {
      return false;
    }
    
    // Secondary filter: VAD psychological compatibility
    if (track.valence !== undefined && track.energy_level !== undefined) {
      const valenceMatch = Math.abs((track.valence - 0.5) * 2 - vadProfile.valence) < 0.6;
      const arousalMatch = Math.abs((track.energy_level - 0.5) * 2 - vadProfile.arousal) < 0.6;
      
      if (!valenceMatch || !arousalMatch) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Get therapeutic effectiveness score for a track and goal
 */
export function getTherapeuticScore(track: TherapeuticTrack, goal: GoalSlug): number {
  const bpmRange = THERAPEUTIC_BPM_RANGES[goal];
  const vadProfile = GOAL_VAD_PROFILES[goal];
  
  let score = 0;
  
  // BPM score (0-40 points)
  if (track.bpm) {
    const bpmDistance = Math.abs(track.bpm - bpmRange.optimal);
    const maxDistance = Math.max(bpmRange.optimal - bpmRange.min, bpmRange.max - bpmRange.optimal);
    score += Math.max(0, 40 - (bpmDistance / maxDistance) * 40);
  }
  
  // VAD score (0-40 points)
  if (track.valence !== undefined && track.energy_level !== undefined) {
    const trackValence = (track.valence - 0.5) * 2;
    const trackArousal = (track.energy_level - 0.5) * 2;
    
    const valenceScore = Math.max(0, 20 - Math.abs(trackValence - vadProfile.valence) * 20);
    const arousalScore = Math.max(0, 20 - Math.abs(trackArousal - vadProfile.arousal) * 20);
    
    score += valenceScore + arousalScore;
  }
  
  // Harmonic compatibility (0-20 points)
  if (track.camelot) {
    // Basic harmonic bonus for having key information
    score += 10;
  }
  
  return Math.round(score);
}

/**
 * Sort tracks by therapeutic effectiveness for a goal
 */
export function sortByTherapeuticEffectiveness(tracks: TherapeuticTrack[], goal: GoalSlug): TherapeuticTrack[] {
  return [...tracks].sort((a, b) => {
    const scoreA = getTherapeuticScore(a, goal);
    const scoreB = getTherapeuticScore(b, goal);
    return scoreB - scoreA;
  });
}

/**
 * Get track count for therapeutic goal (enhanced version of your filter)
 */
export function getTherapeuticTrackCount(tracks: TherapeuticTrack[], goal: GoalSlug): number {
  return filterTracksForGoal(tracks, goal).length;
}

/**
 * Get therapeutic insights for goal
 */
export function getTherapeuticInsights(tracks: TherapeuticTrack[], goal: GoalSlug) {
  const filteredTracks = filterTracksForGoal(tracks, goal);
  const bpmRange = THERAPEUTIC_BPM_RANGES[goal];
  
  if (filteredTracks.length === 0) {
    return {
      count: 0,
      effectiveness: 0,
      insights: [`No tracks found in therapeutic BPM range ${bpmRange.min}-${bpmRange.max}`]
    };
  }
  
  const avgScore = filteredTracks.reduce((sum, track) => sum + getTherapeuticScore(track, goal), 0) / filteredTracks.length;
  const avgBpm = filteredTracks.reduce((sum, track) => sum + (track.bpm || 0), 0) / filteredTracks.length;
  
  const insights = [
    `${filteredTracks.length} therapeutically matched tracks`,
    `Average BPM: ${Math.round(avgBpm)} (optimal: ${bpmRange.optimal})`,
    `Therapeutic effectiveness: ${Math.round(avgScore)}%`
  ];
  
  return {
    count: filteredTracks.length,
    effectiveness: Math.round(avgScore),
    insights
  };
}
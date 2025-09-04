// Updated to use centralized therapeutic goals configuration
import { TherapeuticGoalMapper } from '@/utils/therapeuticMapper';
import type { GoalSlug } from '@/config/therapeuticGoals';

interface TherapeuticTrack {
  id: number;
  bpm?: number;
  valence?: number;
  energy_level?: number;
  musical_key_est?: string;
  camelot?: string;
}

/**
 * Enhanced therapeutic filtering using centralized VAD engine and BPM targeting
 */
export function filterTracksForGoal(tracks: TherapeuticTrack[], goal: GoalSlug): TherapeuticTrack[] {
  const goalConfig = TherapeuticGoalMapper.getBySlug(goal);
  if (!goalConfig) return [];
  
  return tracks.filter(track => {
    // Must have valid BPM
    if (!track.bpm || track.bpm <= 0) {
      return false;
    }
    
    // STRICT therapeutic BPM ranges - no expansion for proper therapeutic effect
    const { min, max } = goalConfig.bpmRange;
    
    if (track.bpm < min || track.bpm > max) {
      return false;
    }
    
    // Must have valid audio file
    return true;
  });
}

/**
 * Get therapeutic effectiveness score for a track and goal
 */
export function getTherapeuticScore(track: TherapeuticTrack, goal: GoalSlug): number {
  const goalConfig = TherapeuticGoalMapper.getBySlug(goal);
  if (!goalConfig) return 0;
  
  let score = 0;
  
  // BPM score (0-40 points)
  if (track.bpm) {
    const bpmDistance = Math.abs(track.bpm - goalConfig.bpmRange.optimal);
    const maxDistance = Math.max(
      goalConfig.bpmRange.optimal - goalConfig.bpmRange.min, 
      goalConfig.bpmRange.max - goalConfig.bpmRange.optimal
    );
    score += Math.max(0, 40 - (bpmDistance / maxDistance) * 40);
  }
  
  // VAD score (0-40 points)
  if (track.valence !== undefined && track.energy_level !== undefined) {
    const trackValence = (track.valence - 0.5) * 2;
    const trackArousal = (track.energy_level - 0.5) * 2;
    
    const valenceScore = Math.max(0, 20 - Math.abs(trackValence - goalConfig.vadProfile.valence) * 20);
    const arousalScore = Math.max(0, 20 - Math.abs(trackArousal - goalConfig.vadProfile.arousal) * 20);
    
    score += valenceScore + arousalScore;
  }
  
  // Harmonic compatibility (0-20 points)
  if (track.camelot) {
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
 * Get track count for therapeutic goal (enhanced version)
 */
export function getTherapeuticTrackCount(tracks: TherapeuticTrack[], goal: GoalSlug): number {
  return filterTracksForGoal(tracks, goal).length;
}

/**
 * Get therapeutic insights for goal
 */
export function getTherapeuticInsights(tracks: TherapeuticTrack[], goal: GoalSlug) {
  const filteredTracks = filterTracksForGoal(tracks, goal);
  const goalConfig = TherapeuticGoalMapper.getBySlug(goal);
  
  if (!goalConfig || filteredTracks.length === 0) {
    return {
      count: 0,
      effectiveness: 0,
      insights: [`No tracks found for therapeutic goal`]
    };
  }
  
  const avgScore = filteredTracks.reduce((sum, track) => sum + getTherapeuticScore(track, goal), 0) / filteredTracks.length;
  const avgBpm = filteredTracks.reduce((sum, track) => sum + (track.bpm || 0), 0) / filteredTracks.length;
  
  const insights = [
    `${filteredTracks.length} therapeutically matched tracks`,
    `Average BPM: ${Math.round(avgBpm)} (optimal: ${goalConfig.bpmRange.optimal})`,
    `Therapeutic effectiveness: ${Math.round(avgScore)}%`
  ];
  
  return {
    count: filteredTracks.length,
    effectiveness: Math.round(avgScore),
    insights
  };
}
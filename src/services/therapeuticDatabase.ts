import { supabase } from "@/integrations/supabase/client";
import type { TherapeuticGoal } from "@/types/music";

// VAD profiles for each therapeutic goal (matching backend logic)
const VAD_PROFILES = {
  'focus-enhancement': {
    valence: { min: 0.4, max: 0.9, target: 0.6 },
    arousal: { min: 0.3, max: 0.8, target: 0.6 },
    dominance: { min: 0.3, max: 0.9, target: 0.6 },
    bpm_min: 60,
    bpm_max: 130
  },
  'stress-reduction': {
    valence: { min: 0.4, max: 0.7, target: 0.6 },
    arousal: { min: 0.2, max: 0.5, target: 0.3 },
    dominance: { min: 0.3, max: 0.6, target: 0.4 },
    bpm_min: 60,
    bpm_max: 80
  },
  'mood-boost': {
    valence: { min: 0.6, max: 0.9, target: 0.8 },
    arousal: { min: 0.5, max: 0.8, target: 0.7 },
    dominance: { min: 0.5, max: 0.8, target: 0.7 },
    bpm_min: 90,
    bpm_max: 130
  },
  'anxiety-relief': {
    valence: { min: 0.4, max: 0.7, target: 0.6 },
    arousal: { min: 0.1, max: 0.4, target: 0.2 },
    dominance: { min: 0.3, max: 0.6, target: 0.4 },
    bpm_min: 50,
    bpm_max: 75
  },
  'meditation-support': {
    valence: { min: 0.7, max: 0.9, target: 0.8 },
    arousal: { min: 0.1, max: 0.4, target: 0.2 },
    dominance: { min: 0.2, max: 0.5, target: 0.3 },
    bpm_min: 40,
    bpm_max: 70
  }
};

export interface Track {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string;
  bpm?: number;
  bpm_est?: number;
  energy_level?: number;
  valence?: number;
  arousal?: number;
  dominance?: number;
  energy?: number;
  audio_status?: "working" | "bad" | "unknown" | "missing";
  storage_bucket?: string;
  storage_key?: string;
  camelot_key?: string;
  duration_seconds?: number;
  play_count?: number;
  therapeutic_effectiveness?: number;
}

// VAD scoring function (matching backend logic)
function calculateVADScore(track: Track, profile: any, goalType: string): { score: number; v: number; a: number; d: number } {
  const v = track.valence ?? (track.energy_level ? (track.energy_level - 1) / 9 * 0.8 + 0.1 : 0.5);
  const a = track.arousal ?? track.energy ?? (track.energy_level ? (track.energy_level - 1) / 9 : 0.5);
  const d = track.dominance ?? 0.5;
  const bpm = track.bpm ?? track.bpm_est ?? 60;

  // BPM filtering
  if (bpm < profile.bpm_min || bpm > profile.bpm_max) return { score: -1, v, a, d };

  // Calculate VAD score
  const vScore = 1 - Math.abs(v - profile.valence.target);
  const aScore = 1 - Math.abs(a - profile.arousal.target);
  const dScore = 1 - Math.abs(d - profile.dominance.target);
  
  const score = (vScore + aScore + dScore) / 3;
  return { score, v, a, d };
}

export async function getTherapeuticTracks(
  goal: string, 
  count: number = 50, 
  excludeIds: string[] = []
): Promise<{ tracks: Track[]; error?: string }> {
  console.log(`🎯 DIRECT STORAGE ACCESS: Fetching ${count} tracks for goal: ${goal}`);
  
  try {
    // Call storage buckets directly as primary source
    const { getTracksFromStorage } = await import('./storageDirectAccess');
    const { tracks: storageTracks, error } = await getTracksFromStorage(goal, count);
    
    if (error) {
      console.error('❌ Storage access error:', error);
      return { tracks: [], error };
    }
    
    // Convert storage tracks to Track interface with stream URLs
    const tracks: Track[] = storageTracks.map(storageTrack => ({
      id: storageTrack.id,
      title: storageTrack.title,
      storage_bucket: storageTrack.storage_bucket,
      storage_key: storageTrack.storage_key,
      audio_status: 'working' as const,
      stream_url: storageTrack.stream_url,
      file_size: storageTrack.file_size,
      last_modified: storageTrack.last_modified
    }));
    
    console.log(`✅ Direct storage: Found ${tracks.length} tracks for ${goal}`);
    return { tracks };

  } catch (error) {
    console.error('❌ Error in direct storage access:', error);
    return { 
      tracks: [], 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function getTrendingTracks(
  minutes: number = 60,
  count: number = 50
): Promise<{ tracks: Track[]; error?: string }> {
  // Use direct storage access for trending tracks too
  const { getTracksFromStorage } = await import('./storageDirectAccess');
  
  console.log(`🗂️ DIRECT STORAGE ACCESS: Fetching ${count} trending tracks`);
  
  const { tracks: storageTracks, error } = await getTracksFromStorage('trending', count);
  
  if (error) {
    console.error('❌ Storage access error:', error);
    return { tracks: [], error };
  }

  // Convert storage tracks to Track interface
  const tracks: Track[] = storageTracks.map(storageTrack => ({
    id: storageTrack.id,
    title: storageTrack.title,
    storage_bucket: storageTrack.storage_bucket,
    storage_key: storageTrack.storage_key,
    audio_status: 'working' as const,
    stream_url: storageTrack.stream_url
  }));

  console.log(`✅ Direct storage: Found ${tracks.length} trending tracks`);
  return { tracks };
}
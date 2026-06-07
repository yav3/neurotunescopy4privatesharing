import type { Track as MusicTrack, TherapeuticGoal } from "@/types/music";
import { getTherapeuticTracks, Track as DBTrack } from "@/services/therapeuticDatabase";
import { supabase } from "@/integrations/supabase/client";

export type SearchCriteria = {
  goal: TherapeuticGoal;
  valence_min?: number;
  arousal_max?: number;
  dominance_min?: number;
  camelot_allow?: string[];    // e.g., ["8A","9A","7A"] harmonic neighborhood
  limit?: number;
};

// Transform database track to music track format
function transformTrack(dbTrack: DBTrack): MusicTrack {
  return {
    unique_id: dbTrack.id,
    title: dbTrack.title,
    artist: dbTrack.artist,
    file_path: dbTrack.storage_key || `tracks/${dbTrack.id}.mp3`,
    camelot_key: dbTrack.camelot_key || "1A",
    bpm: dbTrack.bpm || dbTrack.bpm_est,
    vad: {
      valence: dbTrack.valence || 0.5,
      arousal: dbTrack.arousal || 0.5,
      dominance: dbTrack.dominance || 0.5
    },
    audio_status: dbTrack.audio_status as "working" | "bad" | "unknown" || "working"
  };
}

export async function searchTracks(criteria: SearchCriteria): Promise<MusicTrack[]> {
  console.log('🔍 Searching tracks with criteria:', criteria);
  
  const { tracks } = await getTherapeuticTracks(criteria.goal as string, criteria.limit || 50);
  console.log('📊 Raw tracks received:', tracks.length);

  // Transform and filter tracks
  const transformed = tracks.map(transformTrack);
  
  const filtered = transformed.filter(track => {
    if (criteria.valence_min && track.vad.valence < criteria.valence_min) return false;
    if (criteria.arousal_max && track.vad.arousal > criteria.arousal_max) return false;
    if (criteria.dominance_min && track.vad.dominance && track.vad.dominance < criteria.dominance_min) return false;
    if (criteria.camelot_allow && !criteria.camelot_allow.includes(track.camelot_key)) return false;
    return true;
  });
  
  console.log('✅ Clean tracks after filtering:', filtered.length);
  return filtered;
}

/**
 * Build the stream URL the player should use.
 * Routes through getStorageUrl so private audio buckets return short-lived
 * signed URLs while public buckets keep direct CDN URLs.
 */
export async function toStreamUrl(trackId: string | any): Promise<string> {
  const { getStorageUrl } = await import('@/lib/storageUrl');

  if (typeof trackId === 'object' && trackId.storage_bucket && trackId.storage_key) {
    return getStorageUrl(trackId.storage_bucket, trackId.storage_key);
  }

  const id = typeof trackId === 'string' ? trackId : trackId?.id || trackId;
  return getStorageUrl('audio', `tracks/${id}.mp3`);
}
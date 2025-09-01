import type { Track, TherapeuticGoal } from "@/types/music";
import { API } from "@/lib/api";

export type SearchCriteria = {
  goal: TherapeuticGoal;
  valence_min?: number;
  arousal_max?: number;
  dominance_min?: number;
  camelot_allow?: string[];    // e.g., ["8A","9A","7A"] harmonic neighborhood
  limit?: number;
};

export async function searchTracks(criteria: SearchCriteria): Promise<Track[]> {
  console.log('🔍 Searching tracks with criteria:', criteria);
  
  const data = await API.searchTracks(criteria);
  console.log('📊 Raw tracks received:', data.length);

  // Defensive: drop bad/unknown audio, enforce uniqueness
  const seen = new Set<string>();
  const clean = [];
  for (const t of data) {
    if (t.audio_status && t.audio_status !== "working") continue;
    if (!t.unique_id || seen.has(t.unique_id)) continue;
    seen.add(t.unique_id);
    clean.push(t);
  }
  
  console.log('✅ Clean tracks after filtering:', clean.length);
  return clean;
}

/** Build the proxied stream URL your player must use */
export function toStreamUrl(trackId: string): string {
  return API.streamUrl(trackId);
}
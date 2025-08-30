import { API } from "@/lib/api";
import type { Track, TherapeuticGoal } from "@/types/music";

export type SearchCriteria = {
  goal: TherapeuticGoal;
  valence_min?: number;
  arousal_max?: number;
  dominance_min?: number;
  camelot_allow?: string[];    // e.g., ["8A","9A","7A"] harmonic neighborhood
  limit?: number;
};

export async function searchTracks(criteria: SearchCriteria): Promise<Track[]> {
  const response = await fetch(`${process.env.VITE_API_BASE_URL || 'https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/api'}/tracks/search?${new URLSearchParams(criteria as any)}`);
  const data = await response.json();

  // Defensive: drop bad/unknown audio, enforce uniqueness
  const seen = new Set<string>();
  const clean = [];
  for (const t of data) {
    if (t.audio_status && t.audio_status !== "working") continue;
    if (!t.unique_id || seen.has(t.unique_id)) continue;
    seen.add(t.unique_id);
    clean.push(t);
  }
  return clean;
}

/** Build the proxied stream URL your player must use */
export function toStreamUrl(file_pathOrAbsUrl: string): string {
  const isAbs = /^https?:\/\//i.test(file_pathOrAbsUrl);
  const qp = isAbs ? `url=${encodeURIComponent(file_pathOrAbsUrl)}`
                   : `path=${encodeURIComponent(file_pathOrAbsUrl)}`;
  return `${location.origin}/api/stream?${qp}`;
}
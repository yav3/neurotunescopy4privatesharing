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
  console.log('🔍 Searching tracks with criteria:', criteria);
  
  // Build query parameters
  const params = new URLSearchParams();
  Object.entries(criteria).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        params.append(key, value.join(','));
      } else {
        params.append(key, String(value));
      }
    }
  });

  const url = `https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/api/tracks/search?${params}`;
  console.log('🌐 Fetching from:', url);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Search failed:', response.status, errorText);
    throw new Error(`${response.status} ${errorText}`);
  }

  const data = await response.json();
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
export function toStreamUrl(file_pathOrAbsUrl: string): string {
  const isAbs = /^https?:\/\//i.test(file_pathOrAbsUrl);
  const qp = isAbs ? `url=${encodeURIComponent(file_pathOrAbsUrl)}`
                   : `path=${encodeURIComponent(file_pathOrAbsUrl)}`;
  return `${location.origin}/api/stream?${qp}`;
}
import { logger } from "@/services/logger";
import type { GoalSlug } from "@/domain/goals";

// Environment configuration with validation
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
  || (import.meta.env.VITE_SUPABASE_URL ? `${new URL(import.meta.env.VITE_SUPABASE_URL).origin}/functions/v1/api` : '');

if (!API_BASE_URL) {
  throw new Error('[API_BASE] not set — set VITE_API_BASE_URL to https://<project>.functions.supabase.co/api');
}

function join(base: string, path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`.replace(/\/{2,}/g, "/").replace(/^https?:\//, (m) => m + "/");
}

// Accept callers passing "/api/..." or "/..."; always send absolute
export async function apiFetch(path: string, init?: RequestInit) {
  // strip a single leading /api
  const normalized = path.replace(/^\/api(\/|$)/, "/");
  const url = join(API_BASE_URL, normalized);
  const res = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[API ERROR]", res.status, url, text);
  }
  return res;
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  let lastErr: any;
  for (let i = 0; i < 2; i++) {
    try {
      const r = await apiFetch(path, init);
      if (!r.ok) {
        const text = await r.text().catch(() => 'Unknown error');
        throw new Error(`${r.status} ${r.statusText} @ ${path}: ${text}`);
      }
      const result = (await (r.headers.get("content-type")?.includes("application/json")
        ? r.json()
        : r.text())) as T;
      console.log(`[API] ✅ ${init?.method || 'GET'} ${path}:`, result);
      return result;
    } catch (e) {
      lastErr = e;
      console.warn(`[API] ❌ Attempt ${i + 1} failed:`, e);
      if (i < 1) {
        await new Promise(res => setTimeout(res, 150 * (i + 1)));
      }
    }
  }
  console.error(`[API] 💥 All attempts failed for ${path}:`, lastErr);
  throw lastErr;
}

// New API functions using absolute URLs
export async function fetchPlaylist(goal: string, count = 50, seed?: string, excludeCsv?: string) {
  const qs = new URLSearchParams({ 
    goal, 
    count: String(count), 
    ...(seed ? { seed } : {}), 
    ...(excludeCsv ? { exclude: excludeCsv } : {}) 
  });
  
  const r = await fetch(`${API_BASE_URL}/v1/playlist?${qs}`, { 
    headers: { Accept: 'application/json' }
  });
  
  const body = await r.json().catch(() => ({}));
  return r.ok ? body : { tracks: [], error: body?.error || `status ${r.status}` };
}

export async function fetchTrending(minutes = 60, count = 50, seed?: string, excludeCsv?: string) {
  const qs = new URLSearchParams({ 
    minutes: String(minutes), 
    limit: String(count), 
    ...(seed ? { seed } : {}), 
    ...(excludeCsv ? { exclude: excludeCsv } : {}) 
  });
  
  const r = await fetch(`${API_BASE_URL}/v1/trending?${qs}`, { 
    headers: { Accept: 'application/json' }
  });
  
  const body = await r.json().catch(() => ({}));
  return r.ok ? body : { tracks: [], error: body?.error || `status ${r.status}` };
}

export const streamUrl = (track: any): string => {
  if (!track || !track.storage_bucket || !track.storage_key) {
    console.warn('⚠️ Invalid track data provided to streamUrl:', track);
    return '#invalid-track-data';
  }
  
  // Generate direct Supabase storage URL using actual storage_bucket and storage_key
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    console.error('❌ VITE_SUPABASE_URL not configured');
    return '#no-supabase-url';
  }
  
  // Properly encode the storage key to handle special characters
  const encodedStorageKey = track.storage_key.split('/').map(encodeURIComponent).join('/');
  const url = `${supabaseUrl}/storage/v1/object/public/${track.storage_bucket}/${encodedStorageKey}`;
  console.log('🎵 Generated encoded storage URL:', url);
  return url;
};

export const API = {
  health: () => req<{ ok: true }>("/health"),
  async playlist(goal: GoalSlug, limit = 50, offset = 0) {
    console.warn('⚠️ Using legacy API.playlist - consider using fetchPlaylist instead');
    const url = `/playlist?goal=${encodeURIComponent(goal)}&limit=${limit}&offset=${offset}`;
    return req<{ tracks: Array<{ id: string; title: string; artist?: string; genre?: string }> }>(url);
  },
  debugStorage: () => req<any>("/debug/storage"),
  streamUrl: (track: any) => {
    console.warn('⚠️ Using legacy API.streamUrl - consider using streamUrl function instead');
    return streamUrl(track); // Use the fixed streamUrl function
  },
  
  searchTracks: (params: Record<string, any>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          searchParams.append(key, value.join(','));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    return req<any[]>(`/tracks/search?${searchParams}`);
  },
  
  // Legacy compatibility methods
  buildSession: (body: { goal: string; durationMin: number; intensity: number; limit?: number }) =>
    req<{ tracks: any[]; sessionId: string }>("/session/build", {
      method: "POST", 
      body: JSON.stringify(body)
    }),
  startSession: (body: { trackId: string }) =>
    req<{ sessionId: string }>("/sessions/start", {
      method: "POST",
      body: JSON.stringify(body)
    }),
  progressSession: (body: { sessionId: string; t: number }) =>
    req<{ ok: boolean }>("/sessions/progress", {
      method: "POST",
      body: JSON.stringify(body)
    }),
  completeSession: (body: { sessionId: string }) =>
    req<{ ok: boolean }>("/sessions/complete", {
      method: "POST", 
      body: JSON.stringify(body)
    }),
  get playlistByGoal() { return this.playlist; },
  start: (trackId: string) => API.startSession({ trackId }),
  progress: (sessionId: string, t: number) => API.progressSession({ sessionId, t }),
  complete: (sessionId: string) => API.completeSession({ sessionId }),
};

// Integration test function for dev console
(window as any).testAPIIntegration = async () => {
  try {
    console.log("🧪 Starting API integration test...");
    
    const health = await API.health();
    console.log("✅ Health check:", health);
    
    const { tracks } = await API.playlist("focus-enhancement", 1);
    if (!tracks?.length) throw new Error("No tracks returned");
    console.log("✅ Playlist check:", tracks[0]);
    
    const streamUrl = API.streamUrl(tracks[0].id);
    console.log("🎵 Testing stream URL:", streamUrl);
    const head = await fetch(streamUrl, { method: "HEAD" });
    if (!head.ok) throw new Error(`Stream HEAD failed: ${head.status}`);
    console.log("✅ Stream check:", head.headers.get("content-type"));
    
    console.log("🎉 Integration test PASSED");
    return true;
  } catch (e) {
    console.error("💥 Integration test FAILED:", e);
    return false;
  }
};
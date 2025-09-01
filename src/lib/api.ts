// Single source of truth for API base (must be absolute)
const RAW_BASE =
  (typeof import.meta !== "undefined" ? (import.meta as any).env?.VITE_API_BASE_URL : undefined) ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "";

if (!/^https?:\/\//.test(RAW_BASE)) {
  throw new Error(
    `API base misconfigured: '${RAW_BASE}'. Set VITE_API_BASE_URL (e.g. https://<project>.functions.supabase.co)`
  );
}
const API_BASE = RAW_BASE.replace(/\/+$/, ""); // no trailing slash

function join(base: string, path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`.replace(/\/{2,}/g, "/").replace(/^https?:\//, (m) => m + "/");
}

// Accept callers passing "/api/..." or "/..."; always send absolute
export async function apiFetch(path: string, init?: RequestInit) {
  // strip a single leading /api
  const normalized = path.replace(/^\/api(\/|$)/, "/");
  const url = join(API_BASE, normalized);
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

export const API = {
  health: () => req<{ ok: true }>("/health"),
  playlist: (body: { goal: string; limit?: number; offset?: number }) =>
    req<{ tracks: Array<{ id: string; title: string; file_path: string }> }>("/playlist", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  debugStorage: () => req<any>("/debug/storage"),
  streamUrl: (id: string) => {
    if (!id) {
      console.error('[STREAM URL] No track ID provided:', id);
      throw new Error('Track ID is required for streaming');
    }
    // Validate UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (!isUUID) {
      throw new Error(`Invalid track ID format: "${id}". Expected UUID format.`);
    }
    const url = join(API_BASE, `/stream/${encodeURIComponent(id)}`);
    console.log("[STREAM URL]", { id, url });
    return url;
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
    
    const { tracks } = await API.playlist({ goal: "focus", limit: 1 });
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
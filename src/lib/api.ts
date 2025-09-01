import { API_BASE } from "./env";
import { routes } from "./routes";

function join(base: string, path: string) {
  if (!path.startsWith("/")) throw new Error(`Route must start with '/': ${path}`);
  return `${base}${path}`.replace(/\/{2,}/g, "/").replace(/^https?:\//, m => m + "/");
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const url = join(API_BASE, path);
  console.log(`[API] ${init?.method || 'GET'} ${url}`);
  
  let lastErr: any;
  for (let i = 0; i < 2; i++) {
    try {
      const r = await fetch(url, {
        ...init,
        headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      });
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
  health: () => req<{ ok: true }>(routes.health()),
  playlist: (body: { goal: string; limit?: number; offset?: number }) =>
    req<{ tracks: Array<{ id: string; title: string; file_path: string }> }>(routes.playlist(), {
      method: "POST",
      body: JSON.stringify(body),
    }),
  debugStorage: () => req<any>(routes.debugStorage()),
  streamUrl: (id: string) => {
    if (!id) {
      console.error('[STREAM URL] No track ID provided:', id);
      throw new Error('Track ID is required for streaming');
    }
    const url = join(API_BASE, routes.stream(id));
    console.log("[STREAM URL]", { id, url });
    return url;
  },
  
  // Legacy compatibility methods
  buildSession: (body: { goal: string; durationMin: number; intensity: number; limit?: number }) =>
    req<{ tracks: any[]; sessionId: string }>(routes.buildSession(), {
      method: "POST", 
      body: JSON.stringify(body)
    }),
  startSession: (body: { trackId: string }) =>
    req<{ sessionId: string }>(routes.startSession(), {
      method: "POST",
      body: JSON.stringify(body)
    }),
  progressSession: (body: { sessionId: string; t: number }) =>
    req<{ ok: boolean }>(routes.progressSession(), {
      method: "POST",
      body: JSON.stringify(body)
    }),
  completeSession: (body: { sessionId: string }) =>
    req<{ ok: boolean }>(routes.completeSession(), {
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
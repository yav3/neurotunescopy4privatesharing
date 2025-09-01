import { API_BASE } from "./env";
import { routes } from "./routes";

function join(base: string, path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`Route must start with '/': ${path}`);
  }
  
  const url = `${base}${path}`;
  // Replace multiple consecutive slashes with single slash, but preserve protocol slashes
  return url.replace(/([^:]\/)\/+/g, '$1');
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const url = join(API_BASE, path);
  console.log(`[API] ${init?.method || 'GET'} ${url}`);
  
  let lastErr: any;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(url, {
        ...init,
        headers: { 
          "Content-Type": "application/json", 
          ...(init?.headers || {}) 
        },
      });
      
      if (!r.ok) {
        const text = await r.text().catch(() => 'Unknown error');
        throw new Error(`${r.status} ${r.statusText} @ ${path}: ${text}`);
      }
      
      const contentType = r.headers.get("content-type") || "";
      const result = contentType.includes("application/json") 
        ? await r.json()
        : await r.text();
        
      console.log(`[API] ✅ ${init?.method || 'GET'} ${path}:`, result);
      return result as T;
      
    } catch (e) {
      lastErr = e;
      console.warn(`[API] ❌ Attempt ${attempt + 1} failed:`, e);
      if (attempt < 1) {
        await new Promise(res => setTimeout(res, 150 * (attempt + 1)));
      }
    }
  }
  
  console.error(`[API] 💥 All attempts failed for ${path}:`, lastErr);
  throw lastErr;
}

export const API = {
  health: () => req<{ ok: true; time: string; service: string }>(routes.health()),
  
  // Support both old (goal, limit, offset) and new ({ goal, limit, offset }) signatures
  playlist: (goalOrBody: string | { goal: string; limit?: number; offset?: number }, limit = 50, offset = 0) => {
    const body = typeof goalOrBody === 'string' 
      ? { goal: goalOrBody, limit, offset }
      : goalOrBody;
    return req<{ tracks: Array<{ id: string; title: string; file_path: string; [key: string]: any }> }>(
      routes.playlist(), 
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
  },
  
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
  
  debugStorage: () => req<any>(routes.debugStorage()),
  
  streamUrl: (id: string) => {
    if (!id) {
      console.error('[STREAM URL] No track ID provided:', id);
      throw new Error('Track ID is required for streaming');
    }
    const url = `https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/stream/${encodeURIComponent(id)}`;
    console.log("[STREAM URL]", { id, url });
    return url;
  },
  
  // Legacy compatibility methods
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
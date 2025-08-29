const BASE = typeof window !== 'undefined' 
  ? window.location.origin 
  : 'http://localhost:5000'

const j = async <T>(r: Response): Promise<T> => {
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`${r.status} ${text}`);
  }
  return r.json() as T;
}

// API response types
interface PlaylistResponse {
  tracks: any[]
}

interface SessionResponse {
  sessionId: string
  tracks: any[]
}

interface StartSessionResponse {
  sessionId: string
}

// New unified API client with real event triggers
export const API = {
  // Health checks
  health: () => fetch(`${BASE}/api/healthz`).then(j),
  db: () => fetch(`${BASE}/api/readyz`).then(j),
  storage: () => fetch(`${BASE}/api/stream-health`).then(j),

  // Music catalog  
  featured: () => fetch(`${BASE}/api/catalog/featured`).then(j),
  playlistByGoal: (goal: string) =>
    fetch(`${BASE}/api/playlist?goal=${encodeURIComponent(goal)}`).then(j<PlaylistResponse>),

  buildSession: (p: {goal: string; durationMin: number; intensity: number}) =>
    fetch(`${BASE}/api/session/build`, {
      method: "POST", 
      headers: {"content-type":"application/json"}, 
      body: JSON.stringify(p)
    }).then(j<SessionResponse>),

  // Sessions/telemetry
  startSession: (trackId: string) =>
    fetch(`${BASE}/api/sessions/start`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackId })
    }).then(j<StartSessionResponse>),

  progress: (sessionId: string, t: number) =>
    navigator.sendBeacon?.(`${BASE}/api/sessions/progress`,
      new Blob([JSON.stringify({ sessionId, t })], { type: "application/json" }))
    || fetch(`${BASE}/api/sessions/progress`, {
      method:"POST", 
      headers:{ "content-type":"application/json" }, 
      body: JSON.stringify({ sessionId, t })
    }),

  complete: (sessionId: string) =>
    fetch(`${BASE}/api/sessions/complete`, {
      method:"POST", 
      headers:{ "content-type":"application/json" }, 
      body: JSON.stringify({ sessionId })
    }),
}

export const streamUrl = (t: any) =>
  `${BASE}/api/stream/${encodeURIComponent(t.file_path || t.file_name || t.src || t.id)}`
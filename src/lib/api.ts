import { API_BASE } from './env'

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
  // Health checks - using Supabase edge functions
  health: () => fetch(`${API_BASE}/functions/v1/healthz`).then(j),
  db: () => fetch(`${API_BASE}/rest/v1/`).then(j),
  storage: () => fetch(`${API_BASE}/storage/v1/`).then(j),

  // Music catalog  
  featured: () => fetch(`${API_BASE}/functions/v1/catalog/featured`).then(j),
  playlistByGoal: (goal: string) =>
    fetch(`${API_BASE}/functions/v1/playlist?goal=${encodeURIComponent(goal)}`).then(j<PlaylistResponse>),

  buildSession: (p: {goal: string; durationMin: number; intensity: number}) =>
    fetch(`${API_BASE}/functions/v1/session/build`, {
      method: "POST", 
      headers: {"content-type":"application/json"}, 
      body: JSON.stringify(p)
    }).then(j<SessionResponse>),

  // Sessions/telemetry
  startSession: (trackId: string) =>
    fetch(`${API_BASE}/functions/v1/sessions/start`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackId })
    }).then(j<StartSessionResponse>),

  progress: (sessionId: string, t: number) =>
    navigator.sendBeacon?.(`${API_BASE}/functions/v1/sessions/progress`,
      new Blob([JSON.stringify({ sessionId, t })], { type: "application/json" }))
    || fetch(`${API_BASE}/functions/v1/sessions/progress`, {
      method:"POST", 
      headers:{ "content-type":"application/json" }, 
      body: JSON.stringify({ sessionId, t })
    }),

  complete: (sessionId: string) =>
    fetch(`${API_BASE}/functions/v1/sessions/complete`, {
      method:"POST", 
      headers:{ "content-type":"application/json" }, 
      body: JSON.stringify({ sessionId })
    }),
}

export const streamUrl = (t: any) => {
  const fileName = t.file_path || t.file_name || t.src || t.id
  const url = `${API_BASE}/functions/v1/stream-track/${encodeURIComponent(fileName)}`
  console.log('🎵 Generated stream URL:', url, 'for track:', t.title || fileName)
  return url
}
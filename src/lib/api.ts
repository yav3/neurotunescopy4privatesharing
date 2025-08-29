// src/lib/api.ts
import { API_BASE } from "@/lib/env";

const j = async <T>(r: Response) => { if(!r.ok) throw new Error(`${r.status} ${await r.text()}`); return r.json() as T; };

export const API = {
  health:       () => fetch(`${API_BASE}/health`).then(j),
  playlist:     (goal:string) => fetch(`${API_BASE}/v1/playlist?goal=${encodeURIComponent(goal)}`).then(j<{tracks:any[]}>),
  buildSession: (p:{goal:string; durationMin:number; intensity:number}) =>
                  fetch(`${API_BASE}/v1/session/build`, { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify(p)}).then(j<{tracks:any[];sessionId:string}>),
  start:        (trackId:string) => fetch(`${API_BASE}/v1/sessions/start`, { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({trackId})}).then(j<{sessionId:string}>),
  progress:     (sessionId:string, t:number) =>
                  navigator.sendBeacon?.(`${API_BASE}/v1/sessions/progress`, new Blob([JSON.stringify({sessionId,t})], {type:"application/json"}))
                  || fetch(`${API_BASE}/v1/sessions/progress`, { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({sessionId,t})}),
  complete:     (sessionId:string) => fetch(`${API_BASE}/v1/sessions/complete`, { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({sessionId})}),
  
  // Compatibility aliases
  get playlistByGoal() { return this.playlist },
  get startSession() { return this.start }
};

export const streamUrl = (t:any) => `${API_BASE}/stream?file=${encodeURIComponent(t.file_name ?? t.src ?? t.id)}`;
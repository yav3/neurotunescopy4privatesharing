// src/lib/api.ts
import { API_BASE } from "@/lib/env";

const j = async <T>(r: Response) => { if(!r.ok) throw new Error(`${r.status} ${await r.text()}`); return r.json() as T; };

export const API = {
  health:       () => fetch(`${API_BASE}/health`).then(j),
  playlist:     (goal: string, limit = 50, offset = 0) =>
                  fetch(`${API_BASE}/v1/playlist?goal=${encodeURIComponent(goal)}&limit=${limit}&offset=${offset}`)
                    .then(j<{tracks:any[]; total:number; nextOffset:number}>),
  buildSession: (p:{goal:string; durationMin:number; intensity:number; limit?:number}) =>
                  fetch(`${API_BASE}/v1/session/build`, { 
                    method:"POST", 
                    headers:{ "content-type":"application/json" }, 
                    body: JSON.stringify({ ...p, limit: p.limit ?? 50 })
                  }).then(j<{tracks:any[];sessionId:string}>),
  start:        (trackId:string) => fetch(`${API_BASE}/v1/sessions/start`, { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({trackId})}).then(j<{sessionId:string}>),
  progress:     (sessionId:string, t:number) =>
                  navigator.sendBeacon?.(`${API_BASE}/v1/sessions/progress`, new Blob([JSON.stringify({sessionId,t})], {type:"application/json"}))
                  || fetch(`${API_BASE}/v1/sessions/progress`, { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({sessionId,t})}),
  complete:     (sessionId:string) => fetch(`${API_BASE}/v1/sessions/complete`, { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({sessionId})}),
  
  // Compatibility aliases
  get playlistByGoal() { return this.playlist },
  get startSession() { return this.start }
};

// Build file parameter with proper encoding for paths containing folders
const buildFile = (s: string) => s.includes("/")
  ? s.split("/").map(encodeURIComponent).join("/")
  : encodeURIComponent(s);

export const streamUrl = (t: { file_path?: string; file_name?: string; storage_key?: string; src?: string; title?: string }) => {
  // Prioritize actual file paths over fallbacks
  const fileName = t.file_path || t.storage_key || t.file_name || t.src;
  
  if (!fileName) {
    console.error('❌ streamUrl: No valid file path found in track object:', t);
    throw new Error(`No valid file path for track: ${t.title || 'Unknown'}`);
  }
  
  console.log('🎵 streamUrl input:', t);
  console.log('🎵 fileName resolved:', fileName);
  console.log('🎵 API_BASE:', API_BASE);
  
  const url = `${API_BASE}/stream?file=${encodeURIComponent(fileName)}`;
  console.log('🎵 Final stream URL:', url);
  return url;
};
// Minimal, deterministic audio core
import { API } from "@/lib/api";

export type Track = { 
  id: string; 
  title?: string;
  artist?: string;
  storage_key?: string;
};

let audio: HTMLAudioElement | null = null;
let queue: Track[] = [];
let idx = -1;

function el(): HTMLAudioElement {
  if (audio && document.body.contains(audio)) return audio;
  
  audio = document.getElementById("np-audio") as HTMLAudioElement | null;
  if (!audio) { 
    audio = document.createElement("audio"); 
    audio.id = "np-audio"; 
    audio.preload = "metadata"; 
    audio.crossOrigin = "anonymous"; 
    audio.style.display = "none"; 
    document.body.appendChild(audio); 
  }
  return audio;
}

async function load() { 
  const a = el();
  const t = queue[idx]; 
  if (!t) return; 
  
  console.log('🎵 Loading track:', t.title || t.id);
  a.src = API.streamUrl(t.id); 
  a.load(); 
  
  try { 
    await a.play(); 
    console.log('✅ Playing:', t.title || t.id);
  } catch (e) { 
    console.warn("Play blocked or failed:", e); 
  } 
}

export async function setQueue(tracks: Track[], startAt = 0) {
  if (!tracks?.length) {
    console.warn('⚠️ Empty track list provided to setQueue');
    return;
  }
  
  queue = tracks; 
  idx = startAt; 
  console.log(`🎵 Queue set: ${tracks.length} tracks, starting at ${startAt}`);
  await load(); 
}

export async function playSingle(t: Track) {
  if (!t?.id) {
    console.error('❌ Invalid track provided to playSingle:', t);
    return;
  }
  
  queue = [t]; 
  idx = 0; 
  console.log('🎵 Playing single track:', t.title || t.id);
  await load(); 
}

export function getCurrentTrack(): Track | null {
  return queue[idx] || null;
}

export function getQueue(): Track[] {
  return [...queue];
}

export function getCurrentIndex(): number {
  return idx;
}

// Add to window for debugging
if (typeof window !== 'undefined') {
  (window as any).audioCore = {
    setQueue,
    playSingle,
    getCurrentTrack,
    getQueue,
    getCurrentIndex,
    element: () => el()
  };
}
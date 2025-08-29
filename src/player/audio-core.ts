import { streamUrl } from "@/lib/api";

export type Track = { 
  id: string; 
  title?: string; 
  file_name?: string; 
  file_path?: string;
  src?: string 
};

let el: HTMLAudioElement | null = null;
export const getAudio = (): HTMLAudioElement => {
  if (el && document.body.contains(el)) return el;
  el = document.getElementById("np-audio") as HTMLAudioElement | null;
  if (!el) {
    el = document.createElement("audio");
    el.id = "np-audio";
    el.preload = "metadata";
    el.crossOrigin = "anonymous";
    el.style.display = "none";
    document.body.appendChild(el);
    console.log('🎵 Global audio element created:', el.id);
  }
  return el!;
};

let queue: Track[] = [];
let index = -1;

const loadCurrent = async () => {
  const a = getAudio();
  const t = queue[index];
  if (!t) {
    console.log('❌ No current track to load');
    return;
  }
  
  const url = streamUrl(t);
  console.log('🔄 Loading track via audio-core:', t.title, 'URL:', url);
  
  a.src = url;      // ALWAYS via your Edge Function
  a.load();
  try { 
    await a.play();
    console.log('✅ Track started playing via audio-core');
  } catch (e) { 
    console.warn("🔇 play() blocked:", e);
  }
};

export const setQueue = async (tracks: Track[], startAt = 0) => {
  console.log('📋 Setting queue via audio-core:', tracks.length, 'tracks, starting at:', startAt);
  queue = tracks;
  index = Math.max(0, Math.min(startAt, tracks.length - 1));
  await loadCurrent();
};

export const playSingle = (t: Track) => {
  console.log('▶️ Playing single track via audio-core:', t.title);
  return setQueue([t], 0);
};

export const playAt = (i: number) => { 
  console.log('🎯 Playing at index via audio-core:', i);
  index = Math.max(0, Math.min(i, queue.length - 1)); 
  return loadCurrent(); 
};

export const next = () => { 
  if (index < queue.length - 1) { 
    console.log('⏭️ Next track via audio-core');
    index++; 
    return loadCurrent(); 
  } else {
    console.log('🔚 Already at last track');
  }
};

export const prev = () => { 
  if (index > 0) { 
    console.log('⏮️ Previous track via audio-core');
    index--; 
    return loadCurrent(); 
  } else {
    console.log('🔚 Already at first track');
  }
};

export const current = () => ({ 
  index, 
  track: queue[index], 
  hasEl: !!getAudio(),
  queueLength: queue.length
});

export const getQueue = () => queue;
export const getIndex = () => index;
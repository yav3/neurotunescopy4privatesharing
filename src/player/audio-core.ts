import { streamUrl } from "@/lib/api";
import type { Track } from "@/types";

const MAX_QUEUE = 50;         // hard cap loaded at once
const EXTEND_CHUNK = 10;      // how many to append when we near the end
const EXTEND_GUARD = 3;       // when only 3 tracks left, append more

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
let backlog: Track[] = [];     // future tracks to append lazily

const loadCurrent = async () => {
  const a = getAudio();
  const t = queue[index];
  if (!t) {
    console.log('❌ No current track to load');
    return;
  }
  
  console.log('🔄 Loading track via audio-core:', t.title);
  console.log('🎵 Complete track object:', t);
  console.log('🎵 Track file_path:', t.file_path);
  console.log('🎵 Track storage_key:', t.storage_key);
  
  const url = streamUrl(t);
  console.log('🔗 Stream URL:', url);
  
  a.src = url;      // ALWAYS via your Edge Function
  a.load();
  
  // Add error handling
  a.onerror = (e) => {
    console.error('❌ Audio error:', e);
    console.error('❌ Audio error details:', a.error);
  };
  
  a.onloadstart = () => console.log('🔄 Load started');
  a.oncanplay = () => console.log('✅ Can play');
  a.oncanplaythrough = () => console.log('✅ Can play through');
  
  try { 
    await a.play();
    console.log('✅ Track started playing via audio-core');
  } catch (e) { 
    console.warn("🔇 play() blocked:", e);
  }
};

const maybeExtend = () => {
  if (queue.length - 1 - index <= EXTEND_GUARD && backlog.length > 0) {
    const add = backlog.splice(0, EXTEND_CHUNK);
    queue = queue.concat(add);
    console.log(`🔄 Extended queue with ${add.length} tracks (${queue.length} total, ${backlog.length} in backlog)`);
  }
};

export const setQueue = async (tracks: Track[], startAt = 0) => {
  console.log('📋 Setting queue via audio-core:', tracks.length, 'tracks, starting at:', startAt);
  backlog = tracks.slice(MAX_QUEUE);
  queue = tracks.slice(0, MAX_QUEUE);
  index = Math.max(0, Math.min(startAt, queue.length - 1));
  console.log(`🎵 Queue capped at ${queue.length}, ${backlog.length} in backlog`);
  await loadCurrent();
};

export const playSingle = async (t: Track) => {
  console.log('▶️ Playing single track via audio-core:', t.title);
  backlog = [];
  queue = [t];
  index = 0;
  await loadCurrent();
};

export const playAt = async (i: number) => { 
  console.log('🎯 Playing at index via audio-core:', i);
  index = Math.max(0, Math.min(i, queue.length - 1)); 
  await loadCurrent(); 
};

export const next = async () => { 
  if (index < queue.length - 1) { 
    console.log('⏭️ Next track via audio-core');
    index++; 
    maybeExtend();
    await loadCurrent(); 
  } else {
    console.log('🔚 Already at last track');
  }
};

export const prev = async () => { 
  if (index > 0) { 
    console.log('⏮️ Previous track via audio-core');
    index--; 
    await loadCurrent(); 
  } else {
    console.log('🔚 Already at first track');
  }
};

export const current = () => ({ 
  index, 
  track: queue[index], 
  hasEl: !!getAudio(),
  queueLength: queue.length,
  size: queue.length,
  backlog: backlog.length
});

export const getQueue = () => queue;
export const getIndex = () => index;
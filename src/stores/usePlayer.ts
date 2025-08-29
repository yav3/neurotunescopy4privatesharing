import { create } from "zustand";
import type { Track } from "@/types";
import { setQueue, playAt, playSingle, next, prev, current } from "@/player/audio-core";

type State = {
  queue: Track[];
  index: number;
  isPlaying: boolean;
  isLoading: boolean;
  error?: string;
  setQueue: (t: Track[], startAt?: number) => Promise<void>;
  playAt: (i: number) => Promise<void>;
  playSingle: (t: Track) => Promise<void>;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  setPlaying: (playing: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  clearError: () => void;
};

export const usePlayer = create<State>((set) => ({
  queue: [],
  index: -1,
  isPlaying: false,
  isLoading: false,
  
  setQueue: async (t, i = 0) => { 
    console.log('🎵 usePlayer.setQueue called:', t.length, 'tracks');
    await setQueue(t, i);
    const currentState = current();
    set({ 
      queue: t, 
      index: currentState.index,
      error: undefined 
    });
  },
  
  playAt: async (i) => { 
    console.log('🎵 usePlayer.playAt called:', i);
    await playAt(i);
    const currentState = current();
    set({ index: currentState.index });
  },
  
  playSingle: async (t) => { 
    console.log('🎵 usePlayer.playSingle called:', t.title);
    await playSingle(t);
    const currentState = current();
    set({ 
      queue: [t], 
      index: 0,
      error: undefined 
    });
  },
  
  next: async () => { 
    console.log('🎵 usePlayer.next called');
    await next();
    const currentState = current();
    set({ index: currentState.index });
  },
  
  prev: async () => { 
    console.log('🎵 usePlayer.prev called');
    await prev();
    const currentState = current();
    set({ index: currentState.index });
  },
  
  setPlaying: (playing) => set({ isPlaying: playing }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: undefined })
}));

// Helper to get current track
export const currentTrack = () => {
  const currentState = current();
  return currentState.track || null;
};

// Helper for getting current track's stream URL - no longer needed, handled by audio-core
export const currentSrc = () => {
  const currentState = current();
  return currentState.track ? 'handled-by-audio-core' : '';
};
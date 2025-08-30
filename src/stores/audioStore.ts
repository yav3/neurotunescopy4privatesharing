import { create } from "zustand";
import { buildStreamUrl } from "@/lib/stream";
import { API } from "@/lib/api";
import type { Track } from "@/types";

type AudioState = {
  // Playback state
  isPlaying: boolean;
  isLoading: boolean;
  currentTrack: Track | null;
  currentTime: number;
  duration: number;
  volume: number;
  
  // Queue
  queue: Track[];
  index: number;
  
  // Actions
  playTrack: (track: Track) => Promise<void>;
  playFromGoal: (goal: string) => Promise<void>;
  setQueue: (tracks: Track[], startAt?: number) => Promise<void>;
  play: () => void;
  pause: () => void;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  
  // Internal
  setPlaying: (playing: boolean) => void;
  setLoading: (loading: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  error?: string;
  setError: (error?: string) => void;
};

// Single audio element
let audioElement: HTMLAudioElement | null = null;

const getAudioElement = (): HTMLAudioElement => {
  if (audioElement && document.body.contains(audioElement)) return audioElement;
  
  audioElement = document.getElementById("audio-player") as HTMLAudioElement;
  if (!audioElement) {
    audioElement = document.createElement("audio");
    audioElement.id = "audio-player";
    audioElement.preload = "metadata";
    audioElement.crossOrigin = "anonymous";
    audioElement.style.display = "none";
    document.body.appendChild(audioElement);
  }
  return audioElement;
};

export const useAudioStore = create<AudioState>((set, get) => {
  let audio: HTMLAudioElement;
  
  // Initialize audio element and events
  const initAudio = () => {
    if (audio) return audio;
    
    audio = getAudioElement();
    
    audio.addEventListener("play", () => set({ isPlaying: true }));
    audio.addEventListener("pause", () => set({ isPlaying: false }));
    audio.addEventListener("ended", () => {
      set({ isPlaying: false });
      get().next();
    });
    audio.addEventListener("timeupdate", () => {
      set({ currentTime: audio.currentTime });
    });
    audio.addEventListener("loadedmetadata", () => {
      set({ duration: audio.duration || 0 });
    });
    audio.addEventListener("error", () => {
      set({ isPlaying: false, error: "Playback failed" });
    });
    
    return audio;
  };

  const loadTrack = async (track: Track) => {
    const audio = initAudio();
    set({ isLoading: true, error: undefined });
    
    try {
      const url = buildStreamUrl(track.id);
      audio.src = url;
      await audio.load();
      set({ currentTrack: track, isLoading: false });
    } catch (error) {
      set({ error: "Failed to load track", isLoading: false });
    }
  };

  return {
    // Initial state
    isPlaying: false,
    isLoading: false,
    currentTrack: null,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    queue: [],
    index: -1,

    // Actions
    playTrack: async (track: Track) => {
      await loadTrack(track);
      set({ queue: [track], index: 0 });
      get().play();
    },

    playFromGoal: async (goal: string) => {
      set({ isLoading: true, error: undefined });
      try {
        const response = await API.playlist(goal);
        const tracks = response?.tracks?.map((t: any) => ({
          id: t.id ?? t.track_id,
          title: t.title ?? "",
          artist: t.artist,
          duration: t.duration,
        })).filter((t: Track) => !!t.id) || [];
        
        if (!tracks.length) throw new Error(`No tracks for goal "${goal}"`);
        
        await get().setQueue(tracks, 0);
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    setQueue: async (tracks: Track[], startAt = 0) => {
      const validIndex = Math.max(0, Math.min(startAt, tracks.length - 1));
      set({ queue: tracks, index: validIndex });
      
      if (tracks[validIndex]) {
        await loadTrack(tracks[validIndex]);
      }
    },

    play: () => {
      const audio = initAudio();
      audio.play().catch(() => {
        set({ error: "Playback failed" });
      });
    },

    pause: () => {
      const audio = initAudio();
      audio.pause();
    },

    next: async () => {
      const { queue, index } = get();
      const nextIndex = index + 1;
      if (nextIndex < queue.length) {
        set({ index: nextIndex });
        await loadTrack(queue[nextIndex]);
        get().play();
      }
    },

    prev: async () => {
      const { queue, index } = get();
      const prevIndex = index - 1;
      if (prevIndex >= 0) {
        set({ index: prevIndex });
        await loadTrack(queue[prevIndex]);
        get().play();
      }
    },

    seek: (time: number) => {
      const audio = initAudio();
      audio.currentTime = time;
    },

    setVolume: (volume: number) => {
      const audio = initAudio();
      audio.volume = volume;
      set({ volume });
    },

    // Internal setters
    setPlaying: (playing: boolean) => set({ isPlaying: playing }),
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setCurrentTime: (time: number) => set({ currentTime: time }),
    setDuration: (duration: number) => set({ duration: duration }),
    setError: (error?: string) => set({ error }),
  };
});

// Simplified action exports for backward compatibility
export const playFromGoal = async (goal: string) => {
  await useAudioStore.getState().playFromGoal(goal);
};

export const playTrackNow = async (track: Track) => {
  await useAudioStore.getState().playTrack(track);
};
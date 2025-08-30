// Backward-compatibility shim that re-exports the new API under the old path
// This ensures all existing imports work without modification

import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { audioEngine } from "../audio/AudioEngine";
import { buildStreamUrl } from "@/lib/stream";

// Expanded AudioAPI type that matches what components expect
export type AudioAPI = {
  isReady: boolean;
  isPlaying: boolean;
  current?: { id: string; title?: string };
  queue: Array<{ id: string; title?: string }>;
  index: number;
  play: () => Promise<void> | void;
  pause: () => void;
  toggle: () => Promise<void> | void;
  next: () => Promise<void> | void;
  prev: () => Promise<void> | void;
  setQueue: (tracks: Array<{ id: string; title?: string }>, startAt?: number) => Promise<void> | void;
  playTrack: (t: { id: string; title?: string }) => Promise<void> | void;
  seek: (secs: number) => void;
  duration: number;
  currentTime: number;
  
  // Additional properties some components might expect
  state?: string;
  currentTrack?: { id: string; title?: string };
  playlist?: Array<{ id: string; title?: string }>;
  queuePosition?: number;
  repeatMode?: string;
  shuffleMode?: boolean;
  setVolume?: (volume: number) => void;
  setRepeatMode?: (mode: string) => void;
  toggleShuffle?: () => void;
  clearError?: () => void;
  retryLoad?: () => void;
  
  // Additional compatibility methods
  currentId?: string;
  setPlaylist?: (tracks: Array<{ id: string; title?: string }>, playlistId?: string) => void;
  loadTrack?: (track: { id: string; title?: string }) => Promise<void>;
};

const AudioCtx = createContext<AudioAPI | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setPlaying] = useState(false);
  const [currentId, setCurrentId] = useState<string | undefined>();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueueState] = useState<Array<{ id: string; title?: string }>>([]);
  const [index, setIndex] = useState(0);
  const [isReady, setIsReady] = useState(true);

  // Ensure single audio element exists
  useEffect(() => {
    let el = document.getElementById("np-audio") as HTMLAudioElement | null;
    if (!el) {
      el = document.createElement("audio");
      el.id = "np-audio";
      el.preload = "metadata";
      el.crossOrigin = "anonymous";
      el.style.display = "none";
      document.body.appendChild(el);
    }
  }, []);

  useEffect(() => {
    const el = audioEngine.element;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setProgress(el.currentTime);
    const onMeta = () => setDuration(el.duration || 0);
    const onEnd = () => setPlaying(false);
    const onErr = () => setPlaying(false);

    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnd);
    el.addEventListener("error", onErr);
    
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnd);
      el.removeEventListener("error", onErr);
    };
  }, []);

  const api: AudioAPI = useMemo(() => ({
    isReady,
    isPlaying,
    current: currentId ? { id: currentId, title: queue[index]?.title } : undefined,
    currentTrack: currentId ? { id: currentId, title: queue[index]?.title } : undefined,
    currentId,
    queue,
    playlist: queue,
    index,
    queuePosition: index,
    duration,
    currentTime: progress,
    state: isPlaying ? "playing" : "paused",
    repeatMode: "none",
    shuffleMode: false,

    play: async () => {
      if (currentId) {
        const url = buildStreamUrl(currentId);
        await audioEngine.play({ id: currentId, url });
      }
    },

    pause: () => audioEngine.pause(),

    toggle: async () => {
      if (isPlaying) {
        audioEngine.pause();
      } else if (currentId) {
        const url = buildStreamUrl(currentId);
        await audioEngine.play({ id: currentId, url });
      }
    },

    playTrack: async (track) => {
      setCurrentId(track.id);
      const url = buildStreamUrl(track.id);
      await audioEngine.play({ id: track.id, url });
    },

    loadTrack: async (track) => {
      setCurrentId(track.id);
      const url = buildStreamUrl(track.id);
      await audioEngine.play({ id: track.id, url });
    },

    setQueue: async (tracks, startAt = 0) => {
      setQueueState(tracks);
      setIndex(startAt);
      if (tracks[startAt]) {
        setCurrentId(tracks[startAt].id);
        const url = buildStreamUrl(tracks[startAt].id);
        await audioEngine.play({ id: tracks[startAt].id, url });
      }
    },

    setPlaylist: (tracks, playlistId) => {
      setQueueState(tracks);
      setIndex(0);
      if (tracks[0]) {
        setCurrentId(tracks[0].id);
      }
    },

    next: async () => {
      const nextIndex = Math.min(index + 1, queue.length - 1);
      if (queue[nextIndex]) {
        setIndex(nextIndex);
        setCurrentId(queue[nextIndex].id);
        const url = buildStreamUrl(queue[nextIndex].id);
        await audioEngine.play({ id: queue[nextIndex].id, url });
      }
    },

    prev: async () => {
      const prevIndex = Math.max(index - 1, 0);
      if (queue[prevIndex]) {
        setIndex(prevIndex);
        setCurrentId(queue[prevIndex].id);
        const url = buildStreamUrl(queue[prevIndex].id);
        await audioEngine.play({ id: queue[prevIndex].id, url });
      }
    },

    seek: (seconds) => {
      audioEngine.seek(seconds);
    },

    // Optional methods that some components might call
    setVolume: (volume: number) => {
      audioEngine.element.volume = Math.max(0, Math.min(1, volume));
    },

    setRepeatMode: () => {
      // No-op for now
    },

    toggleShuffle: () => {
      // No-op for now  
    },

    clearError: () => {
      // No-op for now
    },

    retryLoad: () => {
      // No-op for now
    },

  }), [isReady, isPlaying, currentId, progress, duration, queue, index]);

  return <AudioCtx.Provider value={api}>{children}</AudioCtx.Provider>;
};

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    throw new Error("useAudio must be used within AudioProvider (AudioContext compatibility shim)");
  }
  return ctx;
}

// Also export the specific hooks that some components use
export const useNewAudio = useAudio;
export const usePlay = () => {
  const audio = useAudio();
  return {
    safePlay: audio.playTrack,
    currentId: audio.currentId,
    isPlaying: audio.isPlaying,
  };
};

export const usePlayer = () => {
  const audio = useAudio();
  return audio;
};
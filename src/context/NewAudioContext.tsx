import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { audioEngine } from "../audio/AudioEngine";

type Ctx = {
  playById: (id: string) => Promise<void>;
  pause: () => void;
  isPlaying: boolean;
  currentId?: string;
  progress: number;
  duration: number;
  
  // Compatibility fields for existing components
  state?: "playing" | "paused";
  currentTrack?: { id: string; title?: string };
  setPlaylist?: (tracks: Array<{ id: string; title?: string }>, playlistId?: string) => void;
  loadTrack?: (t: { id: string; title?: string }) => Promise<void>;
  toggle?: () => Promise<void>;
  setQueue?: (tracks: Array<{ id: string; title?: string }>, startAt?: number) => Promise<void>;
  playTrack?: (t: { id: string; title?: string }) => Promise<void>;
};

const AudioCtx = createContext<Ctx | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode; buildUrl: (id: string)=>string; }> = ({ children, buildUrl }) => {
  const [isPlaying, setPlaying] = useState(false);
  const [currentId, setCurrentId] = useState<string | undefined>();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

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

  const playById = async (id: string) => {
    const url = buildUrl(id);
    setCurrentId(id);
    await audioEngine.play({ id, url });
  };

  const api: Ctx = useMemo(() => ({
    playById,
    pause: () => audioEngine.pause(),
    isPlaying,
    currentId,
    progress,
    duration,
    
    // Compatibility implementations
    state: isPlaying ? "playing" : "paused",
    currentTrack: currentId ? { id: currentId } : undefined,
    setPlaylist: async (tracks, playlistId) => {
      if (tracks.length > 0) {
        await playById(tracks[0].id);
      }
    },
    loadTrack: async (track) => {
      await playById(track.id);
    },
    toggle: async () => {
      if (isPlaying) {
        audioEngine.pause();
      } else {
        if (currentId) {
          await audioEngine.play({ id: currentId, url: buildUrl(currentId) });
        }
      }
    },
    setQueue: async (tracks, startAt = 0) => {
      if (tracks.length > startAt) {
        await playById(tracks[startAt].id);
      }
    },
    playTrack: async (track) => {
      await playById(track.id);
    },
  }), [isPlaying, currentId, progress, duration, buildUrl]);

  return <AudioCtx.Provider value={api}>{children}</AudioCtx.Provider>;
};

// Fallback no-op API to prevent crashes
const NOOP_AUDIO: Ctx = {
  playById: async () => {},
  pause: () => {},
  isPlaying: false,
  currentId: undefined,
  progress: 0,
  duration: 0,
  state: "paused",
  currentTrack: undefined,
  setPlaylist: async () => {},
  loadTrack: async () => {},
  toggle: async () => {},
  setQueue: async () => {},
  playTrack: async () => {},
};

export function useAudio(): Ctx {
  const ctx = useContext(AudioCtx);
  if (ctx) return ctx;
  
  // Soft fallback: keep UI alive; log once so you can fix the wrapper.
  if (typeof window !== "undefined" && !(window as any).__audio_warned) {
    console.warn("useAudio called outside AudioProvider — returning no-op API");
    (window as any).__audio_warned = true;
  }
  
  return NOOP_AUDIO;
}

// Keep alias for backward compatibility
export const useNewAudio = useAudio;
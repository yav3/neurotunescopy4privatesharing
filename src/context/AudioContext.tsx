import React, { createContext, useContext, useMemo, useRef, useState } from "react";

type AudioCtx = {
  load: (url: string) => Promise<void>;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  isPlaying: boolean;
  currentSrc?: string;
  // Compatibility with existing code
  setPlaylist: (tracks: any[], playlistId?: string) => void;
  currentTrack: any;
  loadTrack: (track: any) => Promise<void>;
  state: string;
};

const Ctx = createContext<AudioCtx | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>();
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const loadAbort = useRef<AbortController | null>(null);

  if (!audioRef.current) {
    const el = new Audio();
    el.preload = "none";
    el.crossOrigin = "anonymous";
    el.addEventListener("play", () => setIsPlaying(true));
    el.addEventListener("pause", () => setIsPlaying(false));
    el.addEventListener("ended", () => setIsPlaying(false));
    audioRef.current = el;
  }

  const api = useMemo<AudioCtx>(() => ({
      async load(url: string) {
        // Abort any in-flight load
        loadAbort.current?.abort();
        const controller = new AbortController();
        loadAbort.current = controller;

        try {
          // Force a HEAD first to warm the cache & validate
          await fetch(url, { method: "HEAD", signal: controller.signal });
          if (controller.signal.aborted) return;

          const a = audioRef.current!;
          if (a.src !== url) {
            a.pause();
            a.src = url;
            setCurrentSrc(url);
          }
          await a.load(); // sync, but keep for semantics
        } catch (e) {
          if ((e as any).name !== "AbortError") throw e;
        }
      },
      async loadTrack(track: any) {
        setCurrentTrack(track);
        const url = `${process.env.VITE_API_BASE_URL || 'https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/api'}/stream/${track.id}`;
        await api.load(url);
      },
      play() {
        audioRef.current?.play();
      },
      pause() {
        audioRef.current?.pause();
      },
      toggle() {
        const a = audioRef.current!;
        if (a.paused) a.play();
        else a.pause();
      },
      setPlaylist(tracks: any[], playlistId?: string) {
        // Compatibility with existing code - load first track if available
        if (tracks.length > 0) {
          api.loadTrack(tracks[0]);
        }
      },
      isPlaying,
      currentSrc,
      currentTrack,
      state: isPlaying ? "playing" : "paused",
    }), [isPlaying, currentSrc, currentTrack]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
};

export const useAudio = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used inside <AudioProvider>");
  return ctx;
};
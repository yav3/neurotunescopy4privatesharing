import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { audioEngine } from "../audio/AudioEngine";

type Ctx = {
  playById: (id: string) => Promise<void>;
  pause: () => void;
  isPlaying: boolean;
  currentId?: string;
  progress: number;
  duration: number;
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

  const api: Ctx = useMemo(() => ({
    playById: async (id) => {
      const url = buildUrl(id);
      setCurrentId(id);
      await audioEngine.play({ id, url });
    },
    pause: () => audioEngine.pause(),
    isPlaying,
    currentId,
    progress,
    duration,
  }), [isPlaying, currentId, progress, duration, buildUrl]);

  return <AudioCtx.Provider value={api}>{children}</AudioCtx.Provider>;
};

export function useNewAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useNewAudio must be used within AudioProvider");
  return ctx;
}
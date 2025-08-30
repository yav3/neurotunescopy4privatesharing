// Route all legacy imports to the new context.
export {
  AudioProvider,
  useAudio,
} from "./NewAudioContext";

// Re-export any types if needed
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
};
// DEPRECATED: This component is replaced by unified audioStore
// Keeping for backward compatibility but redirecting to audioStore
import React, { createContext, useContext, useMemo } from "react";
import { useAudioStore } from "@/stores/audioStore";

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
  console.log('⚠️ AudioProvider is deprecated - using unified audioStore instead');

  // Redirect all audio operations to the unified audioStore
  const audioStore = useAudioStore();
  
  const api = useMemo<AudioCtx>(() => ({
      async load(url: string) {
        console.log('🔄 AudioContext.load() redirected to audioStore');
        // Extract track ID from URL for audioStore
        const trackId = url.split('/').pop() || '';
        await audioStore.playTrack({ id: trackId, title: '', artist: '', duration: 0 });
      },
      async loadTrack(track: any) {
        console.log('🔄 AudioContext.loadTrack() redirected to audioStore');
        await audioStore.playTrack(track);
      },
      play() {
        console.log('🔄 AudioContext.play() redirected to audioStore');
        audioStore.play();
      },
      pause() {
        console.log('🔄 AudioContext.pause() redirected to audioStore');
        audioStore.pause();
      },
      toggle() {
        console.log('🔄 AudioContext.toggle() redirected to audioStore');
        if (audioStore.isPlaying) {
          audioStore.pause();
        } else {
          audioStore.play();
        }
      },
      setPlaylist(tracks: any[], playlistId?: string) {
        console.log('🔄 AudioContext.setPlaylist() redirected to audioStore');
        if (tracks.length > 0) {
          audioStore.setQueue(tracks, 0);
        }
      },
      isPlaying: audioStore.isPlaying,
      currentSrc: audioStore.currentTrack ? `stream/${audioStore.currentTrack.id}` : undefined,
      currentTrack: audioStore.currentTrack,
      state: audioStore.isPlaying ? "playing" : "paused",
    }), [audioStore]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
};

export const useAudio = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used inside <AudioProvider>");
  return ctx;
};
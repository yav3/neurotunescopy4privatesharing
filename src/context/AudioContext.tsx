// Legacy compatibility shim - routes to unified audio store
import { useAudioStore } from "@/stores/audioStore";

export const useAudio = () => {
  const store = useAudioStore();
  
  return {
    isReady: true,
    isPlaying: store.isPlaying,
    current: store.currentTrack ? { id: store.currentTrack.id, title: store.currentTrack.title } : undefined,
    currentTrack: store.currentTrack,
    queue: store.queue,
    index: store.index,
    play: store.play,
    pause: store.pause,
    toggle: async () => store.isPlaying ? store.pause() : store.play(),
    next: store.next,
    prev: store.prev,
    setQueue: store.setQueue,
    playTrack: store.playTrack,
    setPlaylist: (tracks: any[], playlistId?: string) => store.setQueue(tracks),
    loadTrack: store.playTrack,
    seek: store.seek,
    duration: store.duration,
    currentTime: store.currentTime,
    state: store.isPlaying ? "playing" : "paused",
  };
};
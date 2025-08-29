// Player diagnostics utilities
import { current } from "@/player/audio-core";

export const logPlayerState = () => {
  const state = current();
  console.log("🎵 Player State:", { 
    index: state.index, 
    queueSize: state.size, 
    backlog: state.backlog,
    currentTrack: state.track?.title || 'None'
  });
  return state;
};

export const validateQueueSize = (maxSize = 50) => {
  const state = current();
  if (state.size > maxSize) {
    console.warn(`⚠️ Queue size ${state.size} exceeds maximum ${maxSize}`);
    return false;
  }
  return true;
};
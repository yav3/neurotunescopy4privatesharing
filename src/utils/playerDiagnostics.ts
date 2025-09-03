// Player diagnostics utilities - now uses unified audio store
import { useAudioStore } from '@/stores';

export const logPlayerState = () => {
  const state = useAudioStore.getState();
  console.log("🎵 Player State:", { 
    index: state.index, 
    queueSize: state.queue.length, 
    currentTrack: state.currentTrack?.title || 'None'
  });
  return state;
};

export const validateQueueSize = (maxSize = 50) => {
  const state = useAudioStore.getState();
  if (state.queue.length > maxSize) {
    console.warn(`⚠️ Queue size ${state.queue.length} exceeds maximum ${maxSize}`);
    return false;
  }
  return true;
};
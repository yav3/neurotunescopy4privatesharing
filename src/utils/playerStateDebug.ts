// Player state debugging utilities
import { useAudioStore } from '@/stores';
import { getAudioElementId } from '@/player/constants';

export const debugPlayerState = () => {
  console.group('🎵 Player State Debug');
  
  const store = useAudioStore.getState();
  const audioElement = document.getElementById(getAudioElementId()) as HTMLAudioElement;
  
  console.log('Store State:', {
    isPlaying: store.isPlaying,
    currentTrack: store.currentTrack?.title || 'None',
    queueLength: store.queue.length,
    index: store.index,
    error: store.error,
    isLoading: store.isLoading
  });
  
  if (audioElement) {
    console.log('Audio Element:', {
      paused: audioElement.paused,
      ended: audioElement.ended,
      src: audioElement.src,
      currentTime: audioElement.currentTime,
      duration: audioElement.duration,
      readyState: audioElement.readyState,
      networkState: audioElement.networkState
    });
    
    // Check for state mismatch
    const audioPlaying = !audioElement.paused && !audioElement.ended;
    const storePlaying = store.isPlaying;
    
    if (audioPlaying !== storePlaying) {
      console.error('🚨 STATE MISMATCH!', {
        audioElementPlaying: audioPlaying,
        storeIsPlaying: storePlaying
      });
      
      // Auto-fix the mismatch
      console.log('🔧 Auto-fixing state mismatch...');
      useAudioStore.setState({ isPlaying: audioPlaying });
    }
  } else {
    console.error('❌ No audio element found!');
  }
  
  console.groupEnd();
};

export const fixPlayerState = () => {
  console.log('🔧 Fixing player state...');
  
  const store = useAudioStore.getState();
  const audioElement = document.getElementById(getAudioElementId()) as HTMLAudioElement;
  
  if (audioElement) {
    const actuallyPlaying = !audioElement.paused && !audioElement.ended;
    
    if (actuallyPlaying !== store.isPlaying) {
      console.log(`🔧 Syncing state: audio=${actuallyPlaying}, store=${store.isPlaying}`);
      useAudioStore.setState({ isPlaying: actuallyPlaying });
      return true;
    }
  }
  
  return false;
};

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).debugPlayerState = debugPlayerState;
  (window as any).fixPlayerState = fixPlayerState;
}
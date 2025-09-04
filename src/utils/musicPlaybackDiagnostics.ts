// Diagnostic utilities for music playback debugging
import { useAudioStore } from '@/stores';
import { toast } from 'sonner';
import { AUDIO_ELEMENT_ID } from '@/player/constants';

export const diagnoseMusicPlayback = () => {
  console.group('🎵 Music Playback Diagnostics');
  
  const state = useAudioStore.getState();
  console.log('Audio Store State:', {
    isPlaying: state.isPlaying,
    isLoading: state.isLoading,
    currentTrack: state.currentTrack?.title || 'None',
    queueLength: state.queue.length,
    index: state.index,
    error: state.error
  });
  
  // Check audio element
  const audioElement = document.getElementById(AUDIO_ELEMENT_ID) as HTMLAudioElement;
  if (audioElement) {
    console.log('Audio Element:', {
      src: audioElement.src,
      readyState: audioElement.readyState,
      paused: audioElement.paused,
      currentTime: audioElement.currentTime,
      duration: audioElement.duration,
      volume: audioElement.volume,
      muted: audioElement.muted,
      ended: audioElement.ended
    });
  } else {
    console.error('❌ No audio element found!');
  }
  
  // Check if there are tracks in queue
  if (state.queue.length === 0) {
    console.warn('⚠️ Queue is empty - no tracks to play');
  } else {
    console.log('Queue tracks:', state.queue.map((t, i) => ({ 
      index: i, 
      title: t.title, 
      id: t.id,
      current: i === state.index 
    })));
  }
  
  console.groupEnd();
  
  return {
    hasAudioElement: !!audioElement,
    hasCurrentTrack: !!state.currentTrack,
    hasQueue: state.queue.length > 0,
    audioElementSrc: audioElement?.src,
    state
  };
};

export const testPlayButton = async () => {
  console.log('🧪 Testing play button functionality...');
  
  const diagnostics = diagnoseMusicPlayback();
  
  if (!diagnostics.hasQueue) {
    toast.error('No tracks in queue - load a playlist first');
    return;
  }
  
  if (!diagnostics.hasAudioElement) {
    toast.error('Audio element not found');
    return;
  }
  
  try {
    console.log('🎵 Calling store.play()...');
    await useAudioStore.getState().play();
    console.log('✅ Store.play() completed');
    
    // Check if it actually started playing
    setTimeout(() => {
      const newState = useAudioStore.getState();
      if (newState.isPlaying) {
        toast.success('Music playback started successfully!');
      } else {
        toast.warning('Play was called but isPlaying is still false');
      }
    }, 500);
    
  } catch (error) {
    console.error('❌ Play test failed:', error);
    toast.error(`Play test failed: ${error}`);
  }
};

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).diagnoseMusicPlayback = diagnoseMusicPlayback;
  (window as any).testPlayButton = testPlayButton;
}
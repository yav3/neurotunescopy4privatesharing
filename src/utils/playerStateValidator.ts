// Player state validation and recovery utilities
import { useAudioStore } from '@/stores';
import { AUDIO_ELEMENT_ID } from '@/player/constants';

export class PlayerStateValidator {
  static validateAndFix(): boolean {
    console.log('🔧 Validating player state...');
    
    const store = useAudioStore.getState();
    const audio = document.getElementById(AUDIO_ELEMENT_ID) as HTMLAudioElement;
    
    if (!audio) {
      console.error('❌ No audio element found!');
      return false;
    }

    let fixed = false;
    const issues: string[] = [];

    // Check 1: isPlaying vs actual audio state
    const actuallyPlaying = !audio.paused && !audio.ended && audio.currentTime > 0;
    if (store.isPlaying !== actuallyPlaying) {
      issues.push(`isPlaying mismatch: store=${store.isPlaying}, audio=${actuallyPlaying}`);
      useAudioStore.setState({ isPlaying: actuallyPlaying });
      fixed = true;
    }

    // Check 2: currentTrack missing when queue exists and audio has src
    if (!store.currentTrack && store.queue.length > 0 && audio.src) {
      const expectedTrack = store.queue[store.index] || store.queue[0];
      if (expectedTrack) {
        issues.push(`Missing currentTrack, restoring from queue: ${expectedTrack.title}`);
        useAudioStore.setState({ 
          currentTrack: expectedTrack, 
          index: store.queue.indexOf(expectedTrack) 
        });
        fixed = true;
      }
    }

    // Check 3: Duration mismatch
    if (audio.duration && Math.abs(store.duration - audio.duration) > 1) {
      issues.push(`Duration mismatch: store=${store.duration}, audio=${audio.duration}`);
      useAudioStore.setState({ duration: audio.duration });
      fixed = true;
    }

    // Check 4: Multiple audio elements
    const allAudio = document.querySelectorAll('audio');
    if (allAudio.length > 1) {
      issues.push(`Multiple audio elements detected: ${allAudio.length}`);
      allAudio.forEach(el => {
        if (el.id !== AUDIO_ELEMENT_ID) {
          el.pause();
          el.remove();
        }
      });
      fixed = true;
    }

    if (issues.length > 0) {
      console.group('🔧 Player State Issues Fixed');
      issues.forEach(issue => console.log('✅', issue));
      console.groupEnd();
    } else {
      console.log('✅ Player state is valid');
    }

    return fixed;
  }

  static performEmergencyRecovery(): void {
    console.log('🚨 Performing emergency player recovery...');
    
    const audio = document.getElementById(AUDIO_ELEMENT_ID) as HTMLAudioElement;
    const store = useAudioStore.getState();

    // Step 1: Stop all audio
    document.querySelectorAll('audio').forEach(el => {
      el.pause();
      el.currentTime = 0;
    });

    // Step 2: Clear store state
    useAudioStore.setState({
      isPlaying: false,
      currentTime: 0,
      error: undefined
    });

    // Step 3: If there's a queue, try to restore the first track
    if (store.queue.length > 0) {
      const firstTrack = store.queue[0];
      console.log('🔄 Attempting to restore first track:', firstTrack.title);
      useAudioStore.setState({
        currentTrack: firstTrack,
        index: 0
      });
    }

    console.log('✅ Emergency recovery completed');
  }

  static startContinuousMonitoring(): void {
    setInterval(() => {
      this.validateAndFix();
    }, 10000); // Check every 10 seconds
    
    console.log('👀 Started continuous player state monitoring');
  }
}

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).PlayerStateValidator = PlayerStateValidator;
  (window as any).fixPlayer = () => PlayerStateValidator.performEmergencyRecovery();
}
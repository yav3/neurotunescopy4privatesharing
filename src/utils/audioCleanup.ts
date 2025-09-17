// Audio cleanup utilities to prevent simultaneous playback
import { AUDIO_ELEMENT_ID } from '@/player/constants';

export class AudioCleanup {
  static ensureSingleAudioElement(): HTMLAudioElement | null {
    const allAudio = document.querySelectorAll('audio');
    let mainAudio: HTMLAudioElement | null = null;

    console.log(`🔧 Audio cleanup: Found ${allAudio.length} audio elements`);

    allAudio.forEach((audio, index) => {
      if (audio.id === AUDIO_ELEMENT_ID) {
        mainAudio = audio;
        console.log(`✅ Main audio element found: ${audio.id}`);
      } else {
        console.log(`🗑️ Removing extra audio element ${index}: ${audio.id || 'unnamed'}`);
        audio.pause();
        audio.currentTime = 0;
        audio.removeAttribute('src');
        audio.remove();
      }
    });

    return mainAudio;
  }

  static stopAllAudioExcept(keepElement?: HTMLAudioElement): void {
    document.querySelectorAll('audio').forEach(audio => {
      if (audio !== keepElement && !audio.paused) {
        console.log(`⏹️ Stopping audio: ${audio.id || 'unnamed'}`);
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }

  static logAudioState(): void {
    const allAudio = document.querySelectorAll('audio');
    console.group('🎵 Audio State Debug');
    console.log(`Total audio elements: ${allAudio.length}`);
    
    allAudio.forEach((audio, i) => {
      console.log(`Audio ${i + 1}:`, {
        id: audio.id || 'unnamed',
        paused: audio.paused,
        currentTime: audio.currentTime,
        src: audio.src,
        ended: audio.ended
      });
    });
    
    console.groupEnd();
  }

  static performCleanup(): HTMLAudioElement | null {
    console.log('🧹 Performing comprehensive audio cleanup...');
    
    // Stop all audio
    this.stopAllAudioExcept();
    
    // Ensure only one audio element
    const mainAudio = this.ensureSingleAudioElement();
    
    // Log final state
    this.logAudioState();
    
    return mainAudio;
  }
}

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).AudioCleanup = AudioCleanup;
}
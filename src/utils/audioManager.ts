/**
 * Singleton Audio Manager - ensures only ONE audio plays at a time
 * Prevents duplicate audio issues caused by React StrictMode and component lifecycle
 */

type AudioType = 'intro' | 'main';

interface AudioInstance {
  element: HTMLAudioElement;
  type: AudioType;
  id: string;
}

class AudioManager {
  private static instance: AudioManager;
  private currentAudio: AudioInstance | null = null;
  private mainAudioElement: HTMLAudioElement | null = null;
  
  private constructor() {
    console.log('🎵 AudioManager initialized');
  }
  
  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }
  
  /**
   * Register the main audio element (used by LandingPagePlayer)
   */
  registerMainAudio(element: HTMLAudioElement): void {
    this.mainAudioElement = element;
  }
  
  /**
   * Play audio - stops any currently playing audio first
   */
  async play(element: HTMLAudioElement, type: AudioType): Promise<boolean> {
    const id = Math.random().toString(36).substring(7);
    console.log(`🎵 AudioManager.play called - type: ${type}, id: ${id}`);
    
    // Stop current audio if different type
    if (this.currentAudio && this.currentAudio.type !== type) {
      console.log(`🔇 Stopping ${this.currentAudio.type} audio to play ${type}`);
      await this.stopCurrent();
    }
    
    // If same type and different element, stop the old one
    if (this.currentAudio && this.currentAudio.element !== element) {
      console.log('🔇 Stopping previous audio element');
      this.currentAudio.element.pause();
      this.currentAudio.element.src = '';
    }
    
    this.currentAudio = { element, type, id };
    
    try {
      await element.play();
      console.log(`✅ AudioManager: ${type} audio playing (${id})`);
      return true;
    } catch (err) {
      console.log(`⚠️ AudioManager: ${type} autoplay blocked (${id})`, err);
      return false;
    }
  }
  
  /**
   * Stop current audio gracefully
   */
  async stopCurrent(): Promise<void> {
    if (!this.currentAudio) return;
    
    const audio = this.currentAudio.element;
    const type = this.currentAudio.type;
    
    console.log(`🔇 AudioManager: stopping ${type} audio`);
    
    // Fade out if it's intro audio
    if (type === 'intro' && audio.volume > 0) {
      await this.fadeOut(audio);
    } else {
      audio.pause();
    }
    
    audio.src = '';
    this.currentAudio = null;
  }
  
  /**
   * Stop intro audio specifically (called when main playback starts)
   */
  stopIntro(): void {
    if (this.currentAudio?.type === 'intro') {
      console.log('🔇 AudioManager: stopping intro audio');
      this.currentAudio.element.pause();
      this.currentAudio.element.src = '';
      this.currentAudio = null;
    }
    
    // Also kill any orphaned audio elements (except main)
    document.querySelectorAll('audio').forEach((audio) => {
      if (audio !== this.mainAudioElement) {
        audio.pause();
        audio.src = '';
      }
    });
  }
  
  /**
   * Fade out audio smoothly
   */
  private fadeOut(audio: HTMLAudioElement, duration: number = 500): Promise<void> {
    return new Promise((resolve) => {
      const startVolume = audio.volume;
      const steps = 10;
      const stepTime = duration / steps;
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        audio.volume = Math.max(0, startVolume * (1 - step / steps));
        
        if (step >= steps) {
          clearInterval(timer);
          audio.pause();
          audio.volume = startVolume;
          resolve();
        }
      }, stepTime);
    });
  }
  
  /**
   * Check if intro is currently playing
   */
  isIntroPlaying(): boolean {
    return this.currentAudio?.type === 'intro' && !this.currentAudio.element.paused;
  }
  
  /**
   * Get the current audio type
   */
  getCurrentType(): AudioType | null {
    return this.currentAudio?.type || null;
  }
}

export const audioManager = AudioManager.getInstance();

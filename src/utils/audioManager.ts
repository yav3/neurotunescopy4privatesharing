/**
 * Singleton Audio Manager - ensures only ONE audio plays at a time
 * Prevents duplicate audio issues caused by React StrictMode and component lifecycle
 */

type AudioType = 'intro' | 'main';

class AudioManager {
  private static instance: AudioManager;
  private introAudio: HTMLAudioElement | null = null;
  private mainAudioElement: HTMLAudioElement | null = null;
  private currentType: AudioType | null = null;
  private introPlaying = false;
  private introPlayPromise: Promise<boolean> | null = null;
  
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
   * Play intro audio - uses singleton element to prevent duplicates
   * Returns existing promise if already playing to handle StrictMode double-mount
   */
  async playIntro(src: string, volume: number = 0.5): Promise<boolean> {
    console.log('🎵 AudioManager.playIntro called');
    
    // If intro is already playing or pending, return existing state
    if (this.introPlaying && this.introAudio && !this.introAudio.paused) {
      console.log('🎵 Intro already playing, skipping duplicate');
      return true;
    }
    
    // If there's a pending play promise, wait for it instead of creating new
    if (this.introPlayPromise) {
      console.log('🎵 Intro play already pending, waiting...');
      return this.introPlayPromise;
    }
    
    // Stop any existing intro audio first (but don't set introPlaying to false yet)
    if (this.introAudio) {
      this.introAudio.pause();
      this.introAudio.src = '';
      this.introAudio = null;
    }
    
    // Create new intro audio element
    this.introAudio = new Audio(src);
    this.introAudio.volume = volume;
    this.introAudio.crossOrigin = 'anonymous';
    this.introAudio.loop = false;
    this.currentType = 'intro';
    
    // Create and store the play promise
    this.introPlayPromise = (async () => {
      try {
        if (!this.introAudio) return false;
        await this.introAudio.play();
        this.introPlaying = true;
        console.log('✅ AudioManager: intro audio playing');
        return true;
      } catch (err: any) {
        // Ignore AbortError from StrictMode race condition
        if (err?.name === 'AbortError') {
          console.log('⚠️ AudioManager: intro play aborted (expected in StrictMode)');
        } else {
          console.log('⚠️ AudioManager: intro autoplay blocked', err);
        }
        return false;
      } finally {
        this.introPlayPromise = null;
      }
    })();
    
    return this.introPlayPromise;
  }
  
  /**
   * Retry playing intro on user interaction
   */
  async retryIntro(): Promise<boolean> {
    if (this.introAudio && this.introAudio.paused) {
      try {
        await this.introAudio.play();
        this.introPlaying = true;
        console.log('✅ AudioManager: intro audio playing (retry)');
        return true;
      } catch (err) {
        return false;
      }
    }
    return this.introPlaying;
  }
  
  /**
   * Play main audio element - stops intro first
   * Used by LandingPagePlayer for main playback
   */
  async play(element: HTMLAudioElement, type: AudioType): Promise<boolean> {
    console.log(`🎵 AudioManager.play called - type: ${type}`);
    
    // Always stop intro first when playing main audio
    if (type === 'main') {
      this.stopIntroImmediate();
    }
    
    this.currentType = type;
    
    try {
      await element.play();
      console.log(`✅ AudioManager: ${type} audio playing`);
      return true;
    } catch (err) {
      console.log(`⚠️ AudioManager: ${type} autoplay blocked`, err);
      return false;
    }
  }
  
  /**
   * Stop intro audio immediately (no fade)
   */
  private stopIntroImmediate(): void {
    if (this.introAudio) {
      console.log('🔇 AudioManager: stopping intro audio');
      this.introAudio.pause();
      this.introAudio.src = '';
      this.introAudio = null;
    }
    this.introPlaying = false;
    this.introPlayPromise = null;
    
    // Also kill any orphaned audio elements (except main)
    document.querySelectorAll('audio').forEach((audio) => {
      if (audio !== this.mainAudioElement && !audio.id?.startsWith('main-')) {
        audio.pause();
        audio.src = '';
      }
    });
  }
  
  /**
   * Stop intro audio (public API) - called when main playback starts
   */
  stopIntro(): void {
    this.stopIntroImmediate();
    if (this.currentType === 'intro') {
      this.currentType = null;
    }
  }
  
  /**
   * Check if intro is currently playing
   */
  isIntroPlaying(): boolean {
    return this.introPlaying && this.introAudio !== null && !this.introAudio.paused;
  }
  
  /**
   * Get the current audio type
   */
  getCurrentType(): AudioType | null {
    return this.currentType;
  }
}

export const audioManager = AudioManager.getInstance();

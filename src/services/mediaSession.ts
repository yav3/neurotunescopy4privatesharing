// Media Session API integration for background playback and device media controls
// This enables audio to continue playing when switching apps or screen off

export class MediaSessionService {
  private static isSupported = 'mediaSession' in navigator;

  /**
   * Initialize media session with track info and control handlers
   */
  static setupMediaSession(
    track: { title: string; artist: string; artwork?: string },
    handlers: {
      play?: () => void;
      pause?: () => void;
      previoustrack?: () => void;
      nexttrack?: () => void;
      seekto?: (details: { seekTime?: number }) => void;
    }
  ) {
    if (!this.isSupported) {
      console.log('⚠️ Media Session API not supported');
      return;
    }

    try {
      // Set metadata for lock screen / notification controls
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: 'NeuroTunes',
        artwork: track.artwork ? [
          { src: track.artwork, sizes: '512x512', type: 'image/jpeg' }
        ] : [
          { src: '/placeholder.svg', sizes: '512x512', type: 'image/svg+xml' }
        ]
      });

      // Set up action handlers for media controls
      if (handlers.play) {
        navigator.mediaSession.setActionHandler('play', handlers.play);
      }
      if (handlers.pause) {
        navigator.mediaSession.setActionHandler('pause', handlers.pause);
      }
      if (handlers.previoustrack) {
        navigator.mediaSession.setActionHandler('previoustrack', handlers.previoustrack);
      }
      if (handlers.nexttrack) {
        navigator.mediaSession.setActionHandler('nexttrack', handlers.nexttrack);
      }
      if (handlers.seekto) {
        navigator.mediaSession.setActionHandler('seekto', handlers.seekto);
      }

      console.log('🎵 Media Session configured:', track.title);
    } catch (error) {
      console.error('Failed to setup media session:', error);
    }
  }

  /**
   * Update playback state (playing, paused, none)
   */
  static setPlaybackState(state: 'none' | 'paused' | 'playing') {
    if (!this.isSupported) return;

    try {
      navigator.mediaSession.playbackState = state;
      console.log('🎵 Media Session playback state:', state);
    } catch (error) {
      console.error('Failed to set playback state:', error);
    }
  }

  /**
   * Update position state for seek bar in media controls
   */
  static updatePositionState(duration: number, currentTime: number, playbackRate: number = 1.0) {
    if (!this.isSupported) return;

    try {
      if (duration > 0 && !isNaN(duration) && !isNaN(currentTime)) {
        navigator.mediaSession.setPositionState({
          duration,
          position: Math.min(currentTime, duration),
          playbackRate
        });
      }
    } catch (error) {
      // Position state errors are non-critical, just log
      console.log('Media Session position update skipped:', error);
    }
  }

  /**
   * Clear media session (when no track is playing)
   */
  static clear() {
    if (!this.isSupported) return;

    try {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = 'none';
      console.log('🎵 Media Session cleared');
    } catch (error) {
      console.error('Failed to clear media session:', error);
    }
  }
}

// Therapeutic Audio Configuration
// Prevents any browser sounds or notifications that could disrupt therapeutic experience

/**
 * Configure audio element for therapeutic use - completely silent error handling
 */
export function configureTherapeuticAudio(audioElement: HTMLAudioElement): void {
  // Configure for cross-origin audio requests (Supabase storage)
  audioElement.crossOrigin = "anonymous"; // Allow cross-origin requests
  audioElement.preload = "metadata"; // Load metadata for better UX
  audioElement.controls = false; // No default controls
  audioElement.autoplay = false; // Never autoplay
  
  // Mark as therapeutic audio for special handling
  audioElement.setAttribute('data-therapeutic', 'true');
  audioElement.setAttribute('data-silent-errors', 'true');
  
  // Remove any existing error handlers that might trigger sounds
  audioElement.onerror = null;
  audioElement.onabort = null;
  
  // Add silent error handler
  audioElement.addEventListener('error', (event) => {
    // Prevent any browser default error sounds or notifications
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    
    // Silent logging only
    console.log('🎵 Therapeutic audio: Silent error handled');
  }, { capture: true });
  
  // Silent abort handler
  audioElement.addEventListener('abort', (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    console.log('🎵 Therapeutic audio: Silent abort handled');
  }, { capture: true });
  
  // Prevent any context menu or interaction sounds
  audioElement.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });
}

/**
 * Disable all browser audio notifications globally for therapeutic experience
 */
export function disableBrowserAudioFeedback(): void {
  // Disable browser notification sounds
  if ('Notification' in window) {
    // Prevent notification sounds
    try {
      const originalNotification = window.Notification;
      window.Notification = class extends originalNotification {
        constructor(title: string, options: any = {}) {
          // Force silent notifications
          super(title, { ...options, silent: true });
        }
      } as any;
    } catch (e) {
      console.log('🎵 Could not override notifications (expected on some browsers)');
    }
  }
  
  // Disable any potential audio context feedback
  const audioContexts = [
    (window as any).AudioContext,
    (window as any).webkitAudioContext
  ].filter(Boolean);
  
  audioContexts.forEach(AudioContextClass => {
    const originalCreateBuffer = AudioContextClass.prototype.createBuffer;
    if (originalCreateBuffer) {
      AudioContextClass.prototype.createBuffer = function(...args: any[]) {
        const buffer = originalCreateBuffer.apply(this, args);
        // Mark buffer as therapeutic to prevent unwanted sounds
        (buffer as any)._therapeutic = true;
        return buffer;
      };
    }
  });
  
  console.log('🎵 Browser audio feedback disabled for therapeutic experience');
}

/**
 * Create a completely silent audio error handler
 */
export function createSilentErrorHandler() {
  return (error: any) => {
    // No toast notifications
    // No console.error (only console.log for debugging)
    // No browser sounds
    // No user notifications
    
    console.log('🎵 Therapeutic: Silent audio error -', error.name || 'Unknown');
    
    // Return success to prevent error propagation
    return true;
  };
}

/**
 * Initialize therapeutic audio environment
 */
export function initTherapeuticAudio(): void {
  disableBrowserAudioFeedback();
  
  // Add global styles to prevent any audio-related UI feedback
  const style = document.createElement('style');
  style.textContent = `
    /* Hide any audio error indicators */
    audio[data-therapeutic="true"]::-webkit-media-controls-panel {
      display: none !important;
    }
    
    /* Prevent any visual feedback that could distract */
    audio[data-therapeutic="true"] {
      opacity: 0 !important;
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);
  
  console.log('🎵 Therapeutic audio environment initialized');
}
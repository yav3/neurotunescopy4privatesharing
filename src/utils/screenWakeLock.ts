// Screen Wake Lock utility to prevent playback interruptions
let wakeLock: WakeLockSentinel | null = null;

export class ScreenWakeLock {
  static async request(): Promise<boolean> {
    if (!('wakeLock' in navigator)) {
      console.log('⚠️ Wake Lock API not supported');
      return false;
    }

    try {
      // Release any existing wake lock first
      await this.release();
      
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('🔒 Screen wake lock acquired - preventing sleep during audio playback');
      
      // Handle wake lock release (e.g., when tab becomes hidden)
      wakeLock.addEventListener('release', () => {
        console.log('🔓 Screen wake lock released');
      });
      
      return true;
    } catch (error) {
      console.log('❌ Failed to acquire wake lock:', error);
      return false;
    }
  }

  static async release(): Promise<void> {
    if (wakeLock) {
      try {
        await wakeLock.release();
        wakeLock = null;
        console.log('🔓 Screen wake lock manually released');
      } catch (error) {
        console.log('❌ Error releasing wake lock:', error);
      }
    }
  }

  static isActive(): boolean {
    return wakeLock !== null && !wakeLock.released;
  }

  // Handle visibility changes - reacquire wake lock when page becomes visible
  static handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible' && wakeLock?.released) {
      console.log('🔄 Page visible again - reacquiring wake lock');
      await ScreenWakeLock.request();
    }
  };
}

// Auto-setup visibility change listener
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', ScreenWakeLock.handleVisibilityChange);
}
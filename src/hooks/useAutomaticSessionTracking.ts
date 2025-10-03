import { useEffect, useCallback } from 'react';
import { useAudioStore } from '@/stores';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { SessionTracker } from '@/services/sessionTracker';

/**
 * Hook to automatically track listening sessions for all users
 * This ensures no listening activity goes unrecorded
 */
export const useAutomaticSessionTracking = () => {
  const { user } = useAuthContext();
  const { currentTrack, isPlaying, lastGoal } = useAudioStore();

  // Auto-start session when user starts playing music
  useEffect(() => {
    if (user && isPlaying && currentTrack) {
      console.log('🎵 Auto-starting session tracking for user:', user.id);
      
      // Determine session type based on last goal used
      const sessionType = lastGoal ? 'therapeutic' : 'casual';
      SessionTracker.ensureSessionActive(sessionType, lastGoal || undefined);
      
      // Track the current track
      SessionTracker.trackPlayed(
        currentTrack.id?.toString() || 'unknown',
        currentTrack.genre || undefined
      );
    }
  }, [user, isPlaying, currentTrack, lastGoal]);

  // Track when songs are skipped
  const trackSkip = useCallback((trackId: string) => {
    if (user) {
      SessionTracker.trackSkipped(trackId);
    }
  }, [user]);

  // Auto-save sessions periodically (every 5 minutes)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const sessionInfo = SessionTracker.getCurrentSessionInfo();
      if (sessionInfo && sessionInfo.duration >= 5) { // At least 5 minutes
        console.log('⏰ Auto-saving session (periodic):', sessionInfo);
        SessionTracker.forceSave(user.id);
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  // Save session when user stops playing for extended period
  useEffect(() => {
    if (!user) return;

    let inactivityTimer: NodeJS.Timeout;

    if (!isPlaying) {
      // If not playing, start inactivity timer
      inactivityTimer = setTimeout(() => {
        console.log('💤 Ending session due to inactivity');
        SessionTracker.endSession(user.id);
      }, 10 * 60 * 1000); // 10 minutes of inactivity
    }

    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, [isPlaying, user]);

  // Force save on unmount
  useEffect(() => {
    return () => {
      if (user) {
        SessionTracker.forceSave(user.id);
      }
    };
  }, [user]);

  return {
    trackSkip,
    getCurrentSession: () => SessionTracker.getCurrentSessionInfo(),
    manualSave: () => user ? SessionTracker.forceSave(user.id) : Promise.resolve(false)
  };
};
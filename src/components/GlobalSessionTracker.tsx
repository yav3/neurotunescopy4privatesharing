import React, { useEffect } from 'react';
import { useAutomaticSessionTracking } from '@/hooks/useAutomaticSessionTracking';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { toast } from '@/hooks/use-toast';

/**
 * Global component to ensure session tracking is always active
 * Add this to your main App component to track all user listening activity
 */
export const GlobalSessionTracker: React.FC = () => {
  const { user } = useAuthContext();
  const { manualSave, getCurrentSession } = useAutomaticSessionTracking();

  // Show session info to user occasionally
  useEffect(() => {
    if (!user) return;

    const showSessionInfo = () => {
      const session = getCurrentSession();
      if (session && session.duration >= 15) { // Show after 15 minutes
        toast({
          title: "Session Tracking Active",
          description: `You've been listening for ${session.duration} minutes with ${session.tracksPlayed} tracks played.`,
        });
      }
    };

    // Show session info every 15 minutes
    const interval = setInterval(showSessionInfo, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, getCurrentSession]);

  // Emergency save on critical errors
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('🚨 Critical error detected, saving session:', error);
      manualSave();
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🚨 Unhandled promise rejection, saving session:', event);
      manualSave();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [manualSave]);

  // This component doesn't render anything, it just provides global session tracking
  return null;
};
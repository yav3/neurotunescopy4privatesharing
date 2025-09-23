import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Analytics } from '@/utils/analytics';
import { useAuthContext } from '@/components/auth/AuthProvider';

/**
 * Hook to track user access patterns and page views
 */
export const useAccessTracking = () => {
  const location = useLocation();
  const { user } = useAuthContext();
  const sessionStartTime = useRef<number>(Date.now());
  const lastPageTime = useRef<number>(Date.now());

  // Track page views
  useEffect(() => {
    const pageStartTime = Date.now();
    const timeOnPreviousPage = pageStartTime - lastPageTime.current;
    
    Analytics.track('page_view', {
      page: location.pathname,
      user_id: user?.id || 'anonymous',
      user_authenticated: !!user,
      time_on_previous_page: timeOnPreviousPage,
      timestamp: new Date().toISOString()
    });

    lastPageTime.current = pageStartTime;
    
    // Track page leave when component unmounts or location changes
    return () => {
      const timeOnPage = Date.now() - pageStartTime;
      Analytics.track('page_leave', {
        page: location.pathname,
        time_on_page: timeOnPage,
        user_id: user?.id || 'anonymous',
        timestamp: new Date().toISOString()
      });
    };
  }, [location.pathname, user?.id]);

  // Track session duration on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessionDuration = Date.now() - sessionStartTime.current;
      if (user) {
        Analytics.trackSessionEnd(user.id, sessionDuration);
      }
      
      Analytics.track('app_session_end', {
        session_duration: sessionDuration,
        user_id: user?.id || 'anonymous',
        timestamp: new Date().toISOString()
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user?.id]);

  // Track user activity (clicks, scrolls, etc.)
  useEffect(() => {
    let activityCount = 0;
    const activityThreshold = 10; // Track every 10 interactions
    
    const trackActivity = (eventType: string) => {
      activityCount++;
      
      if (activityCount % activityThreshold === 0) {
        Analytics.track('user_activity', {
          event_type: eventType,
          page: location.pathname,
          activity_count: activityCount,
          user_id: user?.id || 'anonymous',
          timestamp: new Date().toISOString()
        });
      }
    };

    const handleClick = () => trackActivity('click');
    const handleScroll = () => trackActivity('scroll');
    const handleKeydown = () => trackActivity('keydown');

    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [location.pathname, user?.id]);

  return {
    trackCustomEvent: (event: string, properties?: Record<string, any>) => {
      Analytics.track(event, {
        page: location.pathname,
        user_id: user?.id || 'anonymous',
        ...properties
      });
    }
  };
};
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/auth/AuthProvider';

/**
 * Comprehensive user behavior tracking hook
 * Tracks page views, session duration, user interactions
 */
export const useComprehensiveTracking = () => {
  const { user } = useAuthContext();
  const location = useLocation();
  const sessionStartRef = useRef<number>(Date.now());
  const lastPageRef = useRef<string>('');
  const pageStartRef = useRef<number>(Date.now());
  const sessionIdRef = useRef<string>(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Track page views and navigation
  useEffect(() => {
    const currentPath = location.pathname;
    const now = Date.now();
    
    // Track time spent on previous page
    if (lastPageRef.current && lastPageRef.current !== currentPath) {
      const timeOnPage = Math.round((now - pageStartRef.current) / 1000);
      trackEvent('page_leave', {
        page: lastPageRef.current,
        duration_seconds: timeOnPage
      });
    }

    // Track new page view
    trackEvent('page_view', {
      page: currentPath,
      referrer: document.referrer
    });

    lastPageRef.current = currentPath;
    pageStartRef.current = now;
  }, [location.pathname, user]);

  // Track session start
  useEffect(() => {
    if (user) {
      trackEvent('session_start', {
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });

      // Create session record
      createUserSession();
    }
  }, [user]);

  // Track session end on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user) {
        const sessionDuration = Math.round((Date.now() - sessionStartRef.current) / 1000);
        trackEvent('session_end', {
          session_duration_seconds: sessionDuration,
          pages_visited: getVisitedPagesCount()
        });
        
        // Update session record
        updateUserSession(sessionDuration);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user]);

  // Track user interactions
  useEffect(() => {
    let clickCount = 0;
    let scrollCount = 0;
    
    const handleClick = (event: MouseEvent) => {
      clickCount++;
      if (clickCount % 10 === 0) { // Track every 10 clicks
        trackEvent('user_interaction', {
          type: 'clicks',
          count: clickCount,
          target: (event.target as Element)?.tagName?.toLowerCase()
        });
      }
    };

    const handleScroll = () => {
      scrollCount++;
      if (scrollCount % 20 === 0) { // Track every 20 scrolls
        trackEvent('user_interaction', {
          type: 'scroll',
          count: scrollCount,
          scroll_position: window.scrollY
        });
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [user]);

  const trackEvent = async (eventType: string, details: Record<string, any> = {}) => {
    if (!user) return;

    try {
      // For now, just log events until tables are properly configured
      console.log('User Event:', {
        user_id: user.id,
        session_id: sessionIdRef.current,
        event_type: eventType,
        page_path: location.pathname,
        event_details: details,
        timestamp: new Date().toISOString()
      });
      
      // TODO: Implement proper event tracking once tables are ready
      // await supabase.from('user_activity_events').insert({...});
    } catch (error) {
      console.debug('Event tracking not available:', error);
    }
  };

  const createUserSession = async () => {
    if (!user) return;

    try {
      // For now, just log session start until tables are properly configured
      console.log('Session Start:', {
        id: sessionIdRef.current,
        user_id: user.id,
        session_start: new Date().toISOString(),
        device_info: {
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      });
      
      // TODO: Implement proper session tracking once tables are ready
      // await supabase.from('user_sessions').insert({...});
    } catch (error) {
      console.debug('Session tracking not available:', error);
    }
  };

  const updateUserSession = async (totalDuration: number) => {
    if (!user) return;

    try {
      // For now, just log session end until tables are properly configured
      console.log('Session End:', {
        session_id: sessionIdRef.current,
        user_id: user.id,
        session_end: new Date().toISOString(),
        total_duration_seconds: totalDuration
      });
      
      // TODO: Implement proper session updates once tables are ready
      // await supabase.from('user_sessions').update({...});
    } catch (error) {
      console.debug('Session update not available:', error);
    }
  };

  const getVisitedPagesCount = (): number => {
    // Simple implementation - could be enhanced
    return new Set([lastPageRef.current, location.pathname]).size;
  };

  return {
    trackEvent,
    sessionId: sessionIdRef.current
  };
};
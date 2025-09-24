import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
  screen: string;
  [key: string]: any; // Make it compatible with Json type
}

interface UserSession {
  id: string;
  device_info: DeviceInfo;
  last_accessed: string;
  ip_address?: string | null;
  user_agent: string | null;
  is_active: boolean;
  created_at: string;
  user_id: string;
}

export function useSessionManager(user: User | null) {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const getDeviceInfo = (): DeviceInfo => {
    const ua = navigator.userAgent;
    
    // Browser detection
    let browser = 'Unknown';
    if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (ua.indexOf('Safari') > -1) browser = 'Safari';
    else if (ua.indexOf('Edge') > -1) browser = 'Edge';
    
    // OS detection
    let os = 'Unknown';
    if (ua.indexOf('Windows') > -1) os = 'Windows';
    else if (ua.indexOf('Mac') > -1) os = 'macOS';
    else if (ua.indexOf('Linux') > -1) os = 'Linux';
    else if (ua.indexOf('Android') > -1) os = 'Android';
    else if (ua.indexOf('iOS') > -1) os = 'iOS';
    
    // Device detection
    let device = 'Desktop';
    if (/Mobi|Android/i.test(ua)) device = 'Mobile';
    else if (/Tablet|iPad/i.test(ua)) device = 'Tablet';
    
    return {
      browser,
      os,
      device,
      screen: `${screen.width}x${screen.height}`
    };
  };

  const createSession = async () => {
    if (!user) return;

    const deviceInfo = getDeviceInfo();
    
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          device_info: deviceInfo,
          user_agent: navigator.userAgent
        })
        .select('id')
        .single();

      if (!error && data) {
        setCurrentSessionId(data.id);
        localStorage.setItem('session_id', data.id);
        console.log('Session created:', data.id);
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const updateSessionActivity = async () => {
    const sessionId = currentSessionId || localStorage.getItem('session_id');
    if (!sessionId || !user) return;

    try {
      const { error } = await supabase.rpc('update_session_activity', {
        session_id: sessionId
      });
      
      if (error) {
        console.error('Error updating session activity:', error);
      }
    } catch (error) {
      console.error('Error updating session activity:', error);
    }
  };

  const loadUserSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_accessed', { ascending: false });

      if (!error && data) {
        // Map the data to ensure it matches our interface structure
        const mappedSessions = data.map(session => ({
          id: session.id,
          device_info: session.device_info as DeviceInfo,
          last_accessed: session.last_accessed,
          ip_address: session.ip_address as string | null,
          user_agent: session.user_agent as string | null,
          is_active: session.is_active,
          created_at: session.created_at,
          user_id: session.user_id
        }));
        setSessions(mappedSessions);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const revokeSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('id', sessionId)
        .eq('user_id', user?.id);

      if (!error) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        
        // If revoking current session, clear local storage
        if (sessionId === currentSessionId) {
          localStorage.removeItem('session_id');
          setCurrentSessionId(null);
        }
      }
    } catch (error) {
      console.error('Error revoking session:', error);
    }
  };

  const revokeAllOtherSessions = async () => {
    const sessionId = currentSessionId || localStorage.getItem('session_id');
    if (!sessionId || !user) return;

    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .neq('id', sessionId);

      if (!error) {
        setSessions(prev => prev.filter(s => s.id === sessionId));
      }
    } catch (error) {
      console.error('Error revoking other sessions:', error);
    }
  };

  // Initialize session when user logs in
  useEffect(() => {
    if (user) {
      const existingSessionId = localStorage.getItem('session_id');
      
      if (existingSessionId) {
        setCurrentSessionId(existingSessionId);
        updateSessionActivity();
      } else {
        createSession();
      }
      
      loadUserSessions();
    } else {
      // Clear session data when user logs out
      localStorage.removeItem('session_id');
      setCurrentSessionId(null);
      setSessions([]);
    }
  }, [user]);

  // Update session activity periodically
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      updateSessionActivity();
    }, 5 * 60 * 1000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [user, currentSessionId]);

  // Update activity on page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateSessionActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return {
    sessions,
    currentSessionId,
    revokeSession,
    revokeAllOtherSessions,
    refreshSessions: loadUserSessions
  };
}
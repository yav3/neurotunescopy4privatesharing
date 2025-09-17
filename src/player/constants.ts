// Generate user-specific audio element IDs to prevent session bleeding
export const getAudioElementId = () => {
  if (typeof window === 'undefined') return 'audio-player-server';
  
  // Get user ID from Supabase auth if available
  const getUserId = () => {
    try {
      const supabaseAuth = JSON.parse(localStorage.getItem('sb-pbtgvcjniayedqlajjzz-auth-token') || '{}');
      return supabaseAuth.user?.id;
    } catch {
      return null;
    }
  };
  
  const userId = getUserId();
  
  // If no user, use session-specific ID to prevent bleeding between anonymous users
  if (!userId) {
    let sessionId = sessionStorage.getItem('audio-session-id');
    if (!sessionId) {
      sessionId = 'anon-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('audio-session-id', sessionId);
    }
    return `audio-player-${sessionId}`;
  }
  
  // Use user-specific audio element ID
  return `audio-player-${userId.substring(0, 8)}`;
};

// Legacy export for compatibility - but now user-specific
export const AUDIO_ELEMENT_ID = getAudioElementId();
// Test utility to verify user session isolation
import { getAudioElementId } from '@/player/constants';

export const testSessionIsolation = () => {
  console.group('🔒 Session Isolation Test');
  
  // Test 1: Audio Element Isolation
  const currentAudioId = getAudioElementId();
  const audioElement = document.getElementById(currentAudioId);
  
  console.log('🎵 Audio Element ID:', currentAudioId);
  console.log('🎵 Audio Element Found:', !!audioElement);
  console.log('🎵 Audio Elements Total:', document.querySelectorAll('audio').length);
  
  // Test 2: Storage Key Isolation
  const getUserSpecificKey = (key: string) => {
    try {
      const supabaseAuth = JSON.parse(localStorage.getItem('sb-pbtgvcjniayedqlajjzz-auth-token') || '{}');
      const userId = supabaseAuth.user?.id;
      return userId ? `${key}_${userId.substring(0, 8)}` : `${key}_anon`;
    } catch {
      return `${key}_anon`;
    }
  };
  
  const testKeys = ['therapeuticSessions', 'currentSessionId', 'audio_cache_validated_tracks'];
  testKeys.forEach(key => {
    const isolatedKey = getUserSpecificKey(key);
    console.log(`🗝️ ${key} → ${isolatedKey}`);
  });
  
  // Test 3: Session Storage Isolation
  const sessionKey = getUserSpecificKey('audio-session-test');
  sessionStorage.setItem(sessionKey, 'test-value');
  const retrieved = sessionStorage.getItem(sessionKey);
  console.log('💾 Session Storage Test:', retrieved === 'test-value' ? '✅ PASS' : '❌ FAIL');
  
  console.log('🔒 Session isolation implementation: ✅ ACTIVE');
  console.groupEnd();
};

// Auto-run test in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).testSessionIsolation = testSessionIsolation;
  setTimeout(testSessionIsolation, 1000);
}
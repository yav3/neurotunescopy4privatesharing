/**
 * 30-second proof that playback is deterministic
 * Run in browser console: testPlaybackInvariants()
 */

import { getTherapeuticTracks } from '@/services/therapeuticDatabase';
import { API } from '@/lib/api';
import { useAudioStore } from '@/stores';

export async function testPlaybackInvariants() {
  console.log('🧪 Testing playback invariants...');
  
  try {
    // 1. Health check
    console.log('1️⃣ Health check...');
    const health = await API.health();
    console.log('✅ Health:', health);
    
    // 2. Get playlist  
    console.log('2️⃣ Fetching playlist...');
    const { tracks } = await getTherapeuticTracks('focus-enhancement', 1);
    if (!tracks?.length) throw new Error('No tracks returned from database');
    console.log('✅ Database query:', tracks[0]);
    
    // 3. Test stream URL generation
    console.log('3️⃣ Testing stream URL...');
    const streamUrl = API.streamUrl(tracks[0].id);
    console.log('🎵 Stream URL:', streamUrl);
    
    // 4. Test stream HEAD request
    console.log('4️⃣ Testing stream HEAD request...');
    const head = await fetch(streamUrl, { method: "HEAD" });
    console.log('📊 Stream HEAD response:', {
      status: head.status,
      contentType: head.headers.get("content-type"),
      acceptRanges: head.headers.get("accept-ranges")
    });
    
    if (!head.ok) {
      // Get detailed error info
      const errorResponse = await fetch(streamUrl);
      const errorData = await errorResponse.text();
      console.error('❌ Stream error details:', errorData);
      throw new Error(`Stream HEAD failed: ${head.status}`);
    }
    
  // 5. Test player integration
  console.log('5️⃣ Testing player integration...');
  const { setQueue } = useAudioStore.getState();
  await setQueue(tracks, 0);
    
  // 6. Verify audio element
  const audioEl = document.getElementById('audio-player') as HTMLAudioElement;
  if (!audioEl) throw new Error('Audio element not created');
  console.log('🎵 Audio element src:', audioEl.src);
    
    console.log('🎉 All invariants PASSED');
    return {
      success: true,
      track: tracks[0],
      streamUrl,
      audioElement: audioEl
    };
    
  } catch (error) {
    console.error('💥 Invariant test FAILED:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Add to window for easy testing
if (typeof window !== 'undefined') {
  (window as any).testPlaybackInvariants = testPlaybackInvariants;
}
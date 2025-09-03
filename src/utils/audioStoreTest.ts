// Browser test utility for bullet-proof audio store
// Run in console: (window as any).testAudioStore()

import { useAudioStore } from "@/stores/audioStore";

export const testAudioStore = async () => {
  const store = useAudioStore.getState();
  
  console.log('🧪 Testing bullet-proof audio store...');
  
  // Test 1: Single audio element
  const audioElements = document.querySelectorAll('audio');
  console.log('✅ Audio elements:', audioElements.length, '(should be 1)');
  
  // Test 2: Audio element has correct ID
  const audioPlayer = document.getElementById('audio-player');
  console.log('✅ Audio player element:', !!audioPlayer);
  
  // Test 3: Current queue state
  console.log('✅ Current queue:', store.queue.length, 'tracks');
  console.log('✅ Current index:', store.index);
  console.log('✅ Current track:', store.currentTrack?.title || 'none');
  console.log('✅ Is loading:', store.isLoading);
  console.log('✅ Is playing:', store.isPlaying);
  
  // Test 4: Check if audio src is set and valid
  if (audioPlayer && (audioPlayer as HTMLAudioElement).src) {
    const src = (audioPlayer as HTMLAudioElement).src;
    console.log('✅ Audio src:', src.includes('?id=') ? 'Valid stream URL' : 'Invalid');
    
    // Test stream URL
    try {
      const response = await fetch(src, { method: 'HEAD' });
      console.log('✅ Stream URL status:', response.status, response.ok ? '✅' : '❌');
    } catch (e) {
      console.log('❌ Stream URL test failed:', e);
    }
  }
  
  return {
    audioElements: audioElements.length,
    hasAudioPlayer: !!audioPlayer,
    queueLength: store.queue.length,
    currentIndex: store.index,
    currentTrack: store.currentTrack?.title,
    isLoading: store.isLoading,
    isPlaying: store.isPlaying
  };
};

// Make available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testAudioStore = testAudioStore;
  console.log('🧪 Audio store test utility loaded. Run: testAudioStore()');
}
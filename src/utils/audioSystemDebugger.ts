/**
 * Audio System Debugger - Comprehensive diagnostics for track loading
 */

export const audioSystemDebugger = {
  async testFullSystem() {
    console.log('🔧 AUDIO SYSTEM FULL DIAGNOSTIC STARTING...\n');
    
    // Test 1: Check therapeutic database
    console.log('📋 TEST 1: Therapeutic Database');
    try {
      const { getTherapeuticTracks } = await import('@/services/therapeuticDatabase');
      const result = await getTherapeuticTracks('focus-enhancement', 5);
      
      console.log(`✅ Database returned ${result.tracks?.length || 0} tracks`);
      if (result.error) {
        console.log(`❌ Database error: ${result.error}`);
      }
      
      if (result.tracks?.length) {
        const sample = result.tracks[0];
        console.log('📝 Sample track:', {
          id: sample.id,
          title: sample.title,
          bucket: sample.storage_bucket,
          key: sample.storage_key,
          stream_url: sample.stream_url
        });
      }
    } catch (error) {
      console.log('❌ Database test failed:', error);
    }
    
    // Test 2: Check storage service
    console.log('\n🗂️ TEST 2: Simple Storage Service');
    try {
      const { SimpleStorageService } = await import('@/services/simpleStorageService');
      const tracks = await SimpleStorageService.getTracksFromCategory('focus-enhancement', 3);
      
      console.log(`✅ Storage service returned ${tracks.length} tracks`);
      if (tracks.length) {
        const sample = tracks[0];
        console.log('📝 Sample track:', {
          id: sample.id,
          title: sample.title,
          url: sample.url,
          bucket: sample.bucket
        });
        
        // Test if the URL works
        if (sample.url) {
          try {
            const response = await fetch(sample.url, { method: 'HEAD' });
            console.log(`🔗 URL test: ${response.status} ${response.statusText}`);
          } catch (error) {
            console.log(`❌ URL test failed: ${error}`);
          }
        }
      }
    } catch (error) {
      console.log('❌ Storage service test failed:', error);
    }
    
    // Test 3: Check audio store
    console.log('\n🎵 TEST 3: Audio Store');
    try {
      const { useAudioStore } = await import('@/stores/audioStore');
      const state = useAudioStore.getState();
      
      console.log('📝 Audio store state:', {
        isPlaying: state.isPlaying,
        isLoading: state.isLoading,
        currentTrack: state.currentTrack?.title || 'none',
        queueLength: state.queue.length,
        error: state.error
      });
    } catch (error) {
      console.log('❌ Audio store test failed:', error);
    }
    
    // Test 4: Direct playback test
    console.log('\n🎮 TEST 4: Direct Playback Test');
    try {
      const { useAudioStore } = await import('@/stores/audioStore');
      const store = useAudioStore.getState();
      
      console.log('🚀 Attempting to play from focus-enhancement goal...');
      const result = await store.playFromGoal('focus-enhancement');
      console.log(`📊 Play result: ${result} tracks loaded`);
      
      // Wait a moment for loading
      setTimeout(() => {
        const newState = useAudioStore.getState();
        console.log('📝 State after play attempt:', {
          isPlaying: newState.isPlaying,
          isLoading: newState.isLoading,
          currentTrack: newState.currentTrack?.title || 'none',
          queueLength: newState.queue.length,
          error: newState.error
        });
      }, 2000);
      
    } catch (error) {
      console.log('❌ Playback test failed:', error);
    }
    
    console.log('\n🏁 DIAGNOSTIC COMPLETE - Check logs above for issues');
  }
};

// Make available globally for debugging
declare global {
  interface Window {
    audioSystemDebugger: typeof audioSystemDebugger;
  }
}

if (typeof window !== 'undefined') {
  window.audioSystemDebugger = audioSystemDebugger;
}
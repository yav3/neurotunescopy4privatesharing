// Browser console test - paste this into DevTools console

console.log('🧪 Testing complete audio pipeline...');

// 1) Check API base URL
const API_BASE = 'https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/api';
console.log('✅ API_BASE =', API_BASE);

// 2) Test playlist endpoint
async function testPlaylist() {
  const goal = 'focus-enhancement';
  const r = await fetch(`${API_BASE}/playlist?goal=${encodeURIComponent(goal)}&limit=5&offset=0`);
  const p = await r.json();
  console.log('✅ Playlist response:', { 
    status: r.status, 
    tracksCount: p.tracks?.length, 
    firstTrack: p.tracks?.[0] 
  });
  return p.tracks?.[0];
}

// 3) Test stream endpoint
async function testStream(track) {
  if (!track?.id) {
    console.error('❌ No track ID available');
    return false;
  }
  
  const streamUrl = `${API_BASE}/stream?id=${track.id}`;
  console.log('🎵 Testing stream URL:', streamUrl);
  
  // First try HEAD request
  const head = await fetch(streamUrl, { method: 'HEAD' });
  console.log('📡 HEAD response:', {
    status: head.status,
    contentType: head.headers.get('content-type'),
    acceptRanges: head.headers.get('accept-ranges')
  });
  
  // If 404, get error details
  if (head.status === 404) {
    const errorResponse = await fetch(streamUrl);
    const error = await errorResponse.json();
    console.error('❌ Stream error:', error);
    return false;
  }
  
  return head.status >= 200 && head.status < 300;
}

// 4) Test audio element
async function testAudioElement(track) {
  if (!track?.id) return false;
  
  let audio = document.getElementById('audio-player');
  if (!audio) {
    audio = document.createElement('audio');
    audio.id = 'audio-player';
    audio.crossOrigin = 'anonymous';
    audio.style.display = 'none';
    document.body.appendChild(audio);
    console.log('🔧 Created audio element');
  }
  
  const streamUrl = `${API_BASE}/stream?id=${track.id}`;
  audio.src = streamUrl;
  
  console.log('🎵 Audio element:', {
    exists: !!audio,
    src: audio.src,
    readyState: audio.readyState
  });
  
  try {
    await audio.play();
    console.log('✅ Audio playing:', !audio.paused);
    return true;
  } catch (e) {
    console.warn('⚠️ Play blocked (may need user gesture):', e.message);
    return false;
  }
}

// Run full test
async function runPipelineTest() {
  try {
    console.log('\n🚀 Starting pipeline test...\n');
    
    const track = await testPlaylist();
    if (!track) {
      console.error('❌ Pipeline failed at playlist step');
      return;
    }
    
    const streamOk = await testStream(track);
    if (!streamOk) {
      console.error('❌ Pipeline failed at stream step');
      return;
    }
    
    const audioOk = await testAudioElement(track);
    if (!audioOk) {
      console.warn('⚠️ Audio may need user gesture - try clicking page and running again');
    }
    
    console.log('\n🎉 Pipeline test complete!');
    
  } catch (error) {
    console.error('💥 Pipeline test failed:', error);
  }
}

// Auto-run the test
runPipelineTest();
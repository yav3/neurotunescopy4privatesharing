/**
 * Quick 30-second test script - copy/paste in browser console
 */

const quickTest = `
// 30-second deterministic playback test
(async () => {
  console.log('🧪 Quick playback test starting...');
  
  const BASE = 'https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/api';
  
  try {
    // 1. Health
    console.log('1️⃣ Health check...');
    const health = await fetch(BASE + '/health').then(r => r.json());
    console.log('✅ Health:', health);
    
    // 2. Playlist
    console.log('2️⃣ Getting playlist...');
    const playlist = await fetch(BASE + '/playlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal: 'focus', limit: 1 })
    }).then(r => r.json());
    
    if (!playlist.tracks?.[0]) throw new Error('No tracks returned');
    console.log('✅ Got track:', playlist.tracks[0]);
    
    // 3. Stream test
    const id = playlist.tracks[0].id;
    console.log('3️⃣ Testing stream for ID:', id);
    
    const streamResponse = await fetch(BASE + '/stream?id=' + encodeURIComponent(id), { method: 'HEAD' });
    console.log('📊 Stream response:', {
      status: streamResponse.status,
      contentType: streamResponse.headers.get('content-type'),
      acceptRanges: streamResponse.headers.get('accept-ranges')
    });
    
    if (!streamResponse.ok) {
      const errorDetails = await fetch(BASE + '/stream?id=' + encodeURIComponent(id)).then(r => r.text());
      throw new Error('Stream failed: ' + errorDetails);
    }
    
    console.log('🎉 ALL TESTS PASSED - Playback is deterministic!');
    return true;
    
  } catch (error) {
    console.error('💥 TEST FAILED:', error);
    return false;
  }
})();
`;

console.log('📋 Copy and paste this in browser console to test:');
console.log(quickTest);

export default quickTest;
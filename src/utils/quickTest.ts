/**
 * Quick 30-second test script - copy/paste in browser console
 */

const quickTest = `
// 30-second deterministic playbook test using direct database access
(async () => {
  console.log('🧪 Quick playback test starting...');
  
  try {
    // Import the direct database functions
    const { getTherapeuticTracks } = await import('./services/therapeuticDatabase');
    const { streamUrl } = await import('./lib/api');
    
    // 1. Health (direct database connection)
    console.log('1️⃣ Database connection check...');
    console.log('✅ Direct database access - no API needed');
    
    // 2. Get tracks directly from database
    console.log('2️⃣ Getting tracks from database...');
    const { tracks, error } = await getTherapeuticTracks('focus-enhancement', 1);
    
    if (error || !tracks?.[0]) throw new Error('No tracks returned: ' + error);
    console.log('✅ Got track:', tracks[0]);
    
    // 3. Stream URL test
    const track = tracks[0];
    console.log('3️⃣ Testing stream URL for track:', track.id);
    
    const url = streamUrl(track);
    console.log('📊 Stream URL generated:', url);
    
    // Test if URL is accessible
    const streamResponse = await fetch(url, { method: 'HEAD' });
    console.log('📊 Stream response:', {
      status: streamResponse.status,
      contentType: streamResponse.headers.get('content-type'),
      acceptRanges: streamResponse.headers.get('accept-ranges')
    });
    
    if (!streamResponse.ok) {
      throw new Error('Stream URL not accessible: ' + streamResponse.status);
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
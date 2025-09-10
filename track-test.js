// Quick track URL test
const testUrl = 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/classicalfocus/Autumn%20Twilght;%20Classical;%20Focus;%20Re-Energize%20(1).mp3';

console.log('🎵 Testing track URL:', testUrl);

// Test with HEAD request
fetch(testUrl, { method: 'HEAD' })
  .then(response => {
    console.log('✅ HTTP Response:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      accessible: response.ok
    });
    
    if (response.ok) {
      // Try to create audio element and test loading
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      audio.crossOrigin = 'anonymous';
      
      audio.addEventListener('loadedmetadata', () => {
        console.log('🎶 Audio metadata loaded successfully! Duration:', audio.duration);
      });
      
      audio.addEventListener('canplay', () => {
        console.log('🎵 Audio can play - track is ready!');
      });
      
      audio.addEventListener('error', (e) => {
        console.error('❌ Audio loading error:', e.target.error);
      });
      
      audio.src = testUrl;
      audio.load();
    }
  })
  .catch(error => {
    console.error('❌ Network error:', error);
  });

// Also test URL encoding issues
const encodedUrl = encodeURI(testUrl);
console.log('🔍 Original URL:', testUrl);
console.log('🔍 Encoded URL:', encodedUrl);
console.log('🔍 URLs match:', testUrl === encodedUrl);
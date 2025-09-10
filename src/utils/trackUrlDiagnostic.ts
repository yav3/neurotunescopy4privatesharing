// Comprehensive track URL diagnostic tool
export const diagnoseSongPlayability = async (url: string) => {
  console.group('🎵 Song Playability Diagnostic');
  console.log('Testing URL:', url);
  
  const results = {
    url,
    accessible: false,
    httpStatus: 0,
    contentType: '',
    contentLength: 0,
    audioLoadable: false,
    encodingIssues: [],
    recommendations: []
  };

  try {
    // 1. Test HTTP accessibility
    console.log('📡 Testing HTTP accessibility...');
    const response = await fetch(url, { method: 'HEAD' });
    
    results.httpStatus = response.status;
    results.accessible = response.ok;
    results.contentType = response.headers.get('content-type') || '';
    results.contentLength = parseInt(response.headers.get('content-length') || '0');
    
    console.log(`HTTP Status: ${response.status} ${response.ok ? '✅' : '❌'}`);
    console.log(`Content-Type: ${results.contentType}`);
    console.log(`Content-Length: ${results.contentLength} bytes`);
    
    if (!response.ok) {
      results.recommendations.push(`HTTP ${response.status}: File not accessible at this URL`);
      console.groupEnd();
      return results;
    }

    // 2. Check content type
    if (!results.contentType.startsWith('audio/')) {
      results.recommendations.push('Warning: Content-Type is not audio/*');
    }

    // 3. Test audio element loading
    console.log('🎶 Testing audio element loading...');
    
    const audioTest = await new Promise<boolean>((resolve) => {
      const audio = document.createElement('audio');
      let resolved = false;
      
      const cleanup = () => {
        if (!resolved) {
          resolved = true;
          audio.remove();
        }
      };
      
      audio.addEventListener('loadedmetadata', () => {
        console.log(`✅ Audio metadata loaded! Duration: ${audio.duration}s`);
        cleanup();
        resolve(true);
      });
      
      audio.addEventListener('error', (e) => {
        console.error('❌ Audio loading failed:', e);
        cleanup();
        resolve(false);
      });
      
      // Timeout after 10 seconds
      setTimeout(() => {
        console.warn('⏱️ Audio loading timeout');
        cleanup();
        resolve(false);
      }, 10000);
      
      audio.preload = 'metadata';
      audio.crossOrigin = 'anonymous';
      audio.src = url;
      audio.load();
    });
    
    results.audioLoadable = audioTest;
    
    // 4. Check for encoding issues
    console.log('🔍 Checking for URL encoding issues...');
    
    const originalUrl = url;
    const encodedUrl = encodeURI(url);
    const fullyEncodedUrl = encodeURIComponent(url.split('/').pop() || '');
    
    if (originalUrl !== encodedUrl) {
      results.encodingIssues.push('URL contains characters that may need encoding');
    }
    
    // Check for problematic characters
    const filename = url.split('/').pop() || '';
    const problematicChars = [';', '(', ')', '[', ']', '{', '}', '&', '?', '#'];
    const foundProblematic = problematicChars.filter(char => filename.includes(char));
    
    if (foundProblematic.length > 0) {
      results.encodingIssues.push(`Problematic characters found: ${foundProblematic.join(', ')}`);
      results.recommendations.push('Consider renaming file to use URL-safe characters (hyphens, underscores)');
    }
    
    // 5. Test alternative URL encodings
    if (results.encodingIssues.length > 0) {
      console.log('🔧 Testing alternative encodings...');
      
      const basePath = url.substring(0, url.lastIndexOf('/') + 1);
      const alternativeUrl = basePath + encodeURIComponent(filename);
      
      try {
        const altResponse = await fetch(alternativeUrl, { method: 'HEAD' });
        if (altResponse.ok && !results.accessible) {
          results.recommendations.push(`Try properly encoded URL: ${alternativeUrl}`);
        }
      } catch (e) {
        console.log('Alternative encoding test failed');
      }
    }
    
    // 6. Generate recommendations
    if (!results.audioLoadable && results.accessible) {
      results.recommendations.push('File is accessible but not loadable as audio - check file format');
    }
    
    if (results.contentLength === 0) {
      results.recommendations.push('File appears to be empty (0 bytes)');
    }
    
    if (results.contentLength < 1000) {
      results.recommendations.push('File is very small - may be corrupted');
    }
    
  } catch (error) {
    console.error('❌ Diagnostic error:', error);
    results.recommendations.push(`Network error: ${error}`);
  }
  
  console.log('📊 Final Results:', results);
  console.groupEnd();
  
  return results;
};

// Make it available globally for easy testing
if (typeof window !== 'undefined') {
  (window as any).diagnoseSongPlayability = diagnoseSongPlayability;
  
  // Quick test function for the specific URL
  (window as any).testClassicalFocusTrack = () => {
    return diagnoseSongPlayability('https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/classicalfocus/Autumn%20Twilght;%20Classical;%20Focus;%20Re-Energize%20(1).mp3');
  };
}
// Audio System UUID Debug Tool
// Add this to your app to trace UUID format issues and audio conflicts

// 1. UUID Format Validator
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// 2. Track ID Format Logger
export const logTrackId = (track: any, context: string) => {
  console.group(`🔍 Track ID Debug - ${context}`);
  console.log('Track object:', track);
  console.log('ID field:', track.id);
  console.log('ID type:', typeof track.id);
  console.log('Is valid UUID:', track.id ? isValidUUID(track.id.toString()) : 'No ID');
  console.log('Other ID fields:', {
    _id: track._id,
    uuid: track.uuid,
    track_id: track.track_id
  });
  console.groupEnd();
};

// 3. Stream URL Debug Function  
export const debugStreamUrl = (track: any) => {
  console.group('🌐 Stream URL Generation Debug');
  
  const trackId = track.id || track._id || track.uuid;
  console.log('Original track:', track);
  console.log('Extracted ID:', trackId);
  console.log('ID is valid UUID:', isValidUUID(trackId?.toString() || ''));
  
  // Use the proper API method to generate stream URL
  try {
    const { API } = require('@/lib/api');
    const properUrl = API.streamUrl(trackId);
    console.log('Proper stream URL:', properUrl);
  } catch (e) {
    console.log('API streamUrl error:', e);
  }
  
  // Legacy method for comparison
  const api_base = import.meta.env.VITE_API_BASE_URL;
  console.log('API_BASE from env:', api_base);
  
  // Method 1: Using ID (legacy - shows URL construction issue)
  const urlById = `${api_base}/stream?id=${trackId}`;
  console.log('URL by ID (legacy):', urlById);
  
  // Method 2: Using file_path
  const file_path = track.file_path || track.file_name || track.src;
  const urlByFile = `${api_base}/stream?file=${encodeURIComponent(file_path || '')}`;
  console.log('URL by file:', urlByFile);
  
  console.groupEnd();
  return { urlById, urlByFile, trackId, isValidUUID: isValidUUID(trackId?.toString() || '') };
};

// 4. Audio System Status (Simplified - No competing systems tracking)
export const logAudioSystemStatus = () => {
  console.group('🎵 Audio System Status');
  console.log('✅ Unified Audio System: useAudioStore');
  console.log('✅ Single Audio Element: #audio-player');
  console.log('✅ Unified API Client: /lib/api.ts');
  console.log('✅ Single Database Table: tracks');
  console.groupEnd();
};

// 5. API Request Interceptor for UUID Tracking
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const [url, options] = args;
  const urlStr = url.toString();
  
  // Log all API requests to stream endpoints
  if (urlStr.includes('/stream') || urlStr.includes('/playlist')) {
    console.group('📡 Stream API Request Debug');
    console.log('URL:', urlStr);
    
    // Extract ID/file parameter
    const urlObj = new URL(urlStr);
    const id = urlObj.searchParams.get('id');
    const file = urlObj.searchParams.get('file');
    const goal = urlObj.searchParams.get('goal');
    
    if (id) {
      console.log('ID parameter:', id);
      console.log('ID is valid UUID:', isValidUUID(id));
      if (!isValidUUID(id)) {
        console.error('🚨 INVALID UUID FORMAT:', id);
      }
    }
    
    if (file) {
      console.log('File parameter:', file);
    }
    
    if (goal) {
      console.log('Goal parameter:', goal);
    }
    
    console.groupEnd();
  }
  
  try {
    const response = await originalFetch(...args);
    
    // Log stream responses
    if (urlStr.includes('/stream') && !response.ok) {
      console.error('🚨 Stream Request Failed:', {
        url: urlStr,
        status: response.status,
        statusText: response.statusText
      });
    }
    
    return response;
  } catch (error) {
    console.error('🚨 Fetch Error:', error);
    throw error;
  }
};

// 6. Database ID Format Checker
export const checkDatabaseIdFormats = async () => {
  console.group('🗃️ Database ID Format Check');
  
  try {
    // Use the proper API method instead of direct fetch to avoid URL issues
    const { API } = await import('@/lib/api');
    const response = await API.playlist({ goal: 'focus', limit: 5 });
    console.log('API Response:', response);
    
    if (response.tracks && Array.isArray(response.tracks)) {
      response.tracks.forEach((track: any, index: number) => {
        console.log(`Track ${index + 1}:`, {
          id: track.id,
          type: typeof track.id,
          isUUID: isValidUUID(track.id?.toString() || ''),
          file_path: track.file_path,
          storage_key: track.storage_key,
          allFields: Object.keys(track),
          track: track
        });
      });
    }
  } catch (error) {
    console.error('Database check failed:', error);
  }
  
  console.groupEnd();
};

// 7. Audio Element State Monitor
export const monitorAudioElement = () => {
  // Look for audio elements in the document
  const audioElements = document.querySelectorAll('audio');
  console.log('🎧 Found audio elements:', audioElements.length);
  
  if (audioElements.length === 0) {
    console.warn('No audio elements found');
    return;
  }
  
  audioElements.forEach((audio, index) => {
    const logAudioState = () => {
      console.log(`🎧 Audio Element ${index} State:`, {
        src: audio.src,
        currentTime: audio.currentTime,
        duration: audio.duration,
        readyState: audio.readyState,
        networkState: audio.networkState,
        error: audio.error?.code,
        paused: audio.paused
      });
      
      // Check if src contains valid UUID
      if (audio.src.includes('?id=')) {
        const idMatch = audio.src.match(/[?&]id=([^&]+)/);
        if (idMatch) {
          const id = idMatch[1];
          console.log('Audio src ID:', id, 'Is UUID:', isValidUUID(id));
        }
      }
    };
    
    // Monitor key audio events
    ['loadstart', 'loadeddata', 'error', 'play', 'pause'].forEach(event => {
      audio.addEventListener(event, () => {
        console.log(`🎧 Audio Event: ${event} (element ${index})`);
        logAudioState();
      });
    });
  });
};

// 8. Main Debug Runner
export const runAudioDebugSuite = async () => {
  console.clear();
  console.log('🔧 Starting Audio Debug Suite...');
  
  // Check environment
  console.log('Environment check:', {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    location: window.location.href
  });
  
  // Log system status
  logAudioSystemStatus();
  
  // Check database ID formats
  await checkDatabaseIdFormats();
  
  // Monitor audio element
  const audioLogger = monitorAudioElement();
  
  console.log('🔧 Debug suite active. Try playing a track...');
  
  return { audioLogger, debugStreamUrl, logTrackId };
};
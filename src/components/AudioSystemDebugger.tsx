import React from 'react';

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
export const debugStreamUrl = async (track: any) => {
  console.group('🌐 Stream URL Generation Debug');
  
  const trackId = track.id || track._id || track.uuid;
  console.log('Original track:', track);
  console.log('Extracted ID:', trackId);
  console.log('ID is valid UUID:', isValidUUID(trackId?.toString() || ''));
  
  // Test different URL generation approaches
  const api_base = 'https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1';
  console.log('API_BASE from env:', api_base);
  
  // Method 1: Using ID - DEPRECATED, should not be used
  const urlById = `${api_base}/api/stream?id=${trackId}`;
  console.log('⚠️ DEPRECATED URL by ID:', urlById);
  
  // Method 2: Using file_path - DEPRECATED, should not be used  
  const file_path = track.file_path || track.file_name || track.src;
  const urlByFile = `${api_base}/api/stream?file=${encodeURIComponent(file_path || '')}`;
  console.log('⚠️ DEPRECATED URL by file:', urlByFile);
  
  // Method 3: Using new streamUrl function
  const { streamUrl } = await import('@/lib/api');
  const newUrl = streamUrl(track);
  console.log('✅ NEW streamUrl result:', newUrl);
  
  console.groupEnd();
  return { urlById, urlByFile, newUrl, trackId, isValidUUID: isValidUUID(trackId?.toString() || '') };
};

// 4. Audio Store Conflict Detector
let activeAudioSystems: string[] = [];

export const registerAudioSystem = (systemName: string) => {
  activeAudioSystems.push(systemName);
  console.warn(`🎵 Audio System Registered: ${systemName}`);
  console.warn(`🚨 Active systems: [${activeAudioSystems.join(', ')}]`);
  
  if (activeAudioSystems.length > 1) {
    console.error('🚨 CONFLICT: Multiple audio systems active!', activeAudioSystems);
  }
};

export const unregisterAudioSystem = (systemName: string) => {
  activeAudioSystems = activeAudioSystems.filter(s => s !== systemName);
  console.log(`🎵 Audio System Unregistered: ${systemName}`);
};

// 5. API Request Interceptor for UUID Tracking
let fetchInterceptorActive = false;
export const activateFetchInterceptor = () => {
  if (fetchInterceptorActive) return;
  fetchInterceptorActive = true;

  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const [url, options] = args;
    const urlStr = url.toString();
    
    // Log all API requests to stream endpoints
    if (urlStr.includes('/stream') || urlStr.includes('/playlist')) {
      console.group('📡 Stream API Request Debug');
      console.log('URL:', urlStr);
      
      // Extract ID/file parameter
      try {
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
      } catch (e) {
        console.log('URL parsing error:', e);
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
};

// 6. Database ID Format Checker
export const checkDatabaseIdFormats = async () => {
  console.group('🗃️ Database ID Format Check');
  
  try {
    // Use direct database access instead of HTTP API
    const { getTherapeuticTracks } = await import('@/services/therapeuticDatabase');
    const { tracks, error } = await getTherapeuticTracks('focus-enhancement', 5);
    
    if (error) {
      throw new Error(`Database query failed: ${error}`);
    }
    
    console.log('Database Query Response:', { tracks: tracks?.length, error });
    
    if (tracks && Array.isArray(tracks)) {
      tracks.forEach((track: any, index: number) => {
        console.log(`Track ${index + 1}:`, {
          id: track.id,
          type: typeof track.id,
          isUUID: isValidUUID(track.id?.toString() || ''),
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
  const audio = document.getElementById('audio-player') as HTMLAudioElement;
  if (!audio) {
    console.warn('No audio element found with id "audio-player"');
    // Try to find any audio elements
    const allAudio = document.querySelectorAll('audio');
    console.log('Found audio elements:', allAudio.length);
    allAudio.forEach((el, i) => {
      console.log(`Audio ${i}:`, { id: el.id, src: el.src });
    });
    return;
  }
  
  const logAudioState = () => {
    console.log('🎧 Audio Element State:', {
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
      console.log(`🎧 Audio Event: ${event}`);
      logAudioState();
    });
  });
  
  return logAudioState;
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
  
  // Activate fetch interceptor
  activateFetchInterceptor();
  
  // Check database ID formats
  await checkDatabaseIdFormats();
  
  // Monitor audio element
  const audioLogger = monitorAudioElement();
  
  // Register this debug system
  registerAudioSystem('DEBUG_SUITE');
  
  console.log('🔧 Debug suite active. Try playing a track...');
  
  return { audioLogger, debugStreamUrl, logTrackId };
};

// 9. Debug Panel Component
export const AudioSystemDebugger = () => {
  const runDebug = async () => {
    await runAudioDebugSuite();
  };
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      zIndex: 9999, 
      background: '#1a1a1a', 
      color: 'white', 
      padding: '10px', 
      border: '1px solid #333',
      borderRadius: '8px',
      fontSize: '12px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Audio Debug Tools</h4>
      <button 
        onClick={runDebug} 
        style={{ 
          marginRight: '5px', 
          marginBottom: '5px',
          padding: '5px 8px',
          background: '#333',
          color: 'white',
          border: '1px solid #555',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🔧 Run Debug Suite
      </button>
      <br />
      <button 
        onClick={() => checkDatabaseIdFormats()}
        style={{ 
          marginRight: '5px', 
          marginBottom: '5px',
          padding: '5px 8px',
          background: '#333',
          color: 'white',
          border: '1px solid #555',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🗃️ Check DB IDs
      </button>
      <br />
      <button 
        onClick={() => {
          const audioLogger = monitorAudioElement();
          audioLogger?.();
        }}
        style={{ 
          marginRight: '5px', 
          marginBottom: '5px',
          padding: '5px 8px',
          background: '#333',
          color: 'white',
          border: '1px solid #555',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🎧 Check Audio
      </button>
      <br />
      <button 
        onClick={() => console.clear()}
        style={{ 
          padding: '5px 8px',
          background: '#333',
          color: 'white',
          border: '1px solid #555',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🧹 Clear Console
      </button>
    </div>
  );
};

// 10. Hook for React Components
export const useAudioDebug = () => {
  React.useEffect(() => {
    registerAudioSystem('useAudioDebug_Hook');
    return () => unregisterAudioSystem('useAudioDebug_Hook');
  }, []);
  
  return {
    logTrackId,
    debugStreamUrl,
    checkDatabaseIdFormats
  };
};
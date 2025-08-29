import { useEffect } from "react";
import { getAudio } from "@/player/audio-core";

export default function AudioProvider() {
  useEffect(() => {
    console.log('🎵 AudioProvider: Initializing global audio element');
    const a = getAudio();
    
    // Add error logging with detailed diagnostics
    const handleError = (e: Event) => {
      const error = a.error;
      const errorTypes = {
        1: 'ABORTED', 2: 'NETWORK', 3: 'DECODE', 4: 'NOT_SUPPORTED'
      };
      
      const errorDetails = {
        errorCode: error?.code,
        errorType: errorTypes[error?.code as keyof typeof errorTypes] || 'UNKNOWN',
        message: error?.message,
        networkState: a.networkState,
        readyState: a.readyState,
        currentSrc: a.currentSrc,
        duration: a.duration,
        currentTime: a.currentTime
      };
      
      console.error('[GLOBAL AUDIO ERROR]', errorDetails);
    };
    
    // Add other useful event listeners
    const handleLoadStart = () => console.log('🔄 Global audio: Load start');
    const handleCanPlay = () => console.log('✅ Global audio: Can play');
    const handlePlay = () => console.log('▶️ Global audio: Started playing');
    const handlePause = () => console.log('⏸️ Global audio: Paused');
    const handleEnded = () => console.log('🏁 Global audio: Ended');
    
    a.addEventListener("error", handleError);
    a.addEventListener("loadstart", handleLoadStart);
    a.addEventListener("canplay", handleCanPlay);
    a.addEventListener("play", handlePlay);
    a.addEventListener("pause", handlePause);
    a.addEventListener("ended", handleEnded);
    
    console.log('✅ Global audio element ready:', a.id);
    
    return () => {
      a.removeEventListener("error", handleError);
      a.removeEventListener("loadstart", handleLoadStart);
      a.removeEventListener("canplay", handleCanPlay);
      a.removeEventListener("play", handlePlay);
      a.removeEventListener("pause", handlePause);
      a.removeEventListener("ended", handleEnded);
    };
  }, []);
  
  return null;
}
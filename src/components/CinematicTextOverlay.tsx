import { useEffect, useState, useRef } from 'react'
import neuralpositiveLogoObsidian from '@/assets/neuralpositive-pearl-obsidian.png'

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

// Intro audio - plays entire song until user navigates away
const INTRO_AUDIO_URL = '/audio/intro-focus.mp3'

// Commercial video (muted)
const COMMERCIAL_VIDEO = '/videos/landing-commercial.mp4'

// Text sequence phases - simplified: focus text briefly, then watch video, then experience
type Phase = 'focus' | 'watching' | 'experience' | 'complete'

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [phase, setPhase] = useState<Phase>('focus')
  const [isTextVisible, setIsTextVisible] = useState(true)
  const [showVideo, setShowVideo] = useState(true)
  const [audioStarted, setAudioStarted] = useState(false)
  const introAudioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Start intro audio immediately on mount - singleton pattern to prevent duplicates
  useEffect(() => {
    console.log('🎵 CinematicTextOverlay mount - checking for existing audio');
    
    // CRITICAL: Kill ALL existing audio elements on the page first
    document.querySelectorAll('audio').forEach((audio) => {
      console.log('🔇 Killing existing audio element');
      audio.pause();
      audio.src = '';
      audio.volume = 0;
    });
    
    // Also clear any global reference
    if ((window as any).__introAudio) {
      console.log('🔇 Clearing existing __introAudio reference');
      const existingAudio = (window as any).__introAudio;
      existingAudio.pause();
      existingAudio.src = '';
      ;(window as any).__introAudio = null;
    }
    
    // Create new audio with unique ID for tracking
    const audio = new Audio(INTRO_AUDIO_URL);
    const audioId = Math.random().toString(36).substring(7);
    console.log('🎵 Creating new intro audio:', audioId);
    
    audio.volume = 0.5;
    audio.crossOrigin = 'anonymous';
    audio.loop = false;
    introAudioRef.current = audio;
    
    ;(window as any).__introAudio = audio;
    ;(window as any).__introAudioId = audioId;
    ;(window as any).__stopIntroAudio = () => {
      console.log('🔇 __stopIntroAudio called');
      // Kill ALL audio on page
      document.querySelectorAll('audio').forEach((a) => {
        a.pause();
        a.src = '';
        a.volume = 0;
      });
      if (introAudioRef.current) {
        introAudioRef.current.pause();
        introAudioRef.current.src = '';
        introAudioRef.current = null;
      }
      ;(window as any).__introAudio = null;
      ;(window as any).__stopIntroAudio = null;
    };
    
    // Start playback immediately
    audio.play().then(() => {
      console.log('✅ Intro audio playing:', audioId);
      setAudioStarted(true);
    }).catch(err => {
      console.log('⚠️ Intro audio autoplay blocked:', audioId, err);
    });
    
    // Fallback: start on first user interaction if autoplay blocked
    const startOnInteraction = () => {
      if (introAudioRef.current && introAudioRef.current.paused) {
        introAudioRef.current.play().then(() => {
          setAudioStarted(true);
        }).catch(() => {});
      }
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
    };
    
    document.addEventListener('click', startOnInteraction);
    document.addEventListener('touchstart', startOnInteraction);
    
    return () => {
      console.log('🔇 CinematicTextOverlay unmount - cleaning up audio:', audioId);
      // Only clean up if this is still our audio
      if ((window as any).__introAudioId === audioId) {
        if (introAudioRef.current) {
          introAudioRef.current.pause();
          introAudioRef.current.src = '';
          introAudioRef.current = null;
        }
        ;(window as any).__introAudio = null;
        ;(window as any).__stopIntroAudio = null;
        ;(window as any).__introAudioId = null;
      }
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
    };
  }, []);

  // Handle video end - transition to experience phase, then show play button after 2 seconds
  const handleVideoEnded = () => {
    setIsTextVisible(false)
    setShowVideo(false)
    setTimeout(() => {
      setPhase('experience')
      setIsTextVisible(true)
      
      // After 2 seconds of "Experience Now", complete and show the play button
      setTimeout(() => {
        setIsTextVisible(false)
        setTimeout(() => {
          setPhase('complete')
          onComplete?.()
        }, 500)
      }, 2000)
    }, 800)
  }

  // Text sequence timing - "Focus made easy" for 2 seconds, then fade out and let video play
  useEffect(() => {
    // Phase 1: "Focus made easy" - 2 seconds, then fade out
    const phase1Timer = setTimeout(() => {
      setIsTextVisible(false)
      setTimeout(() => {
        setPhase('watching')
      }, 500)
    }, 2000)

    return () => {
      clearTimeout(phase1Timer)
    }
  }, [onComplete])

  const fadeOutIntroAudio = (): Promise<void> => {
    return new Promise((resolve) => {
      const audio = introAudioRef.current
      if (!audio) {
        resolve()
        return
      }
      
      const startVolume = audio.volume
      const fadeSteps = 20
      const fadeInterval = 50
      let step = 0
      
      const fadeTimer = setInterval(() => {
        step++
        audio.volume = Math.max(0, startVolume * (1 - step / fadeSteps))
        
        if (step >= fadeSteps) {
          clearInterval(fadeTimer)
          audio.pause()
          audio.src = ''
          introAudioRef.current = null
          ;(window as any).__introAudio = null
          resolve()
        }
      }, fadeInterval)
    })
  }

  // After complete, return null to show the play button behind
  if (phase === 'complete') {
    return null
  }

  return (
    <div 
      className="absolute inset-0 z-10 flex items-center justify-center bg-black transition-opacity duration-800"
    >
      {/* Commercial video background - muted, full sharp focus */}
      {showVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={COMMERCIAL_VIDEO} type="video/mp4" />
        </video>
      )}
      
      {/* Content overlay */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 transition-opacity duration-500"
        style={{ opacity: isTextVisible ? 1 : 0 }}
      >
        {/* Phase 1: Focus made easy */}
        {phase === 'focus' && (
          <h1
            className="text-3xl md:text-5xl lg:text-6xl"
            style={{
              color: '#d4d4d4',
              letterSpacing: '0.06em',
              fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
              fontWeight: 300,
            }}
          >
            Focus made easy
          </h1>
        )}

        {/* Watching phase - no text, just the video */}
        {phase === 'watching' && null}

        {/* Experience Now - on black background after video ends */}
        {phase === 'experience' && (
          <h1
            className="text-3xl md:text-5xl lg:text-6xl"
            style={{
              color: '#d4d4d4',
              letterSpacing: '0.08em',
              fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
              fontWeight: 300,
            }}
          >
            Experience Now
          </h1>
        )}
      </div>
    </div>
  )
}

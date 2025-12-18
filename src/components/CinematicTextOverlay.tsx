import { useEffect, useState, useRef } from 'react'
import { audioManager } from '@/utils/audioManager'

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
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const mountedRef = useRef(true)

  // Start intro audio immediately on mount - using AudioManager's singleton intro audio
  useEffect(() => {
    mountedRef.current = true
    console.log('🎵 CinematicTextOverlay mount')
    
    // Play intro via AudioManager (singleton - prevents duplicates)
    audioManager.playIntro(INTRO_AUDIO_URL, 0.5).then((success) => {
      if (mountedRef.current && success) {
        setAudioStarted(true)
      }
    })
    
    // Fallback: retry on first user interaction if autoplay blocked
    const startOnInteraction = () => {
      audioManager.retryIntro().then((success) => {
        if (success && mountedRef.current) setAudioStarted(true)
      })
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('touchstart', startOnInteraction)
    }
    
    document.addEventListener('click', startOnInteraction)
    document.addEventListener('touchstart', startOnInteraction)
    
    return () => {
      mountedRef.current = false
      console.log('🔇 CinematicTextOverlay unmount')
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('touchstart', startOnInteraction)
      // AudioManager handles singleton intro - no cleanup needed here
    }
  }, [])

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

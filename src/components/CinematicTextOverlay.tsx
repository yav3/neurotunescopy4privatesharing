import { useEffect, useState, useRef } from 'react'

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

// Intro audio synced to video
const INTRO_AUDIO_URL = '/audio/intro-focus.mp3'

// Commercial video (video only, audio plays separately but synced)
const COMMERCIAL_VIDEO = '/videos/landing-commercial.mp4'

// Text sequence phases
type Phase = 'focus' | 'watching' | 'experience' | 'complete'

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [phase, setPhase] = useState<Phase>('focus')
  const [isTextVisible, setIsTextVisible] = useState(true)
  const [showVideo, setShowVideo] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const mountedRef = useRef(true)
  const hasStartedRef = useRef(false)

  // Create and sync audio to video on mount
  useEffect(() => {
    mountedRef.current = true
    
    // Prevent duplicate initialization from StrictMode
    if (hasStartedRef.current) {
      console.log('🎵 CinematicTextOverlay: already initialized, skipping')
      return
    }
    hasStartedRef.current = true
    
    console.log('🎵 CinematicTextOverlay mount - creating synced audio')
    
    // Create audio element
    const audio = new Audio(INTRO_AUDIO_URL)
    audio.volume = 0.5
    audio.crossOrigin = 'anonymous'
    audioRef.current = audio
    
    // Expose audio globally for parent to control (mute/fade)
    ;(window as any).__introAudio = audio
    
    // Start audio when video starts playing
    const video = videoRef.current
    if (video) {
      const handleVideoPlay = () => {
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current.currentTime = video.currentTime
          audioRef.current.play().catch(err => {
            console.log('⚠️ Audio autoplay blocked, will retry on interaction')
          })
        }
      }
      
      // Sync audio time to video time
      const handleTimeUpdate = () => {
        if (audioRef.current && Math.abs(audioRef.current.currentTime - video.currentTime) > 0.3) {
          audioRef.current.currentTime = video.currentTime
        }
      }
      
      video.addEventListener('play', handleVideoPlay)
      video.addEventListener('timeupdate', handleTimeUpdate)
      
      // Expose video for parent control
      ;(window as any).__introVideo = video
      
      // If video is already playing (autoplay worked), start audio
      if (!video.paused) {
        handleVideoPlay()
      }
    }
    
    // Fallback: start audio on user interaction
    const startOnInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        const video = videoRef.current
        if (video) {
          audioRef.current.currentTime = video.currentTime
        }
        audioRef.current.play().catch(() => {})
      }
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('touchstart', startOnInteraction)
    }
    
    document.addEventListener('click', startOnInteraction)
    document.addEventListener('touchstart', startOnInteraction)
    
    return () => {
      mountedRef.current = false
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('touchstart', startOnInteraction)
      // Don't clean up audio here - parent handles fade out
    }
  }, [])

  // Handle video end
  const handleVideoEnded = () => {
    // Stop audio when video ends
    if (audioRef.current) {
      audioRef.current.pause()
    }
    
    setIsTextVisible(false)
    setShowVideo(false)
    setTimeout(() => {
      setPhase('experience')
      setIsTextVisible(true)
      
      setTimeout(() => {
        setIsTextVisible(false)
        setTimeout(() => {
          setPhase('complete')
          onComplete?.()
        }, 500)
      }, 2000)
    }, 800)
  }

  // Text sequence timing
  useEffect(() => {
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

  if (phase === 'complete') {
    return null
  }

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black transition-opacity duration-800">
      {/* Video - muted, audio plays separately but synced */}
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

        {phase === 'watching' && null}

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

import { useEffect, useState, useRef } from 'react'

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

// Intro song - plays synced with video
const INTRO_SONG_URL = '/audio/intro-focus.mp3'

// Commercial video - MUTED (no voiceover)
const COMMERCIAL_VIDEO = '/videos/landing-commercial.mp4'

type Phase = 'focus' | 'watching' | 'experience' | 'complete'

// Singleton to prevent duplicate audio from StrictMode
let globalIntroAudio: HTMLAudioElement | null = null

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [phase, setPhase] = useState<Phase>('focus')
  const [isTextVisible, setIsTextVisible] = useState(true)
  const [showVideo, setShowVideo] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const mountedRef = useRef(true)

  // Create synced audio on mount - singleton pattern
  useEffect(() => {
    mountedRef.current = true
    
    // Kill any existing intro audio first (prevents duplicates)
    if (globalIntroAudio) {
      globalIntroAudio.pause()
      globalIntroAudio.src = ''
      globalIntroAudio = null
    }
    
    // Create single audio instance
    const audio = new Audio(INTRO_SONG_URL)
    audio.volume = 0.5
    audio.crossOrigin = 'anonymous'
    globalIntroAudio = audio
    
    // Expose for parent control
    ;(window as any).__introAudio = audio
    
    // Try to play immediately
    const tryPlay = () => {
      if (globalIntroAudio) {
        globalIntroAudio.play().then(() => {
          console.log('✅ Intro song playing')
        }).catch(() => {
          console.log('⚠️ Intro song autoplay blocked')
        })
      }
    }
    
    // Start playing when video starts (synced)
    const video = videoRef.current
    if (video) {
      ;(window as any).__introVideo = video
      
      video.addEventListener('play', () => {
        if (globalIntroAudio && globalIntroAudio.paused) {
          globalIntroAudio.currentTime = video.currentTime
          tryPlay()
        }
      })
      
      // Keep audio synced to video time
      video.addEventListener('timeupdate', () => {
        if (globalIntroAudio && Math.abs(globalIntroAudio.currentTime - video.currentTime) > 0.5) {
          globalIntroAudio.currentTime = video.currentTime
        }
      })
    }
    
    // Also try playing immediately in case video already started
    tryPlay()
    
    // Fallback: start on user interaction
    const startOnClick = () => {
      if (globalIntroAudio?.paused) {
        const video = videoRef.current
        if (video && !video.paused) {
          globalIntroAudio.currentTime = video.currentTime
        }
        tryPlay()
      }
      document.removeEventListener('click', startOnClick)
      document.removeEventListener('touchstart', startOnClick)
    }
    
    document.addEventListener('click', startOnClick)
    document.addEventListener('touchstart', startOnClick)
    
    return () => {
      mountedRef.current = false
      document.removeEventListener('click', startOnClick)
      document.removeEventListener('touchstart', startOnClick)
    }
  }, [])

  const handleVideoEnded = () => {
    // Pause audio when video ends
    if (globalIntroAudio) {
      globalIntroAudio.pause()
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTextVisible(false)
      setTimeout(() => setPhase('watching'), 500)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (phase === 'complete') return null

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
      {/* Video - MUTED (no voiceover heard) */}
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
      
      <div 
        className="relative z-10 text-center px-6 transition-opacity duration-500"
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

// Export fade function for use by parent
export function fadeOutIntroSong(duration: number = 500): Promise<void> {
  return new Promise((resolve) => {
    if (!globalIntroAudio || globalIntroAudio.paused) {
      resolve()
      return
    }
    
    const startVolume = globalIntroAudio.volume
    const steps = 10
    const stepTime = duration / steps
    let step = 0
    
    const fadeInterval = setInterval(() => {
      step++
      if (globalIntroAudio) {
        globalIntroAudio.volume = Math.max(0, startVolume * (1 - step / steps))
      }
      if (step >= steps) {
        clearInterval(fadeInterval)
        if (globalIntroAudio) {
          globalIntroAudio.pause()
          globalIntroAudio.src = ''
          globalIntroAudio = null
        }
        ;(window as any).__introAudio = null
        resolve()
      }
    }, stepTime)
  })
}

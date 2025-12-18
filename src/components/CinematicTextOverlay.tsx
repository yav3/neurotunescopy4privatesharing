import { useEffect, useState, useRef } from 'react'

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

// Intro song - plays until user starts the experience
const INTRO_SONG_URL = '/audio/intro-relaxation.mp3'

// Commercial video - MUTED (no voiceover)
const COMMERCIAL_VIDEO = '/videos/landing-commercial.mp4'

type Phase = 'focus' | 'watching' | 'experience' | 'complete'

// Singleton to prevent duplicate audio from StrictMode
let globalIntroAudio: HTMLAudioElement | null = null

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [phase, setPhase] = useState<Phase>('focus')
  const [isTextVisible, setIsTextVisible] = useState(true)
  const [showVideo, setShowVideo] = useState(true)
  const [audioBlocked, setAudioBlocked] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const hasInitializedRef = useRef(false)

  // Auto-start on mount - no click required
  useEffect(() => {
    // Guard against double initialization (StrictMode, hot reload)
    if (hasInitializedRef.current) return
    if (globalIntroAudio && !globalIntroAudio.paused) {
      console.log('🔒 Intro audio already playing, skipping initialization')
      return
    }
    
    hasInitializedRef.current = true

    // Kill any existing intro audio first
    if (globalIntroAudio) {
      globalIntroAudio.pause()
      globalIntroAudio.src = ''
      globalIntroAudio = null
    }
    
    // Create audio
    const audio = new Audio(INTRO_SONG_URL)
    audio.volume = 0.5
    audio.crossOrigin = 'anonymous'
    audio.loop = true // Loop until user starts experience
    globalIntroAudio = audio
    ;(window as any).__introAudio = audio
    
    // Attempt to play audio immediately
    audio.play().then(() => {
      console.log('✅ Intro song auto-playing')
    }).catch((err) => {
      console.log('⚠️ Autoplay blocked, will start on interaction:', err)
      setAudioBlocked(true)
    })

    return () => {
      // Don't cleanup audio on unmount - let it keep playing
      // It will be cleaned up by fadeOutIntroSong
    }
  }, [])

  // Handle first interaction to unlock audio if blocked
  useEffect(() => {
    if (!audioBlocked) return

    const unlockAudio = () => {
      if (globalIntroAudio && globalIntroAudio.paused) {
        // Sync audio to video time
        if (videoRef.current) {
          globalIntroAudio.currentTime = videoRef.current.currentTime
        }
        globalIntroAudio.play().then(() => {
          console.log('✅ Audio unlocked on interaction')
          setAudioBlocked(false)
        }).catch(() => {})
      }
    }

    document.addEventListener('click', unlockAudio, { once: true })
    document.addEventListener('touchstart', unlockAudio, { once: true })
    document.addEventListener('keydown', unlockAudio, { once: true })

    return () => {
      document.removeEventListener('click', unlockAudio)
      document.removeEventListener('touchstart', unlockAudio)
      document.removeEventListener('keydown', unlockAudio)
    }
  }, [audioBlocked])

  // Sync audio to video time
  useEffect(() => {
    if (phase === 'focus' || phase === 'watching') {
      const video = videoRef.current
      if (video && globalIntroAudio) {
        const handleTimeUpdate = () => {
          if (globalIntroAudio && Math.abs(globalIntroAudio.currentTime - video.currentTime) > 0.5) {
            globalIntroAudio.currentTime = video.currentTime
          }
        }
        video.addEventListener('timeupdate', handleTimeUpdate)
        return () => video.removeEventListener('timeupdate', handleTimeUpdate)
      }
    }
  }, [phase])

  const handleVideoEnded = () => {
    // Audio already set to loop on creation - just hide video
    
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

  // Text timing for focus phase
  useEffect(() => {
    if (phase === 'focus') {
      const timer = setTimeout(() => {
        setIsTextVisible(false)
        setTimeout(() => setPhase('watching'), 500)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [phase])

  if (phase === 'complete') return null

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
      {/* Video - MUTED (no voiceover) */}
      {showVideo && (
        <video
          ref={(el) => {
            videoRef.current = el
            if (el) {
              el.muted = true
              el.defaultMuted = true
              // Auto-play video on mount
              el.play().catch(() => {})
              ;(window as any).__introVideo = el
            }
          }}
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

import { useEffect, useState, useRef } from 'react'

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

// Intro song - plays synced with video
const INTRO_SONG_URL = '/audio/intro-focus.mp3'

// Commercial video - MUTED (no voiceover)
const COMMERCIAL_VIDEO = '/videos/landing-commercial.mp4'

type Phase = 'ready' | 'focus' | 'watching' | 'experience' | 'complete'

// Singleton to prevent duplicate audio from StrictMode
let globalIntroAudio: HTMLAudioElement | null = null

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [phase, setPhase] = useState<Phase>('ready') // Start with click-to-start
  const [isTextVisible, setIsTextVisible] = useState(true)
  const [showVideo, setShowVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const mountedRef = useRef(true)

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Start everything on user click - this ensures audio plays immediately
  const handleStart = () => {
    // Kill any existing intro audio first
    if (globalIntroAudio) {
      globalIntroAudio.pause()
      globalIntroAudio.src = ''
    }
    
    // Create and play audio IMMEDIATELY on user interaction
    const audio = new Audio(INTRO_SONG_URL)
    audio.volume = 0.5
    audio.crossOrigin = 'anonymous'
    globalIntroAudio = audio
    ;(window as any).__introAudio = audio
    
    // Play audio immediately (user interaction allows this)
    audio.play().then(() => {
      console.log('✅ Intro song playing immediately')
    }).catch((err) => {
      console.log('⚠️ Intro song play failed:', err)
    })
    
    // Show video and start it
    setShowVideo(true)
    setPhase('focus')
    
    // After a tick, start the video (it will sync with audio)
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play()
        ;(window as any).__introVideo = videoRef.current
      }
    }, 50)
  }

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
              el.muted = true // Programmatically set muted - more reliable than attribute
              el.defaultMuted = true
            }
          }}
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
        {/* Initial state - click to start */}
        {phase === 'ready' && (
          <button
            onClick={handleStart}
            className="group flex flex-col items-center gap-6 cursor-pointer"
          >
            <h1
              className="text-3xl md:text-5xl lg:text-6xl transition-opacity duration-300 group-hover:opacity-80"
              style={{
                color: '#d4d4d4',
                letterSpacing: '0.06em',
                fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                fontWeight: 300,
              }}
            >
              Focus made easy
            </h1>
            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-all">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d="M8 5v14l11-7z" fill="rgba(212,212,212,0.8)" />
              </svg>
            </div>
            <p 
              className="text-sm tracking-widest uppercase opacity-50 group-hover:opacity-70 transition-opacity"
              style={{ color: '#a3a3a3' }}
            >
              Click to begin
            </p>
          </button>
        )}

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

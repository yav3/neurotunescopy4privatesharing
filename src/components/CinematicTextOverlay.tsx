import { useEffect, useState, useRef } from 'react'

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

// Single video file with audio baked in
const INTRO_VIDEO_WITH_AUDIO = '/videos/landing-commercial.mp4'

type Phase = 'focus' | 'watching' | 'experience' | 'complete'

// Module-level guard to prevent double initialization
let hasStartedIntro = false

// Module-level reference for external fade control
let introVideoElement: HTMLVideoElement | null = null

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [phase, setPhase] = useState<Phase>('focus')
  const [isTextVisible, setIsTextVisible] = useState(true)
  const [showVideo, setShowVideo] = useState(true)
  const [audioBlocked, setAudioBlocked] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const hasCompletedRef = useRef(false)

  // Handle first interaction to unlock audio if blocked
  useEffect(() => {
    if (!audioBlocked) return

    const unlockAudio = async () => {
      const video = videoRef.current
      if (video && video.muted) {
        video.muted = false
        video.volume = 0.5
        console.log('✅ Video audio unlocked on interaction')
        setAudioBlocked(false)
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

  const handleVideoEnded = () => {
    if (hasCompletedRef.current) {
      console.log('🔒 Video ended already handled, skipping')
      return
    }
    hasCompletedRef.current = true

    console.log('🎬 Video ended, transitioning to experience')
    
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      hasStartedIntro = false
      introVideoElement = null
    }
  }, [])

  if (phase === 'complete') return null

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
      {/* Single video element with audio baked in */}
      {showVideo && (
        <video
          ref={(el) => {
            videoRef.current = el
            introVideoElement = el
            if (el && !hasStartedIntro) {
              hasStartedIntro = true
              el.volume = 0.5
              // Try with audio first
              el.muted = false
              el.play().then(() => {
                console.log('✅ Intro video playing with audio')
              }).catch(() => {
                // Autoplay blocked - try muted
                console.log('⚠️ Autoplay blocked, trying muted')
                el.muted = true
                setAudioBlocked(true)
                el.play().catch(() => {})
              })
              ;(window as any).__introVideo = el
            }
          }}
          playsInline
          onEnded={handleVideoEnded}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={INTRO_VIDEO_WITH_AUDIO} type="video/mp4" />
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

// Export fade function for use by parent - now fades video audio
export function fadeOutIntroSong(duration: number = 500): Promise<void> {
  return new Promise((resolve) => {
    const video = introVideoElement
    if (!video || video.muted || video.paused) {
      if (video) {
        video.muted = true
        video.pause()
      }
      resolve()
      return
    }

    const startVolume = video.volume
    const steps = 10
    const stepTime = duration / steps
    let step = 0

    const fadeInterval = setInterval(() => {
      step++
      video.volume = Math.max(0, startVolume * (1 - step / steps))
      if (step >= steps) {
        clearInterval(fadeInterval)
        video.muted = true
        resolve()
      }
    }, stepTime)
  })
}
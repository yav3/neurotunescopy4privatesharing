import { useEffect, useState, useRef } from 'react'

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

// Single video file - MUTED (no audio from this video)
const INTRO_VIDEO = '/videos/landing-commercial.mp4'

type Phase = 'focus' | 'watching' | 'experience' | 'complete'

// Module-level guard to prevent double initialization
let hasStartedIntro = false

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [phase, setPhase] = useState<Phase>('focus')
  const [isTextVisible, setIsTextVisible] = useState(true)
  const [showVideo, setShowVideo] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const hasCompletedRef = useRef(false)

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
    }
  }, [])

  if (phase === 'complete') return null

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
      {/* Video - always MUTED */}
      {showVideo && (
        <video
          ref={(el) => {
            videoRef.current = el
            if (el && !hasStartedIntro) {
              hasStartedIntro = true
              el.muted = true
              el.volume = 0
              el.play().then(() => {
                console.log('✅ Intro video playing (muted)')
              }).catch(() => {
                console.log('⚠️ Autoplay blocked')
              })
              ;(window as any).__introVideo = el
            }
          }}
          muted
          playsInline
          onEnded={handleVideoEnded}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={INTRO_VIDEO} type="video/mp4" />
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

// Export fade function - now a no-op since video is muted
export function fadeOutIntroSong(_duration?: number): Promise<void> {
  return Promise.resolve()
}
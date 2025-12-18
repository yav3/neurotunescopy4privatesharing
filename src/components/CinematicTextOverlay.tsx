import { useEffect, useState, useRef } from 'react'
import { audioManager } from '@/utils/audioManager'

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

// Intro song - plays until user starts the experience
const INTRO_SONG_URL = '/audio/intro-relaxation.mp3'

// Commercial video - MUTED (no voiceover)
const COMMERCIAL_VIDEO = '/videos/landing-commercial.mp4'

type Phase = 'focus' | 'watching' | 'experience' | 'complete'

// Module-level guard to prevent double initialization
let hasStartedIntro = false

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [phase, setPhase] = useState<Phase>('focus')
  const [isTextVisible, setIsTextVisible] = useState(true)
  const [showVideo, setShowVideo] = useState(true)
  const [audioBlocked, setAudioBlocked] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const hasCompletedRef = useRef(false) // Prevent double completion

  // Auto-start on mount - use centralized audioManager
  useEffect(() => {
    // Guard against double initialization from StrictMode
    if (hasStartedIntro) {
      console.log('🔒 Intro already started, skipping')
      return
    }
    hasStartedIntro = true

    const startAudio = async () => {
      const success = await audioManager.playIntro(INTRO_SONG_URL, 0.5)
      if (!success) {
        setAudioBlocked(true)
      }
    }
    startAudio()

    // Cleanup on unmount
    return () => {
      // Reset guard on unmount so it can play again on next mount
      hasStartedIntro = false
    }
  }, [])

  // Handle first interaction to unlock audio if blocked
  useEffect(() => {
    if (!audioBlocked) return

    const unlockAudio = async () => {
      const success = await audioManager.retryIntro()
      if (success) {
        console.log('✅ Audio unlocked on interaction')
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
    // Prevent double-firing
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
  return audioManager.fadeOutIntro(duration)
}

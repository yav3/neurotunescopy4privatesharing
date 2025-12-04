import { useEffect, useState, useRef } from 'react'
import chromeRings from '@/assets/chrome-rings.png'

type AnimationType = 'zoom-in' | 'zoom-out' | 'fade'

interface TextItem {
  main: string
  sub?: string
  duration: number
  animation: AnimationType
  emphasis?: boolean
}

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

// Intro audio URL - first track from the playlist
const INTRO_AUDIO_URL = 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/The-Spartan-Age-(1).mp3'

// Intro videos in sequence
const INTRO_VIDEOS = ['/videos/intro-2.mp4']

const MESSAGES: TextItem[] = [
  { 
    main: "Real Music  |  Real Science  |  Real Results", 
    duration: 3200, 
    animation: 'fade',
    emphasis: false 
  },
  { 
    main: "Enter the Experience", 
    duration: 2500, 
    animation: 'fade',
    emphasis: true 
  },
]

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isEntering, setIsEntering] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  const [audioStarted, setAudioStarted] = useState(false)
  const introAudioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Handle video ended - advance to next video
  const handleVideoEnded = () => {
    if (currentVideoIndex < INTRO_VIDEOS.length - 1) {
      setCurrentVideoIndex(prev => prev + 1)
    }
  }

  // Start intro audio on mount - with fallback for autoplay blocked
  useEffect(() => {
    const audio = new Audio(INTRO_AUDIO_URL)
    audio.volume = 0.5
    audio.crossOrigin = 'anonymous'
    introAudioRef.current = audio
    
    // Expose globally so main player can stop it
    ;(window as any).__introAudio = audio
    
    // Try autoplay
    audio.play().then(() => {
      console.log('✅ Intro audio autoplay succeeded')
      setAudioStarted(true)
    }).catch(err => {
      console.log('⚠️ Intro audio autoplay blocked, waiting for interaction:', err)
    })
    
    // Fallback: start on any user interaction
    const startOnInteraction = () => {
      if (!audioStarted && introAudioRef.current) {
        introAudioRef.current.play().then(() => {
          console.log('✅ Intro audio started on interaction')
          setAudioStarted(true)
        }).catch(() => {})
      }
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('touchstart', startOnInteraction)
    }
    
    document.addEventListener('click', startOnInteraction)
    document.addEventListener('touchstart', startOnInteraction)
    
    return () => {
      // Clean up on unmount
      audio.pause()
      audio.src = ''
      audio.volume = 0
      ;(window as any).__introAudio = null
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('touchstart', startOnInteraction)
    }
  }, [])

  // Stop intro audio when complete - BEFORE notifying parent
  const stopIntroAudio = () => {
    if (introAudioRef.current) {
      console.log('🔇 Stopping intro audio on completion')
      introAudioRef.current.pause()
      introAudioRef.current.src = ''
      introAudioRef.current.volume = 0
      introAudioRef.current = null
    }
    ;(window as any).__introAudio = null
    
    // Also kill any other audio elements that might exist
    document.querySelectorAll('audio').forEach((audio) => {
      audio.pause()
      audio.src = ''
      audio.volume = 0
    })
  }

  useEffect(() => {
    if (hasCompleted) {
      stopIntroAudio()
    }
  }, [hasCompleted])

  useEffect(() => {
    // Start with entering animation
    setIsEntering(true)
    setIsExiting(false)
    
    const current = MESSAGES[currentIndex]
    
    // After duration, start exit animation
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
      setIsEntering(false)
      
      // Move to next message or complete
      setTimeout(() => {
        if (currentIndex < MESSAGES.length - 1) {
          setCurrentIndex(prev => prev + 1)
        } else {
          // Fade to black briefly, then complete
          setTimeout(() => {
            // CRITICAL: Stop intro audio BEFORE notifying completion
            stopIntroAudio()
            setHasCompleted(true)
            onComplete?.()
          }, 500)
        }
      }, 800)
    }, current.duration)

    return () => clearTimeout(exitTimer)
  }, [currentIndex])

  const current = MESSAGES[currentIndex]

  // If completed, don't render anything
  if (hasCompleted) {
    return null
  }

  const getAnimationClass = () => {
    if (isExiting) {
      return 'scale-110 opacity-0'
    }
    if (isEntering) {
      return 'scale-100 opacity-100'
    }
    return 'scale-75 opacity-0'
  }

  const getBackgroundOpacity = () => {
    if (isExiting) return 'opacity-0'
    if (isEntering) return 'opacity-100'
    return 'opacity-0'
  }

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none bg-black">
      {/* Text content - white on black, centered */}
      <div className="px-6 text-center flex flex-col items-center">
        <div 
          className="transition-opacity ease-in-out"
          style={{ 
            transitionDuration: '1200ms',
            opacity: isEntering && !isExiting ? 1 : 0 
          }}
        >
          {/* Chrome rings image - only on first slide */}
          {currentIndex === 0 && (
            <img 
              src={chromeRings} 
              alt="Three interconnected chrome rings"
              className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 mb-8 object-contain"
            />
          )}
          <h2
            className="text-5xl md:text-7xl"
            style={{
              color: '#e4e4e4',
              letterSpacing: '0.02em',
              lineHeight: '1.1',
              fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
              fontWeight: 400,
            }}
          >
            {current.main}
          </h2>
        </div>
      </div>
    </div>
  )
}

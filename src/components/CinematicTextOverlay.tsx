import { useEffect, useState, useRef } from 'react'

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

const MESSAGES: TextItem[] = [
  { 
    main: "Real Music", 
    duration: 2000, 
    animation: 'fade',
    emphasis: false 
  },
  { 
    main: "Real Science", 
    duration: 2000, 
    animation: 'fade',
    emphasis: false 
  },
  { 
    main: "Real Health Results", 
    duration: 2000, 
    animation: 'fade',
    emphasis: false 
  },
  { 
    main: "Experience Now", 
    duration: 2500, 
    animation: 'fade',
    emphasis: true 
  },
]

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isEntering, setIsEntering] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  const introAudioRef = useRef<HTMLAudioElement | null>(null)

  // Start intro audio on mount
  useEffect(() => {
    const audio = new Audio(INTRO_AUDIO_URL)
    audio.volume = 0.5
    audio.crossOrigin = 'anonymous'
    introAudioRef.current = audio
    
    // Expose globally so main player can stop it
    ;(window as any).__introAudio = audio
    
    audio.play().catch(err => {
      console.log('Intro audio autoplay blocked:', err)
    })
    
    return () => {
      // Clean up on unmount
      audio.pause()
      audio.src = ''
      audio.volume = 0
      ;(window as any).__introAudio = null
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
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      {/* Video background for cinematic intro */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/intro-cinematic.mp4"
        autoPlay
        muted
        playsInline
        loop
      />
      
      {/* Text content - black for contrast against light video */}
      <div className="relative px-6 text-center max-w-5xl">
        <div className={`transition-all duration-1000 ease-out ${getAnimationClass()}`}>
          <h2
            className="text-6xl md:text-8xl text-black mb-3"
            style={{
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

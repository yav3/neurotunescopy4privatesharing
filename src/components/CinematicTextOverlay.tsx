import { useEffect, useState, useRef } from 'react'
import neuralpositiveLogoObsidian from '@/assets/neuralpositive-pearl-obsidian.png'

type AnimationType = 'zoom-in' | 'zoom-out' | 'fade'

interface TextItem {
  main: string
  sub?: string
  duration: number
  animation: AnimationType
  emphasis?: boolean
  isLogo?: boolean
}

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

// Intro audio URL - The Spartan Age plays during cinematic intro
const INTRO_AUDIO_URL = 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/The-Spartan-Age-%281%29.mp3'

// Intro videos in sequence
const INTRO_VIDEOS = ['/videos/intro-2.mp4']

const MESSAGES: TextItem[] = [
  { 
    main: "Engineered for Purpose", 
    duration: 2200, 
    animation: 'fade',
    emphasis: false 
  },
  { 
    main: "Music by award-winners", 
    duration: 2200, 
    animation: 'fade',
    emphasis: false 
  },
  { 
    main: "KOL Physician Leadership", 
    duration: 2200, 
    animation: 'fade',
    emphasis: false 
  },
  { 
    main: "Join Us", 
    duration: 2200, 
    animation: 'fade',
    emphasis: false 
  },
  { 
    main: "", 
    duration: 2000, 
    animation: 'fade',
    emphasis: false,
    isLogo: true
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

  // Fade out intro audio smoothly before stopping
  const fadeOutIntroAudio = (): Promise<void> => {
    return new Promise((resolve) => {
      const audio = introAudioRef.current
      if (!audio) {
        resolve()
        return
      }
      
      console.log('🔇 Fading out intro audio')
      const startVolume = audio.volume
      const fadeSteps = 20
      const fadeInterval = 50 // 1 second total fade
      let step = 0
      
      const fadeTimer = setInterval(() => {
        step++
        audio.volume = Math.max(0, startVolume * (1 - step / fadeSteps))
        
        if (step >= fadeSteps) {
          clearInterval(fadeTimer)
          audio.pause()
          audio.src = ''
          introAudioRef.current = null
          ;(window as any).__introAudio = null
          // NOTE: Don't kill ALL audio elements here - let the main player handle its own audio
          resolve()
        }
      }, fadeInterval)
    })
  }

  useEffect(() => {
    if (hasCompleted) {
      fadeOutIntroAudio()
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
          // Fade out audio smoothly, then complete
          fadeOutIntroAudio().then(() => {
            setHasCompleted(true)
            onComplete?.()
          })
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
      {/* Faint pearl-on-obsidian lissajous background - hidden during logo phase */}
      {!current.isLogo && (
        <div 
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-1000"
          style={{ opacity: 0.12 }}
        >
          <img 
            src={neuralpositiveLogoObsidian} 
            alt=""
            className="w-[400px] h-[400px] md:w-[550px] md:h-[550px] lg:w-[700px] lg:h-[700px] object-contain"
          />
        </div>
      )}
      
      {/* Content - either text or full logo reveal */}
      <div className="px-6 text-center relative z-10">
        <div 
          className="transition-all ease-in-out"
          style={{ 
            transitionDuration: '1200ms',
            opacity: isEntering && !isExiting ? 1 : 0,
            transform: isEntering && !isExiting ? 'scale(1)' : 'scale(0.95)'
          }}
        >
          {current.isLogo ? (
            <img 
              src={neuralpositiveLogoObsidian} 
              alt="Neuralpositive"
              className="w-80 h-80 md:w-[420px] md:h-[420px] lg:w-[520px] lg:h-[520px] object-contain"
            />
          ) : (
            <h2
              className="text-4xl md:text-6xl"
              style={{
                color: '#e4e4e4',
                letterSpacing: '0.05em',
                lineHeight: '1.1',
                fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                fontWeight: 200,
              }}
            >
              {current.main}
            </h2>
          )}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState, useRef } from 'react'
import neuralpositiveLogoObsidian from '@/assets/neuralpositive-pearl-obsidian.png'

type AnimationType = 'zoom-in' | 'zoom-out' | 'fade' | 'zoom-in-out'

interface TextItem {
  main: string
  sub?: string
  duration: number
  animation: AnimationType
  emphasis?: boolean
  isLogo?: boolean
  isFinal?: boolean
}

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

// Intro audio URL - Hail Queen Astrid plays during cinematic intro (local file for reliability)
const INTRO_AUDIO_URL = '/audio/hail-queen-astrid.mp3'

// Intro videos in sequence
const INTRO_VIDEOS = ['/videos/intro-2.mp4']

const MESSAGES: TextItem[] = [
  { 
    main: "", 
    duration: 2500, 
    animation: 'fade',
    emphasis: false,
    isLogo: true // Start with logo
  },
  { 
    main: "JUST RIGHT", 
    duration: 2000, 
    animation: 'fade',
    emphasis: false 
  },
  { 
    main: "ON-DEMAND", 
    duration: 2000, 
    animation: 'fade',
    emphasis: false,
    isFinal: true // End with this, smooth fade to play button
  },
]

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isEntering, setIsEntering] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  const [audioStarted, setAudioStarted] = useState(false)
  const [zoomPhase, setZoomPhase] = useState<'in' | 'out'>('in')
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
    audio.loop = true // Loop the intro song so it plays until user interaction
    introAudioRef.current = audio
    
    // Expose globally so main player can stop it
    ;(window as any).__introAudio = audio
    
    // Expose stop function globally for external triggers (play button, mute, navigation)
    ;(window as any).__stopIntroAudio = () => fadeOutIntroAudio()
    
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
      // Clean up on unmount (navigation away)
      audio.pause()
      audio.src = ''
      audio.volume = 0
      ;(window as any).__introAudio = null
      ;(window as any).__stopIntroAudio = null
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

  // Don't auto-fade audio when text sequence completes - let it play until user interaction
  // The audio will be stopped by:
  // 1. User clicking play button (via window.__stopIntroAudio)
  // 2. User muting (via window.__stopIntroAudio)
  // 3. User navigating away (component unmount)

  useEffect(() => {
    // Start with entering animation
    setIsEntering(true)
    setIsExiting(false)
    setZoomPhase('in')
    
    const current = MESSAGES[currentIndex]
    
    // For zoom-in-out animation, trigger the zoom-out phase midway
    let zoomOutTimer: NodeJS.Timeout | undefined
    if (current.animation === 'zoom-in-out') {
      zoomOutTimer = setTimeout(() => {
        setZoomPhase('out')
      }, current.duration * 0.4) // Start zoom-out at 40% of duration
    }
    
    // After duration, start exit animation
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
      setIsEntering(false)
      
      // Move to next message or complete - faster for final item
      const transitionDelay = current.isFinal ? 300 : 800
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
      }, transitionDelay)
    }, current.duration)

    return () => {
      clearTimeout(exitTimer)
      if (zoomOutTimer) clearTimeout(zoomOutTimer)
    }
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
    <div 
      className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none bg-black transition-opacity duration-1000"
      style={{ opacity: isExiting && current.isFinal ? 0 : 1 }}
    >
      {/* Logo always visible - prominent when isLogo, subtle background otherwise */}
      <div 
        className="absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out"
        style={{ 
          opacity: current.isLogo ? (isEntering && !isExiting ? 1 : 0.3) : 0.08,
          transform: current.isLogo ? 'scale(1)' : 'scale(0.85)'
        }}
      >
        <img 
          src={neuralpositiveLogoObsidian} 
          alt=""
          className="w-[350px] h-[350px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] object-contain"
        />
      </div>
      
      {/* Text content - shown over logo background */}
      {!current.isLogo && (
        <div className="px-6 text-center relative z-10">
          <div 
            className="transition-all ease-in-out"
            style={{ 
              transitionDuration: '1000ms',
              opacity: isEntering && !isExiting ? 1 : 0,
              transform: isEntering && !isExiting ? 'scale(1) translateY(0)' : 'scale(0.98) translateY(10px)'
            }}
          >
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
          </div>
        </div>
      )}
    </div>
  )
}

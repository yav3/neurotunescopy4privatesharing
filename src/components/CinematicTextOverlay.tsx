import { useEffect, useState, useRef } from 'react'
import neuralpositiveLogoObsidian from '@/assets/neuralpositive-pearl-obsidian.png'

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

// Intro audio - plays entire song until user navigates away
const INTRO_AUDIO_URL = '/audio/intro-focus.mp3'

// Commercial video (muted)
const COMMERCIAL_VIDEO = '/videos/landing-commercial.mp4'

// Text sequence phases
type Phase = 'focus' | 'usecases' | 'listen' | 'complete'

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [phase, setPhase] = useState<Phase>('focus')
  const [isTextVisible, setIsTextVisible] = useState(true)
  const [showVideo, setShowVideo] = useState(true)
  const [audioStarted, setAudioStarted] = useState(false)
  const introAudioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Start intro audio on mount - plays entire song until navigation
  useEffect(() => {
    const audio = new Audio(INTRO_AUDIO_URL)
    audio.volume = 0.5
    audio.crossOrigin = 'anonymous'
    audio.loop = false // Play entire song once
    introAudioRef.current = audio
    
    ;(window as any).__introAudio = audio
    ;(window as any).__stopIntroAudio = () => fadeOutIntroAudio()
    
    audio.play().then(() => {
      console.log('✅ Intro audio autoplay succeeded')
      setAudioStarted(true)
    }).catch(err => {
      console.log('⚠️ Intro audio autoplay blocked:', err)
    })
    
    const startOnInteraction = () => {
      if (!audioStarted && introAudioRef.current) {
        introAudioRef.current.play().then(() => {
          setAudioStarted(true)
        }).catch(() => {})
      }
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('touchstart', startOnInteraction)
    }
    
    document.addEventListener('click', startOnInteraction)
    document.addEventListener('touchstart', startOnInteraction)
    
    return () => {
      // Only stop audio when navigating away
      audio.pause()
      audio.src = ''
      audio.volume = 0
      ;(window as any).__introAudio = null
      ;(window as any).__stopIntroAudio = null
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('touchstart', startOnInteraction)
    }
  }, [])

  // Text sequence timing
  useEffect(() => {
    // Phase 1: "Focus made easy" - 3 seconds
    const phase1Timer = setTimeout(() => {
      setIsTextVisible(false)
      setTimeout(() => {
        setPhase('usecases')
        setIsTextVisible(true)
      }, 500)
    }, 3000)

    // Phase 2: Use cases - 4 seconds
    const phase2Timer = setTimeout(() => {
      setIsTextVisible(false)
      setTimeout(() => {
        setPhase('listen')
        setIsTextVisible(true)
      }, 500)
    }, 7500)

    // Phase 3: "Listen Now" - 3 seconds, then hide video
    const phase3Timer = setTimeout(() => {
      setShowVideo(false)
      setPhase('complete')
      onComplete?.()
    }, 11000)

    return () => {
      clearTimeout(phase1Timer)
      clearTimeout(phase2Timer)
      clearTimeout(phase3Timer)
    }
  }, [onComplete])

  const fadeOutIntroAudio = (): Promise<void> => {
    return new Promise((resolve) => {
      const audio = introAudioRef.current
      if (!audio) {
        resolve()
        return
      }
      
      const startVolume = audio.volume
      const fadeSteps = 20
      const fadeInterval = 50
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
          resolve()
        }
      }, fadeInterval)
    })
  }

  // After complete, just show Listen Now button (no video)
  if (phase === 'complete') {
    return null
  }

  return (
    <div 
      className="absolute inset-0 z-10 flex items-center justify-center bg-black transition-opacity duration-800"
      style={{ opacity: showVideo ? 1 : 0 }}
    >
      {/* Commercial video background - muted */}
      {showVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.7 }}
        >
          <source src={COMMERCIAL_VIDEO} type="video/mp4" />
        </video>
      )}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content overlay */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 transition-opacity duration-500"
        style={{ opacity: isTextVisible ? 1 : 0 }}
      >
        {/* Phase 1: Focus made easy */}
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

        {/* Phase 2: Use cases */}
        {phase === 'usecases' && (
          <div className="flex flex-col gap-3">
            <h2
              className="text-2xl md:text-4xl lg:text-5xl"
              style={{
                color: '#d4d4d4',
                letterSpacing: '0.08em',
                fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                fontWeight: 300,
              }}
            >
              Focus | Relax | Reset
            </h2>
            <p
              className="text-lg md:text-2xl"
              style={{
                color: 'rgba(212, 212, 212, 0.6)',
                letterSpacing: '0.12em',
                fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                fontWeight: 200,
              }}
            >
              on-demand
            </p>
          </div>
        )}

        {/* Phase 3: Listen Now */}
        {phase === 'listen' && (
          <div className="flex items-center gap-4">
            <img 
              src={neuralpositiveLogoObsidian} 
              alt="Neurotunes"
              className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
            />
            <span
              className="text-2xl md:text-4xl lg:text-5xl"
              style={{
                color: '#d4d4d4',
                letterSpacing: '0.1em',
                fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                fontWeight: 200,
              }}
            >
              Listen Now
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

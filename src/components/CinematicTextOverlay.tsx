import { useEffect, useState, useRef } from 'react'
import neuralpositiveLogoObsidian from '@/assets/neuralpositive-pearl-obsidian.png'

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

// Intro audio URL - Hail Queen Astrid plays during cinematic intro
const INTRO_AUDIO_URL = '/audio/hail-queen-astrid.mp3'

// Commercial video (muted)
const COMMERCIAL_VIDEO = '/videos/landing-commercial.mp4'

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)
  const [audioStarted, setAudioStarted] = useState(false)
  const introAudioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Start intro audio on mount
  useEffect(() => {
    const audio = new Audio(INTRO_AUDIO_URL)
    audio.volume = 0.5
    audio.crossOrigin = 'anonymous'
    audio.loop = false
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
      audio.pause()
      audio.src = ''
      audio.volume = 0
      ;(window as any).__introAudio = null
      ;(window as any).__stopIntroAudio = null
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('touchstart', startOnInteraction)
    }
  }, [])

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

  // Handle video ended - complete the overlay
  const handleVideoEnded = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 800)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div 
      className="absolute inset-0 z-10 flex items-center justify-center bg-black transition-opacity duration-800"
      style={{ opacity: isExiting ? 0 : 1 }}
    >
      {/* Commercial video background - muted */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnded}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.7 }}
      >
        <source src={COMMERCIAL_VIDEO} type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        {/* Focus made easy, */}
        <h1
          className="text-3xl md:text-5xl lg:text-6xl mb-8"
          style={{
            color: '#d4d4d4',
            letterSpacing: '0.06em',
            fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
            fontWeight: 300,
          }}
        >
          Focus made easy,
        </h1>

        {/* Logo + Neurotunes */}
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
            Neurotunes
          </span>
        </div>
      </div>
    </div>
  )
}

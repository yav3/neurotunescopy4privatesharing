import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play } from 'lucide-react'
import focusLogo from '@/assets/focus-logo-chrome.png'
import jacobsTechnion from '@/assets/jacobs-technion.png'
import stanfordMedicine from '@/assets/stanford-medicine.svg'
import weillCornell from '@/assets/weill-cornell-medicine.png'
import pedestalPhones from '@/assets/pedestal-phones.jpeg'

const INTRO_AUDIO_URL = '/audio/intro-focus.mp3'

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

// Singleton reference to prevent duplicate audio in StrictMode
let introAudioInstance: HTMLAudioElement | null = null

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [phase, setPhase] = useState<'intro' | 'fading' | 'complete'>('intro')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize intro audio on mount
  useEffect(() => {
    // Stop any existing audio first to prevent duplicates
    if (introAudioInstance) {
      introAudioInstance.pause()
      introAudioInstance.src = ''
      introAudioInstance = null
    }
    
    // Also stop any orphaned audio elements
    document.querySelectorAll('audio').forEach(audio => {
      if (!audio.id || !audio.id.startsWith('main-')) {
        audio.pause()
        audio.src = ''
      }
    })
    
    // Create fresh intro audio
    introAudioInstance = new Audio(INTRO_AUDIO_URL)
    introAudioInstance.volume = 0.6
    introAudioInstance.loop = true
    introAudioInstance.crossOrigin = 'anonymous'
    
    audioRef.current = introAudioInstance
    
    // Store reference for mute toggle from header
    ;(window as any).__introAudio = introAudioInstance
    
    // Try to autoplay (may be blocked by browser)
    introAudioInstance.play().catch(() => {
      console.log('Intro audio autoplay blocked - will play on user interaction')
    })

    return () => {
      // Cleanup on unmount
      if (introAudioInstance) {
        introAudioInstance.pause()
        introAudioInstance.src = ''
        introAudioInstance = null
        ;(window as any).__introAudio = null
      }
    }
  }, [])

  const handlePlay = () => {
    // Fade out intro audio
    if (audioRef.current) {
      const audio = audioRef.current
      const fadeOut = () => {
        if (audio.volume > 0.1) {
          audio.volume = Math.max(0, audio.volume - 0.1)
          setTimeout(fadeOut, 50)
        } else {
          audio.pause()
          audio.currentTime = 0
          introAudioInstance = null
          ;(window as any).__introAudio = null
        }
      }
      fadeOut()
    }
    
    setPhase('fading')
    // Complete after fade animation
    setTimeout(() => {
      setPhase('complete')
      onComplete?.()
    }, 1000)
  }

  if (phase === 'complete') return null

  return (
    <AnimatePresence>
      <motion.div
        key="intro-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        initial={{ opacity: 1 }}
        animate={{ 
          opacity: phase === 'fading' ? 0 : 1,
        }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: 1,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        {/* Content wrapper - centers both elements in the viewport */}
        <div className="flex items-center justify-center gap-8 lg:gap-16">
          {/* Left side - Text content */}
          <motion.div
            className="relative z-10 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: phase === 'intro' ? 1 : 0, 
              y: phase === 'intro' ? 0 : -20,
              scale: phase === 'fading' ? 0.95 : 1
            }}
            transition={{ 
              duration: phase === 'intro' ? 0.8 : 0.6,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            {/* Line 1: Feel BETTER + on demand */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <h1
                className="text-3xl md:text-5xl lg:text-6xl whitespace-nowrap"
                style={{
                  color: '#c0c0c0',
                  letterSpacing: '0.02em',
                  fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                  fontWeight: 300,
                }}
              >
                Feel BETTER,
              </h1>
              {/* "on demand" with play button inline */}
              <div className="flex items-center gap-4 mt-2 md:mt-3">
                <h1
                  className="text-3xl md:text-5xl lg:text-6xl whitespace-nowrap"
                  style={{
                    color: '#c0c0c0',
                    letterSpacing: '0.02em',
                    fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                    fontWeight: 300,
                  }}
                >
                  on demand
                </h1>
                
                {/* Frosted play button */}
                <motion.button
                  onClick={handlePlay}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                >
                  <Play className="w-5 h-5 md:w-6 md:h-6 ml-0.5" style={{ color: '#d0d0d0', fill: '#d0d0d0' }} />
                </motion.button>
                
                <span
                  className="text-xs tracking-widest uppercase"
                  style={{
                    color: '#808080',
                    fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                    fontWeight: 400,
                  }}
                >
                  demo
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Phone image */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ 
              opacity: phase === 'intro' ? 1 : 0, 
              x: phase === 'intro' ? 0 : 50 
            }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <img
              src={pedestalPhones}
              alt="Neurotunes App"
              className="max-h-[60vh] w-auto object-contain"
            />
          </motion.div>
        </div>

        {/* Bottom: Logo + supported by + Institution logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: phase === 'intro' ? 1 : 0, 
            y: phase === 'intro' ? 0 : 20 
          }}
          transition={{ delay: 0.9, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-6 md:gap-8"
        >
          <img
            src={focusLogo}
            alt="Neurotunes"
            className="h-6 md:h-8"
          />
          <span
            className="text-sm"
            style={{
              color: '#a0a0a0',
              fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
              fontWeight: 300,
            }}
          >
            supported by
          </span>
          <div className="flex items-center gap-6 md:gap-8 opacity-50">
            <img
              src={jacobsTechnion}
              alt="Jacobs Technion-Cornell Institute"
              className="h-6 md:h-8 brightness-0 invert"
            />
            <img
              src={stanfordMedicine}
              alt="Stanford Medicine"
              className="h-8 md:h-10 brightness-0 invert"
            />
            <img
              src={weillCornell}
              alt="Weill Cornell Medicine"
              className="h-6 md:h-8 brightness-0 invert"
            />
          </div>
        </motion.div>

        {/* Particle swirl effect */}
        {phase === 'fading' && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${20 + i * 15}px`,
                  height: `${20 + i * 15}px`,
                  background: `radial-gradient(circle, rgba(255,255,255,${0.1 - i * 0.01}) 0%, transparent 70%)`,
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 0.3,
                  scale: 1
                }}
                animate={{ 
                  x: Math.cos(i * 0.8) * (150 + i * 50),
                  y: Math.sin(i * 0.8) * (150 + i * 50),
                  opacity: 0,
                  scale: 2,
                  rotate: 360
                }}
                transition={{ 
                  duration: 1,
                  ease: 'easeOut',
                  delay: i * 0.05
                }}
              />
            ))}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// Export fade function for external control
export function fadeOutIntroSong(duration: number = 500): Promise<void> {
  return new Promise((resolve) => {
    const audio = (window as any).__introAudio as HTMLAudioElement | null
    if (!audio || audio.paused) {
      resolve()
      return
    }
    
    const steps = 10
    const stepTime = duration / steps
    let step = 0
    const startVolume = audio.volume
    
    const fadeInterval = setInterval(() => {
      step++
      audio.volume = Math.max(0, startVolume * (1 - step / steps))
      if (step >= steps) {
        clearInterval(fadeInterval)
        audio.pause()
        audio.currentTime = 0
        introAudioInstance = null
        ;(window as any).__introAudio = null
        resolve()
      }
    }, stepTime)
  })
}
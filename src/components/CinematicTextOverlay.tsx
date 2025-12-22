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
let initializationPending = false

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [phase, setPhase] = useState<'text' | 'intro' | 'fading' | 'complete'>('text')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const mountedRef = useRef(false)

  // Auto-transition from text to intro after 3 seconds
  useEffect(() => {
    if (phase === 'text') {
      const timer = setTimeout(() => {
        setPhase('intro')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [phase])

  // Initialize intro audio on mount - with StrictMode protection
  useEffect(() => {
    // Skip if already mounted (StrictMode double-mount protection)
    if (mountedRef.current) {
      // Just reconnect to existing audio if it exists
      if (introAudioInstance) {
        audioRef.current = introAudioInstance
      }
      return
    }
    mountedRef.current = true
    
    // Prevent concurrent initialization
    if (initializationPending) return
    initializationPending = true
    
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
    
    // Delay audio creation slightly to let StrictMode cleanup finish
    const initTimer = setTimeout(() => {
      // Double-check we're still supposed to create audio
      if (introAudioInstance) {
        initializationPending = false
        return
      }
      
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
      
      initializationPending = false
    }, 50)

    return () => {
      clearTimeout(initTimer)
      // Don't cleanup audio on StrictMode unmount - let it persist
      // Only cleanup when component is truly removed
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
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
        {/* Text phase - displays for 3 seconds */}
        <AnimatePresence mode="wait">
          {phase === 'text' && (
            <motion.div
              key="text-phase"
              className="flex flex-col items-center text-center px-6 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              <p
                className="text-lg md:text-xl lg:text-2xl leading-relaxed"
                style={{
                  color: '#c0c0c0',
                  fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                  fontWeight: 400,
                }}
              >
                Adaptive music for different states.
              </p>
              <p
                className="text-lg md:text-xl lg:text-2xl leading-relaxed mt-2"
                style={{
                  color: '#c0c0c0',
                  fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                  fontWeight: 400,
                }}
              >
                On-demand listening for what you need.
              </p>
              <p
                className="text-lg md:text-xl lg:text-2xl leading-relaxed mt-6"
                style={{
                  color: '#e4e4e4',
                  fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                  fontWeight: 500,
                }}
              >
                Press play. Notice the calm.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Centered play button with Demo label - shows after text phase */}
        <AnimatePresence>
          {phase === 'intro' && (
            <motion.div
              key="play-phase"
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Frosted play button */}
              <motion.button
                onClick={handlePlay}
                whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                <Play className="w-8 h-8 md:w-10 md:h-10 ml-1" style={{ color: '#d0d0d0', fill: '#d0d0d0' }} />
              </motion.button>
              
              {/* Demo label */}
              <span
                className="text-sm md:text-base tracking-[0.3em] uppercase"
                style={{
                  color: '#808080',
                  fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                  fontWeight: 400,
                }}
              >
                Demo
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom: Logo + supported by + Institution logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: (phase === 'text' || phase === 'intro') ? 1 : 0, 
            y: (phase === 'text' || phase === 'intro') ? 0 : 20 
          }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
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
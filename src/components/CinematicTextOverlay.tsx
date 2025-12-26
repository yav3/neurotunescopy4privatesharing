import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play } from 'lucide-react'
import focusLogo from '@/assets/focus-logo-chrome.png'
import jacobsTechnion from '@/assets/jacobs-technion.png'
import stanfordMedicine from '@/assets/stanford-medicine.svg'
import weillCornell from '@/assets/weill-cornell-medicine.png'
import pedestalPhones from '@/assets/pedestal-phones.jpeg'

const INTRO_SONG_URL = '/audio/The_Seventh_Wonder_new_age_focus_soprano_1.mp3'
const FADE_DURATION = 1500

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

// Global reference for the intro audio so we can fade it out externally
let globalIntroAudio: HTMLAudioElement | null = null

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [phase, setPhase] = useState<'text' | 'intro' | 'fading' | 'complete'>('text')

  // Auto-transition from text to intro after 3 seconds
  useEffect(() => {
    if (phase === 'text') {
      const timer = setTimeout(() => {
        setPhase('intro')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [phase])

  // Autoplay intro music on mount
  useEffect(() => {
    const audio = new Audio(INTRO_SONG_URL)
    audio.loop = true
    audio.volume = 0.5
    globalIntroAudio = audio
    ;(window as any).__introAudio = audio

    // Attempt to play (may be blocked by browser autoplay policy)
    audio.play().catch(() => {
      // If autoplay blocked, play on first user interaction
      const playOnInteraction = () => {
        audio.play().catch(() => {})
        document.removeEventListener('click', playOnInteraction)
        document.removeEventListener('touchstart', playOnInteraction)
      }
      document.addEventListener('click', playOnInteraction)
      document.addEventListener('touchstart', playOnInteraction)
    })

    return () => {
      audio.pause()
      audio.src = ''
      globalIntroAudio = null
      ;(window as any).__introAudio = null
    }
  }, [])

  const handlePlay = () => {
    // Fade out intro music
    fadeOutIntroSong(FADE_DURATION)
    
    setPhase('fading')
    // Complete after fade animation
    setTimeout(() => {
      setPhase('complete')
      onComplete?.()
    }, 1200)
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            >
              <p
                className="leading-relaxed"
                style={{
                  color: '#e8e8e8',
                  fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                  fontWeight: 300,
                  fontSize: '36px',
                  letterSpacing: '-0.02em',
                }}
              >
                Feel better, on-demand.
              </p>
            </motion.div>
          )}

          {phase === 'intro' && (
            <motion.div
              key="play-phase"
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Prominent play button with glow */}
              <motion.button
                onClick={handlePlay}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center transition-all duration-300 relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 0 60px rgba(255,255,255,0.15), 0 0 120px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                {/* Pulsing ring animation */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: '2px solid rgba(255,255,255,0.2)' }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <Play className="w-12 h-12 md:w-16 md:h-16 ml-2" style={{ color: '#ffffff', fill: '#ffffff' }} />
              </motion.button>
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
    const audio = globalIntroAudio
    if (!audio) {
      resolve()
      return
    }

    const startVolume = audio.volume
    const steps = 20
    const stepTime = duration / steps
    const volumeStep = startVolume / steps
    let currentStep = 0

    const fadeInterval = setInterval(() => {
      currentStep++
      audio.volume = Math.max(0, startVolume - volumeStep * currentStep)
      
      if (currentStep >= steps) {
        clearInterval(fadeInterval)
        audio.pause()
        audio.src = ''
        globalIntroAudio = null
        ;(window as any).__introAudio = null
        resolve()
      }
    }, stepTime)
  })
}
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play } from 'lucide-react'
import focusLogo from '@/assets/focus-logo-chrome.png'

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [phase, setPhase] = useState<'intro' | 'fading' | 'complete'>('intro')

  const handlePlay = () => {
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
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
        {/* Content */}
        <motion.div
          className="relative z-10 text-center px-6 flex flex-col items-center"
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
          {/* Tagline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl md:text-5xl lg:text-6xl mb-6"
            style={{
              color: '#e5e5e5',
              letterSpacing: '0.04em',
              fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
              fontWeight: 300,
            }}
          >
            Feel the music
          </motion.h1>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-10"
          >
            <img
              src={focusLogo}
              alt="Focus"
              className="h-20 md:h-24 mx-auto"
            />
          </motion.div>

          {/* Play Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            onClick={handlePlay}
            className="group relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 transition-all duration-300"
          >
            <Play 
              className="w-8 h-8 md:w-10 md:h-10 text-white/90 ml-1 group-hover:text-white transition-colors" 
              fill="currentColor"
            />
            {/* Pulsing ring effect */}
            <motion.div
              className="absolute inset-0 rounded-full border border-white/20"
              animate={{ 
                scale: [1, 1.3, 1.3],
                opacity: [0.5, 0, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut'
              }}
            />
          </motion.button>
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

// Export fade function - no-op since we removed audio
export function fadeOutIntroSong(_duration?: number): Promise<void> {
  return Promise.resolve()
}

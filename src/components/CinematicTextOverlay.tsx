import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play } from 'lucide-react'
import focusLogo from '@/assets/focus-logo-chrome.png'
import jacobsTechnion from '@/assets/jacobs-technion.png'
import stanfordMedicine from '@/assets/stanford-medicine.svg'
import weillCornell from '@/assets/weill-cornell-medicine.png'

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [phase, setPhase] = useState<'intro' | 'fading' | 'complete'>('intro')

  useEffect(() => {
    // Auto-fade after 3 seconds
    const timer = setTimeout(() => {
      setPhase('fading')
      // Complete after fade animation
      setTimeout(() => {
        setPhase('complete')
        onComplete?.()
      }, 1000)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

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
        {/* Content */}
        <motion.div
          className="relative z-10 px-6 flex flex-col"
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
          {/* Line 1: Feel BETTER, on demand */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl md:text-5xl lg:text-6xl mb-3 whitespace-nowrap"
            style={{
              background: 'linear-gradient(180deg, #e8e8e8 0%, #b0b0b0 50%, #c8c8c8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.02em',
              fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
              fontWeight: 300,
            }}
          >
            Feel BETTER, on demand
          </motion.h1>

          {/* Line 2: Logo + music engine + institution logos */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center">
              <img
                src={focusLogo}
                alt="Focus"
                className="h-7 md:h-10 lg:h-11"
              />
              <span
                className="text-xl md:text-3xl lg:text-4xl"
                style={{
                  background: 'linear-gradient(180deg, #e8e8e8 0%, #b0b0b0 50%, #c8c8c8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '0.02em',
                  fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                  fontWeight: 300,
                }}
              >
                music engine
              </span>
            </div>
            <div className="flex items-center gap-4 md:gap-5 opacity-50">
              <img
                src={jacobsTechnion}
                alt="Jacobs Technion-Cornell Institute"
                className="h-5 md:h-6 lg:h-7 brightness-0 invert"
              />
              <img
                src={stanfordMedicine}
                alt="Stanford Medicine"
                className="h-5 md:h-6 lg:h-7 brightness-0 invert"
              />
              <img
                src={weillCornell}
                alt="Weill Cornell Medicine"
                className="h-5 md:h-6 lg:h-7 brightness-0 invert"
              />
            </div>
          </motion.div>
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
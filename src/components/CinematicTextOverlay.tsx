import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [phase, setPhase] = useState<'intro' | 'fading' | 'complete'>('intro')

  useEffect(() => {
    // Show tagline for 2.5 seconds, then start fade
    const introTimer = setTimeout(() => {
      setPhase('fading')
    }, 2500)

    // Complete after fade animation
    const completeTimer = setTimeout(() => {
      setPhase('complete')
      onComplete?.()
    }, 3500)

    return () => {
      clearTimeout(introTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

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
          {/* Swirl/diffuse pattern overlay for fade effect */}
          {phase === 'fading' && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1.5, rotate: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.8) 70%, black 100%)',
                filter: 'blur(40px)',
              }}
            />
          )}

          {/* Content */}
          <motion.div
            className="relative z-10 text-center px-6"
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
            <h1
              className="text-4xl md:text-6xl lg:text-7xl mb-8"
              style={{
                color: '#e5e5e5',
                letterSpacing: '0.04em',
                fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                fontWeight: 300,
              }}
            >
              Feel the music
            </h1>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <img
                src="/lovable-uploads/59e41f73-7cbb-471a-9a0b-0f596e1ea90e.png"
                alt="NeuroTunes"
                className="h-10 md:h-12 mx-auto opacity-80"
                style={{ filter: 'brightness(0.9)' }}
              />
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
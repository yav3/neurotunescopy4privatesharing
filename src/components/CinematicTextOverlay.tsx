import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play } from 'lucide-react'
import focusLogo from '@/assets/focus-logo-chrome.png'
import jacobsTechnion from '@/assets/jacobs-technion.png'
import stanfordMedicine from '@/assets/stanford-medicine.svg'
import weillCornell from '@/assets/weill-cornell-medicine.png'
import pedestalPhones from '@/assets/pedestal-phones.jpeg'

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
        className="fixed inset-0 z-50 flex items-center bg-black/80"
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
        {/* Left side - Text content */}
        <motion.div
          className="relative z-10 px-8 md:px-16 lg:px-24 flex flex-col w-1/2"
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
            className="mb-3"
          >
            <h1
              className="text-3xl md:text-5xl lg:text-6xl whitespace-nowrap"
              style={{
                color: '#d4d4d4',
                letterSpacing: '0.02em',
                fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                fontWeight: 300,
              }}
            >
              Feel BETTER,
            </h1>
            <h1
              className="text-3xl md:text-5xl lg:text-6xl whitespace-nowrap"
              style={{
                color: '#d4d4d4',
                letterSpacing: '0.02em',
                fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                fontWeight: 300,
              }}
            >
              on demand
            </h1>
          </motion.div>
        </motion.div>

        {/* Right side - Phone image */}
        <motion.div
          className="w-1/2 flex items-center justify-center"
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
            className="max-h-[70vh] w-auto object-contain"
          />
        </motion.div>

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
            className="text-sm opacity-50"
            style={{
              color: '#d4d4d4',
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
              className="h-6 md:h-8 brightness-0 invert"
              style={{ transform: 'scale(1.4)' }}
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

// Export fade function - no-op since we removed audio
export function fadeOutIntroSong(_duration?: number): Promise<void> {
  return Promise.resolve()
}
import { useEffect, useState } from 'react'

type AnimationType = 'zoom-in' | 'zoom-out' | 'fade'

interface TextItem {
  main: string
  sub?: string
  duration: number
  animation: AnimationType
  emphasis?: boolean
}

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

const MESSAGES: TextItem[] = [
  { 
    main: "Real Music", 
    duration: 2000, 
    animation: 'fade',
    emphasis: false 
  },
  { 
    main: "Real Science", 
    duration: 2000, 
    animation: 'fade',
    emphasis: false 
  },
  { 
    main: "Real Health Results", 
    duration: 2000, 
    animation: 'fade',
    emphasis: false 
  },
  { 
    main: "Experience Now", 
    duration: 2500, 
    animation: 'fade',
    emphasis: true 
  },
]

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isEntering, setIsEntering] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)

  useEffect(() => {
    // Start with entering animation
    setIsEntering(true)
    setIsExiting(false)
    
    const current = MESSAGES[currentIndex]
    
    // After duration, start exit animation
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
      setIsEntering(false)
      
      // Move to next message or complete
      setTimeout(() => {
        if (currentIndex < MESSAGES.length - 1) {
          setCurrentIndex(prev => prev + 1)
        } else {
          // Fade to black briefly, then complete
          setTimeout(() => {
            setHasCompleted(true)
            onComplete?.()
          }, 500)
        }
      }, 800)
    }, current.duration)

    return () => clearTimeout(exitTimer)
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
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      {/* Black background that fades out */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-1000 ${getBackgroundOpacity()}`}
      />
      
      {/* Text content */}
      <div className="relative px-6 text-center max-w-5xl">
        <div className={`transition-all duration-1000 ease-out ${getAnimationClass()}`}>
          {/* Main text */}
          <h2
            className={`
              text-6xl md:text-8xl text-white mb-3
              ${current.emphasis 
                ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent' 
                : ''
              }
            `}
            style={{
              textShadow: current.emphasis 
                ? '0 0 60px rgba(6, 182, 212, 0.6)' 
                : '0 2px 40px rgba(0, 0, 0, 0.9)',
              letterSpacing: '0.02em',
              lineHeight: '1.1',
              fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
              fontWeight: 400,
            }}
          >
            {current.main}
          </h2>

          {/* Subtext */}
          {current.sub && (
            <p
              className="text-3xl md:text-4xl text-white/90 tracking-wide"
              style={{
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)',
                fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                fontWeight: 400,
              }}
            >
              {current.sub}
            </p>
          )}
        </div>

      </div>
    </div>
  )
}

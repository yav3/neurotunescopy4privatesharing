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
      {/* Video background for cinematic intro */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/intro-cinematic.mp4"
        autoPlay
        muted
        playsInline
        loop
      />
      
      {/* Subtle dark overlay */}
      <div 
        className={`absolute inset-0 bg-black/30 transition-opacity duration-1000 ${getBackgroundOpacity()}`}
      />
    </div>
  )
}

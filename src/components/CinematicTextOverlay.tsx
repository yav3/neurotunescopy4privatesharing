import { useEffect, useState } from 'react'

type AnimationType = 'zoom-in' | 'zoom-out' | 'fade'

interface TextItem {
  main: string
  sub?: string
  duration: number
  animation: AnimationType
  emphasis?: boolean
}

const MESSAGES: TextItem[] = [
  { 
    main: "50%", 
    sub: "Anxiety Reduction",
    duration: 3500, 
    animation: 'zoom-in',
    emphasis: true 
  },
  { 
    main: "Clinically Validated", 
    sub: "Peer-Reviewed Studies",
    duration: 3000, 
    animation: 'fade'
  },
  { 
    main: "8,500+ Tracks",
    sub: "Therapeutic Music Library",
    duration: 3000, 
    animation: 'zoom-in'
  },
  { 
    main: "Patented Technology", 
    sub: "GRN Generative Network",
    duration: 3500, 
    animation: 'fade',
    emphasis: true 
  },
  { 
    main: "Real Results", 
    sub: "Real Science",
    duration: 3500, 
    animation: 'zoom-in',
    emphasis: true 
  },
]

export function CinematicTextOverlay() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isEntering, setIsEntering] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    setIsEntering(true)
    setIsExiting(false)
    
    const current = MESSAGES[currentIndex]
    
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
      setIsEntering(false)
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % MESSAGES.length)
      }, 800)
    }, current.duration)

    return () => clearTimeout(exitTimer)
  }, [currentIndex])

  const current = MESSAGES[currentIndex]

  const getAnimationClass = () => {
    if (isExiting) {
      return current.animation === 'zoom-in' ? 'scale-110 opacity-0'
        : current.animation === 'zoom-out' ? 'scale-75 opacity-0'
        : 'opacity-0'
    }
    if (isEntering) {
      return 'scale-100 opacity-100'
    }
    return 'scale-95 opacity-0'
  }

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      {/* Vignette sheen */}
      <div 
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.35) 100%)'
        }}
      />
      
      {/* Letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
      
      {/* Text content */}
      <div className="relative px-6 text-center max-w-5xl">
        <div className={`transition-all duration-1000 ease-out ${getAnimationClass()}`}>
          {/* Main text */}
          <h2
            className={`
              text-white mb-3
              ${current.emphasis 
                ? 'text-6xl md:text-8xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent' 
                : 'text-5xl md:text-7xl'
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
              className="text-2xl md:text-4xl text-white/90 tracking-wide"
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

        {/* Accent lines */}
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-20 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent transition-all duration-1000 ${isEntering ? 'opacity-100 -translate-x-24' : 'opacity-0'}`} />
        <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-20 h-px bg-gradient-to-l from-transparent via-cyan-400/60 to-transparent transition-all duration-1000 ${isEntering ? 'opacity-100 translate-x-24' : 'opacity-0'}`} />
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
        {MESSAGES.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentIndex 
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 w-12 shadow-lg shadow-cyan-400/50' 
                : 'bg-white/20 w-8'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

import { useEffect, useState, useRef } from 'react'

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

// Commercial video WITH AUDIO - single source of truth
const COMMERCIAL_VIDEO = '/videos/landing-commercial.mp4'

// Text sequence phases
type Phase = 'focus' | 'watching' | 'experience' | 'complete'

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [phase, setPhase] = useState<Phase>('focus')
  const [isTextVisible, setIsTextVisible] = useState(true)
  const [showVideo, setShowVideo] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const mountedRef = useRef(true)

  // Expose video element globally for sync/control from parent
  useEffect(() => {
    mountedRef.current = true
    
    // Register the video element globally so Index can control/fade it
    if (videoRef.current) {
      (window as any).__introVideo = videoRef.current
    }
    
    return () => {
      mountedRef.current = false
      ;(window as any).__introVideo = null
    }
  }, [])

  // Handle video end - transition to experience phase, then show play button
  const handleVideoEnded = () => {
    setIsTextVisible(false)
    setShowVideo(false)
    setTimeout(() => {
      setPhase('experience')
      setIsTextVisible(true)
      
      // After 2 seconds of "Experience Now", complete and show the play button
      setTimeout(() => {
        setIsTextVisible(false)
        setTimeout(() => {
          setPhase('complete')
          onComplete?.()
        }, 500)
      }, 2000)
    }, 800)
  }

  // Text sequence timing - "Focus made easy" for 2 seconds, then fade out
  useEffect(() => {
    const phase1Timer = setTimeout(() => {
      setIsTextVisible(false)
      setTimeout(() => {
        setPhase('watching')
      }, 500)
    }, 2000)

    return () => {
      clearTimeout(phase1Timer)
    }
  }, [onComplete])

  if (phase === 'complete') {
    return null
  }

  return (
    <div 
      className="absolute inset-0 z-10 flex items-center justify-center bg-black transition-opacity duration-800"
    >
      {/* Commercial video WITH AUDIO - single synced source */}
      {showVideo && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          onEnded={handleVideoEnded}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={COMMERCIAL_VIDEO} type="video/mp4" />
        </video>
      )}
      
      {/* Content overlay */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 transition-opacity duration-500"
        style={{ opacity: isTextVisible ? 1 : 0 }}
      >
        {/* Phase 1: Focus made easy */}
        {phase === 'focus' && (
          <h1
            className="text-3xl md:text-5xl lg:text-6xl"
            style={{
              color: '#d4d4d4',
              letterSpacing: '0.06em',
              fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
              fontWeight: 300,
            }}
          >
            Focus made easy
          </h1>
        )}

        {/* Watching phase - no text, just the video */}
        {phase === 'watching' && null}

        {/* Experience Now - on black background after video ends */}
        {phase === 'experience' && (
          <h1
            className="text-3xl md:text-5xl lg:text-6xl"
            style={{
              color: '#d4d4d4',
              letterSpacing: '0.08em',
              fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
              fontWeight: 300,
            }}
          >
            Experience Now
          </h1>
        )}
      </div>
    </div>
  )
}

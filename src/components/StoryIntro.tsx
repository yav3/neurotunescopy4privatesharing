import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

interface StoryIntroProps {
  onComplete: () => void
}

export function StoryIntro({ onComplete }: StoryIntroProps) {
  const [isVisible, setIsVisible] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Start audio when component mounts
    if (audioRef.current) {
      audioRef.current.volume = 0.6
      audioRef.current.play().catch(err => {
        console.log('Audio autoplay blocked:', err)
      })
    }

    // Auto-complete when video ends
    const video = videoRef.current
    if (video) {
      video.onended = handleComplete
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  const handleComplete = () => {
    // Fade out audio
    if (audioRef.current) {
      const audio = audioRef.current
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.1) {
          audio.volume -= 0.1
        } else {
          clearInterval(fadeOut)
          audio.pause()
        }
      }, 100)
    }
    
    setIsVisible(false)
    setTimeout(() => {
      onComplete()
    }, 500)
  }

  if (!isVisible) {
    return (
      <div className="fixed inset-0 z-50 bg-black transition-opacity duration-500 opacity-0 pointer-events-none" />
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Video with dark overlay for better visibility */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/intro-2.mp4"
        autoPlay
        muted
        playsInline
      />
      
      {/* Dark overlay for better contrast */}
      <div 
        className="absolute inset-0"
        style={{ background: 'rgba(0, 0, 0, 0.3)' }}
      />
      
      {/* Audio */}
      <audio
        ref={audioRef}
        src="/audio/story-intro.mp3"
        preload="auto"
      />
      
      {/* Skip button */}
      <button
        onClick={handleComplete}
        className="absolute top-6 right-6 z-10 p-3 rounded-full transition-all duration-300 hover:bg-white/10"
        style={{ 
          color: 'rgba(228, 228, 228, 0.8)',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(228, 228, 228, 0.2)'
        }}
        aria-label="Skip intro"
      >
        <X size={24} strokeWidth={1.5} />
      </button>

      {/* Optional: Progress indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-xs" style={{ color: 'rgba(228, 228, 228, 0.5)' }}>
          Press X to skip
        </p>
      </div>
    </div>
  )
}

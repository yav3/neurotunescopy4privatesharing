import { useEffect, useState, useRef } from 'react'

interface CinematicTextOverlayProps {
  onComplete?: () => void
}

// Intro song - plays until user starts the experience
const INTRO_SONG_URL = '/audio/intro-relaxation.mp3'

// Commercial video - MUTED (no voiceover)
const COMMERCIAL_VIDEO = '/videos/landing-commercial.mp4'

type Phase = 'focus' | 'watching' | 'experience' | 'complete'

// Singleton audio management - ensures only one intro audio ever exists
class IntroAudioManager {
  private static instance: IntroAudioManager
  private audio: HTMLAudioElement | null = null
  private isPlaying = false

  static getInstance(): IntroAudioManager {
    if (!IntroAudioManager.instance) {
      IntroAudioManager.instance = new IntroAudioManager()
    }
    return IntroAudioManager.instance
  }

  async play(): Promise<boolean> {
    // Already playing - don't start another
    if (this.isPlaying && this.audio && !this.audio.paused) {
      console.log('🔒 Intro audio already playing, skipping')
      return true
    }

    // Kill any existing audio first
    this.stop()

    console.log('🎵 Starting intro audio...')
    this.audio = new Audio(INTRO_SONG_URL)
    this.audio.volume = 0.5
    this.audio.crossOrigin = 'anonymous'
    this.audio.loop = false // Play once only
    ;(window as any).__introAudio = this.audio

    try {
      await this.audio.play()
      this.isPlaying = true
      console.log('✅ Intro song playing')
      return true
    } catch (err) {
      console.log('⚠️ Autoplay blocked:', err)
      return false
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause()
      this.audio.src = ''
      this.audio = null
    }
    this.isPlaying = false
    ;(window as any).__introAudio = null
  }

  getAudio(): HTMLAudioElement | null {
    return this.audio
  }

  setMuted(muted: boolean) {
    if (this.audio) {
      this.audio.muted = muted
    }
  }

  syncToVideo(videoTime: number) {
    if (this.audio && Math.abs(this.audio.currentTime - videoTime) > 0.5) {
      this.audio.currentTime = videoTime
    }
  }

  async fadeOut(duration: number = 500): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audio || this.audio.paused) {
        this.stop()
        resolve()
        return
      }

      const startVolume = this.audio.volume
      const steps = 10
      const stepTime = duration / steps
      let step = 0
      const audioToFade = this.audio

      const fadeInterval = setInterval(() => {
        step++
        if (audioToFade) {
          audioToFade.volume = Math.max(0, startVolume * (1 - step / steps))
        }
        if (step >= steps) {
          clearInterval(fadeInterval)
          this.stop()
          resolve()
        }
      }, stepTime)
    })
  }
}

// Export manager instance for external use
export const introAudioManager = IntroAudioManager.getInstance()

export function CinematicTextOverlay({ onComplete }: CinematicTextOverlayProps) {
  const [phase, setPhase] = useState<Phase>('focus')
  const [isTextVisible, setIsTextVisible] = useState(true)
  const [showVideo, setShowVideo] = useState(true)
  const [audioBlocked, setAudioBlocked] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const hasCompletedRef = useRef(false) // Prevent double completion

  // Auto-start on mount
  useEffect(() => {
    const startAudio = async () => {
      const success = await introAudioManager.play()
      if (!success) {
        setAudioBlocked(true)
      }
    }
    startAudio()

    // Cleanup on unmount
    return () => {
      // Don't stop audio here - let fadeOutIntroSong handle it
    }
  }, [])

  // Handle first interaction to unlock audio if blocked
  useEffect(() => {
    if (!audioBlocked) return

    const unlockAudio = async () => {
      const audio = introAudioManager.getAudio()
      if (audio && audio.paused) {
        // Sync audio to video time
        if (videoRef.current) {
          introAudioManager.syncToVideo(videoRef.current.currentTime)
        }
        try {
          await audio.play()
          console.log('✅ Audio unlocked on interaction')
          setAudioBlocked(false)
        } catch {}
      }
    }

    document.addEventListener('click', unlockAudio, { once: true })
    document.addEventListener('touchstart', unlockAudio, { once: true })
    document.addEventListener('keydown', unlockAudio, { once: true })

    return () => {
      document.removeEventListener('click', unlockAudio)
      document.removeEventListener('touchstart', unlockAudio)
      document.removeEventListener('keydown', unlockAudio)
    }
  }, [audioBlocked])

  // Sync audio to video time
  useEffect(() => {
    if (phase === 'focus' || phase === 'watching') {
      const video = videoRef.current
      if (video) {
        const handleTimeUpdate = () => {
          introAudioManager.syncToVideo(video.currentTime)
        }
        video.addEventListener('timeupdate', handleTimeUpdate)
        return () => video.removeEventListener('timeupdate', handleTimeUpdate)
      }
    }
  }, [phase])

  const handleVideoEnded = () => {
    // Prevent double-firing
    if (hasCompletedRef.current) {
      console.log('🔒 Video ended already handled, skipping')
      return
    }
    hasCompletedRef.current = true

    console.log('🎬 Video ended, transitioning to experience')
    
    setIsTextVisible(false)
    setShowVideo(false)
    setTimeout(() => {
      setPhase('experience')
      setIsTextVisible(true)
      
      setTimeout(() => {
        setIsTextVisible(false)
        setTimeout(() => {
          setPhase('complete')
          onComplete?.()
        }, 500)
      }, 2000)
    }, 800)
  }

  // Text timing for focus phase
  useEffect(() => {
    if (phase === 'focus') {
      const timer = setTimeout(() => {
        setIsTextVisible(false)
        setTimeout(() => setPhase('watching'), 500)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [phase])

  if (phase === 'complete') return null

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
      {/* Video - MUTED (no voiceover) */}
      {showVideo && (
        <video
          ref={(el) => {
            videoRef.current = el
            if (el) {
              el.muted = true
              el.defaultMuted = true
              // Auto-play video on mount
              el.play().catch(() => {})
              ;(window as any).__introVideo = el
            }
          }}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={COMMERCIAL_VIDEO} type="video/mp4" />
        </video>
      )}
      
      <div 
        className="relative z-10 text-center px-6 transition-opacity duration-500"
        style={{ opacity: isTextVisible ? 1 : 0 }}
      >
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

// Export fade function for use by parent
export function fadeOutIntroSong(duration: number = 500): Promise<void> {
  return introAudioManager.fadeOut(duration)
}

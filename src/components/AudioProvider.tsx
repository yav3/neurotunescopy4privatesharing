import { useEffect, useRef } from 'react'
import { usePlayer, currentSrc } from '@/stores/usePlayer'
import { API } from '@/lib/api'

export default function AudioProvider() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const index = usePlayer((s) => s.index)
  const queue = usePlayer((s) => s.queue)
  const isPlaying = usePlayer((s) => s.isPlaying)
  const setPlaying = usePlayer((s) => s.setPlaying)
  const setLoading = usePlayer((s) => s.setLoading)
  const setError = usePlayer((s) => s.setError)
  const next = usePlayer((s) => s.next)

  // Load new track when index/queue changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const src = currentSrc()
    console.log('🎵 AudioProvider: Loading new track, src:', src)
    
    if (!src) {
      audio.pause()
      audio.src = ''
      return
    }

    setLoading(true)
    setError(undefined)
    
    audio.src = src
    audio.load()
    
    const handleCanPlay = () => {
      console.log('✅ AudioProvider: Track can play')
      setLoading(false)
      if (isPlaying) {
        audio.play().catch((error) => {
          console.error('❌ AudioProvider: Play failed:', error)
          setError('Playback failed')
          setPlaying(false)
        })
      }
    }

    const handleError = () => {
      console.error('❌ AudioProvider: Track load error')
      setError('Failed to load track')
      setLoading(false)
      setPlaying(false)
    }

    audio.addEventListener('canplay', handleCanPlay, { once: true })
    audio.addEventListener('error', handleError, { once: true })

    return () => {
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
    }
  }, [index, queue, setLoading, setError, isPlaying, setPlaying])

  // Handle play/pause state changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying && audio.paused && audio.src) {
      console.log('▶️ AudioProvider: Starting playback')
      audio.play().catch((error) => {
        console.error('❌ AudioProvider: Play failed:', error)
        setError('Playback failed')
        setPlaying(false)
      })
    } else if (!isPlaying && !audio.paused) {
      console.log('⏸️ AudioProvider: Pausing playback')
      audio.pause()
    }
  }, [isPlaying, setError, setPlaying])

  // Telemetry + auto-next
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    let sessionId: string | undefined
    let lastReportedTime = 0

    const onPlay = async () => {
      console.log('🎵 AudioProvider: Play event - starting session')
      const currentTrack = queue[index]
      if (!currentTrack) return

      try {
        const response = await API.startSession(currentTrack.id)
        sessionId = response.sessionId
        console.log('✅ AudioProvider: Session started:', sessionId)
      } catch (error) {
        console.error('❌ AudioProvider: Failed to start session:', error)
      }
    }

    const onTimeUpdate = () => {
      if (!sessionId) return
      const currentTime = Math.floor(audio.currentTime)
      
      // Report progress every 10 seconds
      if (currentTime - lastReportedTime >= 10) {
        API.progress(sessionId, currentTime)
        lastReportedTime = currentTime
      }
    }

    const onEnded = async () => {
      console.log('🏁 AudioProvider: Track ended')
      
      if (sessionId) {
        try {
          await API.complete(sessionId)
          console.log('✅ AudioProvider: Session completed:', sessionId)
        } catch (error) {
          console.error('❌ AudioProvider: Failed to complete session:', error)
        }
      }
      
      // Auto-advance to next track
      next()
    }

    const onPause = () => {
      setPlaying(false)
    }

    const onPlaying = () => {
      setPlaying(true)
      setLoading(false)
    }

    const onWaiting = () => {
      setLoading(true)
    }

    const onLoadStart = () => {
      setLoading(true)
    }

    // Add all event listeners
    audio.addEventListener('play', onPlay)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('loadstart', onLoadStart)

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('loadstart', onLoadStart)
    }
  }, [index, queue, next, setPlaying, setLoading])

  return (
    <audio 
      ref={audioRef} 
      preload="metadata" 
      className="hidden"
      playsInline
    />
  )
}
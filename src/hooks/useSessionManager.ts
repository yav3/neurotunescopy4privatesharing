// Session management hook that mirrors backend session lifecycle
import { useEffect, useCallback, useRef } from 'react'
import { API } from '@/lib/api'
import { API_BASE } from '@/lib/env'

interface SessionManager {
  trackProgress: (currentTime: number, duration: number) => void
  completeSession: () => Promise<void>
  startNewSession: (sessionId: string) => void
}

export const useSessionManager = (): SessionManager => {
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastProgressTime = useRef<number>(0)
  const sessionCompletedRef = useRef<boolean>(false)

  // Track progress every 30 seconds (mirror backend expectations)
  const trackProgress = useCallback((currentTime: number, duration: number) => {
    const sessionId = sessionStorage.getItem('currentSessionId')
    if (!sessionId || sessionCompletedRef.current) return

    const now = Date.now()
    const timeSinceLastProgress = now - lastProgressTime.current

    // Send progress every 30 seconds or at significant intervals
    if (timeSinceLastProgress > 30000) {
      console.log('📊 Sending session progress to backend:', {
        sessionId,
        currentTime: Math.floor(currentTime),
        progress: `${Math.floor(currentTime)}/${Math.floor(duration)}`
      })

      // Handle both beacon and fetch return types
      const progressResult = API.progress(sessionId, Math.floor(currentTime))
      if (progressResult && typeof progressResult === 'object' && 'then' in progressResult) {
        progressResult.then(() => {
          // Progress sent successfully
        }).catch((error) => {
          console.warn('⚠️ Failed to send session progress:', error)
        })
      }

      lastProgressTime.current = now
    }
  }, [])

  // Complete session - mirror backend completion
  const completeSession = useCallback(async () => {
    const sessionId = sessionStorage.getItem('currentSessionId')
    if (!sessionId || sessionCompletedRef.current) return

    try {
      console.log('✅ Completing session in backend:', sessionId)
      await API.complete(sessionId)
      
      // Calculate session metrics
      const startTime = sessionStorage.getItem('sessionStartTime')
      const sessionDuration = startTime ? Date.now() - parseInt(startTime) : 0
      
      console.log('📈 Session completed:', {
        sessionId,
        duration: Math.floor(sessionDuration / 1000) + 's',
        timestamp: new Date().toISOString()
      })

      // Clean up session storage
      sessionStorage.removeItem('currentSessionId')
      sessionStorage.removeItem('sessionStartTime')
      sessionCompletedRef.current = true
    } catch (error) {
      console.error('❌ Failed to complete session:', error)
    }
  }, [])

  // Start new session tracking
  const startNewSession = useCallback((sessionId: string) => {
    console.log('🔄 Starting new session management for:', sessionId)
    sessionCompletedRef.current = false
    lastProgressTime.current = 0
    
    // Clear any existing progress interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  // Auto-complete session on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessionId = sessionStorage.getItem('currentSessionId')
      if (sessionId && !sessionCompletedRef.current) {
        // Use navigator.sendBeacon for reliable completion on page exit
        const data = JSON.stringify({ sessionId })
        navigator.sendBeacon(`${API_BASE}/api/sessions/complete`, new Blob([data], { type: 'application/json' }))
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  return {
    trackProgress,
    completeSession, 
    startNewSession
  }
}
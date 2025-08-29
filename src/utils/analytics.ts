import { logger } from '@/services/logger'

export class Analytics {
  static track(event: string, properties?: Record<string, any>) {
    // Send to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, properties)
    }
    
    // Also log therapeutically relevant events
    if (event.includes('play') || event.includes('therapeutic')) {
      logger.info(`Therapeutic Event: ${event}`, properties)
    }
  }
  
  static trackTherapeuticSession(trackId: string, duration: number, frequency_band: string) {
    this.track('therapeutic_session_complete', {
      track_id: trackId,
      session_duration: duration,
      frequency_band,
      timestamp: new Date().toISOString()
    })
  }

  static trackError(error: string, context?: Record<string, any>) {
    this.track('error_occurred', {
      error_message: error,
      ...context,
      timestamp: new Date().toISOString()
    })
  }

  static trackUserAction(action: string, details?: Record<string, any>) {
    this.track('user_action', {
      action,
      ...details,
      timestamp: new Date().toISOString()
    })
  }
}
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
    
    // Log all access and authentication events
    if (event.includes('auth') || event.includes('access') || event.includes('session')) {
      logger.info(`Access Event: ${event}`, properties)
    }
  }
  
  static trackAppAccess(properties?: Record<string, any>) {
    this.track('app_accessed', {
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      ...properties
    })
  }
  
  static trackAuthAttempt(method: 'login' | 'signup', email?: string) {
    this.track('auth_attempt', {
      method,
      email,
      timestamp: new Date().toISOString()
    })
  }
  
  static trackAuthSuccess(method: 'login' | 'signup', userId: string, userRole?: string) {
    this.track('auth_success', {
      method,
      user_id: userId,
      user_role: userRole,
      timestamp: new Date().toISOString()
    })
  }
  
  static trackAuthFailure(method: 'login' | 'signup', error: string, email?: string) {
    this.track('auth_failure', {
      method,
      error_message: error,
      email,
      timestamp: new Date().toISOString()
    })
  }
  
  static trackUnauthorizedAccess(attemptedRoute: string, userAgent?: string) {
    this.track('unauthorized_access_attempt', {
      attempted_route: attemptedRoute,
      user_agent: userAgent || navigator.userAgent,
      timestamp: new Date().toISOString()
    });

    // Log detailed security incident
    import('@/services/securityMonitoring').then(({ securityMonitoring }) => {
      securityMonitoring.logSecurityIncident({
        attempted_route: attemptedRoute,
        ip_address: this.getClientIP(),
        user_agent: userAgent || navigator.userAgent,
        referer: document.referrer,
        session_id: this.generateSessionId(),
        blocked: true,
        severity: attemptedRoute.includes('/admin') ? 'high' : 'medium',
        incident_type: 'unauthorized_access_attempt',
        headers: this.collectRequestHeaders(),
        response_code: 401
      });
    });
  }

  private static getClientIP(): string {
    // In a real application, you'd get this from the server
    // For now, we'll return a placeholder
    return 'unknown';
  }

  private static generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static collectRequestHeaders(): Record<string, string> {
    return {
      'user-agent': navigator.userAgent,
      'accept-language': navigator.language,
      'referrer': document.referrer,
      'timestamp': new Date().toISOString()
    };
  }
  
  static trackSessionStart(userId: string, userRole?: string) {
    this.track('session_start', {
      user_id: userId,
      user_role: userRole,
      timestamp: new Date().toISOString()
    })
  }
  
  static trackSessionEnd(userId: string, sessionDuration?: number) {
    this.track('session_end', {
      user_id: userId,
      session_duration_ms: sessionDuration,
      timestamp: new Date().toISOString()
    })
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
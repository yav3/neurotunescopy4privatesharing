import type { Request, Response, NextFunction } from 'express'

interface LogEntry {
  timestamp: string
  method: string
  url: string
  status?: number
  duration?: string
  userAgent?: string
  ip: string
  error?: string
}

export class Logger {
  static error(message: string, meta?: any) {
    const logEntry = {
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message,
      meta
    }
    console.error(JSON.stringify(logEntry))
    
    // In production, send to external monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(logEntry)
    }
  }
  
  static warn(message: string, meta?: any) {
    const logEntry = {
      level: 'WARN',
      timestamp: new Date().toISOString(),
      message,
      meta
    }
    console.warn(JSON.stringify(logEntry))
  }
  
  static info(message: string, meta?: any) {
    const logEntry = {
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message,
      meta
    }
    console.info(JSON.stringify(logEntry))
  }

  static debug(message: string, meta?: any) {
    if (process.env.LOG_LEVEL === 'debug') {
      const logEntry = {
        level: 'DEBUG',
        timestamp: new Date().toISOString(),
        message,
        meta
      }
      console.debug(JSON.stringify(logEntry))
    }
  }

  private static async sendToMonitoringService(logEntry: any) {
    try {
      // Send to Sentry, LogRocket, or other monitoring service
      // This is a placeholder for actual implementation
      if (process.env.MONITORING_ENDPOINT) {
        await fetch(process.env.MONITORING_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logEntry)
        })
      }
    } catch (error) {
      console.error('Failed to send log to monitoring service:', error)
    }
  }
}

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  const originalSend = res.send

  // Override res.send to capture response
  res.send = function(body) {
    const duration = Date.now() - start
    
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress || 'unknown'
    }

    // Log different levels based on status code
    if (res.statusCode >= 500) {
      Logger.error('Server error', logEntry)
    } else if (res.statusCode >= 400) {
      Logger.warn('Client error', logEntry)
    } else {
      Logger.info('Request completed', logEntry)
    }

    return originalSend.call(this, body)
  }

  next()
}

// Error logging middleware
export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
  Logger.error('Unhandled error', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    body: req.body,
    query: req.query
  })

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' })
  } else {
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    })
  }
}

// Performance monitoring
export const performanceLogger = (threshold = 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now()
    
    res.on('finish', () => {
      const duration = Date.now() - start
      if (duration > threshold) {
        Logger.warn('Slow request detected', {
          method: req.method,
          url: req.url,
          duration: `${duration}ms`,
          threshold: `${threshold}ms`
        })
      }
    })
    
    next()
  }
}
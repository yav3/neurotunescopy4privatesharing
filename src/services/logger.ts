export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn', 
  INFO = 'info',
  DEBUG = 'debug'
}

class Logger {
  private static instance: Logger
  private logLevel: LogLevel = LogLevel.INFO

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private log(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...(meta && { meta })
    }

    // Console output
    switch (level) {
      case LogLevel.ERROR:
        console.error(`[ERROR] ${timestamp}: ${message}`, meta)
        break
      case LogLevel.WARN:
        console.warn(`[WARN] ${timestamp}: ${message}`, meta)
        break
      case LogLevel.INFO:
        console.info(`[INFO] ${timestamp}: ${message}`, meta)
        break
      case LogLevel.DEBUG:
        console.debug(`[DEBUG] ${timestamp}: ${message}`, meta)
        break
    }

    // Send to external logging service in production
    if (import.meta.env.PROD && level === LogLevel.ERROR) {
      // Send to Sentry, LogRocket, etc.
      this.sendToExternalService(logEntry)
    }
  }

  private async sendToExternalService(logEntry: any) {
    try {
      // Implementation for external logging service
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      })
    } catch (error) {
      console.error('Failed to send log to external service:', error)
    }
  }

  error(message: string, meta?: any) {
    this.log(LogLevel.ERROR, message, meta)
  }

  warn(message: string, meta?: any) {
    this.log(LogLevel.WARN, message, meta)
  }

  info(message: string, meta?: any) {
    this.log(LogLevel.INFO, message, meta)
  }

  debug(message: string, meta?: any) {
    this.log(LogLevel.DEBUG, message, meta)
  }
}

export const logger = Logger.getInstance()
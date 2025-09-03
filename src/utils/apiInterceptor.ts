interface APIRequestLog {
  url: string;
  method: string;
  timestamp: Date;
  duration?: number;
  status?: number;
  error?: string;
}

export class APIInterceptor {
  private static requests: APIRequestLog[] = [];
  private static maxLogs = 100;
  private static originalFetch: typeof fetch;
  
  static init() {
    if (this.originalFetch) return; // Already initialized
    
    this.originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const [url, options] = args;
      const startTime = performance.now();
      const method = options?.method || 'GET';
      
      const logEntry: APIRequestLog = {
        url: url.toString(),
        method,
        timestamp: new Date()
      };
      
      // Log request
      console.log(`🌐 API Request: ${method} ${url}`);
      
      try {
        const response = await this.originalFetch(...args);
        const endTime = performance.now();
        
        logEntry.duration = endTime - startTime;
        logEntry.status = response.status;
        
        // Log response
        console.log(`🌐 API Response: ${response.status} ${method} ${url} (${Math.round(logEntry.duration)}ms)`);
        
        // Check for common issues
        if (!response.ok) {
          logEntry.error = `HTTP ${response.status}`;
          console.error(`🚨 API Error: ${response.status} ${response.statusText} for ${url}`);
          
          // Store errors globally for debug panel
          if (!(window as any).__DEBUG_ERRORS__) {
            (window as any).__DEBUG_ERRORS__ = [];
          }
          (window as any).__DEBUG_ERRORS__.push(new Error(`API Error: ${response.status} ${url}`));
        }
        
        this.addLog(logEntry);
        return response;
        
      } catch (error) {
        const endTime = performance.now();
        logEntry.duration = endTime - startTime;
        logEntry.error = error instanceof Error ? error.message : 'Network error';
        
        console.error(`🚨 API Network Error: ${error} for ${url}`);
        
        this.addLog(logEntry);
        throw error;
      }
    };
  }
  
  static restore() {
    if (this.originalFetch) {
      window.fetch = this.originalFetch;
    }
  }
  
  private static addLog(log: APIRequestLog) {
    this.requests.unshift(log);
    if (this.requests.length > this.maxLogs) {
      this.requests = this.requests.slice(0, this.maxLogs);
    }
  }
  
  static getLogs(): APIRequestLog[] {
    return [...this.requests];
  }
  
  static clearLogs() {
    this.requests = [];
  }
}
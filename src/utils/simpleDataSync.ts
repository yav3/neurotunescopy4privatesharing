/**
 * Simple Data Synchronization
 * Basic data fetching and synchronization with force update capabilities
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

type DataCallback<T> = (data: T) => void;

export class SimpleDataSynchronizer<T = any> {
  private apiUrl: string;
  private cache = new Map<string, CacheEntry<T>>();
  private subscribers = new Map<string, Set<DataCallback<T>>>();
  private pollInterval: NodeJS.Timeout | null = null;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  /**
   * Fetch data with caching
   */
  async fetchAndUpdate(endpoint: string, forceUpdate = false): Promise<T> {
    const cacheKey = endpoint;
    
    try {
      if (!forceUpdate && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < 30000) { // 30 seconds
          return cached.data;
        }
      }
      
      const response = await fetch(`${this.apiUrl}${endpoint}`);
      const data = await response.json();
      
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      this.notifySubscribers(cacheKey, data);
      return data;
      
    } catch (error) {
      console.error('Data fetch failed:', error);
      throw error;
    }
  }

  /**
   * Subscribe to data changes
   */
  subscribe(endpoint: string, callback: DataCallback<T>): () => void {
    if (!this.subscribers.has(endpoint)) {
      this.subscribers.set(endpoint, new Set());
    }
    this.subscribers.get(endpoint)!.add(callback);
    
    return () => {
      const callbacks = this.subscribers.get(endpoint);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  /**
   * Notify all subscribers
   */
  private notifySubscribers(endpoint: string, data: T): void {
    if (this.subscribers.has(endpoint)) {
      this.subscribers.get(endpoint)!.forEach(callback => {
        callback(data);
      });
    }
  }

  /**
   * Start polling for updates
   */
  startPolling(endpoint: string, interval = 5000): void {
    this.stopPolling();
    this.pollInterval = setInterval(() => {
      this.fetchAndUpdate(endpoint, true);
    }, interval);
  }

  /**
   * Stop polling
   */
  stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  /**
   * Invalidate cache
   */
  invalidateCache(endpoint?: string): void {
    if (endpoint) {
      this.cache.delete(endpoint);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cached data without making a request
   */
  getCached(endpoint: string): T | null {
    const cached = this.cache.get(endpoint);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > 30000) {
      this.cache.delete(endpoint);
      return null;
    }
    
    return cached.data;
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.stopPolling();
    this.cache.clear();
    this.subscribers.clear();
  }
}
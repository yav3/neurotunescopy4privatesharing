/**
 * Simple Cache Management
 * Lightweight caching with force refresh capabilities
 */

interface CacheItem<T> {
  value: T;
  expires: number;
  version: number;
}

export class SimpleCacheManager<T = any> {
  private memoryCache = new Map<string, CacheItem<T>>();
  private version: number;

  constructor() {
    this.version = Date.now();
  }

  /**
   * Set cache item with TTL (time to live)
   */
  set(key: string, value: T, ttl = 300000): void { // 5 minutes default
    this.memoryCache.set(key, {
      value,
      expires: Date.now() + ttl,
      version: this.version
    });
  }

  /**
   * Get cache item
   */
  get(key: string): T | null {
    const item = this.memoryCache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires || item.version !== this.version) {
      this.memoryCache.delete(key);
      return null;
    }
    
    return item.value;
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    const item = this.memoryCache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expires || item.version !== this.version) {
      this.memoryCache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Invalidate specific key or all cache
   */
  invalidate(key?: string): void {
    if (key) {
      this.memoryCache.delete(key);
    } else {
      this.memoryCache.clear();
    }
  }

  /**
   * Clear expired items
   */
  clearExpired(): number {
    const now = Date.now();
    let cleared = 0;
    
    for (const [key, item] of this.memoryCache.entries()) {
      if (now > item.expires) {
        this.memoryCache.delete(key);
        cleared++;
      }
    }
    
    return cleared;
  }

  /**
   * Force refresh - invalidates all cache by incrementing version
   */
  forceRefresh(): void {
    this.version = Date.now();
    this.memoryCache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let expired = 0;
    let valid = 0;
    
    for (const item of this.memoryCache.values()) {
      if (now > item.expires || item.version !== this.version) {
        expired++;
      } else {
        valid++;
      }
    }
    
    return {
      total: this.memoryCache.size,
      valid,
      expired,
      version: this.version
    };
  }
}

// Global cache instance
export const globalCache = new SimpleCacheManager();
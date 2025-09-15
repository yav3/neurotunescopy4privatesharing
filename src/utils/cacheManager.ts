/**
 * Cache Management Utilities
 * Advanced caching with forced refresh capabilities
 */

interface CacheItem<T> {
  value: T;
  expires: number;
  version: number;
  metadata?: Record<string, any>;
}

type CacheListener<T> = (key: string, value: T | null, action: 'set' | 'delete' | 'expired') => void;

export class CacheManager<T = any> {
  private memoryCache = new Map<string, CacheItem<T>>();
  private version: number;
  private listeners = new Set<CacheListener<T>>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(autoCleanup = true, cleanupInterval = 60000) {
    this.version = Date.now();
    
    if (autoCleanup) {
      this.startAutoCleanup(cleanupInterval);
    }
  }

  /**
   * Set cache item with TTL
   */
  set(key: string, value: T, ttl = 300000, metadata?: Record<string, any>): void {
    const item: CacheItem<T> = {
      value,
      expires: Date.now() + ttl,
      version: this.version,
      metadata
    };

    this.memoryCache.set(key, item);
    this.notifyListeners(key, value, 'set');
  }

  /**
   * Get cache item
   */
  get(key: string): T | null {
    const item = this.memoryCache.get(key);
    if (!item) return null;

    if (Date.now() > item.expires || item.version !== this.version) {
      this.delete(key);
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
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete cache item
   */
  delete(key: string): boolean {
    const existed = this.memoryCache.has(key);
    this.memoryCache.delete(key);
    
    if (existed) {
      this.notifyListeners(key, null, 'delete');
    }
    
    return existed;
  }

  /**
   * Get cache item with metadata
   */
  getWithMetadata(key: string): { value: T; metadata?: Record<string, any> } | null {
    const item = this.memoryCache.get(key);
    if (!item) return null;

    if (Date.now() > item.expires || item.version !== this.version) {
      this.delete(key);
      return null;
    }

    return {
      value: item.value,
      metadata: item.metadata
    };
  }

  /**
   * Update cache item TTL
   */
  touch(key: string, ttl = 300000): boolean {
    const item = this.memoryCache.get(key);
    if (!item) return false;

    item.expires = Date.now() + ttl;
    return true;
  }

  /**
   * Get or set pattern (lazy loading)
   */
  async getOrSet(
    key: string,
    factory: () => Promise<T> | T,
    ttl = 300000,
    metadata?: Record<string, any>
  ): Promise<T> {
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    this.set(key, value, ttl, metadata);
    return value;
  }

  /**
   * Invalidate specific key or all cache
   */
  invalidate(key?: string): void {
    if (key) {
      this.delete(key);
    } else {
      const keys = Array.from(this.memoryCache.keys());
      this.memoryCache.clear();
      keys.forEach(k => this.notifyListeners(k, null, 'delete'));
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
        this.delete(key);
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
    const keys = Array.from(this.memoryCache.keys());
    this.memoryCache.clear();
    keys.forEach(key => this.notifyListeners(key, null, 'expired'));
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

  /**
   * Subscribe to cache events
   */
  subscribe(listener: CacheListener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get all valid cache keys
   */
  getKeys(): string[] {
    const validKeys: string[] = [];
    const now = Date.now();

    for (const [key, item] of this.memoryCache.entries()) {
      if (now <= item.expires && item.version === this.version) {
        validKeys.push(key);
      }
    }

    return validKeys;
  }

  /**
   * Start automatic cleanup
   */
  private startAutoCleanup(interval: number): void {
    this.cleanupInterval = setInterval(() => {
      this.clearExpired();
    }, interval);
  }

  /**
   * Stop automatic cleanup
   */
  stopAutoCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Notify listeners of cache changes
   */
  private notifyListeners(key: string, value: T | null, action: 'set' | 'delete' | 'expired'): void {
    this.listeners.forEach(listener => {
      try {
        listener(key, value, action);
      } catch (error) {
        console.error('Cache listener error:', error);
      }
    });
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopAutoCleanup();
    this.memoryCache.clear();
    this.listeners.clear();
  }
}

/**
 * Global cache instance
 */
export const globalCache = new CacheManager();

/**
 * React hook for cache management
 */
import { useState, useEffect, useCallback } from 'react';

export const useCache = <T>(cacheManager: CacheManager<T> = globalCache as CacheManager<T>) => {
  const [cacheStats, setCacheStats] = useState(cacheManager.getStats());

  const forceRefresh = useCallback(() => {
    cacheManager.forceRefresh();
    setCacheStats(cacheManager.getStats());
  }, [cacheManager]);

  const invalidate = useCallback((key?: string) => {
    cacheManager.invalidate(key);
    setCacheStats(cacheManager.getStats());
  }, [cacheManager]);

  useEffect(() => {
    const unsubscribe = cacheManager.subscribe(() => {
      setCacheStats(cacheManager.getStats());
    });
    return unsubscribe;
  }, [cacheManager]);

  return {
    stats: cacheStats,
    forceRefresh,
    invalidate,
    get: cacheManager.get.bind(cacheManager),
    set: cacheManager.set.bind(cacheManager),
    has: cacheManager.has.bind(cacheManager),
    getOrSet: cacheManager.getOrSet.bind(cacheManager)
  };
};
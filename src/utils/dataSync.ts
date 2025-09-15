/**
 * Data Synchronization Utilities
 * Advanced data fetching and synchronization with force update capabilities
 */

import { CacheManager } from './cacheManager';

interface DataSyncOptions {
  cacheTimeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  pollInterval?: number;
}

type DataSubscriber<T> = (data: T | null, error?: Error) => void;
type DataTransformer<T, U> = (data: T) => U;

export class DataSynchronizer<T = any> {
  private apiUrl: string;
  private cache: CacheManager<T>;
  private subscribers = new Map<string, Set<DataSubscriber<T>>>();
  private pollIntervals = new Map<string, NodeJS.Timeout>();
  private requestQueue = new Map<string, Promise<T>>();

  constructor(apiUrl: string, options: DataSyncOptions = {}) {
    this.apiUrl = apiUrl.replace(/\/$/, ''); // Remove trailing slash
    this.cache = new CacheManager<T>();
  }

  /**
   * Fetch data with caching and error handling
   */
  async fetchAndUpdate<U = T>(
    endpoint: string,
    options: {
      forceUpdate?: boolean;
      transform?: DataTransformer<T, U>;
      headers?: Record<string, string>;
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: any;
    } = {}
  ): Promise<U extends T ? T : U> {
    const {
      forceUpdate = false,
      transform,
      headers = {},
      method = 'GET',
      body
    } = options;

    const cacheKey = `${method}:${endpoint}`;
    
    // Check cache first
    if (!forceUpdate) {
      const cached = this.cache.get(cacheKey);
      if (cached !== null) {
        const result = transform ? transform(cached) : cached;
        return result as U extends T ? T : U;
      }
    }

    // Check if request is already in progress
    if (this.requestQueue.has(cacheKey)) {
      const data = await this.requestQueue.get(cacheKey)!;
      const result = transform ? transform(data) : data;
      return result as U extends T ? T : U;
    }

    // Make new request
    const requestPromise = this.makeRequest<T>(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });

    this.requestQueue.set(cacheKey, requestPromise);

    try {
      const data = await requestPromise;
      
      // Cache the result
      this.cache.set(cacheKey, data, 300000); // 5 minutes default
      
      // Notify subscribers
      this.notifySubscribers(endpoint, data);
      
      const result = transform ? transform(data) : data;
      return result as U extends T ? T : U;

    } catch (error) {
      console.error(`Data fetch failed for ${endpoint}:`, error);
      this.notifySubscribers(endpoint, null, error as Error);
      throw error;
    } finally {
      this.requestQueue.delete(cacheKey);
    }
  }

  /**
   * Subscribe to data changes for an endpoint
   */
  subscribe(endpoint: string, callback: DataSubscriber<T>): () => void {
    if (!this.subscribers.has(endpoint)) {
      this.subscribers.set(endpoint, new Set());
    }
    this.subscribers.get(endpoint)!.add(callback);

    return () => {
      const subs = this.subscribers.get(endpoint);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.subscribers.delete(endpoint);
          this.stopPolling(endpoint);
        }
      }
    };
  }

  /**
   * Start polling an endpoint for updates
   */
  startPolling(endpoint: string, interval = 5000): void {
    this.stopPolling(endpoint);
    
    const pollFn = async () => {
      try {
        await this.fetchAndUpdate(endpoint, { forceUpdate: true });
      } catch (error) {
        console.error(`Polling error for ${endpoint}:`, error);
      }
    };

    // Initial fetch
    pollFn();
    
    // Set up interval
    const intervalId = setInterval(pollFn, interval);
    this.pollIntervals.set(endpoint, intervalId);
  }

  /**
   * Stop polling an endpoint
   */
  stopPolling(endpoint?: string): void {
    if (endpoint) {
      const intervalId = this.pollIntervals.get(endpoint);
      if (intervalId) {
        clearInterval(intervalId);
        this.pollIntervals.delete(endpoint);
      }
    } else {
      // Stop all polling
      for (const intervalId of this.pollIntervals.values()) {
        clearInterval(intervalId);
      }
      this.pollIntervals.clear();
    }
  }

  /**
   * Invalidate cache for specific endpoint or all
   */
  invalidateCache(endpoint?: string): void {
    if (endpoint) {
      const cacheKey = `GET:${endpoint}`;
      this.cache.delete(cacheKey);
    } else {
      this.cache.forceRefresh();
    }
  }

  /**
   * Get cached data without making a request
   */
  getCached(endpoint: string): T | null {
    const cacheKey = `GET:${endpoint}`;
    return this.cache.get(cacheKey);
  }

  /**
   * Prefetch data for later use
   */
  async prefetch(endpoints: string[]): Promise<void> {
    const promises = endpoints.map(endpoint => 
      this.fetchAndUpdate(endpoint).catch(error => {
        console.warn(`Prefetch failed for ${endpoint}:`, error);
      })
    );
    
    await Promise.allSettled(promises);
  }

  /**
   * Batch multiple requests
   */
  async batchFetch(endpoints: string[]): Promise<(T | Error)[]> {
    const promises = endpoints.map(endpoint => 
      this.fetchAndUpdate(endpoint)
        .catch(error => error as Error)
    );
    
    return Promise.all(promises);
  }

  /**
   * Force refresh all cached data
   */
  async forceRefreshAll(): Promise<void> {
    this.cache.forceRefresh();
    
    // Trigger refresh for all active subscriptions
    const refreshPromises = Array.from(this.subscribers.keys()).map(endpoint =>
      this.fetchAndUpdate(endpoint, { forceUpdate: true })
        .catch(error => console.error(`Force refresh failed for ${endpoint}:`, error))
    );
    
    await Promise.allSettled(refreshPromises);
  }

  /**
   * Get synchronizer statistics
   */
  getStats() {
    return {
      cache: this.cache.getStats(),
      activeSubscriptions: this.subscribers.size,
      activePolls: this.pollIntervals.size,
      pendingRequests: this.requestQueue.size
    };
  }

  /**
   * Cleanup all resources
   */
  destroy(): void {
    this.stopPolling();
    this.subscribers.clear();
    this.requestQueue.clear();
    this.cache.destroy();
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest<U>(
    endpoint: string,
    options: RequestInit,
    attempt = 1
  ): Promise<U> {
    const maxRetries = 3;
    const url = `${this.apiUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.makeRequest<U>(endpoint, options, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Notify all subscribers for an endpoint
   */
  private notifySubscribers(endpoint: string, data: T | null, error?: Error): void {
    const subs = this.subscribers.get(endpoint);
    if (subs) {
      subs.forEach(callback => {
        try {
          callback(data, error);
        } catch (callbackError) {
          console.error('Subscriber callback error:', callbackError);
        }
      });
    }
  }
}

/**
 * React hook for data synchronization
 */
import { useState, useEffect, useCallback, useRef } from 'react';

export const useDataSync = <T>(
  synchronizer: DataSynchronizer<T>,
  endpoint: string,
  options: {
    autoFetch?: boolean;
    pollInterval?: number;
    transform?: DataTransformer<T, any>;
  } = {}
) => {
  const { autoFetch = true, pollInterval, transform } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async (forceUpdate = false) => {
    if (!mountedRef.current) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await synchronizer.fetchAndUpdate(endpoint, { 
        forceUpdate,
        transform 
      });
      
      if (mountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err as Error);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [synchronizer, endpoint, transform]);

  const forceRefresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    mountedRef.current = true;
    
    const unsubscribe = synchronizer.subscribe(endpoint, (newData, subscriptionError) => {
      if (!mountedRef.current) return;
      
      if (subscriptionError) {
        setError(subscriptionError);
      } else {
        setData(newData);
        setError(null);
      }
    });

    if (autoFetch) {
      fetchData();
    }

    if (pollInterval) {
      synchronizer.startPolling(endpoint, pollInterval);
    }

    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, [synchronizer, endpoint, autoFetch, pollInterval, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    forceRefresh
  };
};
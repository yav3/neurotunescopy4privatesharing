import { supabase } from "@/integrations/supabase/client";

// Storage request throttling and batching service
class StorageRequestManager {
  private pendingRequests = new Map<string, Promise<any>>();
  private requestCache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 30000; // 30 seconds cache
  private readonly MAX_CONCURRENT_REQUESTS = 3;
  private activeRequests = 0;
  private requestQueue: Array<() => Promise<any>> = [];

  // Generate cache key for storage list requests
  private getCacheKey(bucket: string, options?: any): string {
    return `${bucket}:${JSON.stringify(options || {})}`;
  }

  // Check if cached data is still valid
  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  // Process queued requests when capacity is available
  private async processQueue(): Promise<void> {
    if (this.activeRequests >= this.MAX_CONCURRENT_REQUESTS || this.requestQueue.length === 0) {
      return;
    }

    const request = this.requestQueue.shift();
    if (request) {
      this.activeRequests++;
      try {
        await request();
      } finally {
        this.activeRequests--;
        // Process next request in queue
        setTimeout(() => this.processQueue(), 100);
      }
    }
  }

  // Throttled storage list request - BUCKET ROOT ONLY
  async listStorage(bucket: string, options?: any): Promise<any> {
    const cacheKey = this.getCacheKey(bucket, options);
    
    // Check cache first
    const cached = this.requestCache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      console.log(`📦 Using cached storage list for bucket ROOT: ${bucket}`);
      return cached.data;
    }

    // Check if request is already pending to prevent race conditions
    if (this.pendingRequests.has(cacheKey)) {
      console.log(`🔄 Request already pending for bucket: ${bucket}, waiting...`);
      return this.pendingRequests.get(cacheKey);
    }

    // Create new request promise
    const requestPromise = new Promise<any>((resolve, reject) => {
      const executeRequest = async () => {
        try {
          console.log(`🔄 Executing storage request for bucket ROOT: ${bucket}`);
          const { data, error } = await supabase.storage.from(bucket).list('', {
            limit: 1000,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
            ...options
          });

          if (error) {
            console.error(`❌ Storage error for ${bucket}:`, error);
            throw error;
          }

          // Cache the result
          this.requestCache.set(cacheKey, { data: data || [], timestamp: Date.now() });
          console.log(`✅ Storage request completed for ${bucket}: ${(data || []).length} files`);
          resolve(data || []);
        } catch (error) {
          console.error(`❌ Storage request failed for ${bucket}:`, error);
          reject(error);
        } finally {
          // Clean up pending request
          this.pendingRequests.delete(cacheKey);
        }
      };

      // Queue the request if we're at capacity
      if (this.activeRequests >= this.MAX_CONCURRENT_REQUESTS) {
        console.log(`🔄 Queueing storage request for ${bucket} (${this.activeRequests}/${this.MAX_CONCURRENT_REQUESTS} active)`);
        this.requestQueue.push(executeRequest);
        this.processQueue();
      } else {
        // Execute immediately
        this.activeRequests++;
        executeRequest().finally(() => {
          this.activeRequests--;
          this.processQueue();
        });
      }
    });

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  // Clear cache for specific bucket or all
  clearCache(bucket?: string): void {
    if (bucket) {
      for (const [key] of this.requestCache.entries()) {
        if (key.startsWith(`${bucket}:`)) {
          this.requestCache.delete(key);
        }
      }
      console.log(`🧹 Cleared cache for bucket: ${bucket}`);
    } else {
      this.requestCache.clear();
      console.log('🧹 Cleared all storage cache');
    }
  }

  // Get cache stats for debugging
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.requestCache.size,
      keys: Array.from(this.requestCache.keys())
    };
  }

  // Get request stats for debugging
  getRequestStats(): { 
    activeRequests: number; 
    queueLength: number; 
    pendingRequests: number;
  } {
    return {
      activeRequests: this.activeRequests,
      queueLength: this.requestQueue.length,
      pendingRequests: this.pendingRequests.size
    };
  }
}

// Export singleton instance
export const storageRequestManager = new StorageRequestManager();

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).storageRequestManager = storageRequestManager;
}
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
          console.log(`🔄 Executing storage request via edge function for bucket: ${bucket}`);
          
          // Use storage-access edge function for proper authentication
          const response = await fetch(`https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/storage-access?bucket=${bucket}&limit=1000`, {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Storage edge function error for ${bucket}:`, response.status, errorText);
            throw new Error(`Storage access failed: ${response.status} ${errorText}`);
          }

          const result = await response.json();
          const files = result.tracks || [];
          
          // Convert edge function response back to storage list format,
          // preserving the signed stream_url so consumers don't have to
          // call getPublicUrl (which fails for now-private audio buckets).
          const storageFiles = files.map((track: any) => ({
            name: track.storage_key,
            metadata: { size: track.file_size },
            updated_at: track.last_modified,
            created_at: track.last_modified,
            stream_url: track.stream_url,
          }));

          // Cache the result
          this.requestCache.set(cacheKey, { data: storageFiles, timestamp: Date.now() });
          console.log(`✅ Storage edge function completed for ${bucket}: ${storageFiles.length} files`);
          resolve(storageFiles);
        } catch (error) {
          console.error(`❌ Storage edge function request failed for ${bucket}:`, error);
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
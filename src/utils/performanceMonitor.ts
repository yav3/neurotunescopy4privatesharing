// Performance monitoring and optimization utilities
// Based on the advanced architecture from the repository

export interface PerformanceMetrics {
  responseTime: number;
  tracksLoaded: number;
  cacheHitRate: number;
  errorRate: number;
  timestamp: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 100; // Keep last 100 measurements
  private trackCache = new Map<string, { tracks: any[]; timestamp: number; goal: string }>();
  private readonly cacheExpiry = 5 * 60 * 1000; // 5 minutes cache

  // Track API response times
  async measureApiCall<T>(
    operation: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    let success = true;
    let result: T;

    try {
      result = await apiCall();
      return result;
    } catch (error) {
      success = false;
      throw error;
    } finally {
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      this.recordMetric({
        responseTime,
        tracksLoaded: Array.isArray(result) ? result.length : 0,
        cacheHitRate: this.calculateCacheHitRate(),
        errorRate: success ? 0 : 1,
        timestamp: Date.now()
      });

      console.log(`📊 ${operation} completed in ${responseTime.toFixed(2)}ms`);
      
      // Alert on slow responses (>2 seconds)
      if (responseTime > 2000) {
        console.warn(`⚠️ Slow API response detected: ${operation} took ${responseTime.toFixed(2)}ms`);
      }
    }
  }

  // Intelligent caching for track requests
  getCachedTracks(goal: string): any[] | null {
    const cached = this.trackCache.get(goal);
    
    if (!cached) return null;
    
    // Check if cache is expired
    if (Date.now() - cached.timestamp > this.cacheExpiry) {
      this.trackCache.delete(goal);
      return null;
    }

    console.log(`💾 Cache hit for goal: ${goal} (${cached.tracks.length} tracks)`);
    return cached.tracks;
  }

  cacheTrackss(goal: string, tracks: any[]): void {
    this.trackCache.set(goal, {
      tracks,
      timestamp: Date.now(),
      goal
    });

    // Limit cache size (LRU-style)
    if (this.trackCache.size > 10) {
      const oldestKey = Array.from(this.trackCache.keys())[0];
      this.trackCache.delete(oldestKey);
    }

    console.log(`💾 Cached ${tracks.length} tracks for goal: ${goal}`);
  }

  // Health check and diagnostics
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    avgResponseTime: number;
    cacheHitRate: number;
    errorRate: number;
    recommendations: string[];
  } {
    const recentMetrics = this.metrics.slice(-10); // Last 10 measurements
    
    if (recentMetrics.length === 0) {
      return {
        status: 'healthy',
        avgResponseTime: 0,
        cacheHitRate: 0,
        errorRate: 0,
        recommendations: ['No performance data available yet']
      };
    }

    const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length;
    const avgCacheHitRate = recentMetrics.reduce((sum, m) => sum + m.cacheHitRate, 0) / recentMetrics.length;
    const avgErrorRate = recentMetrics.reduce((sum, m) => sum + m.errorRate, 0) / recentMetrics.length;

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    const recommendations: string[] = [];

    // Determine health status
    if (avgResponseTime > 3000 || avgErrorRate > 0.2) {
      status = 'unhealthy';
      recommendations.push('Critical performance issues detected');
    } else if (avgResponseTime > 1500 || avgErrorRate > 0.1 || avgCacheHitRate < 0.3) {
      status = 'degraded';
      recommendations.push('Performance degradation detected');
    }

    // Specific recommendations
    if (avgResponseTime > 1000) {
      recommendations.push('Consider implementing request batching or pagination');
    }
    if (avgCacheHitRate < 0.5) {
      recommendations.push('Low cache hit rate - consider longer cache duration');
    }
    if (avgErrorRate > 0.05) {
      recommendations.push('High error rate detected - check API connectivity');
    }

    return {
      status,
      avgResponseTime: Math.round(avgResponseTime),
      cacheHitRate: Math.round(avgCacheHitRate * 100) / 100,
      errorRate: Math.round(avgErrorRate * 100) / 100,
      recommendations
    };
  }

  // Memory optimization for track data
  optimizeTrackData(tracks: any[]): any[] {
    return tracks.map(track => ({
      // Keep only essential fields for performance
      id: track.id,
      title: track.title,
      artist: track.artist,
      genre: track.genre,
      mood: track.mood,
      storage_key: track.storage_key,
      audio_status: track.audio_status,
      bpm: track.bpm,
      camelot: track.camelot,
      // Include therapeutic fields
      therapeutic_effectiveness: track.therapeutic_effectiveness,
      valence: track.valence,
      energy_level: track.energy_level,
      // Remove large/unused fields to save memory
      // Omit: raw_data, metadata, large_description_fields, etc.
    }));
  }

  private recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  private calculateCacheHitRate(): number {
    const totalRequests = this.metrics.length;
    if (totalRequests === 0) return 0;
    
    // This is a simplified calculation - in practice you'd track actual cache hits
    return Math.min(this.trackCache.size / 10, 1); // Approximate based on cache size
  }

  // Export metrics for analysis
  exportMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  // Clear cache manually (useful for testing)
  clearCache(): void {
    this.trackCache.clear();
    console.log('🗑️ Performance cache cleared');
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[]; totalTracks: number } {
    let totalTracks = 0;
    const keys = Array.from(this.trackCache.keys());
    
    keys.forEach(key => {
      const cached = this.trackCache.get(key);
      if (cached) totalTracks += cached.tracks.length;
    });

    return {
      size: this.trackCache.size,
      keys,
      totalTracks
    };
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Debug utilities for development
export const debugPerformance = {
  logMetrics: () => {
    const health = performanceMonitor.getHealthStatus();
    const cache = performanceMonitor.getCacheStats();
    
    console.group('🔧 Performance Debug Info');
    console.log('Health Status:', health);
    console.log('Cache Stats:', cache);
    console.log('Recent Metrics:', performanceMonitor.exportMetrics().slice(-5));
    console.groupEnd();
  },
  
  simulateLoad: async (requests: number = 5) => {
    console.log(`🧪 Simulating ${requests} requests...`);
    
    const promises = Array.from({ length: requests }, (_, i) => 
      performanceMonitor.measureApiCall(
        `simulate-${i}`,
        () => new Promise(resolve => setTimeout(resolve, Math.random() * 1000))
      )
    );
    
    await Promise.all(promises);
    debugPerformance.logMetrics();
  }
};

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).debugPerformance = debugPerformance;
}

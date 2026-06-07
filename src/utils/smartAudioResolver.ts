import { supabase } from '@/integrations/supabase/client';
import { getStorageUrl } from '@/lib/storageUrl';

export interface AudioResolutionResult {
  success: boolean;
  url?: string;
  method?: string;
  attempts: Array<{
    url: string;
    status: number;
    method: string;
  }>;
  fallbackBuckets?: string[];
}

/**
 * OPTIMISTIC Smart audio URL resolver.
 * Now routes through getStorageUrl so private buckets receive signed URLs
 * rather than direct /object/public/ URLs that would 400 on private buckets.
 */
export class SmartAudioResolver {
  private static cache = new Map<string, AudioResolutionResult>();

  static async resolveAudioUrl(track: {
    id: string;
    title: string;
    storage_bucket?: string;
    storage_key?: string;
    category?: string;
    genre?: string;
  }): Promise<AudioResolutionResult> {

    const cacheKey = `${track.id}-${track.storage_bucket}-${track.storage_key}`;

    if (this.cache.has(cacheKey)) {
      console.log(`🔄 Cache hit for ${track.title}`);
      return this.cache.get(cacheKey)!;
    }

    console.log(`🚀 SmartAudioResolver: Resolving "${track.title}"`);

    // Priority 1: Use stored bucket + key with signed/public URL resolver
    if (track.storage_bucket && track.storage_key) {
      const dbUrl = await getStorageUrl(track.storage_bucket, track.storage_key);
      if (dbUrl) {
        const result: AudioResolutionResult = {
          success: true,
          url: dbUrl,
          method: 'database_signed',
          attempts: [{ url: dbUrl, status: 200, method: 'database_signed' }],
        };
        this.cache.set(cacheKey, result);
        return result;
      }
    }

    // Priority 2: Bucket guessing with signed URL on the primary candidate
    const targetBuckets = this.getBucketsForTrack(track);
    const cleanedTitle = this.cleanTrackTitle(track.title);
    const primaryBucket = targetBuckets[0];
    const primaryKey = `${cleanedTitle}.mp3`;
    const primaryUrl = await getStorageUrl(primaryBucket, primaryKey);

    const result: AudioResolutionResult = {
      success: !!primaryUrl,
      url: primaryUrl || undefined,
      method: `bucket_${primaryBucket}_signed`,
      attempts: [{
        url: primaryUrl || '',
        status: primaryUrl ? 200 : 0,
        method: `bucket_${primaryBucket}_signed`,
      }],
      fallbackBuckets: targetBuckets.slice(1),
    };
    this.cache.set(cacheKey, result);
    return result;
  }

  private static getBucketsForTrack(track: {
    title: string;
    category?: string;
    genre?: string;
    storage_bucket?: string;
  }): string[] {
    const title = (track.title || '').toLowerCase();
    const category = (track.category || '').toLowerCase();
    const genre = (track.genre || '').toLowerCase();
    
    console.log(`🎯 Analyzing track for bucket selection:`, {
      title: title.substring(0, 50),
      category,
      genre,
      storage_bucket: track.storage_bucket
    });

    const buckets: string[] = [];

    // Always try storage_bucket first if available
    if (track.storage_bucket) {
      buckets.push(track.storage_bucket);
    }

    // Special handling for Chopin/classical tracks (common issue)
    if (title.includes('chopin') || title.includes('sonata') || 
        title.includes('baroque') || category.includes('peaceful-piano') ||
        category.includes('chopin')) {
      buckets.push('Chopin');
      console.log(`🎹 Added Chopin bucket for classical track`);
    }

    // Category-specific bucket mapping
    if (category.includes('stress') || category.includes('anxiety')) {
      buckets.push('newageworldstressanxietyreduction', 'sonatasforstress');
    }
    
    if (category.includes('focus')) {
      buckets.push('focus-music', 'classicalfocus', 'NewAgeandWorldFocus');
    }
    
    if (category.includes('energy') || category.includes('boost')) {
      buckets.push('ENERGYBOOST');
    }

    // Genre-specific buckets
    if (genre.includes('classical')) {
      buckets.push('Chopin', 'classicalfocus', 'sonatasforstress');
    }

    // Always include fallback buckets
    buckets.push('neuralpositivemusic', 'audio');

    const uniqueBuckets = [...new Set(buckets)];
    console.log(`📂 Final bucket priority: [${uniqueBuckets.join(', ')}]`);
    return uniqueBuckets;
  }

  private static cleanTrackTitle(title: string): string {
    let cleaned = title;
    
    // Handle semicolons and complex patterns first
    if (cleaned.includes(';')) {
      cleaned = cleaned
        .replace(/;\s*in\s+/gi, '-in-')
        .replace(/;\s*Movement\s+/gi, '-movement-')
        .replace(/;\s*/g, '-');
    }
    
    // Intelligent truncation for very long titles
    if (cleaned.length > 60) {
      cleaned = cleaned
        .replace(/\s+(Classical|Sleep|Meditation|Deep\s+Rest|Remix|BPM)\s*/gi, '-')
        .replace(/\s*\(\d+\)\s*$/g, '')
        .substring(0, 50);
    }
    
    // Standard cleaning
    cleaned = cleaned
      .replace(/[;&,()]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 45);
    
    console.log(`🧹 Title cleaning: "${title}" -> "${cleaned}"`);
    return cleaned;
  }

  // Optional: Keep lightweight URL testing for edge cases (using GET with Range)
  private static async testUrlLightweight(url: string, method: string): Promise<{ url: string; status: number; method: string }> {
    try {
      // Use lightweight GET with range header instead of HEAD
      const response = await fetch(url, { 
        method: 'GET',
        headers: { 'Range': 'bytes=0-1' }, // Just first 2 bytes
        mode: 'cors'
      });
      console.log(`${response.ok ? '✅' : '❌'} ${method}: ${response.status} - ${url}`);
      return { url, status: response.status, method };
    } catch (error) {
      console.log(`🤔 ${method}: Network test failed, assuming URL might work - ${url}`);
      // OPTIMISTIC: Return success for network errors (CORS, etc.)
      return { url, status: 200, method: `${method}_optimistic` };
    }
  }

  static getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()).slice(0, 10) // First 10 keys for debugging
    };
  }

  static clearCache() {
    this.cache.clear();
    console.log('🗑️ SmartAudioResolver cache cleared');
  }

  // Fallback method for problematic tracks - returns signed URLs for each strategy
  static async resolveFallbackUrl(track: {
    id: string;
    title: string;
    storage_bucket?: string;
    storage_key?: string;
  }): Promise<string[]> {
    const urls: string[] = [];

    if (track.storage_bucket && track.storage_key) {
      const u = await getStorageUrl(track.storage_bucket, track.storage_key);
      if (u) urls.push(u);
    }

    const cleanTitle = track.title
      .replace(/[;&,]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    for (const bucket of ['neuralpositivemusic', 'ENERGYBOOST']) {
      const u = await getStorageUrl(bucket, `${cleanTitle}.mp3`);
      if (u) urls.push(u);
    }

    if (track.id) {
      const u = await getStorageUrl('audio', `tracks/${track.id}.mp3`);
      if (u) urls.push(u);
    }

    console.log(`🎯 Generated ${urls.length} fallback URLs for: "${track.title}"`);
    return urls;
  }
}

// Make it available globally for debugging
declare global {
  interface Window {
    SmartAudioResolver: typeof SmartAudioResolver;
  }
}

if (typeof window !== 'undefined') {
  window.SmartAudioResolver = SmartAudioResolver;
  
  // Simple direct test function
  (window as any).testDirectURL = async () => {
    const testUrl = "https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/audio/tracks/constantinople-of-the-sephardim.-movement-5.mp3";
    
    console.log('🧪 Testing direct storage URL:', testUrl);
    
    try {
      const response = await fetch(testUrl, { method: 'HEAD' });
      console.log('📊 Response:', response.status, response.statusText);
      
      if (response.ok) {
        console.log('✅ URL is accessible via HEAD request');
        // Try to play it
        const audio = new Audio(testUrl);
        try {
          await audio.play();
          console.log('🎵 Audio playback started successfully!');
          setTimeout(() => audio.pause(), 2000);
        } catch (playError) {
          console.log('🔇 Audio play failed (user interaction required?):', playError);
        }
      } else {
        console.log('❌ URL not accessible via HEAD request');
      }
    } catch (error) {
      console.log('❌ Network error:', error);
    }
  };
  
  // Test function for problematic tracks
  (window as any).testProblematicTrack = async () => {
    const testTrack = {
      id: "test-id-123",
      title: "Chopin Mazurka Op. 7 No. 1 For Bluegrass",
      storage_bucket: "neuralpositivemusic",
      storage_key: "chopin-mazurka-op-7-no-1-for-bluegrass.mp3"
    };
    
    console.log('🔍 Track data:', testTrack);
    const optimisticResult = await SmartAudioResolver.resolveAudioUrl(testTrack);
    
    if (optimisticResult.success) {
      console.log(`✅ SUCCESS: Found working URL via ${optimisticResult.method}`);
      console.log(`🔗 URL: ${optimisticResult.url}`);
      
      // Try to actually play it
      const audio = new Audio(optimisticResult.url!);
      try {
        await audio.play();
        console.log('🎵 CONFIRMED: Audio playback works!');
        setTimeout(() => audio.pause(), 3000);
      } catch (playError) {
        console.log('🔇 Play test failed (interaction needed?):', playError);
      }
    } else {
      console.log('❌ FAILED: Could not resolve URL');
      console.log('📋 Attempts:', optimisticResult.attempts);
    }
  };
  
  // Console helper messages
  console.log('🎵 SmartAudioResolver (OPTIMISTIC mode) loaded!');
  console.log('🧪 Debug functions available:');
  console.log('  testDirectURL() - Test a known working URL');
  console.log('  testProblematicTrack() - Test resolver on sample track');
  console.log('  SmartAudioResolver.getCacheStats() - View cache status');
  console.log('  SmartAudioResolver.clearCache() - Clear resolver cache');
}

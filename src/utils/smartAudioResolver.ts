import { supabase } from '@/integrations/supabase/client';

export interface AudioResolutionResult {
  success: boolean;
  url?: string;
  method?: string;
  attempts: Array<{
    url: string;
    status: number;
    method: string;
  }>;
}

/**
 * Smart audio URL resolver that tries multiple strategies to find working audio files
 */
export class SmartAudioResolver {
  private static cache = new Map<string, AudioResolutionResult>();
  
  static async resolveAudioUrl(track: {
    id: string;
    title: string;
    storage_bucket?: string;
    storage_key?: string;
  }): Promise<AudioResolutionResult> {
    
    const cacheKey = `${track.id}-${track.storage_bucket}-${track.storage_key}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      console.log(`🔄 Cache hit for ${track.title}`);
      return this.cache.get(cacheKey)!;
    }

    console.log(`🔍 Resolving audio for: "${track.title}"`);
    console.log(`📋 Database says: bucket="${track.storage_bucket}" key="${track.storage_key}"`);

    const attempts: AudioResolutionResult['attempts'] = [];
    const baseUrl = 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public';

    // Strategy 1: Try database URL as-is
    if (track.storage_bucket && track.storage_key) {
      const dbUrl = `${baseUrl}/${track.storage_bucket}/${encodeURIComponent(track.storage_key)}`;
      console.log(`🔗 Strategy 1: Database URL - ${dbUrl}`);
      
      const dbResult = await this.testUrl(dbUrl, 'database');
      attempts.push(dbResult);
      
      if (dbResult.status === 200) {
        const result = { success: true, url: dbUrl, method: 'database', attempts };
        this.cache.set(cacheKey, result);
        console.log(`✅ Database URL works!`);
        return result;
      }
    }

    // Strategy 2: Try neuralpositivemusic bucket with exact title match
    console.log(`🔗 Strategy 2: neuralpositivemusic exact match`);
    const cleanTitle = track.title.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const neuralUrl = `${baseUrl}/neuralpositivemusic/${cleanTitle}.mp3`;
    const neuralResult = await this.testUrl(neuralUrl, 'neural_exact');
    attempts.push(neuralResult);
    
    if (neuralResult.status === 200) {
      const result = { success: true, url: neuralUrl, method: 'neural_exact', attempts };
      this.cache.set(cacheKey, result);
      console.log(`✅ Neural exact match works!`);
      return result;
    }

    // Strategy 3: Search neuralpositivemusic bucket for partial matches
    console.log(`🔗 Strategy 3: neuralpositivemusic file search`);
    try {
      const { data: files } = await supabase.storage
        .from('neuralpositivemusic')
        .list('', { limit: 1000 });

      if (files) {
        const audioFiles = files.filter(f => f.name.match(/\.(mp3|wav|m4a|flac|ogg)$/i));
        
        // Try fuzzy matching
        const titleWords = track.title.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        let bestMatch = null;
        let highestScore = 0;

        for (const file of audioFiles) {
          const fileName = file.name.toLowerCase();
          let score = 0;
          
          // Count matching words
          for (const word of titleWords) {
            if (fileName.includes(word)) {
              score += word.length;
            }
          }
          
          // Bonus for title start match
          if (titleWords.length > 0 && fileName.startsWith(titleWords[0])) {
            score += 10;
          }
          
          if (score > highestScore && score > 5) {
            highestScore = score;
            bestMatch = file.name;
          }
        }

        if (bestMatch) {
          const fuzzyUrl = `${baseUrl}/neuralpositivemusic/${encodeURIComponent(bestMatch)}`;
          console.log(`🎯 Found potential match: ${bestMatch} (score: ${highestScore})`);
          
          const fuzzyResult = await this.testUrl(fuzzyUrl, 'neural_fuzzy');
          attempts.push(fuzzyResult);
          
          if (fuzzyResult.status === 200) {
            const result = { success: true, url: fuzzyUrl, method: 'neural_fuzzy', attempts };
            this.cache.set(cacheKey, result);
            console.log(`✅ Fuzzy match works!`);
            return result;
          }
        }
      }
    } catch (error) {
      console.log(`❌ Error searching files: ${error}`);
    }

    // Strategy 4: Try audio bucket with UUID format
    if (track.id) {
      const uuidUrl = `${baseUrl}/audio/tracks/${track.id}.mp3`;
      console.log(`🔗 Strategy 4: UUID format - ${uuidUrl}`);
      
      const uuidResult = await this.testUrl(uuidUrl, 'uuid');
      attempts.push(uuidResult);
      
      if (uuidResult.status === 200) {
        const result = { success: true, url: uuidUrl, method: 'uuid', attempts };
        this.cache.set(cacheKey, result);
        console.log(`✅ UUID format works!`);
        return result;
      }
    }

    // All strategies failed
    console.log(`❌ All resolution strategies failed for "${track.title}"`);
    console.log(`📊 Failed attempts summary:`, attempts.map(a => `${a.method}: ${a.status}`));
    console.log(`🔗 Database had: bucket="${track.storage_bucket}" key="${track.storage_key}"`);
    
    // Log this failure for debugging
    if (typeof window !== 'undefined') {
      (window as any).lastFailedTrack = { track, attempts };
    }
    
    const result = { success: false, attempts };
    this.cache.set(cacheKey, result);
    return result;
  }

  private static async testUrl(url: string, method: string): Promise<{ url: string; status: number; method: string }> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`${response.ok ? '✅' : '❌'} ${method}: ${response.status} - ${url}`);
      return { url, status: response.status, method };
    } catch (error) {
      console.log(`❌ ${method}: ERROR - ${url}`);
      return { url, status: 0, method };
    }
  }

  static clearCache() {
    this.cache.clear();
    console.log('🗑️ Audio resolver cache cleared');
  }

  static getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        key,
        success: value.success,
        method: value.method
      }))
    };
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
  
  // Add debugging command to test current queue
  (window as any).testCurrentQueue = async () => {
    const audio = (window as any).useAudioStore?.getState();
    if (!audio?.queue?.length) {
      console.log('❌ No queue to test - try starting a playlist first');
      return;
    }
    
    console.log(`🧪 Testing ${audio.queue.length} tracks from current queue...`);
    let working = 0, broken = 0;
    
    for (const track of audio.queue.slice(0, 5)) { // Test first 5
      console.log(`\n🔍 Testing: ${track.title}`);
      const result = await SmartAudioResolver.resolveAudioUrl({
        id: track.id,
        title: track.title,
        storage_bucket: track.storage_bucket,
        storage_key: track.storage_key
      });
      
      if (result.success) {
        console.log(`✅ WORKING: ${track.title} via ${result.method}`);
        working++;
      } else {
        console.log(`❌ BROKEN: ${track.title}`);
        console.log(`📝 Failed attempts:`, result.attempts.map(a => `${a.method}=${a.status}`));
        broken++;
      }
    }
    
    console.log(`\n📊 Results: ${working} working, ${broken} broken`);
    return { working, broken, total: working + broken };
  };
  
  // Quick test of a single track from latest API response
  (window as any).testSingleTrack = async (trackId = "327d9580-9eb3-460c-9059-b2ee16d1d2fe") => {
    console.log(`🧪 Testing single track: ${trackId}`);
    
    // Test the example track from your logs
    const testTrack = {
      id: trackId,
      title: "constantinople of the sephardim. movement 5", 
      storage_bucket: "audio",
      storage_key: "tracks/constantinople-of-the-sephardim.-movement-5.mp3"
    };
    
    console.log('🔍 Track data:', testTrack);
    const result = await SmartAudioResolver.resolveAudioUrl(testTrack);
    
    if (result.success) {
      console.log(`✅ SUCCESS: Found working URL via ${result.method}`);
      console.log(`🔗 Working URL: ${result.url}`);
      
      // Test if we can actually play it
      const audio = new Audio(result.url);
      try {
        await audio.play();
        console.log('🎵 Audio playback test: SUCCESS');
        audio.pause();
      } catch (e) {
        console.log('❌ Audio playback test: FAILED', e.message);
      }
    } else {
      console.log(`❌ FAILED: No working URL found`);
      console.log('📝 All attempts:', result.attempts);
    }
    
    return result;
  };
}
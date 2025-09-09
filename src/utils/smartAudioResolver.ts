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
    
    // Enhanced debugging for bucket resolution
    console.log(`🏷️ Track details:`, {
      id: track.id,
      title: track.title,
      bucket: track.storage_bucket,
      key: track.storage_key,
      hasDatabase: !!(track.storage_bucket && track.storage_key)
    });

    // Strategy 1: Try database URL as-is
    if (track.storage_bucket && track.storage_key) {
      // Don't encode the entire storage_key since it may contain path separators
      const dbUrl = `${baseUrl}/${track.storage_bucket}/${track.storage_key}`;
      console.log(`🔗 Strategy 1: Database URL - ${dbUrl}`);
      
      const dbResult = await this.testUrl(dbUrl, 'database');
      attempts.push(dbResult);
      
      if (dbResult.status === 200) {
        const result = { success: true, url: dbUrl, method: 'database', attempts };
        this.cache.set(cacheKey, result);
        console.log(`✅ Database URL works!`);
        return result;
      } else {
        console.log(`❌ Database URL failed with status ${dbResult.status}`);
        
        // Try with URL encoding for the storage key
        const encodedDbUrl = `${baseUrl}/${track.storage_bucket}/${encodeURIComponent(track.storage_key)}`;
        if (encodedDbUrl !== dbUrl) {
          console.log(`🔗 Strategy 1b: Encoded Database URL - ${encodedDbUrl}`);
          const encodedResult = await this.testUrl(encodedDbUrl, 'database_encoded');
          attempts.push(encodedResult);
          
          if (encodedResult.status === 200) {
            const result = { success: true, url: encodedDbUrl, method: 'database_encoded', attempts };
            this.cache.set(cacheKey, result);
            console.log(`✅ Encoded Database URL works!`);
            return result;
          }
        }
      }
    } else {
      console.log(`⚠️ No database storage info available for "${track.title}"`);
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

    // Strategy 2b: Try trendingnow bucket with exact title match
    console.log(`🔗 Strategy 2b: trendingnow exact match`);
    const trendingUrl = `${baseUrl}/trendingnow/${cleanTitle}.mp3`;
    const trendingResult = await this.testUrl(trendingUrl, 'trending_exact');
    attempts.push(trendingResult);
    
    if (trendingResult.status === 200) {
      const result = { success: true, url: trendingUrl, method: 'trending_exact', attempts };
      this.cache.set(cacheKey, result);
      console.log(`✅ Trending exact match works!`);
      return result;
    }

    // Strategy 2c: Try trendingnow bucket with original file name (for direct storage tracks)
    if (track.storage_bucket === 'trendingnow' && track.storage_key) {
      console.log(`🔗 Strategy 2c: trendingnow direct file`);
      const directTrendingUrl = `${baseUrl}/trendingnow/${track.storage_key}`;
      const directTrendingResult = await this.testUrl(directTrendingUrl, 'trending_direct');
      attempts.push(directTrendingResult);
      
      if (directTrendingResult.status === 200) {
        const result = { success: true, url: directTrendingUrl, method: 'trending_direct', attempts };
        this.cache.set(cacheKey, result);
        console.log(`✅ Trending direct file works!`);
        return result;
      }
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

    // Strategy 3b: Search trendingnow bucket for partial matches
    console.log(`🔗 Strategy 3b: trendingnow file search`);
    try {
      const { data: trendingFiles } = await supabase.storage
        .from('trendingnow')
        .list('', { limit: 1000 });

      if (trendingFiles) {
        const audioFiles = trendingFiles.filter(f => f.name.match(/\.(mp3|wav|m4a|flac|ogg)$/i));
        
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
          const fuzzyTrendingUrl = `${baseUrl}/trendingnow/${encodeURIComponent(bestMatch)}`;
          console.log(`🎯 Found trending match: ${bestMatch} (score: ${highestScore})`);
          
          const fuzzyTrendingResult = await this.testUrl(fuzzyTrendingUrl, 'trending_fuzzy');
          attempts.push(fuzzyTrendingResult);
          
          if (fuzzyTrendingResult.status === 200) {
            const result = { success: true, url: fuzzyTrendingUrl, method: 'trending_fuzzy', attempts };
            this.cache.set(cacheKey, result);
            console.log(`✅ Trending fuzzy match works!`);
            return result;
          }
        }
      }
    } catch (error) {
      console.log(`❌ Error searching trending files: ${error}`);
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
    
    // Enhanced failure analysis
    const statusCounts = attempts.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    console.log(`📊 Status code analysis:`, statusCounts);
    console.log(`🔍 Common issues: 404=file not found, 403=access denied, 0=network/CORS error`);
    
    // Log this failure for debugging
    if (typeof window !== 'undefined') {
      (window as any).lastFailedTrack = { track, attempts, statusCounts };
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
    // Clear cache for failed resolutions and try fresh
    this.cache.clear();
    console.log('🗑️ Audio resolver cache cleared due to URL fix');
  }

  static clearCache() {
    this.cache.clear();
    console.log('🗑️ Audio resolver cache cleared');
  }

  // Clear cache immediately when file is loaded to use new trending strategies
  static {
    this.cache.clear();
    console.log('🔄 Audio resolver cache cleared - trending strategies added');
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
  
  // Simple direct test function
  (window as any).testDirectURL = async () => {
    const testUrl = "https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/audio/tracks/constantinople-of-the-sephardim.-movement-5.mp3";
    
    console.log('🧪 Testing direct storage URL:', testUrl);
    
    try {
      const response = await fetch(testUrl, { method: 'HEAD' });
      console.log('📊 Response:', response.status, response.statusText);
      
      if (response.ok) {
        console.log('✅ URL EXISTS - File is accessible');
        
        // Try to play it
        const audio = new Audio(testUrl);
        try {
          await audio.play();
          console.log('🎵 PLAYBACK SUCCESS');
          audio.pause();
        } catch (e) {
          console.log('❌ PLAYBACK FAILED:', e.message);
        }
      } else {
        console.log('❌ URL FAILED:', response.status);
      }
    } catch (error) {
      console.log('❌ NETWORK ERROR:', error.message);
    }
  };

  // Add debugging command to test broken tracks from queue
  (window as any).debugBrokenTracks = async (limit = 10) => {
    const audio = (window as any).useAudioStore?.getState();
    if (!audio?.queue?.length) {
      console.log('❌ No queue to test - try starting a playlist first');
      return;
    }
    
    console.log(`🔍 Testing first ${limit} tracks from queue for broken URLs...`);
    
    const results = {
      working: [] as any[],
      broken: [] as any[],
      statusCodes: {} as Record<number, number>
    };
    
    for (const track of audio.queue.slice(0, limit)) {
      console.log(`\n🎵 Testing: "${track.title}"`);
      console.log(`   ID: ${track.id}`);
      console.log(`   Bucket: ${track.storage_bucket}`);
      console.log(`   Key: ${track.storage_key}`);
      
      const result = await SmartAudioResolver.resolveAudioUrl({
        id: track.id,
        title: track.title,
        storage_bucket: track.storage_bucket,
        storage_key: track.storage_key
      });
      
      if (result.success) {
        console.log(`   ✅ WORKING via ${result.method}: ${result.url}`);
        results.working.push({ track: track.title, method: result.method, url: result.url });
      } else {
        console.log(`   ❌ BROKEN - all ${result.attempts.length} attempts failed`);
        results.broken.push({ 
          track: track.title, 
          bucket: track.storage_bucket,
          key: track.storage_key,
          attempts: result.attempts.map(a => `${a.method}:${a.status}`)
        });
        
        // Count status codes
        result.attempts.forEach(attempt => {
          results.statusCodes[attempt.status] = (results.statusCodes[attempt.status] || 0) + 1;
        });
      }
    }
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   ✅ Working: ${results.working.length}`);
    console.log(`   ❌ Broken: ${results.broken.length}`);
    console.log(`   📈 Status codes:`, results.statusCodes);
    
    if (results.broken.length > 0) {
      console.log(`\n🔍 Broken track analysis:`);
      results.broken.forEach(b => {
        console.log(`   "${b.track}": ${b.bucket}/${b.key} -> [${b.attempts.join(', ')}]`);
      });
    }
    
    return results;
  };
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
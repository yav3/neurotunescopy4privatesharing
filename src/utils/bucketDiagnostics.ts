import { supabase } from '@/integrations/supabase/client';
import { getGenreOptions } from '@/config/genreConfigs';

export class BucketDiagnostics {
  static async checkAllBuckets() {
    console.log('🔍 BUCKET DIAGNOSTICS: Starting comprehensive bucket check...');
    
    // Get all bucket names from all genre configs
    const allGoals = ['focus-enhancement', 'stress-anxiety-support', 'mood-boost', 'pain-support', 'energy-boost'];
    const allBuckets = new Set<string>();
    
    allGoals.forEach(goalId => {
      const genres = getGenreOptions(goalId);
      genres.forEach(genre => {
        genre.buckets.forEach(bucket => allBuckets.add(bucket));
      });
    });
    
    console.log(`📋 Found ${allBuckets.size} unique buckets to check:`, Array.from(allBuckets));
    
    const results = {
      working: [] as string[],
      missing: [] as string[],
      empty: [] as string[],
      errors: [] as { bucket: string; error: string }[]
    };
    
    for (const bucketName of allBuckets) {
      try {
        console.log(`🔍 Checking bucket: ${bucketName}`);
        
        const { data: files, error } = await supabase.storage
          .from(bucketName)
          .list('', { limit: 10 });
        
        if (error) {
          console.error(`❌ Error accessing bucket ${bucketName}:`, error.message);
          if (error.message?.includes('not found') || error.message?.includes('does not exist')) {
            results.missing.push(bucketName);
          } else {
            results.errors.push({ bucket: bucketName, error: error.message });
          }
        } else if (!files || files.length === 0) {
          console.warn(`📂 Bucket ${bucketName} exists but is empty`);
          results.empty.push(bucketName);
        } else {
          console.log(`✅ Bucket ${bucketName} is working with ${files.length} files`);
          results.working.push(bucketName);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Unexpected error checking bucket ${bucketName}:`, error);
        results.errors.push({ bucket: bucketName, error: String(error) });
      }
    }
    
    console.log('🎯 BUCKET DIAGNOSTICS RESULTS:');
    console.log(`✅ Working buckets (${results.working.length}):`, results.working);
    console.log(`📂 Empty buckets (${results.empty.length}):`, results.empty);
    console.log(`❌ Missing buckets (${results.missing.length}):`, results.missing);
    console.log(`🚨 Error buckets (${results.errors.length}):`, results.errors);
    
    // Check specific problematic genres
    console.log('\n🎭 GENRE-SPECIFIC DIAGNOSTICS:');
    
    const problemGenres = [
      { goal: 'pain-support', genre: 'new-age-chill', buckets: ['painreducingworld'] }
    ];
    
    for (const { goal, genre, buckets } of problemGenres) {
      console.log(`🎯 Checking problematic genre: ${genre} (${goal}) -> buckets: ${buckets.join(', ')}`);
      for (const bucket of buckets) {
        const status = results.working.includes(bucket) ? '✅ Working' :
                      results.empty.includes(bucket) ? '📂 Empty' :
                      results.missing.includes(bucket) ? '❌ Missing' : '🚨 Error';
        console.log(`  - ${bucket}: ${status}`);
      }
    }
    
    return results;
  }
  
  static async checkSpecificGenre(goalId: string, genreId: string) {
    console.log(`🎯 GENRE DIAGNOSTICS: Checking ${goalId}/${genreId}`);
    
    const genres = getGenreOptions(goalId);
    const genre = genres.find(g => g.id === genreId);
    
    if (!genre) {
      console.error(`❌ Genre not found: ${genreId} in goal ${goalId}`);
      return null;
    }
    
    console.log(`🎭 Genre config:`, genre);
    
    for (const bucket of genre.buckets) {
      await this.checkBucketDetails(bucket);
    }
  }
  
  static async checkBucketDetails(bucketName: string) {
    console.log(`🔍 DETAILED BUCKET CHECK: ${bucketName}`);
    
    try {
      const { data: files, error } = await supabase.storage
        .from(bucketName)
        .list('', { limit: 1000 });
      
      if (error) {
        console.error(`❌ Error:`, error);
        return;
      }
      
      const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
      const audioFiles = files?.filter(file => 
        audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
      ) || [];
      
      console.log(`📊 Bucket stats:`, {
        totalFiles: files?.length || 0,
        audioFiles: audioFiles.length,
        fileTypes: [...new Set(files?.map(f => f.name.split('.').pop()?.toLowerCase()) || [])]
      });
      
      if (audioFiles.length > 0) {
        console.log(`🎵 Sample audio files:`, audioFiles.slice(0, 3).map(f => f.name));
      }
      
    } catch (error) {
      console.error(`❌ Unexpected error:`, error);
    }
  }
}

// Auto-run diagnostics when imported in development
if (import.meta.env.DEV) {
  (window as any).bucketDiagnostics = BucketDiagnostics;
  console.log('🔧 Bucket diagnostics available as window.bucketDiagnostics');
}
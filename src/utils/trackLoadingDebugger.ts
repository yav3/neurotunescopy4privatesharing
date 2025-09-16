import { supabase } from '@/integrations/supabase/client';
import { getGenreOptions } from '@/config/genreConfigs';

export class TrackLoadingDebugger {
  static async debugGenreLoading(goalId: string, genreId: string) {
    console.log(`🔬 TRACK LOADING DEBUG: ${goalId}/${genreId}`);
    
    // 1. Check genre configuration
    const genres = getGenreOptions(goalId);
    const genre = genres.find(g => g.id === genreId);
    
    if (!genre) {
      console.error(`❌ Genre not found: ${genreId} in goal ${goalId}`);
      return { error: 'Genre not found' };
    }
    
    console.log(`✅ Genre found:`, genre);
    console.log(`📂 Target buckets:`, genre.buckets);
    
    // 2. Test each bucket individually
    const bucketResults = {};
    
    for (const bucketName of genre.buckets) {
      console.log(`\n🔍 Testing bucket: ${bucketName}`);
      
      try {
        // Test bucket access
        const { data: files, error } = await supabase.storage
          .from(bucketName)
          .list('', { limit: 10 });
        
        if (error) {
          console.error(`❌ Bucket access failed:`, error);
          bucketResults[bucketName] = { error: error.message };
          continue;
        }
        
        console.log(`📁 Files in ${bucketName}:`, files?.length || 0);
        
        // Filter for audio files
        const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
        const audioFiles = files?.filter(file => 
          audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
        ) || [];
        
        console.log(`🎵 Audio files in ${bucketName}:`, audioFiles.length);
        
        if (audioFiles.length > 0) {
          // Test URL generation for first file
          const testFile = audioFiles[0];
          const directUrl = `https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/${bucketName}/${testFile.name}`;
          
          console.log(`🔗 Sample URL: ${directUrl}`);
          
          // Test URL accessibility
          try {
            const response = await fetch(directUrl, { method: 'HEAD' });
            console.log(`✅ URL test: ${response.ok ? 'ACCESSIBLE' : 'FAILED'} (${response.status})`);
            
            bucketResults[bucketName] = {
              totalFiles: files?.length || 0,
              audioFiles: audioFiles.length,
              sampleUrl: directUrl,
              urlAccessible: response.ok
            };
          } catch (fetchError) {
            console.error(`❌ URL test failed:`, fetchError);
            bucketResults[bucketName] = {
              totalFiles: files?.length || 0,
              audioFiles: audioFiles.length,
              sampleUrl: directUrl,
              urlAccessible: false,
              fetchError: String(fetchError)
            };
          }
        } else {
          bucketResults[bucketName] = {
            totalFiles: files?.length || 0,
            audioFiles: 0,
            fileTypes: [...new Set(files?.map(f => f.name.split('.').pop()?.toLowerCase()) || [])]
          };
        }
        
      } catch (bucketError) {
        console.error(`❌ Bucket test failed:`, bucketError);
        bucketResults[bucketName] = { error: String(bucketError) };
      }
    }
    
    console.log(`\n📊 FINAL RESULTS FOR ${goalId}/${genreId}:`);
    console.log(bucketResults);
    
    return { genre, bucketResults };
  }
  
  static async testPopEnergySpecifically() {
    console.log(`🎯 SPECIFIC TEST: Pop Energy (energy-boost/pop-energy)`);
    return this.debugGenreLoading('energy-boost', 'pop-energy');
  }
  
  static async testPainReductionSpecifically() {
    console.log(`🎯 SPECIFIC TEST: Pain Reduction New Age (pain-support/new-age-chill)`);
    return this.debugGenreLoading('pain-support', 'new-age-chill');
  }
}

// Make available in dev mode
if (import.meta.env.DEV) {
  (window as any).trackLoadingDebugger = TrackLoadingDebugger;
  console.log('🔧 Track loading debugger available as window.trackLoadingDebugger');
}
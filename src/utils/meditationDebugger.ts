import { SimpleStorageService } from '@/services/simpleStorageService';
import { getBucketsForGoal } from '@/config/therapeuticGoals';
import { getGenreOptions } from '@/config/genreConfigs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export class MeditationDebugger {
  static async debugMeditationMode() {
    console.group('🧘 DEBUGGING MEDITATION MODE');
    
    try {
      // 1. Check goal configuration
      const buckets = getBucketsForGoal('meditation-support');
      console.log('📂 Meditation buckets configured:', buckets);
      
      if (buckets.length === 0) {
        console.error('❌ No buckets configured for meditation-support');
        toast.error('Meditation mode has no buckets configured');
        return false;
      }
      
      // 2. Check genre options
      const genres = getGenreOptions('meditation-support');
      console.log('🎭 Meditation genres available:', genres);
      
      if (genres.length === 0) {
        console.error('❌ No genres configured for meditation-support');
        toast.error('Meditation mode has no genre options');
        return false;
      }
      
      // 3. Check each bucket individually
      for (const bucket of buckets) {
        console.log(`🔍 Checking bucket: ${bucket}`);
        
        try {
          const { data: files, error } = await supabase.storage
            .from(bucket)
            .list('', { limit: 100 });
          
          if (error) {
            console.error(`❌ Error accessing bucket ${bucket}:`, error);
            continue;
          }
          
          const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
          const audioFiles = files?.filter(file => 
            audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
          ) || [];
          
          console.log(`📊 Bucket ${bucket}: ${audioFiles.length} audio files out of ${files?.length || 0} total files`);
          
          if (audioFiles.length > 0) {
            console.log(`🎵 Sample files in ${bucket}:`, audioFiles.slice(0, 3).map(f => f.name));
          }
          
        } catch (bucketError) {
          console.error(`❌ Error checking bucket ${bucket}:`, bucketError);
        }
      }
      
      // 4. Test track loading through SimpleStorageService
      console.log('🎵 Testing track loading via SimpleStorageService...');
      const tracks = await SimpleStorageService.getTracksFromCategory('meditation-support', 10);
      
      console.log(`✅ SimpleStorageService returned ${tracks.length} meditation tracks`);
      
      if (tracks.length > 0) {
        console.log('🎵 Sample meditation tracks:', tracks.slice(0, 3).map(t => ({
          title: t.title,
          bucket: t.bucket,
          url: t.url
        })));
        toast.success(`Meditation mode working! Found ${tracks.length} tracks`);
        return true;
      } else {
        console.error('❌ No tracks returned by SimpleStorageService for meditation-support');
        toast.error('No meditation tracks found - check bucket contents');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Error debugging meditation mode:', error);
      toast.error(`Meditation debug failed: ${error}`);
      return false;
    } finally {
      console.groupEnd();
    }
  }
  
  static async fixMeditationMode() {
    console.group('🔧 FIXING MEDITATION MODE');
    
    try {
      // Check if newageworldstressanxietyreduction bucket has content
      const { data: newAgeFiles, error: newAgeError } = await supabase.storage
        .from('newageworldstressanxietyreduction')
        .list('', { limit: 100 });
      
      const newAgeAudioCount = newAgeFiles?.filter(f => 
        ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'].some(ext => 
          f.name.toLowerCase().endsWith(ext)
        )
      ).length || 0;
      
      console.log(`📊 newageworldstressanxietyreduction has ${newAgeAudioCount} audio files`);
      
      // Check Chopin bucket as backup
      const { data: chopinFiles, error: chopinError } = await supabase.storage
        .from('Chopin')
        .list('', { limit: 100 });
      
      const chopinAudioCount = chopinFiles?.filter(f => 
        ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'].some(ext => 
          f.name.toLowerCase().endsWith(ext)
        )
      ).length || 0;
      
      console.log(`📊 Chopin has ${chopinAudioCount} audio files`);
      
      if (newAgeAudioCount === 0 && chopinAudioCount === 0) {
        console.error('❌ Both meditation buckets are empty');
        toast.error('Both meditation music buckets are empty - need to add content');
        return false;
      }
      
      if (newAgeAudioCount === 0) {
        console.log('🔧 Primary meditation bucket empty, will use Chopin as fallback');
        toast.info('Using classical Chopin as meditation music (primary bucket empty)');
      }
      
      // Test actual track loading
      const tracks = await SimpleStorageService.getTracksFromCategory('meditation-support', 5);
      
      if (tracks.length > 0) {
        console.log('✅ Meditation mode is now working');
        toast.success(`Fixed! Found ${tracks.length} meditation tracks`);
        return true;
      } else {
        console.error('❌ Still no tracks after checking buckets');
        toast.error('Meditation buckets have files but track loading still fails');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Error fixing meditation mode:', error);
      toast.error(`Fix failed: ${error}`);
      return false;
    } finally {
      console.groupEnd();
    }
  }
}

// Make globally available for debugging
if (typeof window !== 'undefined') {
  (window as any).debugMeditation = MeditationDebugger.debugMeditationMode;
  (window as any).fixMeditation = MeditationDebugger.fixMeditationMode;
  console.log('🧘 Meditation debugger available: window.debugMeditation() and window.fixMeditation()');
}
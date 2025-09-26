import { SimpleStorageService } from '@/services/simpleStorageService';
import { getBucketsForGoal } from '@/config/therapeuticGoals';
import { getGenreOptions } from '@/config/genreConfigs';
import { toast } from 'sonner';

export class ModePlaybackDebugger {
  static async testAllModes() {
    console.group('🎵 TESTING ALL MODES PLAYBACK');
    
    const allGoals = [
      'focus-enhancement',
      'calm-mood-boost', 
      'anxiety-support',
      'meditation-support',
      'pain-support',
      'energy-boost',
      'non-sleep-deep-rest'
    ];
    
    const results = {
      working: [] as string[],
      issues: [] as { goal: string; error: string; buckets: string[] }[]
    };
    
    for (const goalId of allGoals) {
      try {
        console.log(`🎯 Testing goal: ${goalId}`);
        
        // Get buckets for this goal
        const buckets = getBucketsForGoal(goalId);
        console.log(`📂 Buckets for ${goalId}:`, buckets);
        
        if (buckets.length === 0) {
          results.issues.push({
            goal: goalId,
            error: 'No buckets configured',
            buckets: []
          });
          continue;
        }
        
        // Try to fetch tracks
        const tracks = await SimpleStorageService.getTracksFromCategory(goalId, 5);
        
        if (tracks.length === 0) {
          results.issues.push({
            goal: goalId,
            error: 'No tracks found',
            buckets
          });
        } else {
          console.log(`✅ ${goalId}: Found ${tracks.length} tracks`);
          results.working.push(goalId);
        }
        
      } catch (error) {
        console.error(`❌ Error testing ${goalId}:`, error);
        results.issues.push({
          goal: goalId,
          error: error instanceof Error ? error.message : 'Unknown error',
          buckets: getBucketsForGoal(goalId)
        });
      }
    }
    
    console.log('\n🎯 MODE PLAYBACK TEST RESULTS:');
    console.log(`✅ Working modes (${results.working.length}):`, results.working);
    console.log(`❌ Modes with issues (${results.issues.length}):`, results.issues);
    
    // Show user-friendly summary
    if (results.issues.length === 0) {
      toast.success(`All ${results.working.length} modes are working!`);
    } else {
      toast.error(`${results.issues.length} modes have issues - check console for details`);
    }
    
    console.groupEnd();
    return results;
  }
  
  static async testSpecificMode(goalId: string) {
    console.group(`🎯 TESTING SPECIFIC MODE: ${goalId}`);
    
    try {
      // Test buckets
      const buckets = getBucketsForGoal(goalId);
      console.log(`📂 Buckets:`, buckets);
      
      if (buckets.length === 0) {
        console.error(`❌ No buckets configured for ${goalId}`);
        toast.error(`No buckets configured for ${goalId}`);
        return false;
      }
      
      // Test tracks
      console.log('🎵 Fetching tracks...');
      const tracks = await SimpleStorageService.getTracksFromCategory(goalId, 10);
      
      if (tracks.length === 0) {
        console.error(`❌ No tracks found for ${goalId}`);
        toast.error(`No tracks found for ${goalId}`);
        return false;
      }
      
      console.log(`✅ Found ${tracks.length} tracks for ${goalId}`);
      console.log('🎵 Sample tracks:', tracks.slice(0, 3).map(t => t.title));
      
      // Test genres
      const genres = getGenreOptions(goalId);
      console.log(`🎭 Available genres:`, genres.map(g => g.name));
      
      toast.success(`${goalId} is working! Found ${tracks.length} tracks and ${genres.length} genres`);
      return true;
      
    } catch (error) {
      console.error(`❌ Error testing ${goalId}:`, error);
      toast.error(`Error testing ${goalId}: ${error}`);
      return false;
    } finally {
      console.groupEnd();
    }
  }
}

// Make globally available for debugging
if (typeof window !== 'undefined') {
  (window as any).testAllModes = ModePlaybackDebugger.testAllModes;
  (window as any).testSpecificMode = ModePlaybackDebugger.testSpecificMode;
  console.log('🔧 Mode debugger available: window.testAllModes() and window.testSpecificMode(goalId)');
}
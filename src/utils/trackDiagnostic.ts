// Quick diagnostic for checking track URLs
import { useAudioStore } from '@/stores';
import { headOk } from '@/lib/stream';
import { diagnoseSongPlayability } from './trackUrlDiagnostic';

export const checkCurrentTracks = async () => {
  const state = useAudioStore.getState();
  
  console.group('🎵 Track Diagnostic');
  console.log('Current queue:', state.queue.length, 'tracks');
  console.log('Current index:', state.index);
  console.log('Current track:', state.currentTrack?.title || 'None');
  
  // Check first few tracks
  const tracksToCheck = state.queue.slice(0, 3);
  
  for (let i = 0; i < tracksToCheck.length; i++) {
    const track = tracksToCheck[i];
    console.log(`\n--- Track ${i + 1}: ${track.title} ---`);
    console.log('ID:', track.id);
    console.log('Storage key:', track.storage_key);
    
    // Build expected URL
    const baseUrl = `https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public`;
    const bucket = track.storage_bucket || 'neuralpositivemusic';
    const key = track.storage_key || track.id;
    const testUrl = `${baseUrl}/${bucket}/${key}`;
    
    console.log('Test URL:', testUrl);
    
    try {
      const isOk = await headOk(testUrl, 3000);
      console.log('URL accessible:', isOk ? '✅' : '❌');
    } catch (error) {
      console.log('URL test failed:', error);
    }
  }
  
  console.groupEnd();
  
  return tracksToCheck;
};

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).checkCurrentTracks = checkCurrentTracks;
  (window as any).diagnoseSongPlayability = diagnoseSongPlayability;
}
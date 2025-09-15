// Quick Audio Test Utility - Console Commands for Debugging
import { AudioUrlDebugger } from './audioUrlDebugger';

// Sample of your URL data for quick testing
export const sampleEncodedUrls = [
  { bucket: "neuralpositivemusic", original: "Alternative-frequencies,-2_-instrumental_-relaxation.mp3", encoded: "Alternative-frequencies%2C-2_-instrumental_-relaxation.mp3" },
  { bucket: "neuralpositivemusic", original: "Alternative frequencies 3 from 432 album 1 .mp3", encoded: "Alternative%20frequencies%203%20from%20432%20album%201%20.mp3" },
  { bucket: "ENERGYBOOST", original: "118; Pop, EDM, Funk; Re-Energize (Remix).mp3", encoded: "118%3B%20%20Pop%2C%20EDM%2C%20Funk%3B%20Re-Energize%20(Remix).mp3" },
  { bucket: "ENERGYBOOST", original: "6000 days since i loved you HOUSE.mp3", encoded: "6000%20days%20since%20i%20loved%20you%20HOUSE.mp3" },
  { bucket: "ENERGYBOOST", original: "Adoration; EDM - classical reimagined; HIIT (1).mp3", encoded: "Adoration%3B%20EDM%20-%20classical%20reimagined%3B%20HIIT%20(1).mp3" },
  { bucket: "samba", original: "Coffee, First; Jazz Samba; Movement 2 (1).mp3", encoded: "Coffee%2C%20First%3B%20Jazz%20Samba%3B%20Movement%202%20(1).mp3" },
  { bucket: "samba", original: "Eternal Samba (2).mp3", encoded: "Eternal%20Samba%20(2).mp3" },
  { bucket: "ENERGYBOOST", original: "Arctic Kitties; Alternative; 128 BPM, HIIT, Re-Energize (Remix).mp3", encoded: "Arctic%20Kitties%3B%20Alternative%3B%20128%20BPM%2C%20HIIT%2C%20Re-Energize%20(Remix).mp3" },
];

// Quick test function for console
export async function quickAudioTest() {
  console.log('🧪 Running quick audio test on sample URLs...');
  
  const results = await AudioUrlDebugger.testMultipleUrls(sampleEncodedUrls, 3);
  const report = AudioUrlDebugger.generateReport(results);
  
  console.log(report);
  return results;
}

// Test a specific bucket
export async function testBucket(bucketName: string, count: number = 5) {
  console.log(`🧪 Testing ${count} files from bucket: ${bucketName}`);
  
  const bucketFiles = sampleEncodedUrls
    .filter(file => file.bucket === bucketName)
    .slice(0, count);
  
  if (bucketFiles.length === 0) {
    console.log(`❌ No sample files found for bucket: ${bucketName}`);
    return [];
  }
  
  const results = await AudioUrlDebugger.testMultipleUrls(bucketFiles, 2);
  const report = AudioUrlDebugger.generateReport(results);
  
  console.log(report);
  return results;
}

// Test URL encoding vs non-encoding
export async function testEncoding(original: string, bucket: string = 'ENERGYBOOST') {
  console.log(`🧪 Testing encoding for: ${original}`);
  
  const baseUrl = 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public';
  const nonEncoded = `${baseUrl}/${bucket}/${original}`;
  const encoded = `${baseUrl}/${bucket}/${encodeURIComponent(original)}`;
  
  console.log('Non-encoded URL:', nonEncoded);
  console.log('Encoded URL:', encoded);
  
  const results = await Promise.all([
    AudioUrlDebugger.testAudioUrl(bucket, original, original),
    AudioUrlDebugger.testAudioUrl(bucket, original, encodeURIComponent(original))
  ]);
  
  console.log('Non-encoded result:', results[0].status, results[0].error);
  console.log('Encoded result:', results[1].status, results[1].error);
  
  return results;
}

// Play a working URL directly
export async function playTestUrl(url: string, title: string = 'Test Track') {
  console.log(`🎵 Attempting to play: ${url}`);
  
  try {
    const { useAudioStore } = await import('@/stores/audioStore');
    const store = useAudioStore.getState();
    
    const testTrack = {
      id: `test-${Date.now()}`,
      title,
      artist: 'Debug Test',
      duration: 0,
      stream_url: url,
      audio_status: 'working' as const,
      storage_bucket: '',
      storage_key: ''
    };
    
    await store.playTrack(testTrack);
    console.log('✅ Playback started successfully');
  } catch (error) {
    console.error('❌ Playback failed:', error);
  }
}

// Global console functions
if (typeof window !== 'undefined') {
  (window as any).quickAudioTest = quickAudioTest;
  (window as any).testBucket = testBucket;
  (window as any).testEncoding = testEncoding;
  (window as any).playTestUrl = playTestUrl;
  
  // Add sample data for easy access
  (window as any).sampleEncodedUrls = sampleEncodedUrls;
  
  console.log('🎵 Audio debugging commands available:');
  console.log('  quickAudioTest() - Test sample URLs');
  console.log('  testBucket("ENERGYBOOST") - Test specific bucket');
  console.log('  testEncoding("filename.mp3") - Test encoding vs non-encoding');
  console.log('  playTestUrl("https://...") - Play URL directly');
  console.log('  sampleEncodedUrls - Array of sample URLs for testing');
}
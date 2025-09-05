import { supabase } from '@/integrations/supabase/client';

export interface AudioDataAuditResult {
  bucketStats: Array<{
    storage_bucket: string;
    storage_key: string;
    count: number;
  }>;
  keyPrefixStats: Array<{
    storage_bucket: string;
    key_prefix: string;
    count: number;
  }>;
  sampleTracks: Array<{
    id: string;
    title: string;
    storage_bucket: string;
    storage_key: string;
    audio_status: string;
  }>;
}

/**
 * Phase 1: Data Audit - Find the truth about what's in the database
 */
export async function auditAudioData(): Promise<AudioDataAuditResult> {
  console.log('🔍 Starting comprehensive audio data audit...');
  
  try {
    // 1. Check what buckets/paths are actually in your database
    console.log('📊 Querying bucket and storage key distribution...');
    const { data: bucketStats, error: bucketError } = await supabase
      .from('tracks')
      .select('storage_bucket, storage_key')
      .not('storage_key', 'is', null)
      .order('storage_bucket')
      .limit(1000);

    if (bucketError) {
      console.error('❌ Bucket stats query failed:', bucketError);
      throw bucketError;
    }

    // Process bucket stats
    const bucketCounts = new Map<string, number>();
    bucketStats?.forEach(track => {
      const key = `${track.storage_bucket}:::${track.storage_key}`;
      bucketCounts.set(key, (bucketCounts.get(key) || 0) + 1);
    });

    const processedBucketStats = Array.from(bucketCounts.entries())
      .map(([key, count]) => {
        const [storage_bucket, storage_key] = key.split(':::');
        return { storage_bucket, storage_key, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // 2. Check for data inconsistencies by key prefixes
    console.log('📊 Analyzing storage key patterns...');
    const keyPrefixCounts = new Map<string, number>();
    bucketStats?.forEach(track => {
      const prefix = track.storage_key?.substring(0, 20) || 'null';
      const key = `${track.storage_bucket}:::${prefix}`;
      keyPrefixCounts.set(key, (keyPrefixCounts.get(key) || 0) + 1);
    });

    const processedPrefixStats = Array.from(keyPrefixCounts.entries())
      .map(([key, count]) => {
        const [storage_bucket, key_prefix] = key.split(':::');
        return { storage_bucket, key_prefix, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // 3. Get sample tracks for testing
    console.log('📊 Getting sample tracks...');
    const { data: sampleTracks, error: sampleError } = await supabase
      .from('tracks')
      .select('id, title, storage_bucket, storage_key, audio_status')
      .not('storage_key', 'is', null)
      .eq('audio_status', 'working')
      .limit(10);

    if (sampleError) {
      console.error('❌ Sample tracks query failed:', sampleError);
      throw sampleError;
    }

    const result: AudioDataAuditResult = {
      bucketStats: processedBucketStats,
      keyPrefixStats: processedPrefixStats,
      sampleTracks: sampleTracks || []
    };

    console.log('✅ Audio data audit complete:', result);
    return result;

  } catch (error) {
    console.error('❌ Audio data audit failed:', error);
    throw error;
  }
}

/**
 * Phase 2: Storage Reality Check - Test what files actually exist
 */
export async function testStorageReality(sampleTracks: AudioDataAuditResult['sampleTracks']): Promise<Array<{
  track: any;
  testResults: Array<{
    url: string;
    status: number;
    accessible: boolean;
  }>;
}>> {
  console.log('🧪 Testing storage accessibility for sample tracks...');
  
  const results = [];
  
  for (const track of sampleTracks.slice(0, 5)) { // Test first 5 tracks
    console.log(`🧪 Testing track: ${track.title}`);
    
    const testUrls = [
      // Direct file in bucket root
      `https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/${track.storage_bucket}/${encodeURIComponent(track.storage_key)}`,
      // With tracks/ prefix
      `https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/${track.storage_bucket}/tracks/${encodeURIComponent(track.storage_key)}`,
      // Remove tracks/ prefix if present
      `https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/${track.storage_bucket}/${encodeURIComponent(track.storage_key.replace(/^tracks\//, ''))}`,
      // Try neuralpositivemusic bucket
      `https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/neuralpositivemusic/${encodeURIComponent(track.storage_key.replace(/^tracks\//, ''))}`,
    ];

    const testResults = [];
    
    for (const url of testUrls) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        testResults.push({
          url,
          status: response.status,
          accessible: response.ok
        });
        console.log(`  ${response.ok ? '✅' : '❌'} ${response.status} - ${url}`);
      } catch (error) {
        testResults.push({
          url,
          status: 0,
          accessible: false
        });
        console.log(`  ❌ Error - ${url}: ${error}`);
      }
    }
    
    results.push({ track, testResults });
  }
  
  return results;
}

/**
 * Run complete audio system audit
 */
export async function runCompleteAudit() {
  console.log('🚀 Starting complete audio system audit...');
  
  try {
    // Phase 1: Data Audit
    const auditResults = await auditAudioData();
    
    // Phase 2: Storage Reality Check
    const storageResults = await testStorageReality(auditResults.sampleTracks);
    
    // Generate summary report
    console.log('\n📋 AUDIT SUMMARY REPORT');
    console.log('========================');
    
    console.log('\n1. BUCKET DISTRIBUTION:');
    auditResults.bucketStats.forEach(stat => {
      console.log(`   ${stat.storage_bucket}: ${stat.count} tracks with key "${stat.storage_key}"`);
    });
    
    console.log('\n2. KEY PREFIX PATTERNS:');
    auditResults.keyPrefixStats.forEach(stat => {
      console.log(`   ${stat.storage_bucket}/${stat.key_prefix}*: ${stat.count} tracks`);
    });
    
    console.log('\n3. STORAGE ACCESSIBILITY:');
    storageResults.forEach(result => {
      const accessibleUrls = result.testResults.filter(test => test.accessible);
      console.log(`   ${result.track.title}: ${accessibleUrls.length}/${result.testResults.length} URLs work`);
      if (accessibleUrls.length > 0) {
        console.log(`     ✅ Working: ${accessibleUrls[0].url}`);
      }
    });
    
    return { auditResults, storageResults };
    
  } catch (error) {
    console.error('❌ Complete audit failed:', error);
    throw error;
  }
}

// Make available globally for testing
if (typeof window !== 'undefined') {
  (window as any).runAudioAudit = runCompleteAudit;
  (window as any).auditAudioData = auditAudioData;
  (window as any).testStorageReality = testStorageReality;
}
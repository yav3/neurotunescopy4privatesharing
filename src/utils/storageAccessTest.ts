import { serviceSupabase } from '@/integrations/supabase/service-client';

export const testAmericanaJamBandAccess = async () => {
  console.log('🧪 Testing Americana & Jam Band storage access with service client...');
  
  const buckets = ['jamband', 'countryandamericana'];
  const results: any = {};

  for (const bucket of buckets) {
    console.log(`📂 Testing bucket: ${bucket}`);
    
    try {
      // Test bucket access with service role
      const { data: files, error } = await serviceSupabase.storage
        .from(bucket)
        .list('', { limit: 10 });

      if (error) {
        console.error(`❌ Error accessing ${bucket}:`, error);
        results[bucket] = {
          success: false,
          error: error.message,
          files: []
        };
      } else {
        console.log(`✅ ${bucket}: Found ${files?.length || 0} files`);
        results[bucket] = {
          success: true,
          fileCount: files?.length || 0,
          files: files?.slice(0, 5).map(f => ({
            name: f.name,
            size: f.metadata?.size
          })) || []
        };

        // Test public URL generation
        if (files && files.length > 0) {
          const { data } = serviceSupabase.storage.from(bucket).getPublicUrl(files[0].name);
          results[bucket].sampleUrl = data.publicUrl;
          console.log(`🔗 Sample URL for ${bucket}: ${data.publicUrl}`);
        }
      }
    } catch (bucketError) {
      console.error(`❌ Exception accessing ${bucket}:`, bucketError);
      results[bucket] = {
        success: false,
        error: bucketError.message,
        files: []
      };
    }
  }

  console.log('🏁 Storage access test results:', results);
  return results;
};

// Make available globally for testing
if (typeof window !== 'undefined') {
  (window as any).testAmericanaJamBandAccess = testAmericanaJamBandAccess;
}
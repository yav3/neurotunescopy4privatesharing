import { supabase } from '@/integrations/supabase/client';

/**
 * Debug function to test storage-list edge function directly
 */
export async function testStorageListDirect() {
  console.log('🔍 Testing storage-list edge function directly...');
  
  try {
    // Test the neuralpositivemusic bucket directly
    const { data, error } = await supabase.functions.invoke('storage-list', {
      body: {
        bucket: 'neuralpositivemusic',
        prefix: '', // Empty for root directory
        limit: 10,
        offset: 0,
        strict: 1
      }
    });

    console.log('📊 Edge function response:', { data, error });

    if (error) {
      console.error('❌ Edge function error:', error);
      return;
    }

    if (data?.ok) {
      console.log('✅ Success! Found files:', data.results?.length || 0);
      console.log('📋 Sample files:', data.results?.slice(0, 3));
      console.log('📈 Totals:', data.totals);
    } else {
      console.error('❌ Edge function returned error:', data);
    }

  } catch (error) {
    console.error('💥 Request failed:', error);
  }
}

// Test using direct Supabase storage API as fallback
export async function testDirectStorageAPI() {
  console.log('🔍 Testing direct Supabase storage API...');
  
  try {
    const { data: files, error } = await supabase.storage
      .from('neuralpositivemusic')
      .list('', { limit: 10 });

    console.log('📊 Direct storage API response:', { files, error });

    if (error) {
      console.error('❌ Storage API error:', error);
      return;
    }

    console.log('✅ Direct API found files:', files?.length || 0);
    console.log('📋 Sample files:', files?.slice(0, 3));

    // Test URL generation for first file
    if (files && files.length > 0) {
      const firstFile = files[0];
      const { data: urlData, error: urlError } = await supabase.storage
        .from('neuralpositivemusic')
        .createSignedUrl(firstFile.name, 60);

      console.log('🔗 URL test for', firstFile.name, ':', { urlData, urlError });
    }

  } catch (error) {
    console.error('💥 Storage API failed:', error);
  }
}

// Make available globally for testing
if (typeof window !== 'undefined') {
  (window as any).testStorageListDirect = testStorageListDirect;
  (window as any).testDirectStorageAPI = testDirectStorageAPI;
}
import { supabase } from '@/integrations/supabase/client';

export async function testPainReducingWorldBucket() {
  console.log('🚨 DIRECT BUCKET TEST: painreducingworld');
  
  try {
    // Test 1: List files with detailed logging
    console.log('📋 Step 1: Listing files in painreducingworld bucket...');
    const { data: files, error: listError } = await supabase.storage
      .from('painreducingworld')
      .list('', { limit: 1000 });
    
    if (listError) {
      console.error('❌ Error listing files:', listError);
      return { success: false, error: listError.message };
    }
    
    console.log('📁 Raw file list response:', files);
    console.log(`📊 Total files found: ${files?.length || 0}`);
    
    if (!files || files.length === 0) {
      console.warn('⚠️ Bucket is empty or no files found');
      return { success: false, error: 'Bucket is empty' };
    }
    
    // Test 2: Check file types
    const fileTypes = files.map(f => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return { name: f.name, ext, size: f.metadata?.size };
    });
    
    console.log('🔍 File details:', fileTypes);
    
    // Test 3: Filter for audio files
    const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
    const audioFiles = files.filter(file => 
      audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    );
    
    console.log(`🎵 Audio files found: ${audioFiles.length}`);
    audioFiles.forEach(file => {
      console.log(`  - ${file.name} (${file.metadata?.size} bytes)`);
    });
    
    // Test 4: Try to get public URLs for first few audio files
    if (audioFiles.length > 0) {
      console.log('🌐 Testing public URL generation...');
      const testFile = audioFiles[0];
      const { data: urlData } = supabase.storage
        .from('painreducingworld')
        .getPublicUrl(testFile.name);
      
      console.log(`🔗 Sample public URL: ${urlData.publicUrl}`);
      
      // Test if URL is accessible
      try {
        const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
        console.log(`✅ URL accessibility test: ${response.ok ? 'SUCCESS' : 'FAILED'} (${response.status})`);
      } catch (fetchError) {
        console.error('❌ URL accessibility test failed:', fetchError);
      }
    }
    
    return { 
      success: true, 
      totalFiles: files.length, 
      audioFiles: audioFiles.length,
      sampleFiles: audioFiles.slice(0, 5).map(f => f.name)
    };
    
  } catch (error) {
    console.error('❌ Unexpected error in bucket test:', error);
    return { success: false, error: String(error) };
  }
}

// Auto-run test when imported in development
if (import.meta.env.DEV) {
  (window as any).testPainReducingWorldBucket = testPainReducingWorldBucket;
  console.log('🔧 Direct bucket test available as window.testPainReducingWorldBucket()');
}
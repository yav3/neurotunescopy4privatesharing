import { supabase } from '@/integrations/supabase/client';
import { SimpleStorageService } from '@/services/simpleStorageService';

export const diagnoseSonatasAccess = async () => {
  console.group('🎵 Sonatas Bucket Diagnostic');
  
  try {
    // Test 1: Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    console.log('🔐 Authentication status:', user ? '✅ AUTHENTICATED' : '❌ NOT AUTHENTICATED');
    
    if (!user) {
      console.log('🚫 Sonatas may require authentication');
      console.groupEnd();
      return;
    }
    
    // Test 2: Check direct bucket access
    console.log('📂 Testing direct sonatasforstress bucket access...');
    
    const { data: bucketList, error: listError } = await supabase.storage
      .from('sonatasforstress')
      .list('', { limit: 10 });
      
    if (listError) {
      console.error('❌ Direct bucket access failed:', listError);
    } else {
      console.log('✅ Direct bucket access successful:', bucketList?.length || 0, 'files');
      if (bucketList && bucketList.length > 0) {
        console.log('📋 First few files:', bucketList.slice(0, 3).map(f => f.name));
      }
    }
    
    // Test 3: Check via SimpleStorageService
    console.log('🔄 Testing via SimpleStorageService...');
    try {
      const tracks = await SimpleStorageService.getTracksFromBuckets(['sonatasforstress'], 5);
      console.log('✅ SimpleStorageService returned:', tracks.length, 'tracks');
      if (tracks.length > 0) {
        console.log('📋 Sample track:', {
          id: tracks[0].id,
          title: tracks[0].title,
          bucket: tracks[0].bucket
        });
      }
    } catch (serviceError) {
      console.error('❌ SimpleStorageService failed:', serviceError);
    }
    
    // Test 4: Check fallback behavior
    console.log('🔄 Testing fallback buckets...');
    const { expandBucketsWithFallbacks } = await import('@/utils/bucketFallbacks');
    const expandedBuckets = expandBucketsWithFallbacks(['sonatasforstress']);
    console.log('📈 Fallback expansion:', ['sonatasforstress'], '→', expandedBuckets);
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error);
  }
  
  console.groupEnd();
};

// Test the sonatas genre configuration
export const testSonatasGenreConfig = () => {
  console.group('⚙️ Sonatas Genre Configuration');
  
  try {
    const { getGenreOptions } = require('@/config/genreConfigs');
    const stressGenres = getGenreOptions('stress-anxiety-support');
    const sonatasGenre = stressGenres.find((g: any) => g.id === 'sonatas');
    
    if (sonatasGenre) {
      console.log('✅ Sonatas genre found:', {
        id: sonatasGenre.id,
        name: sonatasGenre.name,
        buckets: sonatasGenre.buckets
      });
    } else {
      console.error('❌ Sonatas genre not found in stress-anxiety-support');
      console.log('Available genres:', stressGenres.map((g: any) => ({ id: g.id, name: g.name })));
    }
    
  } catch (error) {
    console.error('❌ Genre config test failed:', error);
  }
  
  console.groupEnd();
};

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).diagnoseSonatasAccess = diagnoseSonatasAccess;
  (window as any).testSonatasGenreConfig = testSonatasGenreConfig;
  
  // Auto-run diagnostic
  setTimeout(() => {
    testSonatasGenreConfig();
    diagnoseSonatasAccess();
  }, 1000);
}
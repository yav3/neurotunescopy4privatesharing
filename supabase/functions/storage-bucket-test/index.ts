import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for full access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('🔑 Using SERVICE ROLE KEY for full storage access');

    const { buckets } = await req.json();
    
    const results: Record<string, any> = {};
    
    for (const bucket of buckets) {
      console.log(`🔍 Testing bucket: ${bucket.name} with SERVICE ROLE`);
      
      try {
        // List files with service role permissions
        const { data: files, error } = await supabase.storage
          .from(bucket.name)
          .list('', { limit: 100 });

        if (error) {
          console.error(`❌ BUCKET ${bucket.name} ERROR:`, error);
          results[bucket.name] = {
            ...bucket,
            connected: false,
            error: error.message,
            files: 0,
            audioFiles: 0,
            sampleUrls: [],
            urlTests: []
          };
          continue;
        }

        // Filter for audio files
        const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
        const audioFiles = files?.filter(file => 
          audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
        ) || [];

        // Generate sample URLs for first 3 audio files
        const sampleUrls = audioFiles.slice(0, 3).map(file => {
          const { data } = supabase.storage.from(bucket.name).getPublicUrl(file.name);
          return data.publicUrl;
        });

        // Test URL accessibility with HEAD requests
        const urlTests = await Promise.all(
          sampleUrls.map(async (url) => {
            try {
              const response = await fetch(url, { method: 'HEAD' });
              return { 
                url, 
                accessible: response.ok, 
                status: response.status,
                headers: Object.fromEntries(response.headers.entries())
              };
            } catch (error) {
              return { url, accessible: false, error: String(error) };
            }
          })
        );

        console.log(`✅ BUCKET ${bucket.name}: ${files?.length || 0} total files, ${audioFiles.length} audio files`);
        
        results[bucket.name] = {
          ...bucket,
          connected: true,
          files: files?.length || 0,
          audioFiles: audioFiles.length,
          sampleUrls,
          sampleFiles: audioFiles.slice(0, 3).map(f => f.name),
          urlTests
        };

      } catch (error) {
        console.error(`💥 BUCKET ${bucket.name} EXCEPTION:`, error);
        results[bucket.name] = {
          ...bucket,
          connected: false,
          error: String(error),
          files: 0,
          audioFiles: 0,
          sampleUrls: [],
          urlTests: []
        };
      }

      // Small delay to prevent API overload
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Summary
    const connected = Object.values(results).filter((r: any) => r.connected).length;
    const totalAudio = Object.values(results).reduce((sum: number, r: any) => sum + (r.audioFiles || 0), 0);
    
    console.log('📊 SERVICE ROLE BUCKET TEST SUMMARY:');
    console.log(`✅ Connected buckets: ${connected}/${buckets.length}`);
    console.log(`🎵 Total audio files: ${totalAudio}`);

    return new Response(
      JSON.stringify({
        success: true,
        results,
        summary: {
          connected,
          total: buckets.length,
          totalAudio
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Storage bucket test error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
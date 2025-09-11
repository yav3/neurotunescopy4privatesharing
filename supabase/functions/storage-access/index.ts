import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const url = new URL(req.url)
    const bucket = url.searchParams.get('bucket') || 'classicalfocus'
    const limit = parseInt(url.searchParams.get('limit') || '100')

    console.log(`📂 Accessing bucket: ${bucket} with service key`)

    // List files in the bucket using service role
    const { data: files, error: listError } = await supabase.storage
      .from(bucket)
      .list('', {
        limit: limit,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (listError) {
      console.error(`❌ Error listing files in bucket ${bucket}:`, listError)
      return new Response(
        JSON.stringify({ error: listError.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!files || files.length === 0) {
      return new Response(
        JSON.stringify({ files: [], message: `No files found in bucket ${bucket}` }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Filter for audio files
    const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a']
    const audioFiles = files.filter(file => 
      audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    )

    console.log(`🎵 Found ${audioFiles.length} audio files in bucket: ${bucket}`)

    // Create track objects with public URLs
    const tracks = audioFiles.map(file => {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(file.name)
      
      return {
        id: `${bucket}-${file.name}`,
        title: cleanTitle(file.name),
        storage_bucket: bucket,
        storage_key: file.name,
        stream_url: urlData.publicUrl,
        file_size: file.metadata?.size,
        last_modified: file.updated_at || file.created_at
      }
    })

    return new Response(
      JSON.stringify({ 
        tracks: tracks,
        total: tracks.length,
        bucket: bucket
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Error in storage-access function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function cleanTitle(filename: string): string {
  // Remove file extension
  let title = filename.replace(/\.[^/.]+$/, '')
  
  // Replace underscores and hyphens with spaces
  title = title.replace(/[_-]/g, ' ')
  
  // Clean up multiple spaces
  title = title.replace(/\s+/g, ' ')
  
  // Capitalize first letter of each word
  title = title.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    
  return title.trim()
}
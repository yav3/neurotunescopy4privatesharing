import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (req.method === 'GET') {
      // Handle audio streaming
      const url = new URL(req.url)
      const trackId = url.searchParams.get('trackId')
      const filePath = url.searchParams.get('filePath')
      const bucketName = url.searchParams.get('bucket') || 'neuralpositivemusic'

      if (!trackId && !filePath) {
        return new Response(
          JSON.stringify({ error: 'Track ID or file path is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      let track = null
      let audioFilePath = filePath

      // If trackId is provided, get track metadata
      if (trackId) {
        const { data: trackData, error: trackError } = await supabase
          .from('music_tracks')
          .select('file_path, bucket_name, title, file_size')
          .eq('id', trackId)
          .eq('upload_status', 'completed')
          .single()

        if (trackError || !trackData) {
          return new Response(
            JSON.stringify({ error: 'Track not found' }),
            { 
              status: 404, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        track = trackData
        audioFilePath = trackData.file_path
      }

      if (!audioFilePath) {
        return new Response(
          JSON.stringify({ error: 'Audio file path not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Get signed URL for the audio file with longer expiry
      const { data: urlData, error: urlError } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(audioFilePath, 86400) // 24 hours expiry

      if (urlError || !urlData) {
        console.error('Failed to generate signed URL:', urlError)
        return new Response(
          JSON.stringify({ error: 'Failed to generate streaming URL' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Fetch the audio file and stream it with proper headers
      const audioResponse = await fetch(urlData.signedUrl, {
        headers: req.headers.get('range') ? { 'Range': req.headers.get('range')! } : {}
      })

      if (!audioResponse.ok) {
        return new Response(
          JSON.stringify({ error: 'Audio file not accessible' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Forward the audio response with proper headers
      const responseHeaders = new Headers(corsHeaders)
      
      // Copy important headers from the storage response
      const headersToForward = [
        'content-length',
        'content-range', 
        'accept-ranges',
        'content-type',
        'cache-control',
        'etag',
        'last-modified'
      ]

      headersToForward.forEach(header => {
        const value = audioResponse.headers.get(header)
        if (value) {
          responseHeaders.set(header, value)
        }
      })

      // Ensure proper audio content type
      if (!responseHeaders.get('content-type')) {
        responseHeaders.set('content-type', 'audio/mpeg')
      }

      // Enable range requests
      responseHeaders.set('accept-ranges', 'bytes')
      responseHeaders.set('cache-control', 'public, max-age=31536000, immutable')

      // Log streaming analytics if trackId provided
      if (trackId) {
        supabase.from('streaming_analytics').insert({
          track_id: trackId,
          quality_requested: 'medium',
          start_time: 0,
          user_agent: req.headers.get('User-Agent'),
          ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        }).then(() => {}).catch(() => {}) // Fire and forget
      }

      return new Response(audioResponse.body, {
        status: audioResponse.status,
        headers: responseHeaders
      })
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Stream audio error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
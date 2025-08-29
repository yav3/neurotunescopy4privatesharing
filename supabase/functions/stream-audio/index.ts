import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req: Request) => {
  const url = new URL(req.url)
  const method = req.method

  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    return new Response(null, { 
      status: 200, 
      headers: corsHeaders 
    })
  }

  // Handle HEAD requests (for connectivity testing)
  if (method === 'HEAD') {
    return new Response(null, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing environment variables',
          details: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Handle GET requests
    if (method === 'GET') {
      const trackId = url.searchParams.get('trackId')
      const quality = url.searchParams.get('quality') || 'medium'

      // Test endpoint - return success without trackId
      if (!trackId) {
        return new Response(
          JSON.stringify({ 
            status: 'ok',
            message: 'Edge function is working',
            timestamp: new Date().toISOString(),
            availableEndpoints: [
              'GET /?trackId=ID&quality=medium',
              'POST / (with JSON body)',
              'HEAD / (connectivity test)'
            ]
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Get track metadata
      const { data: track, error: trackError } = await supabase
        .from('music_tracks')
        .select('file_path, bucket_name, title, file_size')
        .eq('id', trackId)
        .eq('upload_status', 'completed')
        .single()

      if (trackError || !track) {
        return new Response(
          JSON.stringify({ 
            error: 'Track not found',
            trackId,
            details: trackError?.message || 'No track with this ID'
          }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Get signed URL for the audio file
      const { data: urlData, error: urlError } = await supabase.storage
        .from(track.bucket_name)
        .createSignedUrl(track.file_path, 3600) // 1 hour expiry

      if (urlError || !urlData) {
        return new Response(
          JSON.stringify({ 
            error: 'Failed to generate streaming URL',
            details: urlError?.message || 'Storage error'
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({
          status: 'success',
          streamUrl: urlData.signedUrl,
          track: {
            id: trackId,
            title: track.title,
            fileSize: track.file_size
          },
          quality,
          expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'private, max-age=300'
          }
        }
      )
    }

    // Handle POST requests
    if (method === 'POST') {
      const body = await req.json()
      
      if (!body.trackId) {
        return new Response(
          JSON.stringify({ error: 'Track ID is required in POST body' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Similar logic as GET but with POST body
      return new Response(
        JSON.stringify({ 
          status: 'success',
          message: 'POST request processed',
          receivedData: body
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Method not allowed
    return new Response(
      JSON.stringify({ 
        error: 'Method not allowed',
        allowedMethods: ['GET', 'POST', 'HEAD', 'OPTIONS'],
        receivedMethod: method
      }),
      { 
        status: 405, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Allow': 'GET, POST, HEAD, OPTIONS'
        } 
      }
    )

  } catch (error) {
    console.error('Stream audio error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
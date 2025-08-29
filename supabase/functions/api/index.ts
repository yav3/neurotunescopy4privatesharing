import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, range',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, HEAD',
  'Access-Control-Expose-Headers': 'Content-Range, Accept-Ranges, Content-Type, Content-Length'
}

function supabaseAdmin() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } }
  )
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const path = url.pathname

  console.log(`🔥 API Request: ${req.method} ${path}`)

  try {
    // Health check
    if (path === '/api/health') {
      return new Response(JSON.stringify({ 
        ok: true, 
        time: new Date().toISOString(),
        service: 'NeuroTunes API'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get playlist by goal
    if (path === '/api/v1/playlist' && req.method === 'GET') {
      const goal = url.searchParams.get('goal') || ''
      console.log(`🎯 Loading playlist for goal: ${goal}`)
      
      const supabase = supabaseAdmin()
      
      // Map goals to conditions and build query
      const goalToConditions = {
        'focus': { energy: [0.4, 0.7], valence: [0.4, 0.8], genres: ['classical', 'instrumental', 'acoustic'] },
        'relax': { energy: [0.1, 0.4], valence: [0.6, 0.9], genres: ['jazz', 'classical', 'folk'] },
        'sleep': { energy: [0.0, 0.3], valence: [0.3, 0.7], genres: ['classical', 'acoustic', 'instrumental'] },
        'energy': { energy: [0.5, 1.0], valence: [0.7, 1.0], genres: ['jazz', 'electronic', 'indie'] }
      }
      
      const criteria = goalToConditions[goal as keyof typeof goalToConditions] || goalToConditions['focus']
      
      let query = supabase
        .from('music_tracks')
        .select('*')
        .eq('upload_status', 'completed')
        
      if (criteria.energy) {
        query = query.gte('energy', criteria.energy[0]).lte('energy', criteria.energy[1])
      }
      
      if (criteria.valence) {
        query = query.gte('valence', criteria.valence[0]).lte('valence', criteria.valence[1])
      }
      
      if (criteria.genres.length > 0) {
        query = query.in('genre', criteria.genres)
      }
      
      const { data: tracks, error } = await query.limit(15)
      
      if (error) {
        console.error('❌ Database error:', error)
        return new Response(JSON.stringify({ ok: false, error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      console.log(`✅ Found ${tracks?.length || 0} tracks for goal: ${goal}`)
      return new Response(JSON.stringify({ tracks: tracks || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Build session
    if (path === '/api/v1/session/build' && req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      const { goal = '', durationMin = 15, intensity = 3 } = body
      console.log(`🏗️ Building session:`, { goal, durationMin, intensity })
      
      const supabase = supabaseAdmin()
      
      // Get tracks using same logic as playlist
      const goalToConditions = {
        'focus': { energy: [0.4, 0.7], valence: [0.4, 0.8], genres: ['classical', 'instrumental', 'acoustic'] },
        'relax': { energy: [0.1, 0.4], valence: [0.6, 0.9], genres: ['jazz', 'classical', 'folk'] },
        'sleep': { energy: [0.0, 0.3], valence: [0.3, 0.7], genres: ['classical', 'acoustic', 'instrumental'] },
        'energy': { energy: [0.5, 1.0], valence: [0.7, 1.0], genres: ['jazz', 'electronic', 'indie'] }
      }
      
      const criteria = goalToConditions[goal as keyof typeof goalToConditions] || goalToConditions['focus']
      
      let query = supabase
        .from('music_tracks')
        .select('*')
        .eq('upload_status', 'completed')
        
      if (criteria.energy) {
        query = query.gte('energy', criteria.energy[0]).lte('energy', criteria.energy[1])
      }
      
      if (criteria.valence) {
        query = query.gte('valence', criteria.valence[0]).lte('valence', criteria.valence[1])
      }
      
      if (criteria.genres.length > 0) {
        query = query.in('genre', criteria.genres)
      }
      
      const { data: tracks, error } = await query.limit(Math.ceil(durationMin / 3)) // ~3 min per track
      
      if (error) {
        console.error('❌ Session build error:', error)
        return new Response(JSON.stringify({ ok: false, error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Create session record
      const sessionId = crypto.randomUUID()
      
      console.log(`✅ Built session ${sessionId} with ${tracks?.length || 0} tracks`)
      return new Response(JSON.stringify({ 
        sessionId, 
        tracks: tracks || [] 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Start session
    if (path === '/api/v1/sessions/start' && req.method === 'POST') {
      const { trackId } = await req.json()
      const sessionId = crypto.randomUUID()
      
      console.log(`🎵 Started session ${sessionId} for track ${trackId}`)
      return new Response(JSON.stringify({ sessionId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Session progress
    if (path === '/api/v1/sessions/progress' && req.method === 'POST') {
      const { sessionId, t } = await req.json()
      console.log(`📊 Session ${sessionId} progress: ${t}s`)
      
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Complete session
    if (path === '/api/v1/sessions/complete' && req.method === 'POST') {
      const { sessionId } = await req.json()
      console.log(`✅ Session ${sessionId} completed`)
      
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Stream audio file
    if (path === '/api/stream' && req.method === 'GET') {
      const fileName = url.searchParams.get('file')
      if (!fileName) {
        return new Response('Missing file parameter', { status: 400, headers: corsHeaders })
      }

      console.log(`🎵 Streaming file: ${fileName}`)
      
      const supabase = supabaseAdmin()
      
      try {
        // Get signed URL for the file
        const { data, error } = await supabase.storage
          .from('neuralpositivemusic')
          .createSignedUrl(fileName, 3600) // 1 hour expiry
          
        if (error || !data) {
          console.error('❌ Storage error:', error)
          return new Response('File not found', { status: 404, headers: corsHeaders })
        }

        // Proxy the file with range support
        const range = req.headers.get('Range')
        const proxyHeaders: Record<string, string> = {
          ...corsHeaders,
          'Accept-Ranges': 'bytes',
          'Content-Type': 'audio/mpeg'
        }

        if (range) {
          proxyHeaders['Range'] = range
        }

        const response = await fetch(data.signedUrl, {
          headers: range ? { 'Range': range } : {}
        })

        // Copy relevant headers from the upstream response
        if (response.headers.get('Content-Range')) {
          proxyHeaders['Content-Range'] = response.headers.get('Content-Range')!
        }
        if (response.headers.get('Content-Length')) {
          proxyHeaders['Content-Length'] = response.headers.get('Content-Length')!
        }

        return new Response(response.body, {
          status: response.status,
          headers: proxyHeaders
        })

      } catch (error) {
        console.error('❌ Stream error:', error)
        return new Response('Stream error', { status: 500, headers: corsHeaders })
      }
    }

    // 404 for unknown paths
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ API Error:', error)
    return new Response(JSON.stringify({ 
      ok: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
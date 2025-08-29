import { Hono } from 'https://deno.land/x/hono@v3.10.4/mod.ts'
import { cors } from 'https://deno.land/x/hono@v3.10.4/middleware.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const app = new Hono()

app.use('*', cors({
  origin: Deno.env.get('WEB_ORIGIN') ?? '*',
  allowMethods: ['GET', 'POST', 'OPTIONS', 'HEAD'],
  allowHeaders: ['Content-Type', 'Authorization', 'Range'],
  exposeHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Type', 'Content-Length']
}))

function sbAdmin() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } }
  )
}

/* ---------- Health ---------- */
app.get('/health', (c) => c.json({ ok: true, time: new Date().toISOString(), service: 'NeuroTunes API' }))

/* ---------- Playlist by goal ---------- */
app.get('/v1/playlist', async (c) => {
  const goal = c.req.query('goal') ?? ''
  console.log(`🎯 Loading playlist for goal: ${goal}`)
  
  const supabase = sbAdmin()
  
  // Map goals to conditions and build query
  const goalToConditions: Record<string, any> = {
    'focus': { energy: [0.4, 0.7], valence: [0.4, 0.8], genres: ['classical', 'instrumental', 'acoustic'] },
    'relax': { energy: [0.1, 0.4], valence: [0.6, 0.9], genres: ['jazz', 'classical', 'folk'] },
    'sleep': { energy: [0.0, 0.3], valence: [0.3, 0.7], genres: ['classical', 'acoustic', 'instrumental'] },
    'energy': { energy: [0.5, 1.0], valence: [0.7, 1.0], genres: ['jazz', 'electronic', 'indie'] }
  }
  
  const criteria = goalToConditions[goal] || goalToConditions['focus']
  
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
    return c.json({ ok: false, error: error.message }, 500)
  }

  console.log(`✅ Found ${tracks?.length || 0} tracks for goal: ${goal}`)
  return c.json({ tracks: tracks || [] })
})

/* ---------- Session building ---------- */
app.post('/v1/session/build', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const { goal = '', durationMin = 15, intensity = 3 } = body
  console.log(`🏗️ Building session:`, { goal, durationMin, intensity })
  
  const supabase = sbAdmin()
  
  // Get tracks using same logic as playlist
  const goalToConditions: Record<string, any> = {
    'focus': { energy: [0.4, 0.7], valence: [0.4, 0.8], genres: ['classical', 'instrumental', 'acoustic'] },
    'relax': { energy: [0.1, 0.4], valence: [0.6, 0.9], genres: ['jazz', 'classical', 'folk'] },
    'sleep': { energy: [0.0, 0.3], valence: [0.3, 0.7], genres: ['classical', 'acoustic', 'instrumental'] },
    'energy': { energy: [0.5, 1.0], valence: [0.7, 1.0], genres: ['jazz', 'electronic', 'indie'] }
  }
  
  const criteria = goalToConditions[goal] || goalToConditions['focus']
  
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
  
  const { data: tracks, error } = await query.limit(Math.ceil(durationMin / 3))
  
  if (error) {
    console.error('❌ Session build error:', error)
    return c.json({ ok: false, error: error.message }, 500)
  }

  // Create session record
  const sessionId = crypto.randomUUID()
  
  console.log(`✅ Built session ${sessionId} with ${tracks?.length || 0} tracks`)
  return c.json({ sessionId, tracks: tracks || [] })
})

/* ---------- Session telemetry ---------- */
app.post('/v1/sessions/start', async (c) => {
  const { trackId } = await c.req.json()
  const sessionId = crypto.randomUUID()
  
  console.log(`🎵 Started session ${sessionId} for track ${trackId}`)
  return c.json({ sessionId })
})

app.post('/v1/sessions/progress', async (c) => {
  const { sessionId, t } = await c.req.json()
  console.log(`📊 Session ${sessionId} progress: ${t}s`)
  
  return c.json({ ok: true })
})

app.post('/v1/sessions/complete', async (c) => {
  const { sessionId } = await c.req.json()
  console.log(`✅ Session ${sessionId} completed`)
  
  return c.json({ ok: true })
})

/* ---------- Stream audio ---------- */
app.get('/stream', async (c) => {
  const fileName = c.req.query('file')
  if (!fileName) {
    return c.json({ error: 'Missing file parameter' }, 400)
  }

  console.log(`🎵 Streaming file: ${fileName}`)
  
  const supabase = sbAdmin()
  
  try {
    // Get signed URL for the file
    const { data, error } = await supabase.storage
      .from('neuralpositivemusic')
      .createSignedUrl(fileName, 3600) // 1 hour expiry
      
    if (error || !data) {
      console.error('❌ Storage error:', error)
      return c.json({ error: 'File not found' }, 404)
    }

    // Proxy the file with range support
    const range = c.req.header('Range')
    const proxyHeaders: Record<string, string> = {
      'Accept-Ranges': 'bytes',
      'Content-Type': 'audio/mpeg'
    }

    const fetchOptions: RequestInit = {}
    if (range) {
      fetchOptions.headers = { 'Range': range }
    }

    const response = await fetch(data.signedUrl, fetchOptions)

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
    return c.json({ error: 'Stream error' }, 500)
  }
})

export default app
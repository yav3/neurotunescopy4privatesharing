import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://neurotunes.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FixResult {
  trackId: string
  title: string
  oldStatus: string
  newStatus: string
  action: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Require admin JWT — this function mutates storage and DB records
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
  const callerClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } }
  )
  const { data: { user }, error: uErr } = await callerClient.auth.getUser()
  if (uErr || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
  const { data: isAdmin } = await callerClient.rpc('has_role', { _user_id: user.id, _role: 'admin' })
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    )

    const { searchParams } = new URL(req.url)
    const bucketName = searchParams.get('bucket') || 'audio'
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)
    const dryRun = searchParams.get('dryRun') === 'true'

    const { data: workingTracks, error: dbError } = await supabase
      .from('tracks')
      .select('id, title, storage_key, storage_bucket, audio_status')
      .eq('storage_bucket', bucketName)
      .eq('audio_status', 'working')
      .limit(limit)

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    const results: FixResult[] = []
    const batchSize = 10

    for (let i = 0; i < workingTracks.length; i += batchSize) {
      const batch = workingTracks.slice(i, i + batchSize)

      const batchPromises = batch.map(async (track) => {
        try {
          const { error: storageError } = await supabase.storage
            .from(bucketName)
            .download(track.storage_key)

          if (storageError) {
            const alternateBucket = bucketName === 'audio' ? 'neuralpositivemusic' : 'audio'
            const alternateKey = track.storage_key.startsWith('tracks/')
              ? track.storage_key.replace('tracks/', '')
              : `tracks/${track.storage_key}`

            const { error: alternateError } = await supabase.storage
              .from(alternateBucket)
              .download(alternateKey)

            if (!alternateError) {
              if (!dryRun) {
                await supabase
                  .from('tracks')
                  .update({
                    storage_bucket: alternateBucket,
                    storage_key: alternateKey,
                    audio_status: 'working',
                    last_verified_at: new Date().toISOString(),
                    last_error: null
                  })
                  .eq('id', track.id)
              }
              return {
                trackId: track.id,
                title: track.title,
                oldStatus: 'working (wrong bucket)',
                newStatus: 'working (corrected bucket)',
                action: `Moved from ${bucketName}/${track.storage_key} to ${alternateBucket}/${alternateKey}`
              }
            } else {
              if (!dryRun) {
                await supabase
                  .from('tracks')
                  .update({
                    audio_status: 'missing',
                    last_verified_at: new Date().toISOString(),
                    last_error: `File not found in ${bucketName} or ${alternateBucket}`
                  })
                  .eq('id', track.id)
              }
              return {
                trackId: track.id,
                title: track.title,
                oldStatus: 'working',
                newStatus: 'missing',
                action: 'Marked as missing - file not found in either bucket'
              }
            }
          } else {
            if (!dryRun) {
              await supabase
                .from('tracks')
                .update({ last_verified_at: new Date().toISOString(), last_error: null })
                .eq('id', track.id)
            }
            return {
              trackId: track.id,
              title: track.title,
              oldStatus: 'working',
              newStatus: 'verified working',
              action: 'Updated verification timestamp'
            }
          }
        } catch (error) {
          return {
            trackId: track.id,
            title: track.title,
            oldStatus: 'working',
            newStatus: 'error',
            action: `Error during verification: ${error instanceof Error ? error.message : String(error)}`
          }
        }
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults.filter(Boolean))
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    const summary = {
      bucket: bucketName,
      totalProcessed: workingTracks.length,
      dryRun,
      results,
      summary: {
        verified: results.filter(r => r.newStatus === 'verified working').length,
        corrected: results.filter(r => r.newStatus.includes('corrected')).length,
        markedMissing: results.filter(r => r.newStatus === 'missing').length,
        errors: results.filter(r => r.newStatus === 'error').length
      }
    }

    return Response.json(summary, { headers: corsHeaders })

  } catch (_error) {
    return Response.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders })
  }
})

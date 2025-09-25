import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
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

    console.log(`🔧 Fixing storage mismatches for bucket: ${bucketName}, limit: ${limit}, dryRun: ${dryRun}`)

    // Get tracks that claim to be working
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

    // Process tracks in batches
    for (let i = 0; i < workingTracks.length; i += batchSize) {
      const batch = workingTracks.slice(i, i + batchSize)
      
      const batchPromises = batch.map(async (track) => {
        try {
          // Try to verify the file exists by attempting to get its metadata
          const { error: storageError } = await supabase.storage
            .from(bucketName)
            .download(track.storage_key)

          if (storageError) {
            console.log(`❌ File not found: ${track.storage_key} - ${storageError.message}`)
            
            // Try the other bucket
            const alternateBucket = bucketName === 'audio' ? 'neuralpositivemusic' : 'audio'
            const alternateKey = track.storage_key.startsWith('tracks/') 
              ? track.storage_key.replace('tracks/', '') 
              : `tracks/${track.storage_key}`

            const { error: alternateError } = await supabase.storage
              .from(alternateBucket)
              .download(alternateKey)

            if (!alternateError) {
              // Found in alternate bucket, update the track
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
              // File truly missing, mark as missing
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
                action: `Marked as missing - file not found in either bucket`
              }
            }
          } else {
            // File exists and is accessible, update verification timestamp
            if (!dryRun) {
              await supabase
                .from('tracks')
                .update({
                  last_verified_at: new Date().toISOString(),
                  last_error: null
                })
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
          console.error(`Error processing track ${track.id}:`, error)
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

      // Small delay between batches to avoid overwhelming the storage API
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

    console.log('🎯 Fix summary:', summary.summary)

    return Response.json(summary, { headers: corsHeaders })

  } catch (error) {
    console.error('Fix error:', error)
    return Response.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { 
      status: 500, 
      headers: corsHeaders 
    })
  }
})
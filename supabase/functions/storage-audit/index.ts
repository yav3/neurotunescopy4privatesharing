import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://neurotunes.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Require admin JWT
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
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)

    const { data: storageFiles, error: storageError } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 1000 })

    if (storageError) {
      return Response.json({ error: 'Failed to list storage files' }, { status: 500, headers: corsHeaders })
    }

    const { data: dbTracks, error: dbError } = await supabase
      .from('tracks')
      .select('id, title, storage_key, storage_bucket, audio_status')
      .eq('storage_bucket', bucketName)
      .eq('audio_status', 'working')
      .limit(limit)

    if (dbError) {
      return Response.json({ error: 'Failed to query database' }, { status: 500, headers: corsHeaders })
    }

    const storageFileNames = new Set(storageFiles?.map(f => f.name) || [])
    const dbStorageKeys = dbTracks?.map(t => t.storage_key) || []

    const missingInStorage = dbStorageKeys.filter(key => key && !storageFileNames.has(key))
    const dbStorageKeySet = new Set(dbStorageKeys.filter(Boolean))
    const missingInDb = storageFiles?.filter(f => !dbStorageKeySet.has(f.name)).map(f => f.name) || []

    const sampleMismatches = missingInStorage.slice(0, 5).map(dbKey => {
      const closestMatches = Array.from(storageFileNames)
        .filter(storageFile => {
          const dbClean = dbKey?.toLowerCase().replace(/[^a-z0-9]/g, '') || ''
          const storageClean = storageFile.toLowerCase().replace(/[^a-z0-9]/g, '')
          return storageClean.includes(dbClean.slice(0, 20)) || dbClean.includes(storageClean.slice(0, 20))
        })
        .slice(0, 3)
      return { dbKey, possibleMatches: closestMatches }
    })

    const summary = {
      bucket: bucketName,
      totalStorageFiles: storageFiles?.length || 0,
      totalDbTracks: dbTracks?.length || 0,
      missingInStorage: missingInStorage.length,
      missingInDb: missingInDb.length,
      sampleStorageFiles: storageFiles?.slice(0, 5).map(f => f.name) || [],
      sampleDbKeys: dbStorageKeys.slice(0, 5),
      sampleMismatches,
      firstFewMissingInStorage: missingInStorage.slice(0, 10),
      firstFewMissingInDb: missingInDb.slice(0, 10)
    }

    return Response.json(summary, { headers: corsHeaders })

  } catch (_error) {
    return Response.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders })
  }
})

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// In-memory index of storage objects (same as resolve-track-url)
let storageKeys: string[] = []
let lastIndexAt = 0
const INDEX_CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

// Build or refresh the storage index
async function buildStorageIndex(supabase: any, bucketName: string, force = false) {
  const now = Date.now()
  if (!force && storageKeys.length && now - lastIndexAt < INDEX_CACHE_DURATION) {
    console.log(`Using cached storage index with ${storageKeys.length} files`)
    return
  }

  console.log(`Building storage index for bucket: ${bucketName}`)
  
  // List all objects (paged)
  const keys: string[] = []
  let page = 0
  const PAGE_SIZE = 1000

  while (true) {
    const { data, error } = await supabase.storage.from(bucketName).list('', {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
      sortBy: { column: 'name', order: 'asc' }
    })
    
    if (error) {
      console.error('Error listing storage files:', error)
      throw error
    }
    
    if (!data?.length) break
    
    for (const obj of data) {
      if (obj?.name) {
        const name = obj.name.toLowerCase()
        // Only include audio files for streaming
        if (name.endsWith('.mp3') || name.endsWith('.wav') || name.endsWith('.flac') || 
            name.endsWith('.m4a') || name.endsWith('.ogg')) {
          keys.push(obj.name)
        }
      }
    }
    
    if (data.length < PAGE_SIZE) break
    page++
  }
  
  storageKeys = keys
  lastIndexAt = now
  console.log(`Built index with ${storageKeys.length} audio files`)
}

// Normalize text to tokens (same as resolve-track-url)
function normalizeTokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[_\-\.]+/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(inst|instr|instrumental)\b/g, 'instrumental')
    .replace(/\b(re[\s-]?energize)\b/g, 'reenergize')
    .replace(/\b(hiit)\b/g, 'hiit')
    .replace(/\b(2010s|2010's)\b/g, '2010s')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
}

// Create character bigrams
function bigrams(chars: string[]): string[] {
  const out: string[] = []
  for (let i = 0; i < chars.length - 1; i++) {
    out.push(chars[i] + chars[i + 1])
  }
  return out
}

// Dice coefficient for character-level similarity
function diceCoef(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0
  
  const map = new Map<string, number>()
  for (const g of a) {
    map.set(g, (map.get(g) ?? 0) + 1)
  }
  
  let inter = 0
  for (const g of b) {
    const c = map.get(g)
    if (c && c > 0) {
      inter++
      map.set(g, c - 1)
    }
  }
  
  return (2 * inter) / (a.length + b.length)
}

// Advanced similarity score using Jaccard + Dice
function similarityScore(aRaw: string, bRaw: string): number {
  const A = new Set(normalizeTokens(aRaw))
  const B = new Set(normalizeTokens(bRaw))
  
  if (!A.size || !B.size) return 0

  // Jaccard similarity on tokens
  let inter = 0
  for (const t of A) {
    if (B.has(t)) inter++
  }
  const jaccard = inter / (A.size + B.size - inter)

  // Dice coefficient on character bigrams
  const ad = bigrams(Array.from(aRaw.toLowerCase().replace(/\s+/g, '')))
  const bd = bigrams(Array.from(bRaw.toLowerCase().replace(/\s+/g, '')))
  const dice = diceCoef(ad, bd)

  // Weighted blend: favor token-level matching but include character-level
  return 0.65 * jaccard + 0.35 * dice
}

// Resolve a DB-provided path/title to the best storage key
async function resolveStorageKey(supabase: any, bucketName: string, dbPathOrTitle: string): Promise<{ key: string | null; score: number }> {
  await buildStorageIndex(supabase, bucketName) // ensure index is warmed

  // Filter to audio files only
  const audioKeys = storageKeys.filter(key => {
    const lowerKey = key.toLowerCase()
    return lowerKey.endsWith('.mp3') || lowerKey.endsWith('.wav') || 
           lowerKey.endsWith('.flac') || lowerKey.endsWith('.m4a') || lowerKey.endsWith('.ogg')
  })

  // Try exact name first
  const exact = audioKeys.find(k => k.toLowerCase() === dbPathOrTitle.toLowerCase())
  if (exact) {
    console.log(`Exact match found: ${exact}`)
    return { key: exact, score: 1 }
  }

  // Score all candidates
  let bestKey: string | null = null
  let bestScore = 0
  
  for (const k of audioKeys) {
    const s = similarityScore(dbPathOrTitle, k)
    if (s > bestScore) {
      bestScore = s
      bestKey = k
    }
  }

  console.log(`Best match for "${dbPathOrTitle}": key="${bestKey}", score=${bestScore}`)

  // Accept confident matches or fallback to best match if it's reasonable
  if (bestScore >= 0.62) {
    return { key: bestKey!, score: bestScore }
  }
  
  // For audio files, be more lenient since we need playback to work
  if (bestScore >= 0.3 && bestKey) {
    console.warn(`Using lower confidence match for audio: ${bestKey} (score: ${bestScore})`)
    return { key: bestKey, score: bestScore }
  }
  
  return { key: null, score: bestScore }
}

// Get public URL for storage key
function getPublicUrl(supabase: any, bucketName: string, key: string): string {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(key)
  return data.publicUrl
}

// Update track with correct storage path for future direct hits
async function patchTrackStoragePath(supabase: any, trackId: string, resolvedKey: string) {
  try {
    const { error } = await supabase
      .from('music_tracks')
      .update({ file_path: resolvedKey })
      .eq('id', trackId)
    
    if (error) {
      console.warn('Failed to update track storage path:', error)
    } else {
      console.log(`Updated track ${trackId} with resolved path: ${resolvedKey}`)
    }
  } catch (err) {
    console.warn('Error updating track storage path:', err)
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/').filter(Boolean)
    const lastPart = pathParts[pathParts.length - 1] // Get last part of path
    const bucketName = url.searchParams.get('bucket') || 'neuralpositivemusic'
    
    let candidate = ''
    
    // Handle different request formats:
    // 1. /stream-track/12345 (track ID)
    // 2. /stream-track/path/encoded%20path (path-based)
    // 3. /stream-track (with trackId param - legacy)
    
    if (!lastPart || lastPart === 'stream-track') {
      // Legacy format with trackId parameter
      const trackId = url.searchParams.get('trackId')
      if (!trackId) {
        return new Response(
          JSON.stringify({ error: 'Track identifier required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      // Get track from database
      const { data: track, error: trackError } = await supabase
        .from('music_tracks')
        .select('id, title, original_title, file_path, bucket_name')
        .eq('id', trackId)
        .single()
      
      if (trackError || !track) {
        console.error('Track not found:', trackError)
        return new Response(
          JSON.stringify({ error: 'Track not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      candidate = track.file_path || track.original_title || track.title
    } else if (/^\d+$/.test(lastPart)) {
      // Numeric ID format
      const { data: track, error: trackError } = await supabase
        .from('music_tracks')
        .select('id, title, original_title, file_path, bucket_name')
        .eq('id', lastPart)
        .single()
      
      if (trackError || !track) {
        console.error('Track not found:', trackError)
        return new Response(
          JSON.stringify({ error: 'Track not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      candidate = track.file_path || track.original_title || track.title
    } else {
      // Path-based format - decode the path
      candidate = decodeURIComponent(lastPart)
    }
    
    if (!candidate) {
      return new Response(
        JSON.stringify({ error: 'No file path or title found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    console.log(`Streaming request for candidate: "${candidate}"`)
    
    // Find best match across all candidates
    const { key: resolvedKey, score } = await resolveStorageKey(supabase, bucketName, candidate)
    
    if (!resolvedKey || score < 0.3) {
      console.warn(`No matching audio file found. Best score: ${(score * 100).toFixed(1)}%`)
      
      return new Response(
        JSON.stringify({ 
          error: 'No storage match found',
          candidate,
          bestScore: score,
          threshold: '0.3 minimum for audio streaming'
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Get public URL for the resolved file
    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(resolvedKey)
    const storageUrl = urlData.publicUrl
    
    console.log(`Proxying audio stream: ${resolvedKey} -> ${storageUrl} (score: ${(score * 100).toFixed(1)}%)`)
    
    // Proxy the request with range support for seeking
    const proxyHeaders: Record<string, string> = {
      'User-Agent': 'Supabase-Edge-Function/1.0'
    }
    
    // Forward Range header for seeking support
    const rangeHeader = req.headers.get('range')
    if (rangeHeader) {
      proxyHeaders['Range'] = rangeHeader
    }
    
    // Fetch from storage with range support
    const storageResponse = await fetch(storageUrl, {
      method: req.method,
      headers: proxyHeaders
    })
    
    if (!storageResponse.ok) {
      console.error(`Storage fetch failed: ${storageResponse.status} ${storageResponse.statusText}`)
      return new Response(
        JSON.stringify({ error: 'Storage file not accessible' }),
        { status: storageResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Build response headers with CORS and audio-specific headers
    const responseHeaders = new Headers(corsHeaders)
    
    // Copy important headers from storage response
    const headersToCopy = [
      'accept-ranges', 'content-range', 'content-length', 
      'content-type', 'cache-control', 'etag', 'last-modified'
    ]
    
    for (const headerName of headersToCopy) {
      const headerValue = storageResponse.headers.get(headerName)
      if (headerValue) {
        responseHeaders.set(headerName, headerValue)
      }
    }
    
    // Ensure proper content type for audio
    if (!responseHeaders.get('content-type')) {
      responseHeaders.set('content-type', 'audio/mpeg')
    }
    
    // Enable range requests for seeking
    responseHeaders.set('accept-ranges', 'bytes')
    
    // Cache for 1 hour
    responseHeaders.set('cache-control', 'public, max-age=3600')
    
    console.log(`Streaming ${resolvedKey} with status ${storageResponse.status}`)
    
    // Return the proxied stream
    return new Response(storageResponse.body, {
      status: storageResponse.status,
      headers: responseHeaders
    })
    
  } catch (error) {
    console.error('Error in stream-track:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
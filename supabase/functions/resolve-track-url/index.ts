import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StorageIndex {
  [normalizedPath: string]: {
    originalPath: string
    publicUrl: string
  }
}

let storageIndex: StorageIndex | null = null
let indexLastUpdated: number = 0
const INDEX_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function normalizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric characters
    .trim()
}

function calculateSimilarity(str1: string, str2: string): number {
  // Simple Levenshtein distance-based similarity
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1.0
  
  const distance = levenshteinDistance(longer, shorter)
  return (longer.length - distance) / longer.length
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
  
  for (let i = 0; i <= str1.length; i += 1) {
    matrix[0][i] = i
  }
  
  for (let j = 0; j <= str2.length; j += 1) {
    matrix[j][0] = j
  }
  
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      )
    }
  }
  
  return matrix[str2.length][str1.length]
}

async function buildStorageIndex(supabase: any, bucketName: string): Promise<StorageIndex> {
  console.log(`Building storage index for bucket: ${bucketName}`)
  
  const { data: files, error } = await supabase.storage
    .from(bucketName)
    .list('', {
      limit: 1000,
      sortBy: { column: 'name', order: 'asc' }
    })
  
  if (error) {
    console.error('Error listing files:', error)
    throw new Error(`Failed to list storage files: ${error.message}`)
  }
  
  const index: StorageIndex = {}
  
  for (const file of files || []) {
    if (file.name) {
      const normalizedName = normalizeFilename(file.name)
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(file.name)
      
      index[normalizedName] = {
        originalPath: file.name,
        publicUrl: urlData.publicUrl
      }
    }
  }
  
  console.log(`Built index with ${Object.keys(index).length} files`)
  return index
}

async function getOrBuildIndex(supabase: any, bucketName: string): Promise<StorageIndex> {
  const now = Date.now()
  
  if (!storageIndex || (now - indexLastUpdated) > INDEX_CACHE_DURATION) {
    console.log('Rebuilding storage index...')
    storageIndex = await buildStorageIndex(supabase, bucketName)
    indexLastUpdated = now
  }
  
  return storageIndex
}

function findBestMatch(dbPath: string, index: StorageIndex, threshold: number = 0.6): string | null {
  const normalizedDbPath = normalizeFilename(dbPath)
  
  // First try exact match
  if (index[normalizedDbPath]) {
    return index[normalizedDbPath].publicUrl
  }
  
  // Try fuzzy matching
  let bestMatch: string | null = null
  let bestSimilarity = 0
  
  for (const [normalizedStoragePath, data] of Object.entries(index)) {
    const similarity = calculateSimilarity(normalizedDbPath, normalizedStoragePath)
    
    if (similarity > bestSimilarity && similarity >= threshold) {
      bestSimilarity = similarity
      bestMatch = data.publicUrl
    }
  }
  
  console.log(`Best match for "${dbPath}": similarity=${bestSimilarity}, found=${!!bestMatch}`)
  return bestMatch
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
    const trackId = url.searchParams.get('trackId')
    const fileType = url.searchParams.get('type') || 'audio' // 'audio' or 'artwork'
    const bucketName = url.searchParams.get('bucket') || 'neuralpositivemusic'
    
    if (!trackId) {
      return new Response(
        JSON.stringify({ error: 'trackId parameter is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Get track from database
    const { data: track, error: trackError } = await supabase
      .from('music_tracks')
      .select('id, title, file_path, bucket_name')
      .eq('id', trackId)
      .single()
    
    if (trackError || !track) {
      return new Response(
        JSON.stringify({ error: 'Track not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Build storage index
    const targetBucket = track.bucket_name || bucketName
    const index = await getOrBuildIndex(supabase, targetBucket)
    
    let searchPath = track.file_path
    
    // If looking for artwork, modify the path
    if (fileType === 'artwork' && searchPath) {
      searchPath = searchPath.replace(/\.(mp3|wav|flac|m4a|ogg)$/i, '.jpg')
    }
    
    if (!searchPath) {
      return new Response(
        JSON.stringify({ error: 'No file path found for track' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Find best match
    const resolvedUrl = findBestMatch(searchPath, index, 0.6)
    
    if (!resolvedUrl) {
      return new Response(
        JSON.stringify({ 
          error: 'No matching file found in storage',
          searchPath,
          availableFiles: Object.keys(index).slice(0, 10) // First 10 for debugging
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    console.log(`Resolved ${fileType} URL for track ${trackId}: ${resolvedUrl}`)
    
    return new Response(
      JSON.stringify({ 
        url: resolvedUrl,
        originalPath: searchPath,
        trackId: track.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
    
  } catch (error) {
    console.error('Error in resolve-track-url:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
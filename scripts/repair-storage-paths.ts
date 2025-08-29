import { createClient } from '@supabase/supabase-js'

// Configuration
const SUPABASE_URL = 'https://pbtgvcjniayedqlajjzz.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const BUCKET_NAME = 'neuralpositivemusic'
const INDEX_CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

if (!SUPABASE_SERVICE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// In-memory index of storage objects (same as edge functions)
let storageKeys: string[] = []
let lastIndexAt = 0

// Build or refresh the storage index
async function buildStorageIndex(bucketName: string, force = false) {
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
        // Only include audio files
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

// Normalize text to tokens (same as edge functions)
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
async function resolveStorageKey(dbPathOrTitle: string): Promise<{ key: string | null; score: number }> {
  await buildStorageIndex(BUCKET_NAME) // ensure index is warmed

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

  return { key: bestKey, score: bestScore }
}

// Get all tracks that need repair - optimized for your schema
async function getAllTracksNeedingRepair() {
  const { data: tracks, error } = await supabase
    .from('music_tracks')
    .select('id, title, original_title, file_path, bucket_name, upload_status')
    .eq('upload_status', 'completed')
    .or('file_path.is.null,file_path.eq.') // Tracks with missing/empty file_path
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching tracks:', error)
    throw error
  }
  
  return tracks || []
}

// Update track with correct storage path
async function patchTrackStoragePath(trackId: string, resolvedKey: string) {
  const { error } = await supabase
    .from('music_tracks')
    .update({ file_path: resolvedKey })
    .eq('id', trackId)
  
  if (error) {
    console.error('Failed to update track storage path:', error)
    throw error
  }
}

// Main repair function
async function repairStoragePaths() {
  console.log('🔧 Starting storage path repair...')
  
  try {
    const tracks = await getAllTracksNeedingRepair()
    console.log(`Found ${tracks.length} tracks to process`)
    
    let fixed = 0
    let skipped = 0
    
    for (const track of tracks) {
      // Try multiple candidate sources in priority order
      const candidates = [
        track.file_path,           // Current file_path (if exists)
        track.title,               // Main title
        track.original_title       // Fallback to original_title
      ].filter(Boolean)
      
      if (!candidates.length) {
        console.log(`[SKIP] ${track.id} - No usable identifiers`)
        skipped++
        continue
      }
      
      console.log(`Processing: ${track.title} (${track.id})`)
      
      let bestKey: string | null = null
      let bestScore = 0
      let bestCandidate = ''
      
      // Try each candidate and pick the best match
      for (const candidate of candidates) {
        const { key, score } = await resolveStorageKey(String(candidate))
        if (score > bestScore) {
          bestScore = score
          bestKey = key
          bestCandidate = candidate
        }
      }
      
      if (bestKey && bestScore >= 0.75) {
        await patchTrackStoragePath(track.id, bestKey)
        fixed++
        console.log(`✅ [FIXED] ${track.id} -> ${bestKey} (${(bestScore * 100).toFixed(1)}% via "${bestCandidate}")`)
      } else if (bestKey && bestScore >= 0.4) {
        // Slightly higher threshold for batch repair safety
        await patchTrackStoragePath(track.id, bestKey)
        fixed++
        console.log(`⚠️  [FIXED-MED] ${track.id} -> ${bestKey} (${(bestScore * 100).toFixed(1)}% via "${bestCandidate}")`)
      } else {
        skipped++
        console.log(`❌ [SKIP] ${track.id} - Best: ${(bestScore * 100).toFixed(1)}% via "${bestCandidate}"`)
      }
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log('\n📊 Repair Complete!')
    console.log(`✅ Fixed: ${fixed}`)
    console.log(`❌ Skipped: ${skipped}`)
    console.log(`📝 Total: ${tracks.length}`)
    console.log(`🎯 Success Rate: ${((fixed / tracks.length) * 100).toFixed(1)}%`)
    
  } catch (error) {
    console.error('❌ Repair failed:', error)
    process.exit(1)
  }
}

// Run the repair
if (require.main === module) {
  repairStoragePaths()
    .then(() => {
      console.log('🎉 Storage path repair completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Storage path repair failed:', error)
      process.exit(1)
    })
}

export { repairStoragePaths, resolveStorageKey, getAllTracksNeedingRepair, patchTrackStoragePath }
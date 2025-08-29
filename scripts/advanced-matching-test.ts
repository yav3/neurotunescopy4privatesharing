import { createClient } from '@supabase/supabase-js'

// Test the advanced matching algorithm with real examples
const SUPABASE_URL = 'https://pbtgvcjniayedqlajjzz.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_SERVICE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Test cases based on your example
const testCases = [
  {
    name: "Your Example Case",
    dbRecord: "flame_2_you_instrumental._blues_rock._128._re-energize._remix_1_10923.mp3",
    storageFile: "Amped-Instrumental-Blues-Rock-2010s-Re-Energize-HIIT-1.mp3",
    expectedMatch: true
  },
  {
    name: "Focus Enhancement Test",
    dbRecord: "Focus Enhancement",
    storageFile: "focus_enhancement.mp3",
    expectedMatch: true
  },
  {
    name: "Peaceful Meditation Test", 
    dbRecord: "Peaceful Meditation",
    storageFile: "peaceful_meditation.mp3", 
    expectedMatch: true
  },
  {
    name: "Complex Generated Name",
    dbRecord: "music-1749266794946-885463249",
    storageFile: "music_1749266794946_885463249.mp3",
    expectedMatch: true
  },
  {
    name: "False Positive Test",
    dbRecord: "Classical Symphony No 5",
    storageFile: "Jazz-Fusion-Workout-Mix.mp3",
    expectedMatch: false
  }
]

// Matching algorithm (same as repair script)
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

function bigrams(chars: string[]): string[] {
  const out: string[] = []
  for (let i = 0; i < chars.length - 1; i++) {
    out.push(chars[i] + chars[i + 1])
  }
  return out
}

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

async function runTests() {
  console.log('🧪 Running Advanced Matching Algorithm Tests\n')
  
  let passed = 0
  let failed = 0
  
  for (const test of testCases) {
    const score = similarityScore(test.dbRecord, test.storageFile)
    
    // Determine if this would be considered a match
    const wouldMatch = score >= 0.62 || (score >= 0.3) // Using your thresholds
    
    const testPassed = wouldMatch === test.expectedMatch
    
    console.log(`📝 ${test.name}`)
    console.log(`   DB: "${test.dbRecord}"`)
    console.log(`   Storage: "${test.storageFile}"`)
    console.log(`   Score: ${(score * 100).toFixed(1)}%`)
    console.log(`   Would Match: ${wouldMatch} (Expected: ${test.expectedMatch})`)
    console.log(`   Result: ${testPassed ? '✅ PASS' : '❌ FAIL'}\n`)
    
    if (testPassed) {
      passed++
    } else {
      failed++
    }
  }
  
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`)
  console.log(`🎯 Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`)
  
  // Show token breakdown for the complex example
  console.log('\n🔍 Detailed Analysis of Your Example:')
  const dbTokens = normalizeTokens("flame_2_you_instrumental._blues_rock._128._re-energize._remix_1_10923.mp3")
  const storageTokens = normalizeTokens("Amped-Instrumental-Blues-Rock-2010s-Re-Energize-HIIT-1.mp3")
  
  console.log(`DB Tokens: [${dbTokens.join(', ')}]`)
  console.log(`Storage Tokens: [${storageTokens.join(', ')}]`)
  
  const intersection = dbTokens.filter(token => storageTokens.includes(token))
  console.log(`Common Tokens: [${intersection.join(', ')}]`)
  console.log(`Token Overlap: ${intersection.length}/${Math.max(dbTokens.length, storageTokens.length)} = ${((intersection.length / Math.max(dbTokens.length, storageTokens.length)) * 100).toFixed(1)}%`)
}

// Run tests
if (require.main === module) {
  runTests()
    .then(() => {
      console.log('\n🎉 Matching algorithm tests completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Test failed:', error)
      process.exit(1)
    })
}

export { runTests, similarityScore }
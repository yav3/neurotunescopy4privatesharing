import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { securityMiddleware } from './middleware/security'
import { requestLogger, errorLogger, performanceLogger } from './middleware/logging'
import apiRoutes from './routes/api'
import streamRoutes from './routes/stream'

const app = express()
const PORT = process.env.PORT || 5000
app.set('trust proxy', 1)

// 1) JSON/body parsers FIRST
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(securityMiddleware)

// Logging middleware
app.use(requestLogger)
app.use(performanceLogger(2000))

// 2) HEALTH + API ROUTES (mount all /api/* BEFORE static)
app.get('/api/healthz', (_req, res) =>
  res.type('application/json').status(200).json({ 
    ok: true, 
    service: 'neurotunes-api',
    time: new Date().toISOString(),
    version: '1.0.0'
  })
)

app.get('/api/readyz', async (_req, res) => {
  try {
    // Test Supabase connection
    const testUrl = 'https://pbtgvcjniayedqlajjzz.supabase.co/rest/v1/music_tracks?select=id,title&limit=1'
    const response = await fetch(testUrl, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      res.type('application/json').status(200).json({ ok: true, tracks_found: data.length })
    } else {
      res.type('application/json').status(500).json({ ok: false, error: `Supabase returned ${response.status}` })
    }
  } catch (error) {
    res.type('application/json').status(500).json({ ok: false, error: error.message })
  }
})

app.get('/api/stream-health', async (_req, res) => {
  try {
    // Test the stream-audio edge function
    const testUrl = 'https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/stream-audio?filePath=tangelo_jazz_relaxation_remix_2.mp3&bucket=neuralpositivemusic'
    const response = await fetch(testUrl, { method: 'HEAD' })
    
    res.type('application/json').status(200).json({ 
      ok: response.ok, 
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type'),
        'accept-ranges': response.headers.get('accept-ranges'),
        'content-length': response.headers.get('content-length')
      }
    })
  } catch (error) {
    res.type('application/json').status(500).json({ ok: false, error: error.message })
  }
})

// API routes with real endpoints
app.use('/api', apiRoutes)
app.use('/api/stream', streamRoutes)

// Catalog endpoints
app.get('/api/catalog/featured', async (req, res) => {
  try {
    console.log('🔥 API: Featured catalog requested');
    
    // Get featured tracks from Supabase
    const testUrl = 'https://pbtgvcjniayedqlajjzz.supabase.co/rest/v1/music_tracks?select=*&upload_status=eq.completed&limit=20'
    const response = await fetch(testUrl, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE'
      }
    })
    
    if (response.ok) {
      const tracks = await response.json()
      console.log('✅ API: Featured tracks fetched:', tracks.length)
      res.json({ items: tracks })
    } else {
      res.status(500).json({ error: `Failed to fetch featured: ${response.status}` })
    }
  } catch (error) {
    console.error('❌ API: Featured fetch failed:', error)
    res.status(500).json({ error: error.message })
  }
})

// Enhanced playlist by goal endpoint using therapeutic data
app.get('/api/playlist', async (req, res) => {
  try {
    const goal = String(req.query.goal || '')
    const genre = String(req.query.genre || 'all')
    console.log('🔥 API: Enhanced playlist requested for goal:', goal, 'genre:', genre)
    
    // Map goals to therapeutic conditions and audio features
    const goalToConditions = {
      'focus': {
        condition: 'focus',
        energyRange: [0.4, 0.7],
        valenceRange: [0.4, 0.8],
        minInstrumentalness: 0.7,
        maxSpeechiness: 0.1,
        preferredGenres: ['classical', 'instrumental', 'acoustic']
      },
      'relax': {
        condition: 'anxiety',
        energyRange: [0.1, 0.4],
        valenceRange: [0.6, 0.9],
        maxDanceability: 0.4,
        preferredGenres: ['jazz', 'classical', 'folk']
      },
      'sleep': {
        condition: 'insomnia', 
        energyRange: [0.0, 0.3],
        valenceRange: [0.3, 0.7],
        maxDanceability: 0.3,
        bpmRange: [40, 70],
        preferredGenres: ['classical', 'acoustic', 'instrumental']
      },
      'energy': {
        condition: 'depression',
        energyRange: [0.5, 1.0],
        valenceRange: [0.7, 1.0],
        minDanceability: 0.3,
        bpmRange: [80, 140],
        preferredGenres: ['jazz', 'electronic', 'indie']
      }
    }
    
    const criteria = goalToConditions[goal] || goalToConditions['focus']
    
    // First try using the therapeutic recommendations function
    try {
      const therapeuticUrl = `https://pbtgvcjniayedqlajjzz.supabase.co/rest/v1/rpc/get_therapeutic_recommendations`
      const therapeuticResponse = await fetch(therapeuticUrl, {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          target_condition: criteria.condition,
          min_evidence_score: 0.6
        })
      })
      
      if (therapeuticResponse.ok) {
        const therapeuticTracks = await therapeuticResponse.json()
        console.log('✅ API: Therapeutic recommendations:', therapeuticTracks.length)
        
        if (therapeuticTracks.length > 0) {
          // Get full track details for the recommended tracks
          const trackIds = therapeuticTracks.slice(0, 15).map(t => t.track_id)
          const detailsUrl = `https://pbtgvcjniayedqlajjzz.supabase.co/rest/v1/music_tracks?select=*&id=in.(${trackIds.join(',')})`
          
          const detailsResponse = await fetch(detailsUrl, {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE'
            }
          })
          
          if (detailsResponse.ok) {
            const tracks = await detailsResponse.json()
            console.log('✅ API: Enhanced therapeutic playlist generated:', tracks.length)
            return res.json({ tracks })
          }
        }
      }
    } catch (therapeuticError) {
      console.log('⚠️ API: Therapeutic function not available, falling back to feature-based filtering')
    }
    
    // Fallback to feature-based filtering
    let queryParams = ['select=*', 'upload_status=eq.completed']
    
    // Add genre filter if specified
    if (genre !== 'all' && criteria.preferredGenres.includes(genre)) {
      queryParams.push(`genre=eq.${genre}`)
    } else if (genre === 'all') {
      // Use preferred genres for this goal
      queryParams.push(`genre=in.(${criteria.preferredGenres.join(',')})`)
    }
    
    // Add audio feature filters
    if (criteria.energyRange) {
      queryParams.push(`energy=gte.${criteria.energyRange[0]}`)
      queryParams.push(`energy=lte.${criteria.energyRange[1]}`)
    }
    
    if (criteria.valenceRange) {
      queryParams.push(`valence=gte.${criteria.valenceRange[0]}`)
      queryParams.push(`valence=lte.${criteria.valenceRange[1]}`)
    }
    
    if (criteria.bpmRange) {
      queryParams.push(`bpm=gte.${criteria.bpmRange[0]}`)
      queryParams.push(`bpm=lte.${criteria.bpmRange[1]}`)
    }
    
    // Limit results
    queryParams.push('limit=20')
    
    const enhancedUrl = `https://pbtgvcjniayedqlajjzz.supabase.co/rest/v1/music_tracks?${queryParams.join('&')}`
    console.log('🔍 API: Enhanced query URL:', enhancedUrl)
    
    const response = await fetch(enhancedUrl, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE'
      }
    })
    
    if (response.ok) {
      const tracks = await response.json()
      console.log('✅ API: Enhanced playlist tracks fetched:', tracks.length, 'for goal:', goal)
      
      // Sort by therapeutic relevance
      const sortedTracks = tracks.sort((a, b) => {
        let scoreA = 0, scoreB = 0
        
        // Score based on how well audio features match the goal
        if (criteria.energyRange && a.energy && b.energy) {
          const energyMid = (criteria.energyRange[0] + criteria.energyRange[1]) / 2
          scoreA += 1 - Math.abs(a.energy - energyMid)
          scoreB += 1 - Math.abs(b.energy - energyMid)
        }
        
        if (criteria.valenceRange && a.valence && b.valence) {
          const valenceMid = (criteria.valenceRange[0] + criteria.valenceRange[1]) / 2
          scoreA += 1 - Math.abs(a.valence - valenceMid)
          scoreB += 1 - Math.abs(b.valence - valenceMid)
        }
        
        return scoreB - scoreA
      })
      
      res.json({ tracks: sortedTracks.slice(0, 15) })
    } else {
      res.status(500).json({ error: `Failed to fetch enhanced playlist: ${response.status}` })
    }
  } catch (error) {
    console.error('❌ API: Enhanced playlist fetch failed:', error)
    res.status(500).json({ error: error.message })
  }
})

// Session build endpoint
app.post('/api/session/build', async (req, res) => {
  try {
    const { goal, durationMin, intensity } = req.body
    console.log('🏗️ API: Building session:', { goal, durationMin, intensity })
    
    // Use the same playlist logic but adjust for session parameters
    const playlistResponse = await fetch(`http://localhost:${process.env.PORT || 5000}/api/playlist?goal=${encodeURIComponent(goal)}`)
    
    if (!playlistResponse.ok) {
      throw new Error('Failed to fetch playlist for session')
    }
    
    const { tracks } = await playlistResponse.json()
    
    if (!tracks.length) {
      return res.status(404).json({ error: `No suitable tracks found for ${goal}` })
    }
    
    // Filter and sort tracks based on intensity and duration
    let sessionTracks = tracks.slice()
    
    // Adjust track selection based on intensity (0-100)
    if (intensity > 70) {
      // High intensity - prefer energetic tracks
      sessionTracks = sessionTracks.filter(t => (t.energy || 0.5) > 0.6)
    } else if (intensity < 30) {
      // Low intensity - prefer calm tracks
      sessionTracks = sessionTracks.filter(t => (t.energy || 0.5) < 0.4)
    }
    
    // Calculate number of tracks needed based on duration
    const avgTrackDuration = 4 // minutes - estimate
    const targetTrackCount = Math.max(1, Math.ceil(durationMin / avgTrackDuration))
    
    // Generate session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    console.log('✅ API: Session built:', {
      sessionId,
      trackCount: Math.min(sessionTracks.length, targetTrackCount),
      originalTracks: tracks.length,
      filteredTracks: sessionTracks.length
    })
    
    res.json({
      sessionId,
      tracks: sessionTracks.slice(0, targetTrackCount)
    })
  } catch (error) {
    console.error('❌ API: Session build failed:', error)
    res.status(500).json({ error: error.message })
  }
})

// Session tracking endpoints
app.post('/api/sessions/start', async (req, res) => {
  try {
    const { trackId } = req.body
    console.log('🔥 API: Session start requested for track:', trackId)
    
    // Generate a session ID (in real app, save to DB)
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log('✅ API: Session started:', sessionId)
    
    res.json({ sessionId })
  } catch (error) {
    console.error('❌ API: Session start failed:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/sessions/progress', async (req, res) => {
  try {
    const { sessionId, t } = req.body
    console.log('🔥 API: Progress update:', sessionId, 'at', t, 'seconds')
    res.json({ ok: true })
  } catch (error) {
    console.error('❌ API: Progress update failed:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/sessions/complete', async (req, res) => {
  try {
    const { sessionId } = req.body
    console.log('🔥 API: Session completed:', sessionId)
    res.json({ ok: true })
  } catch (error) {
    console.error('❌ API: Session complete failed:', error)
    res.status(500).json({ error: error.message })
  }
})

// 3) STATIC FILES
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const clientDir = path.resolve(__dirname, '../dist') // adjust to your build output
app.use(express.static(clientDir, { maxAge: '1y', etag: true }))
app.use('/assets', express.static('dist/assets'))
app.use('/lovable-uploads', express.static('public/lovable-uploads'))

// 4) SPA FALLBACK (MUST be last; must NOT catch /api/*)
app.get(/^\/(?!api\/).*/, (_req, res) => {
  res.sendFile(path.join(clientDir, 'index.html'))
})

// 5) API 404 (after everything else, and only for /api)
app.use('/api', (_req, res) => res.status(404).json({ ok: false, error: 'NotFound' }))

// Error handling middleware (must be last)
app.use(errorLogger)

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NeuroTunes Elite server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔒 Security: Enabled`)
  console.log(`📝 Logging: Active`)
  console.log(`🎵 Health checks: /api/healthz, /api/readyz, /api/stream-health`)
})

export default app
import express from 'express'
import path from 'path'
import { securityMiddleware } from './middleware/security'
import { requestLogger, errorLogger, performanceLogger } from './middleware/logging'
import apiRoutes from './routes/api'
import streamRoutes from './routes/stream'

const app = express()
const PORT = process.env.PORT || 5000

// Apply security middleware first
app.use(securityMiddleware)

// Request parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging middleware
app.use(requestLogger)
app.use(performanceLogger(2000)) // Log requests slower than 2 seconds

// API routes first
app.use('/api', apiRoutes)
app.use('/api/stream', streamRoutes)

// Health check endpoints - make sure they come BEFORE static files
app.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    service: 'neurotunes-api', 
    time: new Date().toISOString(),
    version: '1.0.0'
  })
})

app.get('/health/supabase', async (req, res) => {
  try {
    // Test Supabase connection by trying to fetch a track
    const testUrl = 'https://pbtgvcjniayedqlajjzz.supabase.co/rest/v1/music_tracks?select=id,title&limit=1'
    const response = await fetch(testUrl, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      res.json({ ok: true, tracks_found: data.length })
    } else {
      res.status(500).json({ ok: false, error: `Supabase returned ${response.status}` })
    }
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

app.get('/health/streaming', async (req, res) => {
  try {
    // Test the stream-audio edge function
    const testUrl = 'https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/stream-audio?filePath=tangelo_jazz_relaxation_remix_2.mp3&bucket=neuralpositivemusic'
    const response = await fetch(testUrl, { method: 'HEAD' })
    
    res.json({ 
      ok: response.ok, 
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type'),
        'accept-ranges': response.headers.get('accept-ranges'),
        'content-length': response.headers.get('content-length')
      }
    })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist/client'))
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'))
  })
}

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

const server = app.listen(PORT, () => {
  console.log(`🚀 NeuroTunes Elite server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔒 Security: Enabled`)
  console.log(`📝 Logging: Active`)
  console.log(`🎵 Health checks: /health, /health/supabase, /health/streaming`)
})

export default app
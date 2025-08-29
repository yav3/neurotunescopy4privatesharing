import express from 'express'
import { validateQuery, validateBody, TrackQuerySchema, TherapeuticSessionSchema } from '../middleware/validation'
import { sessionLimiter } from '../middleware/security'
import { Logger } from '../middleware/logging'

const router = express.Router()

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  })
})

// Get tracks with validation
router.get('/tracks', validateQuery(TrackQuerySchema), async (req, res) => {
  try {
    const { band, condition, limit, offset, genre, minEnergy, maxEnergy } = req.query as any
    
    Logger.info('Tracks requested', {
      band,
      condition,
      limit,
      offset,
      userAgent: req.get('User-Agent')
    })

    // This would typically call your Supabase service
    // For now, returning a mock response
    const tracks = {
      data: [],
      pagination: {
        limit,
        offset,
        total: 0,
        hasMore: false
      },
      filters: {
        band,
        condition,
        genre,
        minEnergy,
        maxEnergy
      }
    }

    res.json(tracks)
  } catch (error) {
    Logger.error('Failed to fetch tracks', { error: error.message })
    res.status(500).json({ error: 'Failed to fetch tracks' })
  }
})

// Log therapeutic session with rate limiting
router.post('/therapeutic-sessions', 
  sessionLimiter,
  validateBody(TherapeuticSessionSchema),
  async (req, res) => {
    try {
      const sessionData = req.body
      
      Logger.info('Therapeutic session logged', {
        trackId: sessionData.trackId,
        duration: sessionData.duration,
        frequencyBand: sessionData.frequencyBand,
        userAgent: req.get('User-Agent')
      })

      // Here you would save to your database
      // const result = await SupabaseService.logTherapeuticSession(sessionData)

      res.json({
        success: true,
        sessionId: `session_${Date.now()}`,
        message: 'Therapeutic session logged successfully'
      })
    } catch (error) {
      Logger.error('Failed to log therapeutic session', { error: error.message })
      res.status(500).json({ error: 'Failed to log session' })
    }
  }
)

// Get therapeutic recommendations
router.get('/recommendations/:condition', async (req, res) => {
  try {
    const { condition } = req.params
    const minEvidenceScore = parseFloat(req.query.minEvidenceScore as string) || 0.7
    
    if (!condition || condition.length > 50) {
      return res.status(400).json({ error: 'Invalid condition parameter' })
    }

    Logger.info('Recommendations requested', {
      condition,
      minEvidenceScore,
      userAgent: req.get('User-Agent')
    })

    // Mock response - replace with actual Supabase call
    const recommendations = {
      condition,
      tracks: [],
      evidenceScore: minEvidenceScore,
      generatedAt: new Date().toISOString()
    }

    res.json(recommendations)
  } catch (error) {
    Logger.error('Failed to get recommendations', { error: error.message })
    res.status(500).json({ error: 'Failed to get recommendations' })
  }
})

// Get user analytics
router.get('/analytics/user', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] // Or however you identify users
    
    Logger.info('User analytics requested', {
      userId,
      userAgent: req.get('User-Agent')
    })

    // Mock analytics data
    const analytics = {
      totalSessions: 0,
      totalListeningTime: 0,
      favoriteFrequencyBands: [],
      moodImprovements: [],
      streak: 0,
      lastActive: new Date().toISOString()
    }

    res.json(analytics)
  } catch (error) {
    Logger.error('Failed to get user analytics', { error: error.message })
    res.status(500).json({ error: 'Failed to get analytics' })
  }
})

export default router
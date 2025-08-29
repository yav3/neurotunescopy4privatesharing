import express from 'express'
import { securityMiddleware } from './middleware/security'
import { requestLogger, errorLogger, performanceLogger } from './middleware/logging'
import apiRoutes from './routes/api'

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

// API routes
app.use('/api', apiRoutes)

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
})

export default app
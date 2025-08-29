import { z } from 'zod'
import type { Request, Response, NextFunction } from 'express'

// Enhanced validation schemas
export const TrackQuerySchema = z.object({
  band: z.enum(['delta', 'theta', 'alpha', 'beta', 'gamma', 'all']).optional(),
  condition: z.string().min(1).max(50).optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
  offset: z.coerce.number().min(0).default(0),
  genre: z.string().min(1).max(30).optional(),
  minEnergy: z.coerce.number().min(0).max(1).optional(),
  maxEnergy: z.coerce.number().min(0).max(1).optional()
})

export const TherapeuticSessionSchema = z.object({
  trackId: z.string().uuid('Invalid track ID format'),
  duration: z.number().min(1, 'Duration must be at least 1 second').max(7200, 'Duration cannot exceed 2 hours'),
  frequencyBand: z.enum(['delta', 'theta', 'alpha', 'beta', 'gamma']),
  mood: z.object({
    before: z.number().min(1).max(10).optional(),
    after: z.number().min(1).max(10).optional()
  }).optional(),
  metadata: z.object({
    userAgent: z.string().optional(),
    timestamp: z.string().datetime().optional(),
    sessionType: z.enum(['focus', 'relaxation', 'sleep', 'meditation', 'therapy']).optional()
  }).optional()
})

export const FileUploadSchema = z.object({
  filename: z.string()
    .min(1, 'Filename cannot be empty')
    .max(255, 'Filename too long')
    .regex(/^[^<>:"/\\|?*\x00-\x1f]+$/, 'Invalid filename characters'),
  size: z.number()
    .min(1, 'File cannot be empty')
    .max(50 * 1024 * 1024, 'File size cannot exceed 50MB'),
  mimetype: z.enum(['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/ogg', 'audio/mp4', 'audio/aac'])
})

// Validation middleware factory
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid query parameters',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            received: err.input
          }))
        })
      }
      return res.status(500).json({ error: 'Validation error' })
    }
  }
}

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid request body',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            received: err.input
          }))
        })
      }
      return res.status(500).json({ error: 'Validation error' })
    }
  }
}

// File validation middleware
export const validateFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  try {
    FileUploadSchema.parse({
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    })
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid file',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      })
    }
    return res.status(500).json({ error: 'File validation error' })
  }
}

// Sanitization utilities
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '').substring(0, 255)
}

export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 200)
}
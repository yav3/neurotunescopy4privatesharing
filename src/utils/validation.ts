import { z } from 'zod'

// Track query validation
export const TrackQuerySchema = z.object({
  band: z.enum(['delta', 'theta', 'alpha', 'beta', 'gamma', 'all']).optional(),
  condition: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
  offset: z.coerce.number().min(0).default(0)
})

// Search validation
export const SearchQuerySchema = z.object({
  query: z.string().min(1).max(100),
  filters: z.object({
    genre: z.string().optional(),
    minEnergy: z.number().min(0).max(1).optional(),
    maxEnergy: z.number().min(0).max(1).optional(),
    minValence: z.number().min(0).max(1).optional(),
    maxValence: z.number().min(0).max(1).optional()
  }).optional()
})

// Therapeutic session validation
export const TherapeuticSessionSchema = z.object({
  trackId: z.string().uuid(),
  duration: z.number().min(1).max(7200), // 2 hours max
  frequencyBand: z.enum(['delta', 'theta', 'alpha', 'beta', 'gamma']),
  mood: z.object({
    before: z.number().min(1).max(10).optional(),
    after: z.number().min(1).max(10).optional()
  }).optional()
})

// Upload validation
export const FileUploadSchema = z.object({
  filename: z.string().min(1).max(255),
  size: z.number().min(1).max(50 * 1024 * 1024), // 50MB max
  type: z.enum(['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/ogg'])
})

export type TrackQuery = z.infer<typeof TrackQuerySchema>
export type SearchQuery = z.infer<typeof SearchQuerySchema>
export type TherapeuticSession = z.infer<typeof TherapeuticSessionSchema>
export type FileUpload = z.infer<typeof FileUploadSchema>

// Validation helper function
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`)
    }
    throw error
  }
}
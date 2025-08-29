import { supabase } from '@/integrations/supabase/client'
import type { MusicTrack, FrequencyBand } from '@/types'
import { logger } from './logger'

export class SupabaseService {
  static async getTrackUrl(filePath: string, bucketName: string = 'neuralpositivemusic'): Promise<string> {
    try {
      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
      return data.publicUrl
    } catch (error) {
      logger.error('Failed to get track URL', { filePath, bucketName, error })
      throw error
    }
  }

  static async uploadTrack(file: File, path: string, bucketName: string = 'neuralpositivemusic') {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(path, file, { 
          upsert: false,
          contentType: file.type 
        })
      
      if (error) throw error
      
      logger.info('Track uploaded successfully', { path, fileSize: file.size })
      return data
    } catch (error) {
      logger.error('Failed to upload track', { path, error })
      throw error
    }
  }

  static async fetchTracks(options?: {
    bandFilter?: FrequencyBand | 'all'
    condition?: string
    limit?: number
    offset?: number
  }): Promise<MusicTrack[]> {
    try {
      let query = supabase
        .from('music_tracks')
        .select(`
          *,
          therapeutic_applications (*),
          spectral_analysis (*)
        `)
        .eq('upload_status', 'completed')
        .order('created_at', { ascending: false })

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
      }

      if (options?.bandFilter && options.bandFilter !== 'all') {
        query = query.eq('therapeutic_applications.frequency_band_primary', options.bandFilter)
      }

      if (options?.condition) {
        query = query.contains('therapeutic_applications.condition_targets', [options.condition])
      }

      const { data, error } = await query

      if (error) throw error

      logger.info('Tracks fetched successfully', { 
        count: data?.length || 0, 
        filters: options 
      })

      return (data || []) as MusicTrack[]
    } catch (error) {
      logger.error('Failed to fetch tracks', { options, error })
      throw error
    }
  }

  static async getMusicTracksByCategory(category: string): Promise<MusicTrack[]> {
    try {
      // Map category names to frequency bands or conditions
      const categoryMap: { [key: string]: any } = {
        'focus': { bandFilter: 'beta' as FrequencyBand },
        'mood-boost': { condition: 'depression' },
        'sleep': { bandFilter: 'delta' as FrequencyBand },
        'acoustic': { condition: 'anxiety' }
      }

      const filterOptions = categoryMap[category] || {}
      return await this.fetchTracks({ ...filterOptions, limit: 10 })
    } catch (error) {
      logger.error('Failed to fetch tracks by category', { category, error })
      return []
    }
  }

  static async trackTherapeuticSession(
    trackId: string, 
    duration: number, 
    frequencyBand: FrequencyBand
  ) {
    try {
      const { error } = await supabase
        .from('listening_sessions')
        .insert({
          patient_id: null, // For anonymous sessions
          session_duration_minutes: Math.floor(duration / 60),
          tracks_played: 1,
          dominant_genres: [frequencyBand],
          session_date: new Date().toISOString()
        })

      if (error) throw error

      logger.info('Therapeutic session tracked', { 
        trackId, 
        duration, 
        frequencyBand 
      })
    } catch (error) {
      logger.error('Failed to track therapeutic session', { trackId, error })
    }
  }
}
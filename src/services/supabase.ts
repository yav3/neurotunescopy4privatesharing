import { createClient } from '@supabase/supabase-js'
import type { MusicTrack, FrequencyBand } from '@/types'
import { logger } from './logger'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export class SupabaseService {
  static async getTrackUrl(filePath: string, bucketName: string = 'neurotunes-music'): Promise<string> {
    try {
      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
      return data.publicUrl
    } catch (error) {
      logger.error('Failed to get track URL', { filePath, bucketName, error })
      throw error
    }
  }

  static async uploadTrack(file: File, path: string, bucketName: string = 'neurotunes-music') {
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

      return data || []
    } catch (error) {
      logger.error('Failed to fetch tracks', { options, error })
      throw error
    }
  }

  static async getTherapeuticRecommendations(
    condition: string, 
    minEvidenceScore: number = 0.7
  ): Promise<MusicTrack[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_therapeutic_recommendations', {
          target_condition: condition,
          min_evidence_score: minEvidenceScore
        })

      if (error) throw error

      logger.info('Therapeutic recommendations fetched', { 
        condition, 
        count: data?.length || 0 
      })

      return data || []
    } catch (error) {
      logger.error('Failed to get therapeutic recommendations', { condition, error })
      throw error
    }
  }

  static async trackTherapeuticSession(
    trackId: string, 
    duration: number, 
    frequencyBand: FrequencyBand
  ) {
    try {
      const { error } = await supabase
        .from('therapeutic_sessions')
        .insert({
          track_id: trackId,
          duration_seconds: duration,
          frequency_band: frequencyBand,
          session_timestamp: new Date().toISOString()
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
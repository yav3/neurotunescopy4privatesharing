import { supabase } from '@/integrations/supabase/client'
import type { MusicTrack, FrequencyBand } from '@/types'
import { logger } from './logger'

export class SupabaseService {
  static async getTrackUrl(filePath: string, bucketName: string = 'neuralpositivemusic'): Promise<string> {
    try {
      logger.info('Getting track URL', { filePath, bucketName })
      
      // Use Supabase edge function for proper audio streaming
      const streamUrl = `https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/stream-audio?filePath=${encodeURIComponent(filePath)}&bucket=${bucketName}`
      
      logger.info('Using Supabase stream-audio edge function', { streamUrl })
      return streamUrl
      
    } catch (error) {
      logger.error('Failed to get track URL', { filePath, bucketName, error })
      
      // Fallback to the same edge function
      const streamUrl = `https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/stream-audio?filePath=${encodeURIComponent(filePath)}&bucket=${bucketName}`
      logger.info('Using Supabase stream-audio edge function as fallback', { streamUrl })
      return streamUrl
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

  static async fetchTracks(options: {
    genre?: string
    limit?: number
    offset?: number
  } = {}): Promise<MusicTrack[]> {
    try {
      let query = supabase
        .from('music_tracks')
        .select('*')
        .eq('upload_status', 'completed')
        .order('created_at', { ascending: false })

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
      }

      if (options?.genre) {
        query = query.eq('genre', options.genre)
      }

      const { data, error } = await query

      if (error) throw error

      // Transform data to match MusicTrack interface
      const tracks = (data || []).map(track => ({
        ...track,
        therapeutic_applications: [], // Empty array for now
        spectral_analysis: [] // Empty array for now
      })) as MusicTrack[]

      logger.info('Tracks fetched successfully', { 
        count: tracks.length, 
        filters: options 
      })

      return tracks
    } catch (error) {
      logger.error('Failed to fetch tracks', { options, error })
      throw error
    }
  }

  static async getTrackById(trackId: string): Promise<MusicTrack | null> {
    try {
      logger.info('Fetching track by ID', { trackId })
      
      const { data, error } = await supabase
        .from('music_tracks')
        .select('*')
        .eq('id', trackId)
        .eq('upload_status', 'completed')
        .maybeSingle()

      if (error) throw error

      if (!data) {
        logger.warn('Track not found', { trackId })
        return null
      }

      // Transform data to match MusicTrack interface
      const track = {
        ...data,
        therapeutic_applications: [], // Empty array for now
        spectral_analysis: [] // Empty array for now
      } as MusicTrack

      logger.info('Track fetched successfully', { trackId, title: track.title })
      return track
    } catch (error) {
      logger.error('Failed to fetch track by ID', { trackId, error })
      return null
    }
  }

  static async getMusicTracksByCategory(category: string): Promise<MusicTrack[]> {
    try {
      // Map category names to genres
      const categoryMap: { [key: string]: any } = {
        'focus': { genre: 'classical' },
        'mood-boost': { genre: 'jazz' }, 
        'sleep': { genre: 'classical' },
        'acoustic': { genre: 'jazz' }
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
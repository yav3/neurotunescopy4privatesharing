import { supabase } from '@/integrations/supabase/client'
import type { MusicTrack, FrequencyBand } from '@/types'
import { logger } from './logger'

export class SupabaseService {
  static async getTrackUrl(filePath: string, bucketName: string = 'neuralpositivemusic'): Promise<string> {
    try {
      // First check if the bucket exists and is accessible
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      if (bucketsError) {
        logger.error('Failed to list buckets', { error: bucketsError })
      } else {
        logger.info('Available buckets', { buckets: buckets.map(b => b.name) })
      }

      // Check if the file exists in the bucket
      const { data: files, error: listError } = await supabase.storage
        .from(bucketName)
        .list('', { limit: 100 })
      
      if (listError) {
        logger.error('Failed to list files in bucket', { bucketName, error: listError })
      } else {
        logger.info('Files in bucket', { 
          bucketName, 
          fileCount: files.length,
          files: files.slice(0, 5).map(f => f.name),
          targetFile: filePath
        })
        
        const fileExists = files.some(f => f.name === filePath)
        if (!fileExists) {
          logger.warn('Target file not found in bucket', { filePath, bucketName })
          
          // Return a demo audio file URL as fallback
          logger.info('Using demo audio file as fallback')
          return 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3'
        }
      }

      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
      
      logger.info('Generated public URL', { 
        filePath, 
        bucketName, 
        publicUrl: data.publicUrl 
      })
      
      return data.publicUrl
    } catch (error) {
      logger.error('Failed to get track URL', { filePath, bucketName, error })
      
      // Return demo audio file as fallback
      logger.info('Using demo audio file as emergency fallback')
      return 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3'
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
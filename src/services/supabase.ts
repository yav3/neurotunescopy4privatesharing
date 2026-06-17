import { supabase } from '@/integrations/supabase/client'
import type { Track, MusicTrack, FrequencyBand } from '@/types'
import { logger } from './logger'

export class SupabaseService {
  static async getTrackUrl(trackIdOrPath: string, bucketName: string = 'audio'): Promise<string> {
    try {
      logger.info('Getting track URL', { trackIdOrPath, bucketName })
      
      // Check if input is a valid UUID (track ID) or a file path/goal name
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trackIdOrPath);
      
      if (isUUID) {
        // Valid track ID - use stream function directly
        const { buildStreamUrl } = await import('@/lib/stream')
        const streamUrl = buildStreamUrl(trackIdOrPath)
        logger.info('Generated stream URL for track ID', { trackId: trackIdOrPath })
        return streamUrl
      } else {
        // File path or goal name - need to resolve to track ID first
        logger.warn('Non-UUID passed to getTrackUrl, attempting to resolve', { trackIdOrPath })
        
        // Try to find track by file_path or storage_key
        const { data: track } = await supabase
          .from('tracks')
          .select('id')
          .or(`file_path.eq.${trackIdOrPath},storage_key.eq.${trackIdOrPath}`)
          .eq('storage_bucket', 'audio')
          .not('camelot', 'is', null)
          .eq('audio_status', 'working')
          .maybeSingle()
        
        if (track) {
          const { buildStreamUrl } = await import('@/lib/stream')
          const streamUrl = buildStreamUrl(track.id)
          logger.info('Resolved file path to track ID', { originalPath: trackIdOrPath, trackId: track.id })
          return streamUrl
        } else {
          throw new Error(`Could not resolve "${trackIdOrPath}" to a valid track ID`)
        }
      }
      
    } catch (error) {
      logger.error('Failed to get track URL', { trackIdOrPath, bucketName, error })
      throw error
    }
  }

  static async uploadTrack(file: File, path: string, bucketName: string = 'audio') {
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
    buckets?: string[]
  } = {}): Promise<any[]> {
    try {
    let query = supabase
      .from('tracks')
      .select('*')
      .not('camelot', 'is', null)
      .eq('audio_status', 'working')
      .order('created_at', { ascending: false })

      // Support multiple buckets or default to 'audio'
      const targetBuckets = options?.buckets || ['audio'];
      if (targetBuckets.length === 1) {
        query = query.eq('storage_bucket', targetBuckets[0]);
      } else {
        query = query.in('storage_bucket', targetBuckets);
      }

      query = query.limit(options?.limit ?? 200)

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
      }

      if (options?.genre) {
        query = query.eq('genre', options.genre)
      }

      const { data, error } = await query

      if (error) throw error

      const tracks = (data || []).map(track => ({
        ...track,
        therapeutic_applications: [],
        spectral_analysis: []
      })) as any[]

      logger.info('Tracks fetched successfully', { count: tracks.length, filters: options })

      return tracks
    } catch (error) {
      logger.error('Failed to fetch tracks', { options, error })
      throw error
    }
  }

  static async getTrackById(trackId: string): Promise<any | null> {
    try {
      logger.info('Fetching track by ID', { trackId })
      
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('id', trackId)
        .eq('storage_bucket', 'audio')
        .not('camelot', 'is', null)
        .eq('audio_status', 'working')
        .maybeSingle()

      if (error) throw error

      if (!data) {
        logger.warn('Track not found', { trackId })
        return null
      }

      const track = {
        ...data,
        therapeutic_applications: [],
        spectral_analysis: []
      } as any

      logger.info('Track fetched successfully', { trackId, title: track.title })
      return track
    } catch (error) {
      logger.error('Failed to fetch track by ID', { trackId, error })
      return null
    }
  }

  static async getMusicTracksByCategory(category: string): Promise<any[]> {
    try {
      const categoryMap: { [key: string]: any } = {
        'focus': { genre: 'classical' },
        'mood boost': { genre: 'jazz' }, 
        'sleep': { genre: 'classical' },
        'acoustic': { genre: 'jazz' }
      }

      let fetchOptions = { ...categoryMap[category] || {}, limit: 10 };
      
      try {
        const { getBucketsForGoal } = await import('@/config/therapeuticGoals');
        const buckets = getBucketsForGoal(category);
        if (buckets && buckets.length > 0) {
          fetchOptions = { ...fetchOptions, buckets } as any;
        }
      } catch (error) {
        // use default bucket
      }
      
      let tracks = await this.fetchTracks(fetchOptions)
      
      if (tracks.length === 0) {
        tracks = await this.fetchTracks({ limit: 10 })
      }
      
      return tracks
    } catch (error) {
      logger.error('Failed to fetch tracks by category', { category, error })
      return []
    }
  }

  static async trackTherapeuticSession(
    trackId: string, 
    duration: number, 
    frequencyBand: FrequencyBand,
    userId?: string,
    sessionData?: {
      tracksPlayed: any[];
      skipCount: number;
      dominantGenres: string[];
      totalDuration: number;
    }
  ) {
    try {
      let currentUserId = userId;
      if (!currentUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        currentUserId = user?.id || null;
      }

      if (!currentUserId) {
        console.warn('No user ID available for session tracking');
        return;
      }

      const sessionDurationMinutes = Math.floor(duration / 60);
      const skipRate = sessionData ? (sessionData.tracksPlayed.length > 0 ? sessionData.skipCount / sessionData.tracksPlayed.length : 0) : 0;

      const { data: patientId, error: patientError } = await supabase
        .rpc('get_or_create_patient_for_user', { user_id: currentUserId });
      
      if (patientError) {
        logger.error('Error getting/creating patient record', { error: patientError });
        const { error } = await supabase
          .from('listening_sessions')
          .insert({
            user_id: currentUserId,
            patient_id: null,
            session_date: new Date().toISOString(),
            session_duration_minutes: sessionDurationMinutes,
            tracks_played: sessionData?.tracksPlayed?.length || 1,
            skip_rate: skipRate,
            dominant_genres: sessionData?.dominantGenres || [frequencyBand],
            mood_progression: null,
            average_complexity_score: null
          });
        if (error) throw error;
        return;
      }

      const { error } = await supabase
        .from('listening_sessions')
        .insert({
          user_id: currentUserId,
          patient_id: patientId,
          session_date: new Date().toISOString(),
          session_duration_minutes: sessionDurationMinutes,
          tracks_played: sessionData?.tracksPlayed?.length || 1,
          skip_rate: skipRate,
          dominant_genres: sessionData?.dominantGenres || [frequencyBand],
          mood_progression: null,
          average_complexity_score: null
        });

      if (error) throw error;

      logger.info('Therapeutic session tracked', { 
        trackId, 
        duration, 
        frequencyBand,
        patientId,
        tracksPlayed: sessionData?.tracksPlayed?.length || 1,
        skipRate: Math.round(skipRate * 100)
      });
    } catch (error) {
      logger.error('Failed to track therapeutic session', { trackId, error });
    }
  }
}

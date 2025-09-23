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
        logger.info('Generated stream URL for track ID', { streamUrl, trackIdOrPath })
        return streamUrl
      } else {
        // File path or goal name - need to resolve to track ID first
        logger.warn('⚠️ Non-UUID passed to getTrackUrl, attempting to resolve', { trackIdOrPath })
        
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
          logger.info('Resolved file path to track ID and generated stream URL', { 
            originalPath: trackIdOrPath, 
            trackId: track.id,
            streamUrl 
          })
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
  } = {}): Promise<any[]> {
    try {
    let query = supabase
      .from('tracks')
      .select('*')
      .eq('storage_bucket', 'audio')
      .not('camelot', 'is', null)
      .eq('audio_status', 'working')
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

      // Transform data to match Track interface
      const tracks = (data || []).map(track => ({
        ...track,
        therapeutic_applications: [], // Empty array for now
        spectral_analysis: [] // Empty array for now
      })) as any[]

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

      // Transform data to match Track interface
      const track = {
        ...data,
        therapeutic_applications: [], // Empty array for now
        spectral_analysis: [] // Empty array for now
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
      console.log('Fetching tracks for category:', category);
      
      // If no specific genre mapping found, return some tracks anyway for testing
      let filterOptions = {};
      
      // Map category names to genres - updated to match actual database genres
      const categoryMap: { [key: string]: any } = {
        'focus': { genre: 'classical' },
        'mood boost': { genre: 'jazz' }, 
        'sleep': { genre: 'classical' },
        'acoustic': { genre: 'jazz' }
      }

      filterOptions = categoryMap[category] || {}
      console.log('Using filter options:', filterOptions);
      
      let tracks = await this.fetchTracks({ ...filterOptions, limit: 10 })
      
      // If no tracks found with specific genre, get any tracks for testing
      if (tracks.length === 0) {
        console.log('No tracks found for specific genre, fetching any available tracks');
        tracks = await this.fetchTracks({ limit: 10 })
      }
      
      console.log('Retrieved tracks:', tracks);
      
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
      // Get current user if not provided
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

      // Get or create patient record for this user
      const { data: patientId, error: patientError } = await supabase
        .rpc('get_or_create_patient_for_user', { user_id: currentUserId });
      
      if (patientError) {
        console.error('Error getting/creating patient record:', patientError);
        // Fallback: store with user_id only
        const insertData = {
          user_id: currentUserId,
          patient_id: null,
          session_date: new Date().toISOString(),
          session_duration_minutes: sessionDurationMinutes,
          tracks_played: sessionData?.tracksPlayed?.length || 1,
          skip_rate: skipRate,
          dominant_genres: sessionData?.dominantGenres || [frequencyBand],
          mood_progression: null,
          average_complexity_score: null
        };

        const { error } = await supabase
          .from('listening_sessions')
          .insert(insertData);

        if (error) throw error;
        return;
      }

      // Store with both patient_id and user_id for compatibility
      const insertData = {
        user_id: currentUserId,
        patient_id: patientId,
        session_date: new Date().toISOString(),
        session_duration_minutes: sessionDurationMinutes,
        tracks_played: sessionData?.tracksPlayed?.length || 1,
        skip_rate: skipRate,
        dominant_genres: sessionData?.dominantGenres || [frequencyBand],
        mood_progression: null,
        average_complexity_score: null
      };

      const { error } = await supabase
        .from('listening_sessions')
        .insert(insertData);

      if (error) throw error;

      logger.info('Therapeutic session tracked', { 
        trackId, 
        duration, 
        frequencyBand,
        patientId,
        tracksPlayed: insertData.tracks_played,
        skipRate: Math.round(skipRate * 100)
      });
    } catch (error) {
      logger.error('Failed to track therapeutic session', { trackId, error });
    }
  }
}
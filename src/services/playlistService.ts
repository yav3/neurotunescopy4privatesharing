import { supabase } from '@/integrations/supabase/client'
import { logger } from './logger'
import type { Track, MusicTrack, FrequencyBand } from '@/types'

export interface Playlist {
  id: string
  title: string
  description?: string | null
  created_at: string | null
  track_count: number | null
  category?: string
  artwork_url?: string | null
  artwork_semantic_label?: string | null
  bucket_name?: string
  is_pre_configured?: boolean | null
  therapeutic_tags?: string[] | null
  therapeutic_benefits?: string[] | null
  usage_recommendations?: string[] | null
  research_info?: any
  total_duration_minutes?: number | null
  updated_at?: string | null
}

export interface PlaylistTrack {
  id: string
  playlist_id: string
  track_id: string
  position: number
  created_at: string | null
  track?: MusicTrack
}

export interface TherapeuticPlaylist extends Playlist {
  frequency_band: FrequencyBand
  target_condition: string
  evidence_threshold: number
}

export class PlaylistService {
  /**
   * Create a new playlist
   */
  static async createPlaylist(title: string, description?: string, category: string = 'relaxation', bucket_name: string = 'playlists'): Promise<Playlist> {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .insert([{
          title,
          description,
          track_count: 0,
          category: category as any,
          bucket_name
        }])
        .select()
        .single()

      if (error) throw error

      logger.info('Playlist created successfully', { playlistId: data.id, title })
      return data
    } catch (error) {
      logger.error('Failed to create playlist', { title, error })
      throw error
    }
  }

  /**
   * Get all playlists
   */
  static async getPlaylists(): Promise<Playlist[]> {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      logger.info('Playlists fetched successfully', { count: data?.length || 0 })
      return data || []
    } catch (error) {
      logger.error('Failed to fetch playlists', { error })
      throw error
    }
  }

  /**
   * Get playlist with tracks
   */
  static async getPlaylistWithTracks(playlistId: string): Promise<{
    playlist: Playlist
    tracks: any[]
  }> {
    try {
      // Get playlist info
      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .select('*')
        .eq('id', playlistId)
        .single()

      if (playlistError) throw playlistError

      // Get playlist tracks with full track data
      const { data: playlistTracks, error: tracksError } = await supabase
        .from('playlist_tracks')
        .select(`
          *,
          tracks (*)
        `)
        .eq('playlist_id', playlistId)
        .order('position')

      if (tracksError) throw tracksError

      const tracks = (playlistTracks || [])
        .filter(pt => pt.tracks && typeof pt.tracks === 'object')
        .map(pt => ({
          ...(pt.tracks as any),
          therapeutic_applications: [],
          spectral_analysis: []
        })) as any[]

      logger.info('Playlist with tracks fetched', { 
        playlistId, 
        trackCount: tracks.length 
      })

      return { playlist, tracks }
    } catch (error) {
      logger.error('Failed to fetch playlist with tracks', { playlistId, error })
      throw error
    }
  }

  /**
   * Add track to playlist
   */
  static async addTrackToPlaylist(playlistId: string, trackId: string): Promise<void> {
    try {
      // Get current max position
      const { data: maxPosition } = await supabase
        .from('playlist_tracks')
        .select('position')
        .eq('playlist_id', playlistId)
        .order('position', { ascending: false })
        .limit(1)

      const nextPosition = (maxPosition?.[0]?.position || 0) + 1

      // Add track to playlist
      const { error: insertError } = await supabase
        .from('playlist_tracks')
        .insert({
          playlist_id: playlistId,
          track_id: trackId,
          position: nextPosition
        })

      if (insertError) throw insertError

      // Update track count
      const { error: updateError } = await supabase
        .from('playlists')
        .update({ 
          track_count: nextPosition
        })
        .eq('id', playlistId)

      if (updateError) throw updateError

      logger.info('Track added to playlist', { playlistId, trackId, position: nextPosition })
    } catch (error) {
      logger.error('Failed to add track to playlist', { playlistId, trackId, error })
      throw error
    }
  }

  /**
   * Remove track from playlist
   */
  static async removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<void> {
    try {
      const { error: deleteError } = await supabase
        .from('playlist_tracks')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('track_id', trackId)

      if (deleteError) throw deleteError

      // Get updated track count
      const { data: trackCount } = await supabase
        .from('playlist_tracks')
        .select('id', { count: 'exact' })
        .eq('playlist_id', playlistId)

      // Update track count
      const { error: updateError } = await supabase
        .from('playlists')
        .update({ 
          track_count: trackCount?.length || 0
        })
        .eq('id', playlistId)

      if (updateError) throw updateError

      logger.info('Track removed from playlist', { playlistId, trackId })
    } catch (error) {
      logger.error('Failed to remove track from playlist', { playlistId, trackId, error })
      throw error
    }
  }

  /**
   * Create therapeutic playlist based on conditions
   */
  static async createTherapeuticPlaylist(
    title: string,
    frequencyBand: FrequencyBand,
    targetCondition: string,
    evidenceThreshold: number = 0.7
  ): Promise<{ playlist: Playlist; tracks: any[] }> {
    try {
      // Create the playlist
      const playlist = await this.createPlaylist(
        title, 
        `Therapeutic playlist for ${targetCondition} using ${frequencyBand} frequency`,
        'meditation'
      )

      // Get tracks that match criteria
      const { data: tracks, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('storage_bucket', 'audio')
        .not('camelot', 'is', null)
        .eq('audio_status', 'working')
        .limit(20)

      if (error) throw error

      // Add tracks to playlist
      if (tracks && tracks.length > 0) {
        const trackPromises = tracks.slice(0, 10).map((track, index) => 
          supabase
            .from('playlist_tracks')
            .insert({
              playlist_id: playlist.id,
              track_id: track.id,
              position: index + 1
            })
        )

        await Promise.all(trackPromises)

        // Update track count
        await supabase
          .from('playlists')
          .update({ track_count: tracks.slice(0, 10).length })
          .eq('id', playlist.id)
      }

      const processedTracks = (tracks || []).slice(0, 10).map(track => ({
        ...track,
        therapeutic_applications: [],
        spectral_analysis: []
      })) as any[]

      logger.info('Therapeutic playlist created', { 
        playlistId: playlist.id, 
        frequencyBand, 
        targetCondition,
        trackCount: processedTracks.length
      })

      return { playlist, tracks: processedTracks }
    } catch (error) {
      logger.error('Failed to create therapeutic playlist', { 
        frequencyBand, 
        targetCondition, 
        error 
      })
      throw error
    }
  }

  /**
   * Delete playlist
   */
  static async deletePlaylist(playlistId: string): Promise<void> {
    try {
      // Delete playlist tracks first (cascade should handle this, but being explicit)
      await supabase
        .from('playlist_tracks')
        .delete()
        .eq('playlist_id', playlistId)

      // Delete playlist
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', playlistId)

      if (error) throw error

      logger.info('Playlist deleted successfully', { playlistId })
    } catch (error) {
      logger.error('Failed to delete playlist', { playlistId, error })
      throw error
    }
  }

  /**
   * Reorder tracks in playlist
   */
  static async reorderPlaylistTracks(
    playlistId: string, 
    trackId: string, 
    newPosition: number
  ): Promise<void> {
    try {
      // Update the specific track's position
      const { error } = await supabase
        .from('playlist_tracks')
        .update({ position: newPosition })
        .eq('playlist_id', playlistId)
        .eq('track_id', trackId)

      if (error) throw error

      logger.info('Playlist track reordered', { playlistId, trackId, newPosition })
    } catch (error) {
      logger.error('Failed to reorder playlist track', { 
        playlistId, 
        trackId, 
        newPosition, 
        error 
      })
      throw error
    }
  }
}
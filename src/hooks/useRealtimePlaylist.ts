import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { logger } from '@/services/logger'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimePlaylistProps {
  playlistId?: number | null
  onPlaylistUpdate?: (payload: any) => void
  onTrackAdded?: (payload: any) => void
  onTrackRemoved?: (payload: any) => void
}

/**
 * Hook for real-time playlist updates
 * Listens for changes to playlist data and tracks
 */
export const useRealtimePlaylist = ({
  playlistId,
  onPlaylistUpdate,
  onTrackAdded,
  onTrackRemoved
}: UseRealtimePlaylistProps) => {
  const queryClient = useQueryClient()
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!playlistId) return

    // Create channel for real-time updates
    const channel = supabase
      .channel(`playlist-${playlistId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'playlists',
          filter: `id=eq.${playlistId}`
        },
        (payload) => {
          logger.info('Playlist updated via realtime', { playlistId, payload })
          
          // Invalidate playlist queries
          queryClient.invalidateQueries({ queryKey: ['playlists'] })
          queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] })
          
          onPlaylistUpdate?.(payload)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'playlist_tracks',
          filter: `playlist_id=eq.${playlistId}`
        },
        (payload) => {
          logger.info('Track added to playlist via realtime', { playlistId, payload })
          
          // Invalidate playlist tracks queries
          queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] })
          
          onTrackAdded?.(payload)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'playlist_tracks',
          filter: `playlist_id=eq.${playlistId}`
        },
        (payload) => {
          logger.info('Track removed from playlist via realtime', { playlistId, payload })
          
          // Invalidate playlist tracks queries
          queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] })
          
          onTrackRemoved?.(payload)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'playlist_tracks',
          filter: `playlist_id=eq.${playlistId}`
        },
        (payload) => {
          logger.info('Track position updated via realtime', { playlistId, payload })
          
          // Invalidate playlist tracks queries for reordering
          queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] })
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info('Subscribed to playlist realtime updates', { playlistId })
        } else if (status === 'CLOSED') {
          logger.info('Unsubscribed from playlist realtime updates', { playlistId })
        } else if (status === 'CHANNEL_ERROR') {
          logger.error('Error in playlist realtime subscription', { playlistId, status })
        }
      })

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [playlistId, queryClient, onPlaylistUpdate, onTrackAdded, onTrackRemoved])

  return {
    isConnected: channelRef.current?.state === 'joined'
  }
}

export default useRealtimePlaylist
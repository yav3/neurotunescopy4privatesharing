import React, { useState } from 'react'
import { Plus, Play, Trash2, Music, Clock, MoreVertical } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PlaylistService, type Playlist } from '@/services/playlistService'
import { useAudioStore } from '@/stores/audioStore'
import { LoadingSpinner } from './LoadingSpinner'
import { logger } from '@/services/logger'

interface SimplePlaylistManagerProps {
  userId?: string
  className?: string
}

export const SimplePlaylistManager: React.FC<SimplePlaylistManagerProps> = ({ userId, className }) => {
  const [isCreating, setIsCreating] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('')
  const queryClient = useQueryClient()
  const { playTrack } = useAudioStore()

  // Fetch playlists
  const { 
    data: playlists = [], 
    isLoading: playlistsLoading,
    error: playlistsError 
  } = useQuery({
    queryKey: ['playlists', userId],
    queryFn: () => PlaylistService.getPlaylists(),
    enabled: !!userId,
  })

  // Create playlist mutation
  const createPlaylistMutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      PlaylistService.createPlaylist(data.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists', userId] })
      setIsCreating(false)
      setNewPlaylistName('')
      setNewPlaylistDescription('')
      logger.info('Playlist created successfully')
    },
    onError: (error) => {
      logger.error('Failed to create playlist:', error)
    },
  })

  // Delete playlist mutation
  const deletePlaylistMutation = useMutation({
    mutationFn: PlaylistService.deletePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists', userId] })
      logger.info('Playlist deleted successfully')
    },
    onError: (error) => {
      logger.error('Failed to delete playlist:', error)
    },
  })

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return
    
    createPlaylistMutation.mutate({
      name: newPlaylistName.trim(),
      description: newPlaylistDescription.trim() || undefined,
    })
  }

  const handlePlayPlaylist = async (playlist: Playlist) => {
    try {
      const fullPlaylist = await PlaylistService.getPlaylistWithTracks(playlist.id)
      const tracks = fullPlaylist.tracks || []
      if (tracks.length > 0) {
        // For simplicity, just play the first track
        await playTrack(tracks[0])
        logger.info(`Playing playlist: ${playlist.name}`)
      }
    } catch (error) {
      logger.error('Failed to play playlist:', error)
    }
  }

  if (playlistsLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <LoadingSpinner />
      </div>
    )
  }

  if (playlistsError) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <p className="text-destructive">Failed to load playlists</p>
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['playlists', userId] })}
          className="mt-2 text-sm text-muted-foreground hover:text-foreground underline"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Playlists</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          Create Playlist
        </button>
      </div>

      {/* Create new playlist form */}
      {isCreating && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold">Create New Playlist</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            />
            <textarea
              placeholder="Description (optional)"
              value={newPlaylistDescription}
              onChange={(e) => setNewPlaylistDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-background resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistName.trim() || createPlaylistMutation.isPending}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createPlaylistMutation.isPending ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => {
                  setIsCreating(false)
                  setNewPlaylistName('')
                  setNewPlaylistDescription('')
                }}
                className="px-4 py-2 border border-border rounded-md hover:bg-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Playlists grid */}
      {playlists.length === 0 ? (
        <div className="text-center py-12">
          <Music size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-2">No playlists yet</p>
          <p className="text-sm text-muted-foreground">Create your first playlist to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{playlist.name}</h3>
                  {playlist.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {playlist.description}
                    </p>
                  )}
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Music size={12} />
                <span>0 tracks</span>
                <Clock size={12} />
                <span>0 min</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handlePlayPlaylist(playlist)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
                >
                  <Play size={12} />
                  Play
                </button>
                <button
                  onClick={() => deletePlaylistMutation.mutate(playlist.id)}
                  disabled={deletePlaylistMutation.isPending}
                  className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-md hover:bg-secondary text-sm"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SimplePlaylistManager
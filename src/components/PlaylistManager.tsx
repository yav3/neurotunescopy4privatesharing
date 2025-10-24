import React, { useState, useEffect } from 'react'
import { Plus, Play, Trash2, Music, Clock, MoreVertical } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PlaylistService, type Playlist } from '@/services/playlistService'
import { useAudioStore } from '@/stores'
import { LoadingSpinner } from './LoadingSpinner'
import { logger } from '@/services/logger'

interface PlaylistManagerProps {
  onSelectPlaylist?: (playlist: Playlist) => void
}

export const PlaylistManager: React.FC<PlaylistManagerProps> = ({ onSelectPlaylist }) => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('')
  const queryClient = useQueryClient()
  const { playTrack } = useAudioStore()

  // Fetch playlists
  const { 
    data: playlists = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['playlists'],
    queryFn: PlaylistService.getPlaylists,
    staleTime: 5 * 60 * 1000
  })

  // Create playlist mutation
  const createPlaylistMutation = useMutation({
    mutationFn: ({ name, description }: { name: string; description?: string }) =>
      PlaylistService.createPlaylist(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] })
      setNewPlaylistName('')
      setNewPlaylistDescription('')
      setShowCreateForm(false)
      logger.info('Playlist created successfully')
    },
    onError: (error) => {
      logger.error('Failed to create playlist', { error })
    }
  })

  // Delete playlist mutation
  const deletePlaylistMutation = useMutation({
    mutationFn: PlaylistService.deletePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] })
      logger.info('Playlist deleted successfully')
    },
    onError: (error) => {
      logger.error('Failed to delete playlist', { error })
    }
  })

  // Load playlist tracks mutation
  const loadPlaylistMutation = useMutation({
    mutationFn: PlaylistService.getPlaylistWithTracks,
    onSuccess: ({ playlist, tracks }) => {
      // TODO: Implement setPlaylist functionality with audio core
      onSelectPlaylist?.(playlist)
      logger.info('Playlist loaded', { playlistId: playlist.id, trackCount: tracks.length })
    },
    onError: (error) => {
      logger.error('Failed to load playlist', { error })
    }
  })

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPlaylistName.trim()) return
    
    createPlaylistMutation.mutate({
      name: newPlaylistName.trim(),
      description: newPlaylistDescription.trim() || undefined
    })
  }

  const handlePlayPlaylist = (playlist: Playlist) => {
    loadPlaylistMutation.mutate(playlist.id)
  }

  const handleDeletePlaylist = (playlist: Playlist) => {
    if (window.confirm(`Are you sure you want to delete "${playlist.title}"? This cannot be undone.`)) {
      deletePlaylistMutation.mutate(playlist.id)
    }
  }

  if (error) {
    return (
      <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-xl">
        <h3 className="text-destructive font-medium mb-2">Failed to load playlists</h3>
        <p className="text-destructive/80 text-sm">
          {error instanceof Error ? error.message : 'Something went wrong'}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-card rounded-xl p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Music size={24} className="text-primary" />
          Your Playlists
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
        >
          <Plus size={18} />
          Create Playlist
        </button>
      </div>

      {/* Create Playlist Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-secondary rounded-lg border border-border">
          <form onSubmit={handleCreatePlaylist}>
            <div className="space-y-4">
              <div>
                <label htmlFor="playlist-name" className="block text-sm font-medium text-muted-foreground mb-2">
                  Playlist Name *
                </label>
                <input
                  id="playlist-name"
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Enter playlist name..."
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label htmlFor="playlist-description" className="block text-sm font-medium text-muted-foreground mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="playlist-description"
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  placeholder="Describe your playlist..."
                  rows={3}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={createPlaylistMutation.isPending || !newPlaylistName.trim()}
                  className="px-4 py-2 bg-music-mood hover:bg-music-mood/90 disabled:bg-muted disabled:cursor-not-allowed text-foreground rounded-lg transition-colors"
                >
                  {createPlaylistMutation.isPending ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewPlaylistName('')
                    setNewPlaylistDescription('')
                  }}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Playlists List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner text="Loading playlists..." />
        </div>
      ) : playlists.length === 0 ? (
        <div className="text-center py-12">
          <Music size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No playlists yet</h3>
          <p className="text-muted-foreground mb-4">Create your first therapeutic music playlist</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-colors"
          >
            Create Your First Playlist
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="flex items-center justify-between p-4 bg-card hover:bg-card/80 border border-border rounded-lg transition-colors group shadow-card"
            >
              <div className="flex-1">
                <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                  {playlist.title}
                </h3>
                {playlist.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {playlist.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Music size={12} />
                    {playlist.track_count} tracks
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {playlist.created_at ? new Date(playlist.created_at).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayPlaylist(playlist)}
                  disabled={loadPlaylistMutation.isPending}
                  className="p-2 bg-music-mood hover:bg-music-mood/90 disabled:bg-muted disabled:cursor-not-allowed text-foreground rounded-full transition-colors"
                  title="Play playlist"
                >
                  {loadPlaylistMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Play size={16} />
                  )}
                </button>
                
                <div className="relative group/menu">
                  <button className="p-2 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-full transition-colors">
                    <MoreVertical size={16} />
                  </button>
                  
                  <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-10">
                    <button
                      onClick={() => onSelectPlaylist?.(playlist)}
                      className="w-full px-4 py-2 text-left text-popover-foreground hover:bg-secondary rounded-t-lg transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeletePlaylist(playlist)}
                      disabled={deletePlaylistMutation.isPending}
                      className="w-full px-4 py-2 text-left text-destructive hover:bg-secondary rounded-b-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      Delete Playlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PlaylistManager
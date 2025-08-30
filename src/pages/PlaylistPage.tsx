import React, { useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import PlaylistManager from '@/components/PlaylistManager'
import EnhancedMusicPlayer from '@/components/EnhancedMusicPlayer'
import { TrackCard } from '@/components/TrackCard'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { PlaylistService, type Playlist } from '@/services/playlistService'
import useRealtimePlaylist from '@/hooks/useRealtimePlaylist'
import { useAudio } from "@/context";

export const PlaylistPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { setPlaylist } = useAudio()
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)

  const playlistId = id ? parseInt(id) : null

  // Fetch playlist details if ID is provided
  const { 
    data: playlistData, 
    isLoading: isLoadingPlaylist,
    error: playlistError 
  } = useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => playlistId ? PlaylistService.getPlaylistWithTracks(playlistId) : null,
    enabled: !!playlistId,
    staleTime: 2 * 60 * 1000 // 2 minutes
  })

  // Real-time playlist updates
  useRealtimePlaylist({
    playlistId,
    onPlaylistUpdate: () => {
      // Queries will be automatically invalidated by the hook
    },
    onTrackAdded: () => {
      // Show notification or update UI
      console.log('Track added to playlist!')
    },
    onTrackRemoved: () => {
      // Show notification or update UI
      console.log('Track removed from playlist!')
    }
  })

  const handleSelectPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
    navigate(`/playlists/${playlist.id}`)
  }

  const handleLoadPlaylist = () => {
    if (playlistData) {
      setPlaylist(playlistData.tracks, playlistData.playlist.id.toString())
    }
  }

  // If we have a playlist ID but no data yet
  if (playlistId && isLoadingPlaylist) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="bg-card p-6 border-b border-border">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Loading Playlist...</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto p-6">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading playlist details..." />
          </div>
        </main>
      </div>
    )
  }

  // If there was an error loading the playlist
  if (playlistId && playlistError) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="bg-card p-6 border-b border-border">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Playlist Error</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-4">Failed to Load Playlist</h2>
            <p className="text-gray-400 mb-6">
              {playlistError instanceof Error ? playlistError.message : 'Something went wrong'}
            </p>
            <button
              onClick={() => navigate('/playlists')}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-colors"
            >
              Back to Playlists
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card p-6 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">
              {playlistData?.playlist?.name || 'Playlists'}
            </h1>
          </div>

          {playlistData && (
            <button
              onClick={handleLoadPlaylist}
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors"
            >
              <Plus size={18} />
              Load in Player
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Playlist Manager */}
          <div className="lg:col-span-2">
            {!playlistId ? (
              <PlaylistManager onSelectPlaylist={handleSelectPlaylist} />
            ) : playlistData ? (
              <div>
                {/* Playlist Header */}
                <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
                  <h2 className="text-2xl font-bold mb-2">{playlistData.playlist.name}</h2>
                  {playlistData.playlist.description && (
                    <p className="text-gray-400 mb-4">{playlistData.playlist.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{playlistData.tracks.length} tracks</span>
                    <span>Created {new Date(playlistData.playlist.created_date).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Playlist Tracks */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tracks</h3>
                  {playlistData.tracks.length === 0 ? (
                    <div className="text-center py-12 bg-gray-800/30 rounded-xl">
                      <div className="text-6xl mb-4">🎵</div>
                      <h4 className="text-lg font-medium text-gray-400 mb-2">Empty Playlist</h4>
                      <p className="text-gray-500">Add tracks to start listening</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {playlistData.tracks.map((track) => (
                        <TrackCard key={track.id} track={track} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Enhanced Music Player */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <EnhancedMusicPlayer />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PlaylistPage
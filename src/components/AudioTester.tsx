import React, { useState } from 'react'
import { CheckCircle, AlertTriangle, Wifi, WifiOff, Volume2, VolumeX, Play } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { SupabaseService } from '@/services/supabase'
import SimpleAudioPlayer from './SimpleAudioPlayer'

export const AudioTester: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>('classical')

  // Fetch tracks for testing
  const { data: testTracks = [], isLoading, error } = useQuery({
    queryKey: ['test-tracks', selectedGenre],
    queryFn: () => SupabaseService.fetchTracks({ genre: selectedGenre, limit: 3 })
  })

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Audio Delivery Test</h2>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="px-3 py-2 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-border"
        >
          <option value="classical">Classical</option>
          <option value="ambient">Ambient</option>
          <option value="jazz">Jazz</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle size={16} />
            <span className="font-medium">Failed to load test tracks</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading test tracks...</p>
        </div>
      ) : testTracks.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">
            Testing {testTracks.length} tracks from the {selectedGenre} genre:
          </p>
          {testTracks.map((track) => (
            <SimpleAudioPlayer
              key={track.id}
              track={track}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Play size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No tracks available for testing</p>
        </div>
      )}
    </div>
  )
}

export default AudioTester
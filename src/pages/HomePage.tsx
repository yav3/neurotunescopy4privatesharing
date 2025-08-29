import React, { useState, useEffect, useMemo } from 'react'
import { Brain, Heart, Zap, Search, Filter } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { SupabaseService } from '@/services/supabase'
import { useAudio } from '@/context/AudioContext'
import { FrequencyBand } from '@/components/FrequencyBand'
import { TrackCard } from '@/components/TrackCard'
import { LoadingSpinner, InlineLoadingSpinner } from '@/components/LoadingSpinner'
import { API } from '@/lib/api'
import type { FrequencyBand as FrequencyBandType, MusicTrack } from '@/types'

export const HomePage: React.FC = () => {
  console.log('📱 HomePage component rendered')
  const [selectedBand, setSelectedBand] = useState<FrequencyBandType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCondition, setSelectedCondition] = useState<string>('')
  const { setPlaylist } = useAudio()

  console.log('🎵 HomePage state:', { selectedBand, searchQuery, selectedCondition })

  // Fetch tracks with React Query
  const { 
    data: tracks = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['tracks', selectedBand],
    queryFn: () => SupabaseService.fetchTracks({
      genre: selectedBand === 'all' ? undefined : mapBandToGenre(selectedBand),
      limit: 50
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  })

  // Map frequency bands to genres
  function mapBandToGenre(band: FrequencyBandType | 'all'): string | undefined {
    const mapping = {
      'delta': 'classical',
      'theta': 'jazz', 
      'alpha': 'rock',
      'beta': 'dance',
      'gamma': 'electronic'
    }
    return band === 'all' ? undefined : mapping[band as FrequencyBandType]
  }

  // Set playlist when tracks change
  useEffect(() => {
    if (tracks.length > 0) {
      setPlaylist(tracks)
    }
  }, [tracks, setPlaylist])

  // Filter tracks by search query
  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) return tracks
    
    const query = searchQuery.toLowerCase()
    return tracks.filter(track => 
      track.title.toLowerCase().includes(query) ||
      track.genre.toLowerCase().includes(query)
    )
  }, [tracks, searchQuery])

  // Get track counts by frequency band (computed from real data)
  const bandCounts = useMemo(() => {
    // Helper to determine frequency band from track data
    const getBandFromTrack = (track: any): FrequencyBandType => {
      // First try brainwave_hz if available
      const hz = Number(track.brainwave_hz || track.frequency_hz)
      if (!isNaN(hz) && hz > 0) {
        if (hz < 4) return 'delta'
        if (hz < 8) return 'theta' 
        if (hz < 13) return 'alpha'
        if (hz < 30) return 'beta'
        return 'gamma'
      }
      
      // Fallback to genre mapping or tags
      const genre = (track.genre || '').toLowerCase()
      const tags = (track.tags || '').toLowerCase()
      const combined = `${genre} ${tags}`
      
      if (combined.includes('delta') || genre === 'classical') return 'delta'
      if (combined.includes('theta') || genre === 'jazz') return 'theta'
      if (combined.includes('alpha') || genre === 'rock') return 'alpha'
      if (combined.includes('beta') || genre === 'dance') return 'beta'
      if (combined.includes('gamma') || genre === 'electronic') return 'gamma'
      
      // Default mapping based on energy/BPM
      if (track.bpm) {
        if (track.bpm < 60) return 'delta'
        if (track.bpm < 90) return 'theta'
        if (track.bpm < 120) return 'alpha'
        if (track.bpm < 150) return 'beta'
        return 'gamma'
      }
      
      return 'alpha' // Default fallback
    }

    const counts = tracks.reduce((acc, track) => {
      const band = getBandFromTrack(track)
      acc[band] = (acc[band] || 0) + 1
      return acc
    }, {} as Record<FrequencyBandType, number>)
    
    console.log('📊 Computed band counts from', tracks.length, 'tracks:', counts)
    return counts
  }, [tracks])

  // Simplified conditions - no longer using therapeutic applications
  const availableConditions: string[] = []

  const handleBandFilter = (band: FrequencyBandType) => {
    console.log('🎛️ Band filter clicked:', band, 'current:', selectedBand)
    setSelectedBand(selectedBand === band ? 'all' : band)
  }

  const handleCategoryClick = async (categoryId: string) => {
    console.log('🎵 HomePage: Category clicked:', categoryId)
    try {
      const response = await API.playlistByGoal(categoryId)
      const tracks = response.tracks || []
      
      if (tracks.length > 0) {
        console.log('✅ HomePage: Setting playlist with', tracks.length, 'tracks')
        setPlaylist(tracks)
      }
    } catch (error) {
      console.error('❌ HomePage: Failed to load category playlist:', error)
    }
  }

  const clearFilters = () => {
    setSelectedBand('all')
    setSelectedCondition('')
    setSearchQuery('')
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-destructive text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Failed to Load Tracks</h2>
          <p className="text-muted-foreground mb-6">
            {error instanceof Error ? error.message : 'Something went wrong'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 p-6 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Brain size={48} className="text-primary" />
            <div>
              <h1 className="text-4xl font-bold">NeuroTunes Elite</h1>
              <p className="text-muted-foreground text-lg">Evidence-Based Therapeutic Music</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Heart className="text-destructive" size={18} />
              <span>Clinical Research</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="text-accent" size={18} />
              <span>Brainwave Entrainment</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="text-primary" size={18} />
              <span>Therapeutic Applications</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Search and Filters */}
        <section className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search tracks, genres, or conditions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Condition Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="pl-10 pr-8 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="">All Conditions</option>
                {availableConditions.map(condition => (
                  <option key={condition} value={condition}>
                    {condition.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(selectedBand !== 'all' || selectedCondition || searchQuery) && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </section>

        {/* Frequency Band Selector */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Select Brainwave Frequency</h2>
          {isLoading ? (
            <InlineLoadingSpinner text="Loading frequency bands..." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {(['delta', 'theta', 'alpha', 'beta', 'gamma'] as FrequencyBandType[]).map((band) => (
                <FrequencyBand
                  key={band}
                  band={band}
                  isActive={selectedBand === band}
                  onClick={handleBandFilter}
                  count={bandCounts[band] || 0}
                />
              ))}
            </div>
          )}
        </section>

        {/* Track Library */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {selectedBand === 'all' 
                ? 'All Therapeutic Tracks' 
                : `${selectedBand.charAt(0).toUpperCase() + selectedBand.slice(1)} Band Tracks`
              }
              {selectedCondition && (
                <span className="text-lg font-normal text-primary ml-2">
                  for {selectedCondition.replace('_', ' ')}
                </span>
              )}
            </h2>
            <span className="text-muted-foreground">
              {filteredTracks.length} track{filteredTracks.length !== 1 ? 's' : ''}
            </span>
          </div>

          {isLoading ? (
            <InlineLoadingSpinner text="Loading tracks..." />
          ) : filteredTracks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-bold text-muted-foreground mb-2">No tracks found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedBand !== 'all' || selectedCondition
                  ? 'Try adjusting your filters or search terms'
                  : 'No tracks have been uploaded yet'
                }
              </p>
              {(searchQuery || selectedBand !== 'all' || selectedCondition) && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          )}
        </section>

        {/* Stats Section */}
        {tracks.length > 0 && (
          <section className="mt-12 p-6 bg-card/50 rounded-2xl border">
            <h3 className="text-xl font-bold mb-4">Library Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{tracks.length}</div>
                <div className="text-sm text-muted-foreground">Total Tracks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {Object.keys(bandCounts).length}
                </div>
                <div className="text-sm text-muted-foreground">Frequency Bands</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {availableConditions.length}
                </div>
                <div className="text-sm text-muted-foreground">Conditions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {tracks.filter(t => t.energy > 0.7 || t.valence > 0.7).length}
                </div>
                <div className="text-sm text-muted-foreground">High Energy/Valence</div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default HomePage
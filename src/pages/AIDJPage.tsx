import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Radio, 
  Zap, 
  Moon, 
  Brain, 
  Heart as HeartIcon, 
  Play, 
  Heart, 
  ChevronLeft, 
  SkipBack, 
  SkipForward, 
  Pause,
  Shuffle,
  Volume2,
  Settings
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { API } from '@/lib/api' // Use the real API client!
import { TrackCard } from '@/components/TrackCard'
import { useAudio } from '@/context/AudioContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { AudioDebugger } from '@/components/AudioDebugger'
import AudioTester from '@/components/AudioTester'
import { cn } from '@/lib/utils'

export function AIDJPage() {
  const navigate = useNavigate()
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [localPlaylist, setLocalPlaylist] = useState<any[]>([])
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [showFavorites, setShowFavorites] = useState(false)
  const [isFullscreenMode, setIsFullscreenMode] = useState(false)
  const [showAudioTester, setShowAudioTester] = useState(false)
  
  const {
    setPlaylist,
    loadTrack,
    currentTrack,
    state,
    toggle,
    next,
    prev,
    setVolume,
    formatTime
  } = useAudio()

  // Add boot trigger - fetch featured content on component mount
  useEffect(() => {
    console.log('🔥 BOOT TRIGGER: AI DJ page mounted, testing full stack')
    ;(async () => {
      try {
        // Test full stack connectivity
        const [healthCheck, dbCheck, storageCheck] = await Promise.all([
          API.health().catch(e => ({ error: e.message })),
          API.db().catch(e => ({ error: e.message })),
          API.storage().catch(e => ({ error: e.message }))
        ])
        
        console.log('✅ BOOT: Health checks completed', { healthCheck, dbCheck, storageCheck })
        
        // Fetch featured content to prove the full chain works
        const featured = await API.featured()
        console.log('✅ BOOT: Featured content loaded', (featured as any).items?.length, 'tracks')
        
      } catch (error) {
        console.error('❌ BOOT: Full stack test failed:', error)
      }
    })()
  }, [])

  const moods = [
    { 
      id: 'focus', 
      label: 'Focus', 
      icon: Brain, 
      gradient: 'bg-gradient-to-br from-card to-card/60 border border-border',
      description: 'Enhance concentration and productivity',
      color: 'text-music-focus'
    },
    { 
      id: 'chill', 
      label: 'Chill', 
      icon: HeartIcon, 
      gradient: 'bg-gradient-to-br from-card to-card/60 border border-border',
      description: 'Relax and unwind with soothing sounds',
      color: 'text-music-mood'
    },
    { 
      id: 'sleep', 
      label: 'Sleep', 
      icon: Moon, 
      gradient: 'bg-gradient-to-br from-card to-card/60 border border-border',
      description: 'Peaceful music for rest and recovery',
      color: 'text-music-sleep'
    },
    { 
      id: 'energy', 
      label: 'Energy', 
      icon: Zap, 
      gradient: 'bg-gradient-to-br from-card to-card/60 border border-border',
      description: 'Boost motivation and vitality',
      color: 'text-music-energy'
    }
  ]

  const genres = [
    { id: 'all', label: 'All Genres' },
    { id: 'classical', label: 'Classical' },
    { id: 'ambient', label: 'Ambient' },
    { id: 'acoustic', label: 'Acoustic' },
    { id: 'electronic', label: 'Electronic' },
    { id: 'indie', label: 'Indie' },
    { id: 'jazz', label: 'Jazz' }
  ]

  // Generate playlist based on mood and genre with REAL API CALLS
  const { data: generatedPlaylist, isLoading: isGenerating, refetch: regeneratePlaylist } = useQuery({
    queryKey: ['ai-playlist', selectedMood, selectedGenre],
    queryFn: () => selectedMood ? API.playlistByGoal(selectedMood) : Promise.resolve({ tracks: [] }),
    enabled: !!selectedMood,
    select: (data) => (data as any)?.tracks || []
  })

  // Update playlist when generated
  useEffect(() => {
    if (generatedPlaylist) {
      setLocalPlaylist(generatedPlaylist)
    }
  }, [generatedPlaylist])

  const handleMoodSelect = async (moodId: string) => {
    console.log('🎵 AI DJ: Mood selected:', moodId)
    setSelectedMood(moodId)
    setIsFullscreenMode(true)
    
    // Trigger API call immediately when mood is selected
    try {
      console.log('🔥 TRIGGER: Fetching playlist for goal:', moodId)
      const playlistData = await API.playlistByGoal(moodId)
      console.log('✅ TRIGGER: Got playlist data:', playlistData)
      setLocalPlaylist((playlistData as any).tracks || [])
    } catch (error) {
      console.error('❌ TRIGGER: Failed to fetch playlist:', error)
    }
  }

  const handlePlayPlaylist = async () => {
    if (localPlaylist.length > 0) {
      console.log('🎵 AI DJ: Starting playlist with', localPlaylist.length, 'tracks')
      console.log('🔥 TRIGGER: Starting session for track:', localPlaylist[0].id)
      
      try {
        // Start session tracking
        const sessionData = await API.startSession(localPlaylist[0].id)
        console.log('✅ TRIGGER: Session started:', (sessionData as any).sessionId)
      } catch (error) {
        console.error('❌ TRIGGER: Session start failed:', error)
      }
      
      setPlaylist(localPlaylist)
      await loadTrack(localPlaylist[0])
    }
  }

  const handleShufflePlaylist = async () => {
    if (localPlaylist.length > 0) {
      const shuffled = [...localPlaylist].sort(() => Math.random() - 0.5)
      console.log('🎵 AI DJ: Starting shuffled playlist')
      setPlaylist(shuffled)
      await loadTrack(shuffled[0])
    }
  }

  const selectedMoodData = moods.find(m => m.id === selectedMood)

  return (
    <div className="min-h-screen bg-background">
      {!isFullscreenMode ? (
        // Mood Selection Screen
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Radio className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">AI DJ</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Let our AI curate the perfect therapeutic playlist for your current mood and goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {moods.map((mood) => {
              const Icon = mood.icon
              return (
                <Card
                  key={mood.id}
                  className={cn(
                    "group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg overflow-hidden",
                    mood.gradient
                  )}
                  onClick={() => handleMoodSelect(mood.id)}
                >
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={cn("p-3 rounded-full bg-card/80 backdrop-blur-sm", mood.color)}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">{mood.label}</h3>
                        <p className="text-muted-foreground mt-1">{mood.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <Badge variant="secondary" className="bg-card/80 text-foreground border-border">
                        AI Curated
                      </Badge>
                      <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                        <span className="text-sm font-medium">Start Session</span>
                        <Play className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      ) : (
        // Full Music Interface
        <div className="min-h-screen">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
            <div className="container max-w-6xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreenMode(false)}
                    className="hover:bg-secondary"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  
                  {selectedMoodData && (
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-full bg-card border-border",
                        selectedMoodData.color
                      )}>
                        <selectedMoodData.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">{selectedMoodData.label} Mix</h2>
                        <p className="text-sm text-muted-foreground">
                          {localPlaylist.length} tracks • AI Generated
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Audio Test Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAudioTester(!showAudioTester)}
                    className="hover:bg-secondary"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Audio Test
                  </Button>

                  {/* Genre Filter */}
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="px-3 py-2 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {genres.map(genre => (
                      <option key={genre.id} value={genre.id}>
                        {genre.label}
                      </option>
                    ))}
                  </select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => regeneratePlaylist()}
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Generating...' : 'Regenerate'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="container max-w-6xl mx-auto px-4 py-8">
            {/* Audio Tester (Debug Tool) */}
            {showAudioTester && (
              <div className="mb-8">
                <AudioTester />
                <div className="mt-4">
                  <AudioDebugger />
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Playlist Controls */}
                <div className="flex items-center gap-4 mb-8">
                  <Button
                    onClick={handlePlayPlaylist}
                    disabled={localPlaylist.length === 0}
                    className="h-12 px-8 text-lg font-semibold"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Play All
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleShufflePlaylist}
                    disabled={localPlaylist.length === 0}
                    className="h-12 px-6"
                  >
                    <Shuffle className="h-5 w-5 mr-2" />
                    Shuffle
                  </Button>

                  <Badge variant="secondary" className="h-12 px-4 text-base">
                    {localPlaylist.length} tracks
                  </Badge>
                </div>

                {/* Track List */}
                <div className="space-y-3">
                  {isGenerating ? (
                    <div className="text-center py-12">
                      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Generating your perfect playlist...</p>
                    </div>
                  ) : localPlaylist.length > 0 ? (
                    localPlaylist.map((track, index) => (
                    <TrackCard
                      key={`${track.id}-${index}`}
                      track={track}
                    />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Select a mood to generate your playlist</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Now Playing Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24 p-6">
                  <h3 className="text-lg font-semibold mb-4">Now Playing</h3>
                  
                  {currentTrack ? (
                    <div className="space-y-6">
                      {/* Track Info */}
                      <div className="text-center">
                        <h4 className="font-semibold text-lg truncate">{currentTrack.title}</h4>
                        {currentTrack.artist && (
                          <p className="text-muted-foreground truncate">{currentTrack.artist}</p>
                        )}
                        {currentTrack.genre && (
                          <Badge variant="secondary" className="mt-2">
                            {currentTrack.genre}
                          </Badge>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: state.duration > 0 ? `${(state.currentTime / state.duration) * 100}%` : '0%' 
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{formatTime(state.currentTime)}</span>
                          <span>{formatTime(state.duration)}</span>
                        </div>
                      </div>

                      {/* Playback Controls */}
                      <div className="flex items-center justify-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={prev}
                          className="h-10 w-10 rounded-full"
                        >
                          <SkipBack className="h-5 w-5" />
                        </Button>

                        <Button
                          onClick={toggle}
                          className="h-12 w-12 rounded-full"
                        >
                          {state.isPlaying ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={next}
                          className="h-10 w-10 rounded-full"
                        >
                          <SkipForward className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Volume Control */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4 text-muted-foreground" />
                          <Slider
                            value={[state.volume]}
                            onValueChange={(values) => setVolume(values[0])}
                            max={1}
                            step={0.1}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      {/* Favorite Button - Remove for now since we don't have favorites in AudioContext */}
                      <div className="text-center text-sm text-muted-foreground">
                        Click any track to play it
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No track selected</p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
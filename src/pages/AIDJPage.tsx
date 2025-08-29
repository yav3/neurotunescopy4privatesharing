import React, { useState, useEffect } from 'react'
import { Radio, Play, Pause, SkipBack, SkipForward, Volume2, ChevronLeft, Settings, Shuffle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { useAudio } from '@/context/AudioContext'
import { TrackCard } from '@/components/TrackCard'
import AudioTester from '@/components/AudioTester'
import { AudioDebugger } from '@/components/AudioDebugger'
import { API } from '@/lib/api'
import { API_BASE } from '@/lib/env'
import { usePlayer } from '@/stores/usePlayer'
import type { MusicTrack } from '@/types'

// Debug hook for React components
const useDebugComponent = (componentName: string, props: any, state: any) => {
  useEffect(() => {
    console.log(`🔧 ${componentName} MOUNTED:`, { props, state });
    return () => console.log(`🔧 ${componentName} UNMOUNTED`);
  }, []);
  
  useEffect(() => {
    console.log(`🔧 ${componentName} UPDATED:`, { props, state });
  });
};

// Mock data for moods and genres
const moods = [
  {
    id: 'focus',
    label: 'Deep Focus',
    description: 'Alpha waves for concentration and productivity',
    icon: Radio,
    gradient: 'bg-gradient-to-r from-blue-600 to-cyan-600',
    color: 'text-blue-600'
  },
  {
    id: 'relax',
    label: 'Relaxation',
    description: 'Theta waves for deep relaxation and stress relief',
    icon: Radio,
    gradient: 'bg-gradient-to-r from-green-600 to-teal-600',
    color: 'text-green-600'
  },
  {
    id: 'sleep',
    label: 'Sleep',
    description: 'Delta waves for deep, restorative sleep',
    icon: Radio,
    gradient: 'bg-gradient-to-r from-purple-600 to-indigo-600',
    color: 'text-purple-600'
  },
  {
    id: 'energy',
    label: 'Energy',
    description: 'Beta waves for alertness and motivation',
    icon: Radio,
    gradient: 'bg-gradient-to-r from-orange-600 to-red-600',
    color: 'text-orange-600'
  }
]

const genres = [
  { id: 'all', label: 'All Genres' },
  { id: 'ambient', label: 'Ambient' },
  { id: 'binaural', label: 'Binaural Beats' },
  { id: 'nature', label: 'Nature Sounds' },
  { id: 'classical', label: 'Classical' }
]

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const AIDJPage: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string>('')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [isFullscreenMode, setIsFullscreenMode] = useState(false)
  const [localPlaylist, setLocalPlaylist] = useState<MusicTrack[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAudioTester, setShowAudioTester] = useState(false)

  const { state, currentTrack, setPlaylist, loadTrack, toggle, prev, next, setVolume } = useAudio()

  // Debug this component
  useDebugComponent('AIDJPage', {}, { 
    selectedMood, selectedGenre, isFullscreenMode, 
    localPlaylist: localPlaylist.length, isGenerating, showAudioTester,
    audioState: state, currentTrack: currentTrack?.id
  });

  // Component lifecycle and API test
  useEffect(() => {
    console.log('🏗️ AIDJPage MOUNTED');
    
    // Immediate API connectivity test
    const testAPIConnectivity = async () => {
      console.log('🧪 Testing API connectivity on mount...');
      const tests = [
        { name: 'Health', test: () => API.health() },
        { name: 'Debug Storage', test: () => fetch(`${API_BASE}/debug/storage`).then(r => r.json()) },
        { name: 'External Test', test: () => fetch('https://httpbin.org/get').then(r => r.json()) }
      ];
      
      for (const { name, test } of tests) {
        try {
          const result = await test();
          console.log(`✅ ${name} test passed:`, result);
        } catch (error) {
          console.log(`❌ ${name} test failed:`, error);
        }
      }
    };
    
    testAPIConnectivity();
    
    // Log global state
    console.log('🌐 AIDJPage GLOBALS:', {
      location: window.location.href,
      API_BASE,
      userAgent: navigator.userAgent.substring(0, 100)
    });
  }, []);

  // Replace mock function with real API calls
  const generatePlaylist = async (mood: string, genre: string = 'all') => {
    setIsGenerating(true)
    
    try {
      console.log('🔥 REAL API: Fetching playlist for mood:', mood, 'genre:', genre)
      
      // Map moods to goals for better API compatibility
      const moodToGoal: Record<string, string> = {
        'Focus Enhancement': 'focus',
        'Anxiety Relief': 'relax',
        'Sleep Preparation': 'sleep',
        'Mood Boost': 'energy',
        'Stress Reduction': 'relax',
        'Meditation Support': 'relax',
      }
      
      const goal = moodToGoal[mood] ?? mood.toLowerCase()
      
      // Call the real backend API instead of generating mock data
      const { tracks } = await API.playlist(goal)
      
      console.log('✅ REAL API: Playlist received:', tracks.length, 'tracks')
      
      // Convert to proper format with therapeutic applications if missing
      const processedTracks = tracks.map(track => ({
        ...track,
        therapeutic_applications: track.therapeutic_applications || [{
          id: `app-${track.id}`,
          track_id: track.id,
          frequency_band_primary: getBandFromBPM(track.bpm),
          condition_targets: [mood === 'focus' ? 'focus' : mood === 'energy' ? 'energy' : mood === 'sleep' ? 'sleep' : 'relaxation'],
          anxiety_evidence_score: mood === 'relax' ? 0.85 : 0.6,
          sleep_evidence_score: mood === 'sleep' ? 0.92 : 0.3,
          focus_evidence_score: mood === 'focus' ? 0.88 : 0.4,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]
      }))
      
      setLocalPlaylist(processedTracks)
      setPlaylist(processedTracks)
      
    } catch (error) {
      console.error('❌ REAL API: Failed to fetch playlist:', error)
      
      // Fallback to empty playlist with error message
      setLocalPlaylist([])
      setPlaylist([])
    } finally {
      setIsGenerating(false)
    }
  }
  
  // Helper function to determine frequency band from BPM
  const getBandFromBPM = (bpm: number): 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma' => {
    if (!bpm) return 'alpha'
    if (bpm < 60) return 'delta'
    if (bpm < 90) return 'theta' 
    if (bpm < 120) return 'alpha'
    if (bpm < 150) return 'beta'
    return 'gamma'
  }

  const handleMoodSelect = async (moodId: string) => {
    console.log('🎵 AI DJ mood selected:', moodId);
    setSelectedMood(moodId)
    setIsFullscreenMode(true)
    
    try {
      await generatePlaylist(moodId, selectedGenre)
      console.log('✅ Playlist generated for mood:', moodId);
    } catch (error) {
      console.error('❌ Error generating playlist:', error);
    }
  }

  const handlePlayPlaylist = async () => {
    console.log('🎵 AI DJ: Play All button clicked');
    if (localPlaylist.length > 0) {
      console.log('🎵 AI DJ: Starting playlist with', localPlaylist.length, 'tracks');
      console.log('🎵 First track:', localPlaylist[0]);
      
      try {
        // Use the new global audio system
        const { setQueue } = usePlayer.getState();
        await setQueue(localPlaylist, 0);
        
        console.log('✅ AI DJ: Successfully started playback via global audio');
      } catch (error) {
        console.error('❌ AI DJ: Failed to start playbook via global audio:', error);
      }
    } else {
      console.log('❌ AI DJ: No tracks in playlist to play');
    }
  };

  const handleShufflePlaylist = async () => {
    console.log('🎵 AI DJ: Shuffle button clicked');
    if (localPlaylist.length > 0) {
      const shuffled = [...localPlaylist].sort(() => Math.random() - 0.5)
      console.log('🔀 AI DJ: Shuffling playlist:', shuffled.length, 'tracks');
      
      try {
        setLocalPlaylist(shuffled);
        const { setQueue } = usePlayer.getState();
        await setQueue(shuffled, 0);
        
        console.log('✅ AI DJ: Successfully shuffled and started playback');
      } catch (error) {
        console.error('❌ AI DJ: Failed to shuffle and start playback:', error);
      }
    } else {
      console.log('❌ AI DJ: No tracks to shuffle');
    }
  };

  const regeneratePlaylist = async () => {
    if (selectedMood) {
      await generatePlaylist(selectedMood, selectedGenre)
    }
  }

  // Regenerate playlist when genre changes
  useEffect(() => {
    if (selectedMood && isFullscreenMode) {
      regeneratePlaylist()
    }
  }, [selectedGenre])

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
                  onClick={() => {
                    console.log('🎯 Mood card clicked:', mood.id, mood.label);
                    handleMoodSelect(mood.id);
                  }}
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

                  {/* API Test Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      console.log('🔧 API Test button clicked');
                      try {
                        console.log('🔧 Testing API health...');
                        const health = await API.health();
                        console.log('✅ Health check passed:', health);
                        
                        console.log('🔧 Testing debug storage...');
                        const debug = await fetch(`${API_BASE}/debug/storage`).then(r => r.json());
                        console.log('✅ Debug storage response:', debug);
                        
                        console.log('🔧 Testing playlist API...');
                        const playlist = await API.playlist('focus');
                        console.log('✅ Playlist response:', playlist);
                      } catch (error) {
                        console.error('❌ API Test failed:', error);
                      }
                    }}
                    className="hover:bg-secondary"
                  >
                    🔧 Test API
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

export { AIDJPage }
import React, { useState, useEffect, useCallback } from 'react'
import { Play, Clock, Target, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { TherapeuticGoalCard } from '@/components/ui/TherapeuticGoalCard'
import { useTherapeuticGoals } from '@/hooks/useTherapeuticGoals'
import { useToast } from '@/hooks/use-toast'
import { API } from '@/lib/api'
import { useAudioStore } from '@/stores'
import { useSessionManager } from '@/hooks/useSessionManager'

interface TherapeuticSessionBuilderProps {
  onSessionStart: (tracks: any[]) => void
  className?: string
}

export const TherapeuticSessionBuilder: React.FC<TherapeuticSessionBuilderProps> = ({
  onSessionStart,
  className = ''
}) => {
  const { goals, mapper } = useTherapeuticGoals();
  const [selectedGoalId, setSelectedGoalId] = useState('anxiety-relief') // Use kebab-case ID
  const [duration, setDuration] = useState([15])
  const [intensity, setIntensity] = useState([3])
  const [isBuilding, setIsBuilding] = useState(false)
  const { toast } = useToast()
  const sessionManager = useSessionManager()

  // 🔄 MIRROR BACKEND: Connect session manager to audio store (FIXED - no dependency array to prevent loops)
  useEffect(() => {
    const setSessionManager = useAudioStore.getState().setSessionManager;
    setSessionManager(sessionManager);
  }, []); // Empty dependency array to run only once

  // Memoized slider handlers to prevent infinite loops
  const handleDurationChange = useCallback((value: number[]) => {
    setDuration(value);
  }, []);

  const handleIntensityChange = useCallback((value: number[]) => {
    setIntensity(value);
  }, []);

  // Get real track count for selected goal
  const selectedGoal = mapper.getById(selectedGoalId);
  const goalWithMetrics = goals.find(g => g.id === selectedGoalId);
  const availableTracks = goalWithMetrics?.trackCount ?? 0;

  const handleBuildSession = async () => {
    if (availableTracks === 0) {
      toast({
        title: "No Tracks Available",
        description: "Please wait while tracks are loaded or check your connection.",
        variant: "destructive"
      })
      return
    }

    const selectedGoal = mapper.getById(selectedGoalId);
    if (!selectedGoal) {
      toast({
        title: "Invalid Goal",
        description: "Please select a valid therapeutic goal.",
        variant: "destructive"
      })
      return;
    }

    setIsBuilding(true)

    try {
      console.log('🏗️ Building therapeutic session with backend:', {
        goal: selectedGoal.backendKey, // Use backend key for API
        durationMin: duration[0],
        intensity: intensity[0]
      });

      // 🎲 VARIETY SYSTEM: Get recently played tracks to avoid repetition
      const getRecentlyPlayed = (): string[] => {
        const recentTracks = localStorage.getItem('recentlyPlayedTracks');
        return recentTracks ? JSON.parse(recentTracks) : [];
      };

      const updateRecentlyPlayed = (trackIds: string[]) => {
        const recent = getRecentlyPlayed();
        const updated = [...trackIds, ...recent].slice(0, 100); // Keep last 100 tracks
        localStorage.setItem('recentlyPlayedTracks', JSON.stringify(updated));
      };

      const recentlyPlayed = getRecentlyPlayed();
      console.log('🚫 Excluding recently played tracks:', recentlyPlayed.length);

      // 🔄 MIRROR BACKEND: Use API.buildSession endpoint with variety parameters
      const session = await API.buildSession({
        goal: selectedGoal.backendKey, // Use backend key
        durationMin: duration[0],
        intensity: intensity[0],
        limit: 200, // Request more tracks to allow for variety filtering
        exclude: recentlyPlayed.join(','), // Exclude recently played tracks
        randomSeed: Math.random().toString(36) // Add randomization
      });
      
      // Add defensive null checking to prevent "Cannot read properties of undefined" errors
      if (!session) {
        throw new Error('Session response is empty');
      }
      
      if (!session.tracks || !Array.isArray(session.tracks)) {
        throw new Error('No tracks returned in session');
      }
      
      if (session.tracks.length === 0) {
        throw new Error('Session returned empty tracks array');
      }
      
      // Add client-side variety filtering as fallback
      let availableTracks = session.tracks.filter((t: any) => t && t.id);
      
      // Client-side exclusion if backend doesn't support it
      if (recentlyPlayed.length > 0) {
        const beforeFilter = availableTracks.length;
        availableTracks = availableTracks.filter((t: any) => !recentlyPlayed.includes(t.id));
        console.log(`🎲 Variety filter: ${beforeFilter} → ${availableTracks.length} tracks (excluded ${beforeFilter - availableTracks.length} recent)`);
      }
      
      if (availableTracks.length === 0) {
        // If all tracks are recently played, clear history and try again
        console.log('🔄 All tracks recently played, clearing history for variety');
        localStorage.removeItem('recentlyPlayedTracks');
        availableTracks = session.tracks.filter((t: any) => t && t.id);
      }

      // 🎲 SHUFFLE for variety: Randomize track order before selection
      const shuffledTracks = [...availableTracks].sort(() => Math.random() - 0.5);
      
      // Calculate needed tracks
      const averageTrackLength = 4; // minutes
      const tracksNeeded = Math.max(3, Math.ceil(duration[0] / averageTrackLength));
      
      // Select diverse tracks (not just the first ones)
      const selectedTracks = shuffledTracks.slice(0, Math.min(tracksNeeded, shuffledTracks.length));

      console.log('✅ Backend session built:', session.sessionId, 'with', selectedTracks.length, 'diverse tracks');

      // Convert backend tracks to frontend format with additional null checking
      const tracks = selectedTracks.map((t: any) => ({
        id: t.id,
        title: t.title || "",
        artist: t.genre || "Unknown",
        duration: 0,
        // Include VAD data from backend
        energy: t.energy,
        valence: t.valence,
        acousticness: t.acousticness,
        instrumentalness: t.instrumentalness
      }));

      // 🎲 VARIETY TRACKING: Update recently played list
      const trackIds = tracks.map((t: any) => t.id);
      updateRecentlyPlayed(trackIds);
      console.log('📝 Updated recently played list with', trackIds.length, 'new tracks');

      // 🔄 MIRROR BACKEND: Start session tracking
      if (tracks.length > 0) {
        const sessionTracker = await API.start(tracks[0].id);
        console.log('📊 Session tracking started:', sessionTracker.sessionId);
        
        // Store session info for progress tracking
        sessionStorage.setItem('currentSessionId', sessionTracker.sessionId);
        sessionStorage.setItem('sessionStartTime', Date.now().toString());
      }

      // Set tracks to audio store
      const { setQueue } = useAudioStore.getState();
      await setQueue(tracks, 0);
      
      toast({
        title: "Therapeutic Session Started",
        description: `Playing ${tracks.length} backend-curated tracks for ${selectedGoal.name}`,
      })

      console.log('✅ Frontend mirrored backend session structure');
      onSessionStart(tracks);
    } catch (error) {
      console.error('❌ Failed to build therapeutic session:', error)
      toast({
        title: "Session Build Failed", 
        description: error instanceof Error ? error.message : "Failed to create therapeutic session",
        variant: "destructive"
      })
    } finally {
      setIsBuilding(false)
    }
  }


  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Build Your Therapeutic Session
        </h2>
        <p className="text-muted-foreground">
          Personalized music therapy based on scientific research and harmonic progression
        </p>
      </div>

      {/* Goal Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Select Your Goal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <TherapeuticGoalCard
              key={goal.id}
              goal={goal}
              isSelected={selectedGoalId === goal.id}
              showBpmRange={false}
              onClick={() => setSelectedGoalId(goal.id)}
            />
          ))}
        </div>
      </div>

      {/* Session Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Duration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Session Duration
            </h3>
          </div>
          <div className="space-y-3">
            <Slider
              value={duration}
              onValueChange={handleDurationChange}
              min={5}
              max={60}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>5 min</span>
              <span className="font-medium text-foreground">
                {duration[0]} minutes
              </span>
              <span>60 min</span>
            </div>
          </div>
        </div>

        {/* Intensity */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Intensity Level
            </h3>
          </div>
          <div className="space-y-3">
            <Slider
              value={intensity}
              onValueChange={handleIntensityChange}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Gentle</span>
              <span className="font-medium text-foreground">
                Level {intensity[0]}
              </span>
              <span>Intense</span>
            </div>
          </div>
        </div>
      </div>

      {/* Session Preview */}
      {selectedGoal && (
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full bg-gradient-to-br ${selectedGoal.gradient} text-white`}>
              <selectedGoal.icon size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {selectedGoal.name} Session
              </h3>
              <p className="text-muted-foreground">
                {selectedGoal.description}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock size={14} />
              {duration[0]} minutes
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Target size={14} />
              Intensity {intensity[0]}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Brain size={14} />
              {availableTracks} tracks available
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              BPM: {selectedGoal.bpmRange.min}-{selectedGoal.bpmRange.max}
            </Badge>
          </div>

          <Button
            onClick={handleBuildSession}
            disabled={isBuilding || availableTracks === 0}
            className="w-full h-12 text-lg font-semibold"
          >
            {isBuilding ? (
              <>
                <LoadingSpinner className="mr-2" />
                Building Session...
              </>
            ) : (
              <>
                <Play size={20} className="mr-2" />
                Start Therapeutic Session
              </>
            )}
          </Button>
        </Card>
      )}

      {/* Track Library Status */}
      <div className="text-center text-sm text-muted-foreground">
        {availableTracks > 0 ? (
          <p>✓ {availableTracks} therapeutic tracks loaded and ready</p>
        ) : (
          <p>⚠️ No tracks available - checking connection...</p>
        )}
      </div>
    </div>
  )
}
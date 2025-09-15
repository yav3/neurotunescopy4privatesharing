import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { useTherapeuticGoals } from '@/hooks/useTherapeuticGoals';
import { useAudioStore } from '@/stores/audioStore';
import { Track } from '@/types/index';
import { TherapeuticMusicDebugger } from '@/utils/musicDebugger';

// Use shared genre configurations instead of hardcoded ones
import { getGenreOptions } from '@/config/genreConfigs';

export default function GenreView() {
  const { goalId, genreId } = useParams();
  const navigate = useNavigate();
  const { getGoal } = useTherapeuticGoals();
  
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isTracksLoading, setIsTracksLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goal = goalId ? getGoal(goalId) : null;
  const genreOptions = goalId ? getGenreOptions(goalId) : [];
  const selectedGenre = genreOptions.find(g => g.id === genreId);

  // Debug logs to see what's happening with genre selection
  console.log('🔍 DEBUG - URL params:', { goalId, genreId });
  console.log('🔍 DEBUG - Available genres for goal:', genreOptions.map(g => ({ id: g.id, name: g.name, buckets: g.buckets })));
  console.log('🔍 DEBUG - Selected genre:', selectedGenre ? { id: selectedGenre.id, name: selectedGenre.name, buckets: selectedGenre.buckets } : 'NOT FOUND');

  // Load tracks using the proper therapeutic database system  
  useEffect(() => {
    if (!goal) {
      console.log('❌ No goal available');
      setError('No therapeutic goal specified.');
      setIsTracksLoading(false);
      return;
    }

    const loadTherapeuticTracks = async () => {
      setIsTracksLoading(true);
      setTracks([]);
      setError(null);
      
      try {
        console.log(`🎯 Loading therapeutic tracks for goal: ${goal.id} (backend: ${goal.backendKey})`);
        
        // Use the proper therapeutic database system
        const { getTherapeuticTracks } = await import('@/services/therapeuticDatabase');
        const { tracks: therapeuticTracks, error } = await getTherapeuticTracks(goal.backendKey, 50);
        
        if (error) {
          console.error('❌ Error loading therapeutic tracks:', error);
          setError(`Failed to load music: ${error}`);
          return;
        }
        
        console.log(`🎵 Loaded ${therapeuticTracks.length} therapeutic tracks`);
        
        // Convert therapeutic tracks to our Track interface
        const convertedTracks: Track[] = therapeuticTracks.map((track, index) => ({
          id: track.id || `track-${index}`,
          unique_id: track.id || `track-${index}`,
          title: track.title || 'Unknown Track',
          url: track.stream_url || '',
          file_path: track.stream_url || '',
          bucket: track.storage_bucket || '',
          folder: '',
          artwork_url: selectedGenre?.image || '',
          size: 0,
          artist: track.artist,
          bpm: track.bpm || track.bpm_est,
          duration: track.duration_seconds,
          camelot_key: '',
          vad: { valence: 0.5, arousal: 0.5, dominance: 0.5 }
        }));
        
        console.log(`✅ Converted ${convertedTracks.length} tracks for UI`);
        console.log(`🎵 Sample track:`, convertedTracks[0] ? {
          id: convertedTracks[0].id,
          title: convertedTracks[0].title,
          hasUrl: !!convertedTracks[0].file_path
        } : 'No tracks');
        
        // Debug the music connection
        const musicDebugger = new TherapeuticMusicDebugger();
        musicDebugger.debugMusicConnection(selectedGenre, convertedTracks);
        
        if (convertedTracks.length > 0) {
          setTracks(convertedTracks);
        } else {
          setError('No music tracks found for this therapeutic goal.');
        }
        
      } catch (error) {
        console.error('❌ Failed to load therapeutic tracks:', error);
        setError('Failed to load music. Please try again.');
      } finally {
        setIsTracksLoading(false);
      }
    };

    loadTherapeuticTracks();
  }, [goal?.id, goal?.backendKey, selectedGenre]);

  const handleTrackPlay = async (track: Track) => {
    try {
      const audioStore = useAudioStore.getState();
      await audioStore.setQueue([track], 0);
      await audioStore.play();
    } catch (error) {
      console.error('Failed to play track:', error);
    }
  };

  const handlePlayAll = async () => {
    if (tracks.length === 0) return;
    
    try {
      const audioStore = useAudioStore.getState();
      await audioStore.setQueue(tracks, 0);
      await audioStore.play();
    } catch (error) {
      console.error('Failed to play all tracks:', error);
    }
  };

  const handleBack = () => {
    navigate(`/goal/${goalId}`);
  };

  const handleRetry = () => {
    // Trigger a reload by updating the dependency
    setError(null);
    setTracks([]);
  };

  if (!goal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Goal Not Found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedGenre) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Genre Not Found</h2>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Genres
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={handleBack} variant="ghost" className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Genres
      </Button>

      <div className="mb-8">
        <div 
          className="relative h-64 rounded-lg bg-cover bg-center mb-6"
          style={{ backgroundImage: `url(${selectedGenre.image})` }}
        >
          <div className="absolute inset-0 bg-black/40 rounded-lg flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{selectedGenre.name}</h1>
              <p className="text-lg opacity-90">{goal.name}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <Button onClick={handlePlayAll} disabled={tracks.length === 0 || isTracksLoading}>
            <Play className="h-4 w-4 mr-2" />
            Play All
          </Button>
          
          {error && (
            <Button onClick={handleRetry} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>

      {isTracksLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading tracks...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">{error}</p>
        </div>
      )}

      {!isTracksLoading && !error && tracks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tracks found for this genre.</p>
        </div>
      )}

      {tracks.length > 0 && (
        <div className="space-y-4">
          {tracks.map((track) => (
            <div 
              key={track.id} 
              className="bg-card rounded-lg p-4 flex items-center justify-between hover:bg-accent transition-colors cursor-pointer"
              onClick={() => handleTrackPlay(track)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Play className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{track.title}</h3>
                  {track.artist && <p className="text-sm text-muted-foreground">{track.artist}</p>}
                  {track.bpm && <p className="text-xs text-muted-foreground">{track.bpm} BPM</p>}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
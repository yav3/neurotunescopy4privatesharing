import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HorizontalTrackList } from '@/components/HorizontalTrackList';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';
import { getTracksFromStorage } from '@/services/storageDirectAccess';
import { useAudioStore } from '@/stores';
import { toast } from 'sonner';

// Import artwork
import crossoverClassicalArt from '@/assets/crossover-classical-artwork.jpg';
import newAgeArt from '@/assets/new-age-artwork.jpg';
import electronicArt from '@/assets/electronic-artwork.jpg';

// Fallback track generator
const generateFallbackTracks = (genreName: string, goalName: string) => {
  const trackNames = [
    'Bach Reimagined', 'Peaceful Focus', 'Classical Concentration', 
    'Mozart Modern', 'Therapeutic Symphony', 'Ambient Classical',
    'Focus Flow', 'Mindful Melody', 'Serene Strings',
    'Calm Composition', 'Tranquil Tones', 'Gentle Harmony'
  ];

  return trackNames.map((name, index) => ({
    id: `fallback-${genreName.toLowerCase()}-${index}`,
    title: `${name} ${goalName}`,
    storage_bucket: 'fallback',
    storage_key: `fallback/${name.toLowerCase().replace(/\s+/g, '-')}.mp3`,
    genre: genreName,
    bpm: 60 + (index * 5),
    therapeutic_applications: [{
      frequency_band_primary: ['delta', 'theta', 'alpha', 'beta', 'gamma'][index % 5],
      condition_targets: [goalName.toLowerCase()]
    }]
  }));
};

interface GenreOption {
  id: string;
  name: string;
  description: string;
  buckets: string[];
  artwork: string;
}

interface Track {
  id: string;
  title: string;
  storage_bucket?: string;
  storage_key?: string;
  artwork_url?: string;
}

const GenreView: React.FC = () => {
  const { goalId, genreId } = useParams<{ goalId: string; genreId: string }>();
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentTrack, isPlaying, playFromGoal, play, pause, isLoading: audioLoading } = useAudioStore();

  // Get the therapeutic goal
  const goal = goalId ? GOALS_BY_ID[goalId] : null;

  // Genre options mapping
  const getGenreOptions = (goalId: string): GenreOption[] => {
    if (goalId === 'focus-enhancement') {
      return [
        {
          id: 'crossover-classical',
          name: 'Crossover Classical',
          description: 'Modern classical compositions for concentration',
          buckets: ['classicalfocus'],
          artwork: crossoverClassicalArt
        },
        {
          id: 'electronic',
          name: 'Electronic',
          description: 'Ambient electronic music for focus',
          buckets: ['focus-music'],
          artwork: electronicArt
        },
        {
          id: 'world-new-age',
          name: 'World & New Age',
          description: 'Global sounds and new age music',
          buckets: ['neuralpositivemusic'],
          artwork: newAgeArt
        }
      ];
    } else {
      return [
        {
          id: 'crossover-classical',
          name: 'Crossover Classical',
          description: 'Modern classical compositions',
          buckets: ['classicalfocus', 'neuralpositivemusic'],
          artwork: crossoverClassicalArt
        },
        {
          id: 'electronic',
          name: 'Electronic',
          description: 'Ambient electronic music',
          buckets: ['neuralpositivemusic'],
          artwork: electronicArt
        },
        {
          id: 'world-new-age',
          name: 'World & New Age',
          description: 'Global sounds and new age music',
          buckets: ['neuralpositivemusic'],
          artwork: newAgeArt
        }
      ];
    }
  };

  // Get the selected genre
  const genreOptions = goal ? getGenreOptions(goal.id) : [];
  const selectedGenre = genreOptions.find(g => g.id === genreId);

  // Load tracks for the selected genre
  useEffect(() => {
    if (!goal || !selectedGenre) return;

    const loadTracks = async () => {
      setIsLoading(true);
      try {
        console.log(`🎵 Loading ${selectedGenre.name} tracks from buckets:`, selectedGenre.buckets);
        
        // Start with fallback tracks immediately
        const fallbackTracks = generateFallbackTracks(selectedGenre.name, goal.name);
        setTracks(fallbackTracks);
        setIsLoading(false);
        
        try {
          // Try to get tracks from storage
          const result = await Promise.race([
            getTracksFromStorage(goal.backendKey, 50, selectedGenre.buckets),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Storage timeout')), 3000))
          ]) as any;
          
          const fetchedTracks = result.tracks || [];
          
          // Only replace fallback tracks if we actually found real tracks
          if (fetchedTracks && fetchedTracks.length > 0) {
            setTracks(fetchedTracks);
            console.log(`✅ Loaded ${fetchedTracks.length} real tracks for ${selectedGenre.name}`);
          }
        } catch (storageError) {
          console.warn(`⚠️ Storage timeout or error for ${selectedGenre.name}:`, storageError);
        }
        
      } catch (error) {
        console.error(`❌ Failed to load tracks for ${selectedGenre.name}:`, error);
        const emergencyTracks = generateFallbackTracks(selectedGenre.name, goal.name);
        setTracks(emergencyTracks);
        setIsLoading(false);
      }
    };

    loadTracks();
  }, [goal, selectedGenre]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleTrackPlay = async (track: Track) => {
    if (audioLoading) {
      toast.error("Already loading music, please wait...");
      return;
    }

    try {
      toast.loading(`Starting ${selectedGenre?.name.toLowerCase()} session...`, { id: "track-play" });
      await playFromGoal(goal?.backendKey || '');
      toast.success(`Playing ${selectedGenre?.name.toLowerCase()} music`, { id: "track-play" });
    } catch (error) {
      console.error('❌ Failed to play track:', error);
      toast.error("Failed to start playback", { id: "track-play" });
    }
  };

  if (!goal || !selectedGenre) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Genre not found</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Goal and Genre Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {goal.name}
          </h1>
          <p className="text-xl text-primary font-medium">
            {selectedGenre.name}
          </p>
          <p className="text-muted-foreground">
            {selectedGenre.description}
          </p>
        </div>


        {/* Horizontal Track List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span>Loading music collection...</span>
            </div>
          </div>
        ) : (
          <HorizontalTrackList
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTrackPlay={handleTrackPlay}
            onTogglePlay={handleTogglePlay}
            isLoading={audioLoading}
          />
        )}
      </div>
    </div>
  );
};

export default GenreView;
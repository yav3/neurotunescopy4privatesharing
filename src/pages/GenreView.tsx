import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VerticalTrackList } from '@/components/VerticalTrackList';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';
import { useAudioStore } from '@/stores';
import { toast } from 'sonner';

// Import artwork
import crossoverClassicalArt from '@/assets/crossover-classical-artwork.jpg';
import newAgeArt from '@/assets/new-age-artwork.jpg';
import electronicArt from '@/assets/electronic-artwork.jpg';
import acousticArt from '@/assets/acoustic-artwork.jpg';
import peacefulPianoArt from '@/assets/peaceful-piano-artwork.jpg';

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
  artist?: string;
  duration?: number;
  storage_bucket?: string;
  storage_key?: string;
  artwork_url?: string;
  stream_url?: string;
  audio_status?: 'working' | 'missing' | 'unknown';
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
          id: 'peaceful-piano',
          name: 'Peaceful Piano',
          description: 'Serene piano compositions for deep focus',
          buckets: ['Chopin'],
          artwork: peacefulPianoArt
        },
        {
          id: 'crossover-classical',
          name: 'Classical Crossover',
          description: 'Modern classical compositions for focus',
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
          id: 'peaceful-piano',
          name: 'Peaceful Piano',
          description: 'Serene piano compositions',
          buckets: ['Chopin'],
          artwork: peacefulPianoArt
        },
        {
          id: 'crossover-classical',
          name: 'Classical Crossover',
          description: 'Modern classical compositions',
          buckets: ['classicalfocus'],
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

  // Load tracks directly from bucket - simplified
  useEffect(() => {
    if (!goal || !selectedGenre) return;

    const loadTracks = async () => {
      setIsLoading(true);
      console.log(`🎵 Loading ${selectedGenre.name} tracks directly from buckets:`, selectedGenre.buckets);
      
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        let allTracks: any[] = [];

        // Process each bucket - simplified
        for (const bucketName of selectedGenre.buckets) {
          console.log(`🗂️ Processing bucket: ${bucketName} directly`);
          
          // List files directly from bucket
          const { data: files, error: listError } = await supabase.storage
            .from(bucketName)
            .list('', {
              limit: 1000,
              sortBy: { column: 'name', order: 'asc' }
            });

          if (listError) {
            console.error(`❌ Error listing files in bucket ${bucketName}:`, listError);
            continue;
          }

          if (!files || files.length === 0) {
            console.log(`📂 No files found in bucket: ${bucketName}`);
            continue;
          }

          // Filter for audio files
          const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
          const audioFiles = files.filter(file => 
            audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
          );

          console.log(`🎵 Found ${audioFiles.length} audio files in bucket: ${bucketName}`);

          // Convert to tracks with direct URLs
          const bucketTracks = audioFiles.map((file, index) => {
            const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(file.name);
            
            const cleanTitle = file.name
              .replace(/\.[^/.]+$/, '') // Remove extension
              .replace(/[_-]/g, ' ') // Replace underscores/hyphens with spaces
              .replace(/\s+/g, ' ') // Clean up multiple spaces
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ')
              .trim();

            return {
              id: `${bucketName}-${file.name}`,
              title: cleanTitle,
              artist: 'Neural Positive Music',
              storage_bucket: bucketName,
              storage_key: file.name,
              stream_url: urlData.publicUrl,
              artwork_url: crossoverClassicalArt,
              audio_status: 'working' as const,
            };
          });

          allTracks.push(...bucketTracks);
          console.log(`✅ Added ${bucketTracks.length} tracks from ${bucketName}`);
        }

        console.log(`🎯 Total tracks from storage: ${allTracks.length}`);
        
        // Set tracks directly - no complex conditions
        if (allTracks.length > 0) {
          const shuffledTracks = allTracks.sort(() => Math.random() - 0.5);
          const limitedTracks = shuffledTracks.slice(0, 50);
          setTracks(limitedTracks);
          console.log(`✅ Set ${limitedTracks.length} tracks for display`);
        } else {
          console.log('📂 No tracks found, using fallback');
          setTracks(generateFallbackTracks(selectedGenre.name, goal.name));
        }
        
      } catch (error) {
        console.error(`❌ Failed to load tracks:`, error);
        setTracks(generateFallbackTracks(selectedGenre.name, goal.name));
      } finally {
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
      
      // Play directly from bucket - bypass all APIs and edge functions
      console.log(`🎵 Playing directly from ${selectedGenre?.name} bucket:`, track);
      
      // Get the audio store and play the specific track directly
      const { playTrack } = useAudioStore.getState();
      await playTrack(track);
      
      toast.success(`Playing ${track.title}`, { id: "track-play" });
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
        <div className="space-y-3 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {goal.name}
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            {selectedGenre.name}
          </h2>
        </div>


        {/* Vertical Track List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span>Loading music collection...</span>
            </div>
          </div>
        ) : (
          <VerticalTrackList
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
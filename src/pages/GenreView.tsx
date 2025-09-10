import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrackRowCard } from '@/components/TrackRowCard';
import { THERAPEUTIC_GOALS, GOALS_BY_ID } from '@/config/therapeuticGoals';
import { getTracksFromStorage } from '@/services/storageDirectAccess';
import { useAudioStore } from '@/stores';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Fallback track generator for when storage is unavailable
const generateFallbackTracks = (genreName: string, goalName: string) => {
  const trackNames = [
    'Bach Reimagined',
    'Peaceful Focus',
    'Classical Concentration', 
    'Mozart Modern',
    'Therapeutic Symphony',
    'Ambient Classical',
    'Focus Flow',
    'Mindful Melody',
    'Serene Strings',
    'Calm Composition',
    'Tranquil Tones',
    'Gentle Harmony'
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
          buckets: ['focus-music', 'neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/117C864AE7A4E7398F43D87FFB1B21C8222AC165161EC128BBE2FEAABFB7C3A0_sk_6_cid_1.jpeg'
        },
        {
          id: 'electronic',
          name: 'Electronic',
          description: 'Ambient electronic music for focus',
          buckets: ['focus-music'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/84E41822D72BB74C3DE361758D96552D357EF3D12CFB9A4B739B8539B88001A5_sk_6_cid_1.jpeg'
        },
        {
          id: 'world-new-age',
          name: 'World & New Age',
          description: 'Global sounds and new age music',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/414EBE5027B77577DFEF40EA2823103319D32B7A8261D00D4413FCE57E22FB91_sk_6_cid_1.jpeg'
        }
      ];
    } else if (goalId === 'mood-boost') {
      return [
        {
          id: 'classical-crossover',
          name: 'Classical Crossover',
          description: 'Modern classical music with contemporary elements',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/117C864AE7A4E7398F43D87FFB1B21C8222AC165161EC128BBE2FEAABFB7C3A0_sk_6_cid_1.jpeg'
        },
        {
          id: 'electronic',
          name: 'Electronic',
          description: 'Uplifting electronic beats and rhythms',
          buckets: ['ENERGYBOOST'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/84E41822D72BB74C3DE361758D96552D357EF3D12CFB9A4B739B8539B88001A5_sk_6_cid_1.jpeg'
        },
        {
          id: 'new-age-world',
          name: 'New Age & World',
          description: 'Soothing world music and new age sounds',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/414EBE5027B77577DFEF40EA2823103319D32B7A8261D00D4413FCE57E22FB91_sk_6_cid_1.jpeg'
        },
        {
          id: 'samba-jazz',
          name: 'Samba & Jazz',
          description: 'Smooth jazz and Brazilian rhythms',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/494A919302CB58E88F52E96F4FEDDD68B9E220433097EAC2A78DF75E1BB1863D_sk_6_cid_1.jpeg'
        }
      ];
    } else if (goalId === 'energy-boost') {
      return [
        {
          id: 'classical-crossover',
          name: 'Classical Crossover',
          description: 'Energizing classical music with modern elements',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/117C864AE7A4E7398F43D87FFB1B21C8222AC165161EC128BBE2FEAABFB7C3A0_sk_6_cid_1.jpeg'
        },
        {
          id: 'electronic',
          name: 'EDM & House',
          description: 'High-energy electronic music and beats',
          buckets: ['HIIT', 'ENERGYBOOST'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/84E41822D72BB74C3DE361758D96552D357EF3D12CFB9A4B739B8539B88001A5_sk_6_cid_1.jpeg'
        },
        {
          id: 'new-age-world',
          name: 'New Age & World',
          description: 'Motivational world music and new age sounds',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/414EBE5027B77577DFEF40EA2823103319D32B7A8261D00D4413FCE57E22FB91_sk_6_cid_1.jpeg'
        },
        {
          id: 'samba-jazz',
          name: 'Samba & Jazz',
          description: 'Energetic jazz and Brazilian rhythms',
          buckets: ['ENERGYBOOST'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/494A919302CB58E88F52E96F4FEDDD68B9E220433097EAC2A78DF75E1BB1863D_sk_6_cid_1.jpeg'
        }
      ];
    } else {
      // For stress-anxiety-support and pain-support
      return [
        {
          id: 'classical-crossover',
          name: 'Classical Crossover',
          description: 'Modern classical music with contemporary elements',
          buckets: ['classicalfocus', 'neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/117C864AE7A4E7398F43D87FFB1B21C8222AC165161EC128BBE2FEAABFB7C3A0_sk_6_cid_1.jpeg'
        },
        {
          id: 'electronic',
          name: 'Electronic',
          description: 'Ambient electronic textures for healing',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/84E41822D72BB74C3DE361758D96552D357EF3D12CFB9A4B739B8539B88001A5_sk_6_cid_1.jpeg'
        },
        {
          id: 'new-age-world',
          name: 'New Age & World',
          description: 'Soothing world music and new age sounds',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/414EBE5027B77577DFEF40EA2823103319D32B7A8261D00D4413FCE57E22FB91_sk_6_cid_1.jpeg'
        },
        {
          id: 'samba-jazz',
          name: 'Samba & Jazz',
          description: 'Smooth jazz and Brazilian rhythms',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/494A919302CB58E88F52E96F4FEDDD68B9E220433097EAC2A78DF75E1BB1863D_sk_6_cid_1.jpeg'
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
        
        let fetchedTracks: any[] = [];
        let error = null;
        
        try {
          const result = await getTracksFromStorage(
            goal.backendKey, 
            50, // Load more tracks for full page view
            selectedGenre.buckets
          );
          fetchedTracks = result.tracks || [];
          error = result.error;
        } catch (storageError) {
          console.warn(`⚠️ Storage error for ${selectedGenre.name}:`, storageError);
          // Fallback to sample tracks when storage fails
          fetchedTracks = generateFallbackTracks(selectedGenre.name, goal.name);
          console.log('🔄 Using fallback tracks due to storage error');
        }
        
        if (error && (!fetchedTracks || fetchedTracks.length === 0)) {
          console.warn(`⚠️ Error loading tracks for ${selectedGenre.name}:`, error);
          // Use fallback tracks if storage error and no tracks
          fetchedTracks = generateFallbackTracks(selectedGenre.name, goal.name);
          console.log('🔄 Using fallback tracks due to error');
        }
        
        if (fetchedTracks && fetchedTracks.length > 0) {
          setTracks(fetchedTracks);
          console.log(`✅ Loaded ${fetchedTracks.length} tracks for ${selectedGenre.name}`);
        } else {
          // Emergency fallback if nothing worked
          console.warn(`⚠️ No tracks found for ${selectedGenre.name}, using emergency fallback`);
          const emergencyTracks = generateFallbackTracks(selectedGenre.name, goal.name);
          setTracks(emergencyTracks);
          console.log(`🔄 Using emergency fallback tracks (${emergencyTracks.length} tracks)`);
        }
      } catch (error) {
        console.error(`❌ Failed to load tracks for ${selectedGenre.name}:`, error);
        // Final fallback
        const emergencyTracks = generateFallbackTracks(selectedGenre.name, goal.name);
        setTracks(emergencyTracks);
        console.log(`🔄 Using final fallback tracks due to complete failure`);
      } finally {
        setIsLoading(false);
      }
    };

    loadTracks();
  }, [goal, selectedGenre]);

  // Auto-start playback when tracks load
  useEffect(() => {
    if (tracks.length > 0 && goal && !currentTrack) {
      handleAutoPlay();
    }
  }, [tracks, goal]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleAutoPlay = async () => {
    if (!goal || audioLoading) return;

    try {
      toast.loading(`Starting ${goal.name.toLowerCase()} session...`, { id: "auto-play" });
      await playFromGoal(goal.backendKey);
      toast.success(`Playing ${goal.name.toLowerCase()} music`, { id: "auto-play" });
    } catch (error) {
      console.error('❌ Failed to auto-start playback:', error);
      toast.error("Failed to start playback", { id: "auto-play" });
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

  const isTrackPlaying = (track: Track): boolean => {
    return currentTrack?.id === track.id;
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
      {/* Hero Section */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        {/* Background Image */}
        <img 
          src={selectedGenre.artwork} 
          alt={selectedGenre.name}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-8">
          <div className="max-w-7xl mx-auto w-full">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20 mb-4 md:mb-8"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            {/* Genre Info */}
            <div className="space-y-2 md:space-y-4">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {selectedGenre.name}
              </h1>
              <p className="text-base md:text-xl text-white/80 max-w-2xl">
                {selectedGenre.description}
              </p>
              <p className="text-sm md:text-lg text-white/60">
                {goal.name} • {tracks.length} tracks
              </p>
              
              {/* Play/Pause Button */}
              <div className="mt-6 md:mt-8">
                <Button
                  size="lg"
                  className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg"
                  onClick={currentTrack ? handleTogglePlay : handleAutoPlay}
                  disabled={audioLoading || isLoading}
                >
                  {audioLoading ? (
                    <>
                      <div className="w-5 h-5 md:w-6 md:h-6 mr-2 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Loading
                    </>
                  ) : isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                      Play
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tracks Section */}
      <div className="px-4 md:px-8 py-6 md:py-8 pb-24">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
                <span>Loading music collection...</span>
              </div>
            </div>
          ) : tracks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {tracks.slice(0, 12).map((track) => (
                <TrackRowCard
                  key={track.id}
                  track={track}
                  isPlaying={isTrackPlaying(track)}
                  onPlay={() => handleTrackPlay(track)}
                  className="w-full h-auto aspect-[3/4]"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No tracks available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenreView;
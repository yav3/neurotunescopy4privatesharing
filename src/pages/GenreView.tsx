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

// Import new artwork
import crossoverClassicalArt from '@/assets/crossover-classical-artwork.jpg';
import newAgeArt from '@/assets/new-age-artwork.jpg';
import electronicArt from '@/assets/electronic-artwork.jpg';

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
        
        // Start with fallback tracks immediately to prevent long loading
        const fallbackTracks = generateFallbackTracks(selectedGenre.name, goal.name);
        setTracks(fallbackTracks);
        setIsLoading(false); // Stop loading immediately with fallback tracks
        console.log(`🔄 Using fallback tracks (${fallbackTracks.length} tracks) while checking storage`);
        
        let fetchedTracks: any[] = [];
        let error = null;
        
        try {
          // Try to get tracks from storage but with shorter timeout
          const result = await Promise.race([
            getTracksFromStorage(goal.backendKey, 50, selectedGenre.buckets),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Storage timeout')), 3000))
          ]) as any;
          
          fetchedTracks = result.tracks || [];
          error = result.error;
          
          // Only replace fallback tracks if we actually found real tracks
          if (fetchedTracks && fetchedTracks.length > 0) {
            setTracks(fetchedTracks);
            console.log(`✅ Loaded ${fetchedTracks.length} real tracks for ${selectedGenre.name}`);
          }
        } catch (storageError) {
          console.warn(`⚠️ Storage timeout or error for ${selectedGenre.name}:`, storageError);
          // Keep using fallback tracks - no need to update state
        }
        
      } catch (error) {
        console.error(`❌ Failed to load tracks for ${selectedGenre.name}:`, error);
        // Ensure we have fallback tracks
        const emergencyTracks = generateFallbackTracks(selectedGenre.name, goal.name);
        setTracks(emergencyTracks);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/80 relative overflow-hidden">
      {/* Glassmorphism background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/4 -right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      {/* Hero Section */}
      <div className="relative h-80 md:h-[28rem] overflow-hidden">
        {/* Background Image with glassmorphism overlay */}
        <div className="relative w-full h-full">
          <img 
            src={selectedGenre.artwork} 
            alt={selectedGenre.name}
            className="w-full h-full object-cover opacity-60"
          />
          
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background/90 backdrop-blur-sm" />
          
          {/* Glass morphism content card */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
            <div className="max-w-7xl mx-auto w-full">
              {/* Back Button */}
              <Button 
                variant="ghost" 
                className="glass-morphism text-foreground/80 hover:text-foreground hover:bg-background/20 mb-6 md:mb-8 backdrop-blur-md border border-border/20"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              
              {/* Genre Info in glass card */}
              <div className="glass-morphism p-6 md:p-8 rounded-2xl backdrop-blur-xl border border-border/20 bg-background/10 max-w-3xl">
                <div className="space-y-3 md:space-y-4">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight font-sf-pro">
                    {selectedGenre.name}
                  </h1>
                  <p className="text-base md:text-xl text-muted-foreground max-w-2xl">
                    {selectedGenre.description}
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    {goal.name}
                  </div>
                  
                  {/* Play/Pause Button */}
                  <div className="pt-4">
                    <Button
                      size="lg"
                      className="h-12 md:h-14 px-8 md:px-10 text-base md:text-lg bg-primary/90 hover:bg-primary backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={currentTrack ? handleTogglePlay : handleAutoPlay}
                      disabled={audioLoading || isLoading}
                    >
                      {audioLoading ? (
                        <>
                          <div className="w-5 h-5 md:w-6 md:h-6 mr-2 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                          Loading
                        </>
                      ) : isPlaying ? (
                        <>
                          <Pause className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                          Pause Session
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                          Begin Session
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tracks Section */}
      <div className="relative px-4 md:px-8 py-8 md:py-12 pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-sf-pro">
              {tracks.length}+ tracks available
            </h2>
            <p className="text-muted-foreground">
              Therapeutic grade • Ready to play
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="glass-morphism inline-flex items-center gap-3 px-6 py-4 rounded-full backdrop-blur-xl border border-border/20 bg-background/10">
                <div className="w-5 h-5 rounded-full bg-primary animate-pulse"></div>
                <span className="text-foreground">Loading music collection...</span>
              </div>
            </div>
          ) : tracks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {tracks.slice(0, 12).map((track) => (
                <div key={track.id} className="glass-morphism-card group">
                  <TrackRowCard
                    track={track}
                    isPlaying={isTrackPlaying(track)}
                    onPlay={() => handleTrackPlay(track)}
                    className="w-full h-auto aspect-[3/4] border-0 bg-transparent hover:bg-background/5 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="glass-morphism inline-flex items-center gap-3 px-6 py-4 rounded-full backdrop-blur-xl border border-border/20 bg-background/10">
                <p className="text-muted-foreground">
                  No tracks available
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenreView;
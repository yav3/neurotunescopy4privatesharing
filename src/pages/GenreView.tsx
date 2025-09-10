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
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/C88246F2851BBECC71585D1F76802BE14EEDFE1EEFFCE560ED39938CEB786A40_sk_6_cid_1%20(1).jpeg'
        },
        {
          id: 'electronic',
          name: 'Electronic',
          description: 'Ambient electronic music for focus',
          buckets: ['focus-music'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/241F64A3035F4873DDECA5B3F913F9FA9B13EA7CBD1E568152E113519DB472BB_sk_6_cid_1%20(1).jpeg'
        },
        {
          id: 'world-new-age',
          name: 'World & New Age',
          description: 'Global sounds and new age music',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/86AA1A7D3B84B7D5EA536D984AC2D75F6ECCD149DFF3B665F5D94AECA777AE30_sk_6_cid_1%20(1).jpeg'
        }
      ];
    } else if (goalId === 'mood-boost') {
      return [
        {
          id: 'classical-crossover',
          name: 'Classical Crossover',
          description: 'Modern classical music with contemporary elements',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/C88246F2851BBECC71585D1F76802BE14EEDFE1EEFFCE560ED39938CEB786A40_sk_6_cid_1%20(1).jpeg'
        },
        {
          id: 'electronic',
          name: 'Electronic',
          description: 'Uplifting electronic beats and rhythms',
          buckets: ['ENERGYBOOST'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/84E41822D72BB74C3DE361758D96552D357EF3D12CFB9A4B739B8539B88001A5_sk_6_cid_1%20(1).jpeg'
        },
        {
          id: 'new-age-world',
          name: 'New Age & World',
          description: 'Soothing world music and new age sounds',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/429A6F36DE97D9EC84D8B6FE222AF037FC120E389CE2148819653E61EC48C50F_sk_6_cid_1%20(1).jpeg'
        },
        {
          id: 'samba-jazz',
          name: 'Samba & Jazz',
          description: 'Smooth jazz and Brazilian rhythms',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/97C5C02513BFA6AD3D0CDC1C512840EA792FBD12DC992D536C556CD40FE31E19_sk_6_cid_1%20(1).jpeg'
        }
      ];
    } else if (goalId === 'energy-boost') {
      return [
        {
          id: 'classical-crossover',
          name: 'Classical Crossover',
          description: 'Energizing classical music with modern elements',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/C88246F2851BBECC71585D1F76802BE14EEDFE1EEFFCE560ED39938CEB786A40_sk_6_cid_1%20(1).jpeg'
        },
        {
          id: 'electronic',
          name: 'Electronic',
          description: 'High-energy electronic music and beats',
          buckets: ['ENERGYBOOST'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/341FC8389CC6512FE7F09A03DA617996E167E0D2D642355A24537D37DF6B5997_sk_6_cid_1%20(1).jpeg'
        },
        {
          id: 'new-age-world',
          name: 'New Age & World',
          description: 'Motivational world music and new age sounds',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/414EBE5027B77577DFEF40EA2823103319D32B7A8261D00D4413FCE57E22FB91_sk_6_cid_1%20(1).jpeg'
        },
        {
          id: 'samba-jazz',
          name: 'Samba & Jazz',
          description: 'Energetic jazz and Brazilian rhythms',
          buckets: ['ENERGYBOOST'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/99BE3D3797F87CE9A6CD4EDF860ED60E194A89125A96A92434A2E67ADC2AB52F_sk_6_cid_1%20(1).jpeg'
        }
      ];
    } else {
      // For stress-anxiety-support and pain-support
      return [
        {
          id: 'classical-crossover',
          name: 'Classical Crossover',
          description: 'Modern classical music with contemporary elements',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/C88246F2851BBECC71585D1F76802BE14EEDFE1EEFFCE560ED39938CEB786A40_sk_6_cid_1%20(1).jpeg'
        },
        {
          id: 'new-age-world',
          name: 'New Age & World',
          description: 'Soothing world music and new age sounds',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/436AD4981FBCBAA958102476AC118A5FBBC39BC3E584CE80656B411DB5284875_sk_6_cid_1%20(1).jpeg'
        },
        {
          id: 'samba-jazz',
          name: 'Samba & Jazz',
          description: 'Smooth jazz and Brazilian rhythms',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/89C29BE0159665B8CE7F212E30C03CAB8D9E3A90F7D1F90C7E4615F97659919B_sk_6_cid_1%20(1).jpeg'
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
        
        const { tracks: fetchedTracks, error } = await getTracksFromStorage(
          goal.backendKey, 
          50, // Load more tracks for full page view
          selectedGenre.buckets
        );
        
        if (error) {
          console.warn(`⚠️ Error loading tracks for ${selectedGenre.name}:`, error);
        }
        
        if (fetchedTracks && fetchedTracks.length > 0) {
          setTracks(fetchedTracks);
          console.log(`✅ Loaded ${fetchedTracks.length} tracks for ${selectedGenre.name}`);
        } else {
          console.warn(`⚠️ No tracks found for ${selectedGenre.name}`);
        }
      } catch (error) {
        console.error(`❌ Failed to load tracks for ${selectedGenre.name}:`, error);
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
      <div className="relative h-96 overflow-hidden">
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
              className="text-white hover:bg-white/20 mb-8"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            {/* Genre Info */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                {selectedGenre.name}
              </h1>
              <p className="text-xl text-white/80 max-w-2xl">
                {selectedGenre.description}
              </p>
              <p className="text-lg text-white/60">
                {goal.name} • {tracks.length} tracks
              </p>
              
              {/* Play/Pause Button */}
              <div className="flex items-center gap-4 mt-8">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg"
                  onClick={currentTrack ? handleTogglePlay : handleAutoPlay}
                  disabled={audioLoading || isLoading}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 mr-2" />
                  ) : (
                    <Play className="w-6 h-6 mr-2" />
                  )}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                
                {isLoading && (
                  <div className="text-white/60">Loading tracks...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tracks Grid */}
      <div className="px-4 md:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {Array.from({ length: 24 }).map((_, i) => (
                <div 
                  key={i} 
                  className="aspect-square bg-muted animate-pulse rounded-lg" 
                />
              ))}
            </div>
          ) : tracks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {tracks.map((track) => (
                <TrackRowCard
                  key={track.id}
                  track={track}
                  isPlaying={isTrackPlaying(track)}
                  onPlay={() => handleTrackPlay(track)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No tracks available for {selectedGenre.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenreView;
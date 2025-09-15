import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGenreOptions } from '@/config/genreConfigs';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VerticalTrackList } from '@/components/VerticalTrackList';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';
import { useAudioStore } from '@/stores';
import { toast } from 'sonner';
import { formatTrackTitleForDisplay } from '@/utils/trackTitleFormatter';
import { playFromGenre } from '@/actions/playFromGoal';
import { TherapeuticMusicDebugger } from '@/utils/musicDebugger';

interface Track {
  id: string;
  title: string;
  url: string;
  bucket: string;
  folder: string;
  artwork_url: string;
  size: number;
}

export const GenreView: React.FC = () => {
  console.log('🚀 GenreView component loaded at:', new Date().toISOString());
  const { goalId, genreId } = useParams<{ goalId: string; genreId: string }>();
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isTracksLoading, setIsTracksLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isPlaying, play, pause, isLoading } = useAudioStore();

  const goal = goalId ? GOALS_BY_ID[goalId] : null;
  
  // Get the genre configuration
  const genreOptions = goalId ? getGenreOptions(goalId) : [];
  const selectedGenre = genreOptions.find(genre => genre.id === genreId);
  
  // Debug logs to see what's happening with genre selection
  console.log('🔍 DEBUG - URL params:', { goalId, genreId });
  console.log('🔍 DEBUG - Available genres for goal:', genreOptions.map(g => ({ id: g.id, name: g.name, buckets: g.buckets })));
  console.log('🔍 DEBUG - Selected genre:', selectedGenre ? { id: selectedGenre.id, name: selectedGenre.name, buckets: selectedGenre.buckets } : 'NOT FOUND');

  // Simple direct bucket loading
  useEffect(() => {
    if (!goal || !selectedGenre) return;

    const loadTracksDirectly = async () => {
      setIsTracksLoading(true);
      setTracks([]);
      setError(null);
      
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        let allTracks: Track[] = [];

        console.log(`🎵 DIRECT BUCKET ACCESS - Loading from:`, selectedGenre.buckets);

        for (const bucketName of selectedGenre.buckets) {
          console.log(`📂 Accessing bucket: ${bucketName}`);
          
          // Get all files from bucket
          const { data: files, error } = await supabase.storage
            .from(bucketName)
            .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });

          if (error) {
            console.error(`❌ Error accessing bucket ${bucketName}:`, error);
            continue;
          }

          if (files && files.length > 0) {
            console.log(`✅ Found ${files.length} items in ${bucketName}`);
            
            // Filter for audio files
            const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
            const audioFiles = files.filter(file => 
              audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
            );

            console.log(`🎵 Audio files in ${bucketName}: ${audioFiles.length}`);

            // Convert to Track objects
            for (const file of audioFiles) {
              const { data } = supabase.storage.from(bucketName).getPublicUrl(file.name);
              
              allTracks.push({
                id: `${bucketName}-${file.name}-${Date.now()}`,
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                url: data.publicUrl,
                bucket: bucketName,
                folder: '',
                artwork_url: selectedGenre.image,
                size: file.metadata?.size || 0
              });
            }
          } else {
            console.log(`📂 No files found in bucket: ${bucketName}`);
          }
        }

        console.log(`🎯 TOTAL TRACKS LOADED: ${allTracks.length}`);
        
        // Debug the music connection
        const musicDebugger = new TherapeuticMusicDebugger();
        musicDebugger.debugMusicConnection(selectedGenre, allTracks);
        
        if (allTracks.length > 0) {
          setTracks(allTracks);
        } else {
          setError('No music files found in the designated buckets.');
        }
        
      } catch (error) {
        console.error('❌ Failed to load tracks from buckets:', error);
        setError('Failed to load music. Please try again.');
      } finally {
        setIsTracksLoading(false);
      }
    };

    loadTracksDirectly();
  }, [goal?.id, selectedGenre?.id, JSON.stringify(selectedGenre?.buckets)]);

  const handleTrackPlay = async (track: Track) => {
    try {
      const audioStore = useAudioStore.getState();
      await audioStore.setQueue([track], 0);
      await audioStore.play();
      toast.success(`Now playing: ${formatTrackTitleForDisplay(track.title)}`);
    } catch (error) {
      toast.error("Failed to play track");
    }
  };

  const handleTogglePlay = async () => {
    try {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } catch (error) {
      toast.error("Failed to toggle playback");
    }
  };

  if (isTracksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading music...</p>
        </div>
      </div>
    );
  }

  if (!goal || !selectedGenre) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Goal or genre not found</p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-8">
          <Button 
            onClick={() => navigate(`/goals/${goalId}/genres`)} 
            variant="ghost" 
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Genres
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <img 
              src={selectedGenre.image} 
              alt={selectedGenre.name}
              className="w-full lg:w-48 h-48 object-cover rounded-xl shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {selectedGenre.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                {selectedGenre.description}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {tracks.length} tracks available
                </span>
                <Button 
                  onClick={async () => {
                    try {
                      await playFromGenre(goalId!, selectedGenre.buckets);
                      toast.success(`Playing ${selectedGenre.name}`);
                    } catch (error) {
                      toast.error('Failed to start music');
                    }
                  }}
                  className="bg-primary hover:bg-primary/90"
                  disabled={tracks.length === 0}
                >
                  Play All
                </Button>
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : tracks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No tracks found for this genre</p>
          </div>
        ) : (
          <VerticalTrackList
            tracks={tracks}
            onTrackPlay={handleTrackPlay}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default GenreView;
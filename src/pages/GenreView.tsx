import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VerticalTrackList } from '@/components/VerticalTrackList';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';
import { useAudioStore } from '@/stores';
import { toast } from 'sonner';
import { formatTrackTitleForDisplay } from '@/utils/trackTitleFormatter';
import { createTherapeuticDebugger } from '@/utils/therapeuticConnectionDebugger';
import { TherapeuticMusicDebugger } from '@/utils/therapeuticMusicDebugger';
import { playFromGenre } from '@/actions/playFromGoal';

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
  const { goalId, genreId } = useParams<{ goalId: string; genreId: string }>();
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isPlaying, play, pause, isLoading: audioLoading } = useAudioStore();
  const loadLock = useRef(false);
  const lastLoadKey = useRef<string>('');

  const goal = goalId ? GOALS_BY_ID[goalId] : null;
  
  // Get the actual genre configuration with correct buckets
  const { getGenreOptions } = require('@/config/genreConfigs');
  const genreOptions = goalId ? getGenreOptions(goalId) : [];
  const selectedGenre = genreOptions.find(genre => genre.id === genreId);

  // Comprehensive debug logging
  useEffect(() => {
    if (goal && selectedGenre) {
      const connectionDebugger = createTherapeuticDebugger([selectedGenre], goal.musicBuckets || []);
      connectionDebugger.debugConnections();

      // Add the comprehensive music debugger
      const musicDebugger = new TherapeuticMusicDebugger();
      
      console.log('🔍 COMPREHENSIVE MUSIC BUCKET DEBUG');
      console.log('Goal:', goal.name);
      console.log('Genre:', selectedGenre.name);
      console.log('Genre Buckets:', selectedGenre.buckets);
      
      // Test classical focus specifically
      if (selectedGenre.id === 'crossover-classical') {
        musicDebugger.testClassicalFocusBucket([]);
      }
      
      // Debug the selected genre as a bucket
      musicDebugger.debugMusicConnection(selectedGenre, tracks || []);
    }
  }, [goal, selectedGenre, tracks]);

  // Load tracks with enhanced folder traversal
  useEffect(() => {
    if (!goal || !selectedGenre) return;

    const loadKey = `${goal.id}:${selectedGenre.id}:${selectedGenre.buckets.join(',')}`;
    if (loadLock.current && lastLoadKey.current === loadKey) return;

    let cancelled = false;
    lastLoadKey.current = loadKey;

    const loadTracks = async () => {
      if (cancelled) return;
      setIsLoading(true);
      setTracks([]);
      setError(null);
      
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        let allTracks: Track[] = [];

        console.log(`🎵 Loading ${selectedGenre.name} tracks from buckets:`, selectedGenre.buckets);
        console.log(`🔍 CRITICAL DEBUG - Selected Genre Buckets:`, selectedGenre.buckets);
        console.log(`🔍 CRITICAL DEBUG - Is Classical Crossover?`, selectedGenre.id === 'crossover-classical');

        // Process each bucket with enhanced folder handling
        for (const bucketPath of selectedGenre.buckets) {
          console.log(`🗂️ Processing bucket path: ${bucketPath}`);
          
          let bucketName: string;
          let specificFolder: string;
          
          if (bucketPath.includes('/')) {
            const parts = bucketPath.split('/');
            bucketName = parts[0];
            specificFolder = parts.slice(1).join('/');
          } else {
            bucketName = bucketPath;
            specificFolder = '';
          }

          // Check bucket structure for debugging
          const { data: rootFiles, error: rootError } = await supabase.storage
            .from(bucketName)
            .list('', { limit: 100 });
          
          if (!rootError && rootFiles) {
            console.log(`📂 Root level of ${bucketName}:`, rootFiles.length, 'items');
            
            const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
            const folders = rootFiles.filter(f => !f.name.includes('.'));
            const directFiles = rootFiles.filter(f => audioExtensions.some(ext => f.name.toLowerCase().endsWith(ext)));
            
            console.log(`📁 Folders: ${folders.length}, Direct audio files: ${directFiles.length}`);

            // Handle direct files in root
            if (directFiles.length > 0) {
              for (const file of directFiles.slice(0, 10)) {
                const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(file.name);
                if (urlData?.publicUrl) {
                  allTracks.push({
                    id: `${bucketName}-${file.name}-${Date.now()}-${Math.random()}`,
                    title: file.name,
                    url: urlData.publicUrl,
                    bucket: bucketName,
                    folder: '',
                    artwork_url: selectedGenre.image,
                    size: file.metadata?.size || 0
                  });
                }
              }
            }

            // Handle folders
            for (const folder of folders.slice(0, 5)) {
              const { data: folderFiles } = await supabase.storage
                .from(bucketName)
                .list(folder.name, { limit: 100 });
              
              if (folderFiles) {
                const folderAudioFiles = folderFiles.filter(f => 
                  audioExtensions.some(ext => f.name.toLowerCase().endsWith(ext))
                );
                
                console.log(`🎵 Found ${folderAudioFiles.length} audio files in folder: ${folder.name}`);
                
                for (const file of folderAudioFiles.slice(0, 10)) {
                  const fullPath = `${folder.name}/${file.name}`;
                  const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fullPath);
                  if (urlData?.publicUrl) {
                    allTracks.push({
                      id: `${bucketName}-${fullPath}-${Date.now()}-${Math.random()}`,
                      title: file.name,
                      url: urlData.publicUrl,
                      bucket: bucketName,
                      folder: folder.name,
                      artwork_url: selectedGenre.image,
                      size: file.metadata?.size || 0
                    });
                  }
                }
              }
            }
          }
        }

        console.log(`🎯 Total tracks found: ${allTracks.length}`);
        
        if (allTracks.length > 0) {
          // Shuffle and set tracks
          const shuffledTracks = allTracks.sort(() => Math.random() - 0.5);
          setTracks(shuffledTracks.slice(0, 50));
        } else {
          setError('No music found for this genre.');
        }
        
      } catch (error) {
        console.error('Failed to load tracks:', error);
        setError('Failed to load music. Please try again.');
      } finally {
        setIsLoading(false);
        if (!cancelled) loadLock.current = false;
      }
    };

    loadTracks();
    return () => { cancelled = true; loadLock.current = false; };
  }, [goal?.id, selectedGenre?.id]);

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

  if (isLoading) {
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
            onTogglePlay={() => isPlaying ? pause() : play()}
            isLoading={audioLoading}
          />
        )}
      </div>
    </div>
  );
};

export default GenreView;
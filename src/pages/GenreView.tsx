import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { useAudioStore } from '@/stores/audioStore';
import { Track } from '@/types/simpleTrack';
import { getCategoryById } from '@/config/therapeuticCategories';
import { SimpleStorageService } from '@/services/simpleStorageService';

export default function GenreView() {
  const { goalId } = useParams();
  const navigate = useNavigate();
  
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isTracksLoading, setIsTracksLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const category = goalId ? getCategoryById(goalId) : null;

  console.log('🔍 DEBUG - Category ID:', goalId);
  console.log('🔍 DEBUG - Found category:', category);

  // Load tracks using simple storage service
  useEffect(() => {
    if (!category) {
      console.log('❌ No category available');
      setError('No therapeutic category specified.');
      setIsTracksLoading(false);
      return;
    }

    const loadCategoryTracks = async () => {
      setIsTracksLoading(true);
      setTracks([]);
      setError(null);
      
      try {
        console.log(`🎯 Loading tracks for category: ${category.name}`);
        
        // Use simple storage service - no complex conversions needed
        const tracks = await SimpleStorageService.getTracksFromCategory(category.id, 200);
        
        if (tracks.length > 0) {
          console.log(`✅ Loaded ${tracks.length} tracks for category`);
          setTracks(tracks);
        } else {
          setError('No music tracks found for this category.');
        }
        
      } catch (error) {
        console.error('❌ Failed to load category tracks:', error);
        setError('Failed to load music. Please try again.');
      } finally {
        setIsTracksLoading(false);
      }
    };

    loadCategoryTracks();
  }, [category?.id]);

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
    navigate('/');
  };

  const handleRetry = () => {
    // Trigger a reload by updating the dependency
    setError(null);
    setTracks([]);
  };

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={handleBack} variant="ghost" className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Categories
      </Button>

      <div className="mb-8">
        <div 
          className="relative h-64 rounded-lg bg-cover bg-center mb-6"
          style={{ backgroundImage: `url(${category.image})` }}
        >
          <div className="absolute inset-0 bg-black/40 rounded-lg flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
              <p className="text-lg opacity-90">{category.description}</p>
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
          <p className="text-muted-foreground">No tracks found for this category.</p>
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
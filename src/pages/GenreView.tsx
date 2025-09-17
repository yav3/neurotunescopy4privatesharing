import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { useAudioStore } from '@/stores/audioStore';
import { Track as SimpleTrack } from '@/types/simpleTrack';
import { Track as AudioTrack } from '@/types';
import { getGenreOptions } from '@/config/genreConfigs';
import { SimpleStorageService } from '@/services/simpleStorageService';

export default function GenreView() {
  const { goalId, genreId } = useParams();
  const navigate = useNavigate();
  
  const [tracks, setTracks] = useState<SimpleTrack[]>([]);
  const [isTracksLoading, setIsTracksLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to convert SimpleTrack to AudioTrack for the audio store
  const convertToAudioTrack = (simpleTrack: SimpleTrack): AudioTrack => {
    return {
      id: simpleTrack.id,
      title: simpleTrack.title,
      artist: simpleTrack.artist || 'Therapeutic Music',
      stream_url: simpleTrack.url,
      storage_bucket: simpleTrack.bucket,
      storage_key: simpleTrack.folder ? `${simpleTrack.folder}/${simpleTrack.title}` : simpleTrack.title,
      duration: simpleTrack.duration,
      bpm: simpleTrack.bpm,
      album_art_url: simpleTrack.artwork_url,
      audio_status: 'working' as const
    };
  };

  // Get the specific genre from the configuration
  const genres = goalId ? getGenreOptions(goalId) : [];
  const genre = genres.find(g => g.id === genreId);

  console.log('🔍 DEBUG - Goal ID:', goalId);
  console.log('🔍 DEBUG - Genre ID:', genreId);
  console.log('🔍 DEBUG - Found genre:', genre);

  // Immediate bucket diagnostics for painreducingworld
  useEffect(() => {
    if (genre?.buckets.includes('painreducingworld')) {
      import('@/utils/bucketDiagnostics').then(({ BucketDiagnostics }) => {
        console.log('🚨 PAINREDUCINGWORLD BUCKET DIAGNOSTICS - Starting immediate check...');
        BucketDiagnostics.checkBucketDetails('painreducingworld');
      });
    }
  }, [genre]);

  // Load tracks using simple storage service
  useEffect(() => {
    if (!genre) {
      console.log('❌ No genre available');
      setError('Genre not found.');
      setIsTracksLoading(false);
      return;
    }

    const loadGenreTracks = async () => {
      setIsTracksLoading(true);
      setTracks([]);
      setError(null);
      
      try {
        console.log(`🎯 Loading tracks for genre: ${genre.name} with buckets: ${genre.buckets.join(', ')}`);
        
        // Use the specific genre buckets instead of category buckets
        const tracks = await SimpleStorageService.getTracksFromBuckets(genre.buckets, 200);
        
        if (tracks.length > 0) {
          console.log(`✅ Loaded ${tracks.length} tracks for genre`);
          setTracks(tracks);
        } else {
          console.warn(`⚠️ No tracks found for genre: ${genre.name}, buckets: ${genre.buckets.join(', ')}`);
          console.log('🔍 This could mean:');
          console.log('  1. Bucket(s) do not exist in Supabase');
          console.log('  2. Bucket(s) exist but are empty');
          console.log('  3. Bucket(s) exist but contain no audio files');
          console.log('  4. Permission issues accessing bucket(s)');
          setError('No music tracks found for this genre.');
        }
        
      } catch (error) {
        console.error(`❌ Error loading genre tracks:`, error);
        setError('Failed to load music tracks for this genre.');
      } finally {
        setIsTracksLoading(false);
      }
    };

    loadGenreTracks();
  }, [genre?.id]);

  // Audio store actions
  const { play, setQueue } = useAudioStore();

  const handleTrackPlay = async (track: SimpleTrack) => {
    console.log('🎵 Playing single track:', track.title);
    const audioTrack = convertToAudioTrack(track);
    await setQueue([audioTrack], 0);
    await play();
  };

  const handlePlayAll = async () => {
    if (tracks.length === 0) return;
    
    console.log(`🎵 Playing all ${tracks.length} tracks`);
    const audioTracks = tracks.map(convertToAudioTrack);
    await setQueue(audioTracks, 0);
    await play();
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleRetry = () => {
    console.log('🔄 Retrying to load tracks...');
    
    // Import and run diagnostics
    import('@/utils/bucketDiagnostics').then(({ BucketDiagnostics }) => {
      if (goalId && genreId) {
        BucketDiagnostics.checkSpecificGenre(goalId, genreId);
      }
    });
    
    setError(null);
    setTracks([]);
    
    // Trigger re-fetch by updating the dependency
    if (genre) {
      const event = new CustomEvent('retry-load');
      window.dispatchEvent(event);
    }
  };

  if (!genre) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Genre Not Found</h2>
          <Button onClick={handleBack}>Back to Home</Button>
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
        {/* Genre Banner */}
        <div className="relative mb-8 rounded-xl overflow-hidden">
          <div className="aspect-[3/1] relative">
            <img 
              src={genre.image}
              alt={genre.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h2 className="text-3xl font-bold text-white mb-2">{genre.name}</h2>
              <p className="text-white/80">{genre.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <Button onClick={handlePlayAll} disabled={tracks.length === 0 || isTracksLoading}>
            <Play className="h-4 w-4 mr-2" />
            Play All ({tracks.length})
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
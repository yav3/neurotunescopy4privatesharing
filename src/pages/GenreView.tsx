import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { useAudioStore } from '@/stores/audioStore';
import { Track as SimpleTrack } from '@/types/simpleTrack';
import { Track as AudioTrack } from '@/types';
import { getGenreOptions } from '@/config/genreConfigs';
import { DirectBucketAccess } from '@/services/directBucketAccess';
import { useAsyncEffect } from '@/hooks/useAsyncEffect';

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

  // Initialize state when route params change - no continuous debug logs
  useEffect(() => {
    if (!genre) {
      setError('Genre not found.');
      setIsTracksLoading(false);
      return;
    }

    setIsTracksLoading(true);
    setTracks([]);
    setError(null);

    // Run diagnostics for specific bucket (non-blocking, no debug logs)
    if (genre.buckets.includes('painreducingworld')) {
      import('@/utils/bucketDiagnostics').then(({ BucketDiagnostics }) => {
        BucketDiagnostics.checkBucketDetails('painreducingworld');
      }).catch(console.error);
    }
  }, [goalId, genreId]); // Only depend on route params, not derived objects

  // Safe async effect for loading tracks with race condition protection - BUCKET ROOTS ONLY
  useAsyncEffect(
    async (signal: AbortSignal) => {
      if (!genre) {
        throw new Error('Genre not found.');
      }
      
      // Check if request was aborted before making network call
      if (signal.aborted) {
        throw new Error('Request aborted');
      }
      
      // Use DIRECT bucket root access - no folders, no subpaths
      const rawTracks = await DirectBucketAccess.getTracksFromBucketRoots(genre.buckets);
      
      // Check if request was aborted after network call
      if (signal.aborted) {
        throw new Error('Request aborted');
      }
      
      // Convert to SimpleTrack format
      const tracks: SimpleTrack[] = rawTracks.map(rawTrack => ({
        id: rawTrack.id,
        title: rawTrack.title,
        url: rawTrack.url,
        bucket: rawTrack.bucket,
        folder: rawTrack.folder,
        artist: 'Neural Positive Music',
        duration: rawTrack.size ? Math.floor(rawTrack.size / 1000) : undefined
      }));
      
      return tracks;
    },
    (tracks: SimpleTrack[]) => {
      if (tracks.length > 0) {
        setTracks(tracks);
        setError(null);
      } else {
        setError('No music tracks found in bucket roots for this genre.');
        setTracks([]);
      }
      setIsTracksLoading(false);
    },
    (error: Error) => {
      setError('Failed to load music tracks from bucket roots.');
      setTracks([]);
      setIsTracksLoading(false);
    },
    [goalId, genreId] // Depend on route params only
  );

  // Audio store actions
  const { playTrack, setQueue, play } = useAudioStore();

  const handleTrackPlay = async (track: SimpleTrack) => {
    console.log('🎵 Playing single track:', track.title);
    const audioTrack = convertToAudioTrack(track);
    
    // Use atomic playTrack operation to prevent race conditions
    await playTrack(audioTrack);
  };

  const handlePlayAll = async () => {
    if (tracks.length === 0) return;
    
    console.log(`🎵 Playing all ${tracks.length} tracks`);
    const audioTracks = tracks.map(convertToAudioTrack);
    
    // Atomic operation: set queue and play first track
    await setQueue(audioTracks, 0);
    await play();
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleRetry = () => {
    console.log('🔄 Retrying to load tracks...');
    
    // Run diagnostics in background (non-blocking)
    import('@/utils/bucketDiagnostics').then(({ BucketDiagnostics }) => {
      if (goalId && genreId) {
        BucketDiagnostics.checkSpecificGenre(goalId, genreId);
      }
    });
    
    // Reset state to trigger re-fetch via useAsyncEffect dependency
    setError(null);
    setTracks([]);
    setIsTracksLoading(true);
    
    // Force re-render to trigger useAsyncEffect with current genre
    // The useAsyncEffect hook will handle the actual retry logic safely
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
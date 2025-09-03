import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAudioStore } from "@/stores";
import { SupabaseService } from "@/services/supabase";
import FullPlayer from "@/components/FullPlayer";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const PlayerPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentTrack, playTrack } = useAudioStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('🎵 PlayerPage - currentTrack:', currentTrack?.title);

  useEffect(() => {
    const trackId = searchParams.get('track');
    
    // If no track is specified and no current track, try to load a demo track
    if (!trackId && !currentTrack) {
      const loadDemoTrack = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          // Get any available track for demo
          const demoTracks = await SupabaseService.fetchTracks({ limit: 1 });
          
          if (demoTracks.length > 0) {
            console.log('Loading demo track for empty player:', demoTracks[0]);
            await playTrack(demoTracks[0]);
            return; // Don't navigate away if we successfully loaded a demo track
          }
          
          // If no tracks available, go to home
          navigate('/');
        } catch (error) {
          console.error('Failed to load demo track:', error);
          navigate('/');
        } finally {
          setIsLoading(false);
        }
      };

      loadDemoTrack();
      return;
    }

    // If track ID is specified and it's different from current track, load it
    if (trackId && (!currentTrack || currentTrack.id !== trackId)) {
      const fetchAndLoadTrack = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          const track = await SupabaseService.getTrackById(trackId);
          
          if (!track) {
            setError('Track not found');
            return;
          }
          
          await playTrack(track);
        } catch (error) {
          console.error('Failed to load track:', error);
          setError('Failed to load track');
        } finally {
          setIsLoading(false);
        }
      };

      fetchAndLoadTrack();
    }
  }, [searchParams, currentTrack, navigate, playTrack]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p className="text-muted-foreground">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Go Home
        </button>
      </div>
    );
  }

  return <FullPlayer />;
};

export default PlayerPage;
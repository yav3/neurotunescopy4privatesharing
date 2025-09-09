import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, Music, Loader2, Play, Pause, SkipForward } from 'lucide-react';
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';

const AIDJ = () => {
  const [activeNavTab, setActiveNavTab] = useState("ai-dj");
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  
  // Refs for cleanup and event handlers
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const audioHandlersRef = useRef<{ended?: () => void, error?: (e: any) => void}>({});

  const generateFlowPlaylist = useCallback(async (flowType) => {
    if (!isMountedRef.current) return;
    
    // Abort any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    if (isMountedRef.current) {
      setLoading(flowType);
      setError(null);
      setPlaylist(null);
    }

    try {
      console.log(`Generating ${flowType} playlist...`);

      // Step 1: Query database for working tracks
      let query = supabase
        .from('tracks')
        .select('*')
        .eq('audio_status', 'working')
        .not('id', 'is', null);

      // Step 2: Filter tracks based on flow type
      if (flowType === 'focus') {
        query = query
          .gte('bpm', 60)
          .lte('bpm', 100)
          .or('therapeutic_use.cs.{meditation,mindfulness,focus},genre.ilike.%instrumental%,genre.ilike.%ambient%,genre.ilike.%classical%');
      } else if (flowType === 'energy') {
        query = query
          .gte('bpm', 90)
          .lte('bpm', 140)
          .or('therapeutic_use.cs.{energy,motivation},genre.ilike.%electronic%,genre.ilike.%pop%,genre.ilike.%house%');
      }

      const { data: tracks, error: queryError } = await query.limit(50);

      // Check if component is still mounted
      if (!isMountedRef.current) return;

      if (queryError) {
        throw new Error(`Database query failed: ${queryError.message}`);
      }

      console.log(`Found ${tracks?.length || 0} tracks in database`);

      if (!tracks || tracks.length === 0) {
        throw new Error('No matching tracks found for this flow type');
      }

      // Step 3: Randomize and select tracks
      const shuffled = tracks
        .sort(() => Math.random() - 0.5)
        .slice(0, 8); // Take up to 8 tracks

      // Step 4: Generate signed URLs and create playlist
      const playlistTracks = [];
      
      for (let i = 0; i < shuffled.length; i++) {
        const track = shuffled[i];
        try {
          console.log(`Trying to create signed URL for track: ${track.title}, storage_key: ${track.storage_key}`);
          
          const { data: urlData, error: urlError } = await supabase.storage
            .from('audio')
            .createSignedUrl(track.storage_key, 3600); // 1 hour expiry

          if (urlData?.signedUrl) {
            console.log(`✅ Successfully created signed URL for: ${track.title}`);
            playlistTracks.push({
              id: track.id,
              title: track.title || 'Unknown Title',
              artist: track.genre || 'Unknown Artist',
              fileName: track.storage_key?.split('/').pop() || 'unknown.mp3',
              stream_url: urlData.signedUrl,
              duration: null,
              index: playlistTracks.length + 1,
              bpm: track.bpm,
              genre: track.genre
            });
          } else {
            console.warn(`❌ Failed to create signed URL for track ${track.title}:`, urlError);
          }
        } catch (err) {
          console.warn(`❌ Error creating signed URL for track ${track.title}:`, err);
        }
      }

      const result = {
        goal: flowType,
        count: playlistTracks.length,
        description: flowType === 'focus' 
          ? 'Curated instrumental tracks for deep concentration'
          : 'High-energy tracks to boost motivation and performance',
        playlist: playlistTracks
      };

      console.log(`Generated playlist with ${result.playlist.length} tracks`);
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setPlaylist(result);
      }

    } catch (err) {
      console.error("FlowState playlist generation error:", err);
      if (isMountedRef.current && !abortControllerRef.current?.signal.aborted) {
        setError(err.message || 'Failed to generate playlist. Please try again.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(null);
      }
    }
  }, []);

  const playTrack = useCallback((track, index) => {
    if (!isMountedRef.current) return;
    
    // Clean up existing audio properly
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      
      // Remove stored event listeners
      if (audioHandlersRef.current.ended) {
        audio.removeEventListener('ended', audioHandlersRef.current.ended);
      }
      if (audioHandlersRef.current.error) {
        audio.removeEventListener('error', audioHandlersRef.current.error);
      }
      
      audio.src = '';
    }

    if (track?.stream_url && isMountedRef.current) {
      const newAudio = new Audio();
      
      // Create and store event handlers for proper cleanup
      const endedHandler = () => {
        if (!isMountedRef.current) return;
        
        const nextIndex = index + 1;
        if (nextIndex < playlist?.playlist?.length) {
          playTrack(playlist.playlist[nextIndex], nextIndex);
        } else {
          if (isMountedRef.current) {
            setIsPlaying(false);
            setCurrentTrack(null);
          }
        }
      };

      const errorHandler = (e) => {
        console.error('Audio playback error:', e);
        if (isMountedRef.current) {
          setError('Audio playback failed. Please try another track.');
          setIsPlaying(false);
        }
      };

      // Store handlers for cleanup
      audioHandlersRef.current = { ended: endedHandler, error: errorHandler };
      
      newAudio.addEventListener('ended', endedHandler);
      newAudio.addEventListener('error', errorHandler);
      
      // Set source and update state
      newAudio.src = track.stream_url.trim();
      
      if (isMountedRef.current) {
        setAudio(newAudio);
        setCurrentTrack(index);
        setIsPlaying(true);
      }
      
      // Handle play promise for cross-browser compatibility
      const playPromise = newAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.error('Play failed:', err);
          if (isMountedRef.current) {
            setError('Could not start audio playback');
            setIsPlaying(false);
          }
        });
      }
    }
  }, [audio, playlist?.playlist]);

  const pauseTrack = useCallback(() => {
    if (audio && isMountedRef.current) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [audio]);

  const resumeTrack = useCallback(() => {
    if (audio && isMountedRef.current) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.error('Resume failed:', err);
          if (isMountedRef.current) {
            setError('Could not resume playback');
            setIsPlaying(false);
          }
        });
      }
      setIsPlaying(true);
    }
  }, [audio]);

  const skipTrack = useCallback(() => {
    if (currentTrack !== null && playlist?.playlist && currentTrack + 1 < playlist.playlist.length) {
      playTrack(playlist.playlist[currentTrack + 1], currentTrack + 1);
    }
  }, [currentTrack, playlist?.playlist, playTrack]);

  const goBack = useCallback(() => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      
      // Properly remove stored event listeners
      if (audioHandlersRef.current.ended) {
        audio.removeEventListener('ended', audioHandlersRef.current.ended);
      }
      if (audioHandlersRef.current.error) {
        audio.removeEventListener('error', audioHandlersRef.current.error);
      }
      
      audio.src = '';
    }
    
    // Clear handlers reference
    audioHandlersRef.current = {};
    
    if (isMountedRef.current) {
      setPlaylist(null);
      setCurrentTrack(null);
      setIsPlaying(false);
      setError(null);
      setAudio(null);
    }
  }, [audio]);

  const handleNavTabChange = useCallback((tab) => {
    if (isMountedRef.current) {
      setActiveNavTab(tab);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      
      // Abort any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Clean up audio
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        
        // Remove stored event listeners
        if (audioHandlersRef.current.ended) {
          audio.removeEventListener('ended', audioHandlersRef.current.ended);
        }
        if (audioHandlersRef.current.error) {
          audio.removeEventListener('error', audioHandlersRef.current.error);
        }
        
        audio.src = '';
      }
    };
  }, [audio]);

  // Playlist view
  if (playlist) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Header />
        
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <button 
              onClick={goBack}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-foreground">
              {playlist.goal === 'focus' ? 'Focus Enhancement' : 'Energy Boost'} Playlist
            </h1>
            <div className="w-20"></div>
          </div>
        </div>

        {/* Player Controls */}
        {playlist.playlist.length > 0 && (
          <div className="p-4 bg-muted/50 border-b border-border/50">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {playlist.count} tracks • Direct from storage
              </div>
              <div className="flex items-center gap-3">
                 {isPlaying ? (
                   <button
                     onClick={pauseTrack}
                     disabled={!audio}
                     className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground p-2 rounded-full transition-colors"
                   >
                     <Pause className="w-5 h-5" />
                   </button>
                 ) : (
                   <button
                     onClick={currentTrack !== null ? resumeTrack : () => playlist?.playlist?.[0] && playTrack(playlist.playlist[0], 0)}
                     disabled={!playlist?.playlist?.length}
                     className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground p-2 rounded-full transition-colors"
                   >
                     <Play className="w-5 h-5" />
                   </button>
                 )}
                 <button
                   onClick={skipTrack}
                   disabled={currentTrack === null || !playlist?.playlist || currentTrack + 1 >= playlist.playlist.length}
                   className="bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed text-secondary-foreground p-2 rounded-full transition-colors"
                 >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Track List */}
        <div className="p-4 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-2">
              {playlist.playlist.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, index)}
                  className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all ${
                    currentTrack === index
                      ? 'bg-primary/20 border-l-4 border-primary'
                      : 'bg-card hover:bg-accent'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentTrack === index ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  
                   <div className="flex-grow min-w-0">
                     <h3 className="font-medium text-foreground truncate">{track.title}</h3>
                     <p className="text-sm text-muted-foreground truncate">
                       {track.artist} {track.bpm && `• ${track.bpm} BPM`}
                     </p>
                   </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {track.fileName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Navigation activeTab={activeNavTab} onTabChange={handleNavTabChange} />
      </div>
    );
  }

  // Main selection screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Header />
      
      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <p className="text-lg text-muted-foreground">
          Powering Peak performance with our patented closed loop methods.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-2xl mx-auto mb-8 px-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
            <p className="text-destructive">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-primary hover:text-primary/80 text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="px-4 md:px-8 pb-32">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-2 gap-6">
          {/* Focus Enhancement Card */}
          <Card 
            onClick={() => generateFlowPlaylist('focus')}
            className={`relative overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br from-card to-card/80 border-border/50 ${
              loading === 'focus' ? 'opacity-75 pointer-events-none scale-95' : ''
            }`}
          >
            <div className="aspect-[4/3] relative">
              {/* Background Image */}
              <img 
                src="/lovable-uploads/703143dc-8c8a-499e-bd2c-8e526bbe62d5.png"
                alt="Focus Enhancement"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="space-y-2">
                  {loading === 'focus' ? (
                    <div className="flex items-center gap-2 mb-2">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                      <span className="text-white font-semibold">Loading from storage...</span>
                    </div>
                  ) : (
                    <h3 className="text-white font-semibold text-lg leading-tight">Focus Enhancement</h3>
                  )}
                  <p className="text-white/80 text-sm">
                    Instrumental tracks for deep concentration
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Energy Boost Card */}
          <Card 
            onClick={() => generateFlowPlaylist('energy')}
            className={`relative overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br from-card to-card/80 border-border/50 ${
              loading === 'energy' ? 'opacity-75 pointer-events-none scale-95' : ''
            }`}
          >
            <div className="aspect-[4/3] relative">
              {/* Background Image */}
              <img 
                src="/lovable-uploads/6fa80e74-6c84-4add-bc17-db4cb527a0a2.png"
                alt="Energy Boost"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="space-y-2">
                  {loading === 'energy' ? (
                    <div className="flex items-center gap-2 mb-2">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                      <span className="text-white font-semibold">Loading from storage...</span>
                    </div>
                  ) : (
                    <h3 className="text-white font-semibold text-lg leading-tight">Energy Boost</h3>
                  )}
                  <p className="text-white/80 text-sm">
                    High-energy tracks for motivation
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Navigation activeTab={activeNavTab} onTabChange={handleNavTabChange} />
    </div>
  );
};

export default AIDJ;
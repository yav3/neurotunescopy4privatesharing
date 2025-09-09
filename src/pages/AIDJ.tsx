import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Music, Loader2, Play, Pause, SkipForward } from 'lucide-react';
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { fetchPlaylist } from "@/lib/api";
import { newSeed, remember, excludeQS } from "@/state/playlistSession";

const AIDJ = () => {
  const [activeNavTab, setActiveNavTab] = useState("ai-dj");
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Use refs for audio and handlers to avoid stale closures
  const audioRef = useRef(null);
  const handlersRef = useRef({});

  const generateFlowPlaylist = async (flowType) => {
    setLoading(flowType);
    setError(null);
    setPlaylist(null);

    try {
      console.log(`Generating ${flowType} playlist...`);

      // Map flow types to therapeutic goals
      const goalMap = {
        'focus': 'focus-enhancement',
        'energy': 'mood-boost' // Use mood-boost for energy since it's high energy
      };

      const goalSlug = goalMap[flowType];
      if (!goalSlug) {
        throw new Error(`Unknown flow type: ${flowType}`);
      }

      // Fetch real tracks from your music library
      const { tracks, error } = await fetchPlaylist(goalSlug, 20, newSeed(), excludeQS());
      
      if (error) {
        console.warn('Playlist error:', error);
      }
      
      if (!tracks?.length) {
        throw new Error(`No ${flowType} tracks found in your music library`);
      }

      console.log(`✅ Loaded ${tracks.length} real ${flowType} tracks from library`);

      // Format tracks for the playlist interface
      const formattedTracks = tracks.map((track, index) => ({
        id: track.id,
        title: track.title || 'Untitled',
        artist: track.genre || 'Unknown Artist',
        fileName: track.storage_key,
        stream_url: track.stream_url || null,
        index: index + 1,
        bpm: track.bpm,
        genre: track.genre
      }));

      const result = {
        goal: flowType,
        count: formattedTracks.length,
        description: flowType === 'focus' 
          ? 'Curated tracks from your library for deep concentration'
          : 'High-energy tracks from your library to boost motivation and performance',
        playlist: formattedTracks
      };

      setPlaylist(result);

      // Remember played tracks for future exclusion
      tracks.slice(0, 5).forEach(track => remember(track.id));

    } catch (err) {
      console.error("Playlist generation error:", err);
      setError(`Failed to generate playlist: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  const playTrack = (track, index) => {
    try {
      // Clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        Object.keys(handlersRef.current).forEach(event => {
          if (handlersRef.current[event]) {
            audioRef.current.removeEventListener(event, handlersRef.current[event]);
          }
        });
      }

      if (!track.stream_url) {
        setError('No audio URL available for this track');
        return;
      }

      const newAudio = new Audio(track.stream_url);
      
      const handleTrackEnd = () => {
        const nextIndex = index + 1;
        if (nextIndex < playlist.playlist.length) {
          playTrack(playlist.playlist[nextIndex], nextIndex);
        } else {
          setIsPlaying(false);
          setCurrentTrack(null);
        }
      };

      const handleError = (e) => {
        console.error('Audio playback error:', e);
        setError('Playback failed for this track');
        setIsPlaying(false);
      };

      // Store handlers for cleanup
      handlersRef.current = {
        ended: handleTrackEnd,
        error: handleError
      };

      newAudio.addEventListener('ended', handleTrackEnd);
      newAudio.addEventListener('error', handleError);
      
      newAudio.play().catch(err => {
        console.error('Play failed:', err);
        setError('Could not play track - audio may be blocked');
        setIsPlaying(false);
      });
      
      audioRef.current = newAudio;
      setCurrentTrack(index);
      setIsPlaying(true);
      setError(null); // Clear any previous errors

    } catch (err) {
      console.error('Play track error:', err);
      setError('Failed to play track');
      setIsPlaying(false);
    }
  };

  const pauseTrack = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.error('Pause error:', err);
    }
  };

  const resumeTrack = () => {
    try {
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.error('Resume failed:', err);
          setError('Could not resume playback');
        });
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Resume error:', err);
    }
  };

  const skipTrack = () => {
    try {
      if (currentTrack !== null && currentTrack + 1 < playlist.playlist.length) {
        playTrack(playlist.playlist[currentTrack + 1], currentTrack + 1);
      }
    } catch (err) {
      console.error('Skip error:', err);
    }
  };

  const goBack = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        Object.keys(handlersRef.current).forEach(event => {
          if (handlersRef.current[event]) {
            audioRef.current.removeEventListener(event, handlersRef.current[event]);
          }
        });
      }
      setPlaylist(null);
      setCurrentTrack(null);
      setIsPlaying(false);
      setError(null);
      audioRef.current = null;
      handlersRef.current = {};
    } catch (err) {
      console.error('Go back error:', err);
    }
  };

  const handleNavTabChange = (tab) => {
    setActiveNavTab(tab);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (audioRef.current) {
          audioRef.current.pause();
          Object.keys(handlersRef.current).forEach(event => {
            if (handlersRef.current[event]) {
              audioRef.current.removeEventListener(event, handlersRef.current[event]);
            }
          });
        }
      } catch (error) {
        console.warn('Error during cleanup:', error);
      }
    };
  }, []);

  // Playlist view
  if (playlist) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Header />
        
        {/* Back Navigation */}
        <div className="px-4 pt-4">
          <div className="max-w-6xl mx-auto">
            <button 
              onClick={goBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Flow State</span>
            </button>
          </div>
        </div>

        {/* Page Title and Description */}
        <div className="text-center px-4 pb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {playlist.goal === 'focus' ? 'Focus Enhancement' : 'Energy Boost'} Playlist
          </h1>
          <p className="text-lg text-muted-foreground">
            {playlist.count} tracks • {playlist.description}
          </p>
        </div>

        {/* Player Controls */}
        {playlist.playlist && playlist.playlist.length > 0 && (
          <div className="px-4 pb-6">
            <div className="max-w-6xl mx-auto flex items-center justify-center">
              <div className="flex items-center gap-4 bg-card rounded-xl p-4 shadow-card">
                {isPlaying ? (
                  <button
                    onClick={pauseTrack}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full transition-colors"
                  >
                    <Pause className="w-6 h-6" />
                  </button>
                ) : (
                  <button
                    onClick={currentTrack !== null ? resumeTrack : () => playTrack(playlist.playlist[0], 0)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full transition-colors"
                  >
                    <Play className="w-6 h-6" />
                  </button>
                )}
                <button
                  onClick={skipTrack}
                  className="bg-muted hover:bg-muted/80 text-muted-foreground p-3 rounded-full transition-colors"
                >
                  <SkipForward className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-destructive/20 border-b border-destructive/50">
            <div className="max-w-6xl mx-auto text-center">
              <p className="text-destructive">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-2 text-primary hover:text-primary/80 text-sm underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Track List */}
        <div className="px-4 pb-32">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-3">
              {playlist.playlist && playlist.playlist.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, index)}
                  className={`bg-card hover:bg-accent rounded-xl p-4 cursor-pointer transition-all duration-300 shadow-card ${
                    currentTrack === index
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-background shadow-[0_0_20px_hsl(var(--primary)_/_0.3)]'
                      : 'hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      currentTrack === index 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-foreground truncate text-lg">{track.title}</h3>
                      <p className="text-muted-foreground truncate">{track.artist}</p>
                    </div>
                    
                    <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                      {track.stream_url ? 'Ready' : 'No audio'}
                    </div>
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
        <h1 className="text-4xl font-bold text-foreground mb-2">Flow State</h1>
        <p className="text-lg text-muted-foreground">
          Curated playlists from your NeuroTunes music library
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
      <div className="px-4 pb-32">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-2 gap-4">
          {/* Focus Enhancement Card */}
          <div 
            onClick={() => generateFlowPlaylist('focus')}
            className={`relative overflow-hidden rounded-2xl h-40 cursor-pointer group transition-all duration-500 ease-out ${
              loading === 'focus' 
                ? 'opacity-75 pointer-events-none scale-95' 
                : 'hover:shadow-[0_20px_60px_hsl(217_91%_60%_/_0.3),_0_8px_24px_hsl(217_91%_5%_/_0.6)] hover:border-primary/40 hover:-translate-y-2 hover:scale-[1.02]'
            }`}
          >
            {/* Background Image */}
            <img 
              src="/lovable-uploads/acoustic-sunset-field.png"
              alt="Focus Enhancement"
              className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
            />
            
            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5 group-hover:from-black/70 transition-all duration-500" />
            
            {/* Animated glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-t from-primary/60 to-transparent" />
            
            {/* Content - Fixed positioning for perfect alignment */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                {loading === 'focus' ? (
                  <div className="flex items-center gap-2 mb-1">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                    <span className="text-white font-semibold">Generating...</span>
                  </div>
                ) : (
                  <h3 className="text-white font-semibold text-lg leading-tight drop-shadow-lg mb-1">Focus Enhancement</h3>
                )}
                <p className="text-white/90 text-sm drop-shadow-md">
                  Instrumental tracks for deep concentration
                </p>
              </div>
            </div>
          </div>

          {/* Energy Boost Card */}
          <div 
            onClick={() => generateFlowPlaylist('energy')}
            className={`relative overflow-hidden rounded-2xl h-40 cursor-pointer group transition-all duration-500 ease-out ${
              loading === 'energy' 
                ? 'opacity-75 pointer-events-none scale-95' 
                : 'hover:shadow-[0_20px_60px_hsl(217_91%_60%_/_0.3),_0_8px_24px_hsl(217_91%_5%_/_0.6)] hover:border-primary/40 hover:-translate-y-2 hover:scale-[1.02]'
            }`}
          >
            {/* Background Image */}
            <img 
              src="/lovable-uploads/gamma-sunbeam-forest.png"
              alt="Energy Boost"
              className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
            />
            
            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5 group-hover:from-black/70 transition-all duration-500" />
            
            {/* Animated glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-t from-primary/60 to-transparent" />
            
            {/* Content - Fixed positioning for perfect alignment */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                {loading === 'energy' ? (
                  <div className="flex items-center gap-2 mb-1">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                    <span className="text-white font-semibold">Generating...</span>
                  </div>
                ) : (
                  <h3 className="text-white font-semibold text-lg leading-tight drop-shadow-lg mb-1">Energy Boost</h3>
                )}
                <p className="text-white/90 text-sm drop-shadow-md">
                  High arousal, high valence for motivation and power
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Navigation activeTab={activeNavTab} onTabChange={handleNavTabChange} />
    </div>
  );
};

export default AIDJ;
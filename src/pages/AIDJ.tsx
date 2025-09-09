import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Music, Loader2, Play, Pause, SkipForward } from 'lucide-react';
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";

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

      // Create demo playlist for now (replace with your actual logic)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading

      const demoTracks = flowType === 'focus' ? [
        {
          id: 'focus1',
          title: 'Deep Focus Ambient',
          artist: 'Focus Artist',
          fileName: 'focus1.mp3',
          stream_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Demo URL
          index: 1
        },
        {
          id: 'focus2',
          title: 'Concentration Flow',
          artist: 'Ambient Sounds',
          fileName: 'focus2.mp3',
          stream_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Demo URL
          index: 2
        },
        {
          id: 'focus3',
          title: 'Study Session',
          artist: 'Instrumental Vibes',
          fileName: 'focus3.mp3',
          stream_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Demo URL
          index: 3
        }
      ] : [
        {
          id: 'energy1',
          title: 'High Energy Boost',
          artist: 'Energy Artist',
          fileName: 'energy1.mp3',
          stream_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Demo URL
          index: 1
        },
        {
          id: 'energy2',
          title: 'Motivation Drive',
          artist: 'Upbeat Sounds',
          fileName: 'energy2.mp3',
          stream_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Demo URL
          index: 2
        },
        {
          id: 'energy3',
          title: 'Power Session',
          artist: 'Dynamic Beats',
          fileName: 'energy3.mp3',
          stream_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Demo URL
          index: 3
        }
      ];

      const result = {
        goal: flowType,
        count: demoTracks.length,
        description: flowType === 'focus' 
          ? 'Curated instrumental tracks for deep concentration'
          : 'High-energy tracks to boost motivation and performance',
        playlist: demoTracks
      };

      setPlaylist(result);

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
        {playlist.playlist && playlist.playlist.length > 0 && (
          <div className="p-4 bg-muted/50 border-b border-border/50">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {playlist.count} tracks • {playlist.description}
              </div>
              <div className="flex items-center gap-3">
                {isPlaying ? (
                  <button
                    onClick={pauseTrack}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full transition-colors"
                  >
                    <Pause className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={currentTrack !== null ? resumeTrack : () => playTrack(playlist.playlist[0], 0)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full transition-colors"
                  >
                    <Play className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={skipTrack}
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground p-2 rounded-full transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
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
        <div className="p-4 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-2">
              {playlist.playlist && playlist.playlist.map((track, index) => (
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
                    <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {track.stream_url ? 'Ready' : 'No audio'}
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
            className={`relative overflow-hidden rounded-2xl h-40 cursor-pointer transition-all duration-300 ${
              loading === 'focus' ? 'opacity-75 pointer-events-none scale-95' : 'hover:scale-105'
            }`}
            style={{
              backgroundImage: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 50%, hsl(var(--primary)) 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {loading === 'focus' ? (
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                  <span className="text-white font-semibold">Generating...</span>
                </div>
              ) : (
                <h3 className="text-white text-xl font-bold mb-2 drop-shadow-lg">Focus Enhancement</h3>
              )}
              <p className="text-white/90 text-sm drop-shadow-md">
                Instrumental tracks for deep concentration
              </p>
            </div>
          </div>

          {/* Energy Boost Card */}
          <div 
            onClick={() => generateFlowPlaylist('energy')}
            className={`relative overflow-hidden rounded-2xl h-40 cursor-pointer transition-all duration-300 ${
              loading === 'energy' ? 'opacity-75 pointer-events-none scale-95' : 'hover:scale-105'
            }`}
            style={{
              backgroundImage: 'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--secondary) / 0.8) 50%, hsl(var(--secondary)) 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {loading === 'energy' ? (
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                  <span className="text-white font-semibold">Generating...</span>
                </div>
              ) : (
                <h3 className="text-white text-xl font-bold mb-2 drop-shadow-lg">Energy Boost</h3>
              )}
              <p className="text-white/90 text-sm drop-shadow-md">
                High arousal, high valence for motivation and power
              </p>
            </div>
          </div>
        </div>
      </div>

      <Navigation activeTab={activeNavTab} onTabChange={handleNavTabChange} />
    </div>
  );
};

export default AIDJ;
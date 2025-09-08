import React, { useState } from 'react';
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

  const generateFlowPlaylist = async (flowType) => {
    setLoading(flowType);
    setError(null);
    setPlaylist(null);

    try {
      console.log(`Generating ${flowType} playlist...`);

      // Step 1: List files directly from storage bucket
      const { data: files, error: listError } = await supabase.storage
        .from('audio')
        .list('', {
          limit: 1000,
          offset: 0
        });

      if (listError) {
        throw new Error(`Storage list failed: ${listError.message}`);
      }

      console.log(`Found ${files?.length || 0} files in storage`);

      if (!files || files.length === 0) {
        throw new Error('No audio files found in storage');
      }

      // Step 2: Filter files based on flow type
      let filteredFiles = [];
      
      if (flowType === 'focus') {
        // Look for focus-related files
        filteredFiles = files.filter(file => {
          const name = file.name.toLowerCase();
          return (
            name.includes('focus') || 
            name.includes('ambient') || 
            name.includes('instrumental') ||
            name.includes('concentration') ||
            name.includes('study')
          );
        });
      } else if (flowType === 'energy') {
        // Look for energy-related files
        filteredFiles = files.filter(file => {
          const name = file.name.toLowerCase();
          return (
            name.includes('energy') || 
            name.includes('upbeat') || 
            name.includes('motivation') ||
            name.includes('workout') ||
            name.includes('boost')
          );
        });
      }

      console.log(`Filtered to ${filteredFiles.length} ${flowType} files`);

      if (filteredFiles.length === 0) {
        // Fallback: use any audio files
        filteredFiles = files.filter(file => 
          file.name.toLowerCase().match(/\.(mp3|wav|m4a|flac|ogg)$/i)
        );
      }

      // Step 3: Randomize and select tracks
      const shuffled = filteredFiles
        .sort(() => Math.random() - 0.5)
        .slice(0, 8); // Take up to 8 tracks

      // Step 4: Generate signed URLs and create playlist
      const playlistTracks = await Promise.all(
        shuffled.map(async (file, index) => {
          const { data: urlData } = await supabase.storage
            .from('audio')
            .createSignedUrl(file.name, 3600); // 1 hour expiry

          // Extract basic info from filename
          const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
          const parts = nameWithoutExt.split(' - ');
          
          return {
            id: file.id || index,
            title: parts[1] || nameWithoutExt,
            artist: parts[0] || 'Unknown Artist',
            fileName: file.name,
            stream_url: urlData?.signedUrl,
            duration: null,
            index: index + 1
          };
        })
      );

      const result = {
        goal: flowType,
        count: playlistTracks.length,
        description: flowType === 'focus' 
          ? 'Curated instrumental tracks for deep concentration'
          : 'High-energy tracks to boost motivation and performance',
        playlist: playlistTracks.filter(track => track.stream_url)
      };

      console.log(`Generated playlist with ${result.playlist.length} tracks`);
      setPlaylist(result);

    } catch (err) {
      console.error("Direct storage playlist generation error:", err);
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const playTrack = (track, index) => {
    if (audio) {
      audio.pause();
      const existingHandlers = audio.cloneNode ? [] : audio.removeEventListener('ended', () => {});
    }

    if (track.stream_url) {
      const newAudio = new Audio(track.stream_url);
      
      newAudio.addEventListener('ended', () => {
        const nextIndex = index + 1;
        if (nextIndex < playlist.playlist.length) {
          playTrack(playlist.playlist[nextIndex], nextIndex);
        } else {
          setIsPlaying(false);
          setCurrentTrack(null);
        }
      });

      newAudio.addEventListener('error', (e) => {
        console.error('Audio playbook error:', e);
        setError('Playback failed for this track');
      });
      
      newAudio.play().catch(err => {
        console.error('Play failed:', err);
        setError('Could not play track');
      });
      
      setAudio(newAudio);
      setCurrentTrack(index);
      setIsPlaying(true);
    }
  };

  const pauseTrack = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const resumeTrack = () => {
    if (audio) {
      audio.play().catch(err => {
        console.error('Resume failed:', err);
        setError('Could not resume playbook');
      });
      setIsPlaying(true);
    }
  };

  const skipTrack = () => {
    if (currentTrack !== null && currentTrack + 1 < playlist.playlist.length) {
      playTrack(playlist.playlist[currentTrack + 1], currentTrack + 1);
    }
  };

  const goBack = () => {
    if (audio) {
      audio.pause();
      audio.removeEventListener('ended', () => {});
    }
    setPlaylist(null);
    setCurrentTrack(null);
    setIsPlaying(false);
    setError(null);
    setAudio(null);
  };

  const handleNavTabChange = (tab: string) => {
    setActiveNavTab(tab);
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.removeEventListener('ended', () => {});
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
                    <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
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
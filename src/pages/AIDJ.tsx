import React, { useState, useEffect } from 'react';
import { ArrowLeft, Music, Loader2, Play, Pause, SkipForward } from 'lucide-react';
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { useAudioStore } from "@/stores";
import { toast } from "@/hooks/use-toast";
import { fetchPlaylist } from "@/lib/api";
import { newSeed, remember, excludeQS } from "@/state/playlistSession";
import { supabase } from "@/integrations/supabase/client";
import { handleImageError } from "@/utils/imageUtils";
import sambaImage from '@/assets/samba-tropical-instruments.jpg';

const AIDJ = () => {
  const [activeNavTab, setActiveNavTab] = useState("flow");
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  
  const { 
    queue, 
    currentTrack, 
    index, 
    isPlaying, 
    play, 
    pause, 
    next, 
    setQueue 
  } = useAudioStore();

  const generateFlowPlaylist = async (flowType) => {
    setLoading(flowType);
    setError(null);
    setPlaylist(null);

    try {
      console.log(`🎵 Generating ${flowType} playlist...`);

      let tracks, fetchError;

      if (flowType === 'samba') {
        // Fetch from samba bucket directly
        const { data: files, error: sambaError } = await supabase.storage
          .from('samba')
          .list('', {
            limit: 100,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (sambaError) {
          throw new Error(`Samba fetch error: ${sambaError.message}`);
        }

        if (!files) {
          throw new Error('No samba files returned');
        }

        // Filter for audio files and convert to track format
        const audioFiles = files.filter(file => file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.m4a'));
        console.log('🎵 Found audio files:', audioFiles.length);
        console.log('🎵 First few files:', audioFiles.slice(0, 3).map(f => f.name));
        
        tracks = audioFiles
          .slice(0, 20)
          .map((file, index) => ({
            id: `samba-${index}-${file.name}`,
            title: file.name
              .replace(/\.(mp3|wav|m4a)$/i, '')
              .replace(/[-_]/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase()),
            artist: 'Samba & Jazz Collection',
            storage_bucket: 'samba',
            storage_key: file.name,
            stream_url: supabase.storage.from('samba').getPublicUrl(file.name).data.publicUrl
          }));
        
        console.log('🎵 Created tracks:', tracks.slice(0, 3).map(t => ({
          title: t.title,
          fileName: t.storage_key,
          streamUrl: t.stream_url,
          hasSpecialChars: /[^\w\s.-]/.test(t.storage_key)
        })));
        
        fetchError = null;
      } else {
        // Map flow types to therapeutic goals
        const goalMap = {
          'focus': 'focus-enhancement',
          'energy': 'mood-boost'
        };

        const goalSlug = goalMap[flowType];
        if (!goalSlug) {
          throw new Error(`Unknown flow type: ${flowType}`);
        }

        console.log(`🎯 Mapped "${flowType}" to goal slug: "${goalSlug}"`);

        // Fetch real tracks from your music library
        const result = await fetchPlaylist(goalSlug, 20, newSeed(), excludeQS());
        tracks = result.tracks;
        fetchError = result.error;
      }
      
      console.log(`📦 FetchPlaylist result:`, { 
        tracksFound: tracks?.length || 0, 
        error: fetchError,
        flowType,
        source: flowType === 'samba' ? 'samba-bucket' : 'therapeutic-goals'
      });
      
      if (fetchError) {
        console.warn('Playlist error:', fetchError);
        setError(`Error loading ${flowType} tracks: ${fetchError}`);
        return;
      }
      
      if (!tracks?.length) {
        console.error(`❌ No tracks returned for ${flowType}`);
        setError(`No ${flowType} tracks found. The music buckets may be empty or inaccessible.`);
        return;
      }

      console.log(`✅ Loaded ${tracks.length} real ${flowType} tracks from library`);
      console.log(`🎵 Sample tracks:`, tracks.slice(0, 3).map(t => ({ 
        id: t.id, 
        title: t.title, 
        bucket: t.storage_bucket,
        hasStreamUrl: !!t.stream_url 
      })));

      const result = {
        goal: flowType,
        count: tracks.length,
        description: flowType === 'focus' 
          ? 'Curated instrumental tracks for deep concentration'
          : flowType === 'energy'
          ? 'High-energy tracks to boost motivation and power'
          : 'Smooth samba and jazz rhythms for relaxation',
        playlist: tracks
      };

      // Remember played tracks for future exclusion
      tracks.slice(0, 5).forEach(track => remember(track.id));

      setPlaylist(result);

      toast({
        title: "Playlist Ready",
        description: `Generated ${flowType} playlist with ${tracks.length} tracks`,
      });

    } catch (err) {
      console.error('❌ Failed to load category:', flowType, err);
      setError(`Failed to generate playlist: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  const playTrack = async (track, trackIndex) => {
    try {
      if (!playlist?.playlist) return;
      
      // Set the entire playlist as the queue starting from selected track
      await setQueue(playlist.playlist, trackIndex);
      
      setError(null);
    } catch (err) {
      console.error('Play track error:', err);
      setError('Failed to play track');
    }
  };

  const goBack = () => {
    setPlaylist(null);
    setError(null);
  };

  const handleNavTabChange = (tab: string) => {
    setActiveNavTab(tab);
  };

  const clearError = () => setError(null);

  // Playlist view
  if (playlist) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <button 
              onClick={goBack}
              className="flex items-center gap-2 text-primary hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Back</span>
            </button>
            <h1 className="text-lg sm:text-2xl font-bold text-foreground text-center flex-1 mx-4">
              {playlist.goal === 'focus' ? 'Stretch & Cool Down' : 
               playlist.goal === 'energy' ? 'Cardio' : 'Samba & Jazz'} Playlist
            </h1>
            <div className="w-16 sm:w-20"></div>
          </div>
        </div>

        {/* Player Controls */}
        {playlist.playlist && playlist.playlist.length > 0 && (
          <div className="p-4 bg-muted/30 border-b border-border/50">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div className="text-xs sm:text-sm text-muted-foreground">
                {playlist.count} tracks • {playlist.description}
              </div>
              <div className="flex items-center gap-3">
                {isPlaying ? (
                  <button
                    onClick={pause}
                    className="bg-primary hover:bg-primary/80 p-2 rounded-full transition-colors text-primary-foreground"
                  >
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                ) : (
                  <button
                    onClick={queue.length > 0 ? play : () => playTrack(playlist.playlist[0], 0)}
                    className="bg-primary hover:bg-primary/80 p-2 rounded-full transition-colors text-primary-foreground"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
                <button
                  onClick={next}
                  className="bg-muted hover:bg-muted/80 p-2 rounded-full transition-colors text-foreground"
                >
                  <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-destructive/10 border-b border-destructive/20">
            <div className="max-w-6xl mx-auto text-center">
              <p className="text-destructive">{error}</p>
              <button 
                onClick={clearError}
                className="mt-2 text-primary hover:text-primary/80 text-sm underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Track List */}
        <div className="p-4">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-2">
              {playlist.playlist && playlist.playlist.map((track, trackIndex) => {
                const isCurrentTrack = currentTrack?.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track, trackIndex)}
                    className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg cursor-pointer transition-all ${
                      isCurrentTrack
                        ? 'bg-primary/20 border-l-4 border-primary'
                        : 'bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                      isCurrentTrack ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {trackIndex + 1}
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-foreground truncate text-sm sm:text-base">{track.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{track.artist || 'Unknown Artist'}</p>
                    </div>
                    
                    <div className="text-xs text-muted-foreground shrink-0">
                      Ready
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Navigation activeTab={activeNavTab} onTabChange={handleNavTabChange} />
      </div>
    );
  }

  // Main selection screen
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header */}
      <div className="text-center pt-8 sm:pt-12 pb-6 sm:pb-8 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Flow State</h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          patented closed loop personalization designed to enhance your performance
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
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Focus Enhancement Card */}
          <div 
            onClick={() => generateFlowPlaylist('focus')}
            className={`relative overflow-hidden rounded-2xl h-48 sm:h-40 lg:h-44 cursor-pointer transition-all duration-300 ${
              loading === 'focus' ? 'opacity-75 pointer-events-none scale-95' : 'hover:scale-105'
            }`}
          >
            <img 
              src="/lovable-uploads/f252233e-2545-4bdc-ae4f-7aee7b58db7f.png"
              alt="Stretch & Cool Down"
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="relative p-4 sm:p-6 h-full flex flex-col justify-end">
              {loading === 'focus' ? (
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-spin" />
                  <span className="text-white font-semibold text-sm sm:text-base">Generating...</span>
                </div>
              ) : (
                <h3 className="text-white text-lg sm:text-xl font-bold mb-2 drop-shadow-lg">Stretch & Cool Down</h3>
              )}
              <p className="text-white/90 text-xs sm:text-sm drop-shadow-md line-clamp-2">
                Instrumental tracks for deep concentration
              </p>
            </div>
          </div>

          {/* Energy Boost Card */}
          <div 
            onClick={() => generateFlowPlaylist('energy')}
            className={`relative overflow-hidden rounded-2xl h-48 sm:h-40 lg:h-44 cursor-pointer transition-all duration-300 ${
              loading === 'energy' ? 'opacity-75 pointer-events-none scale-95' : 'hover:scale-105'
            }`}
          >
            <img 
              src="/lovable-uploads/4e6f957d-a660-4a2e-9019-364f45cebb99.png"
              alt="Cardio"
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="relative p-4 sm:p-6 h-full flex flex-col justify-end">
              {loading === 'energy' ? (
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-spin" />
                  <span className="text-white font-semibold text-sm sm:text-base">Generating...</span>
                </div>
              ) : (
                <h3 className="text-white text-lg sm:text-xl font-bold mb-2 drop-shadow-lg">Cardio</h3>
              )}
              <p className="text-white/90 text-xs sm:text-sm drop-shadow-md line-clamp-2">
                High arousal, high valence for motivation and power
              </p>
            </div>
          </div>

          {/* Samba & Jazz Card */}
          <div 
            onClick={() => generateFlowPlaylist('samba')}
            className={`relative overflow-hidden rounded-2xl h-48 sm:h-40 lg:h-44 cursor-pointer transition-all duration-300 ${
              loading === 'samba' ? 'opacity-75 pointer-events-none scale-95' : 'hover:scale-105'
            }`}
          >
            <img 
              src={sambaImage}
              alt="Samba & Jazz"
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="relative p-4 sm:p-6 h-full flex flex-col justify-end">
              {loading === 'samba' ? (
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-spin" />
                  <span className="text-white font-semibold text-sm sm:text-base">Generating...</span>
                </div>
              ) : (
                <h3 className="text-white text-lg sm:text-xl font-bold mb-2 drop-shadow-lg">Samba & Jazz</h3>
              )}
              <p className="text-white/90 text-xs sm:text-sm drop-shadow-md line-clamp-2">
                Smooth rhythms for relaxation and enjoyment
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
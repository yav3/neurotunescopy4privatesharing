import React, { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAudio } from "@/context/AudioContext";
import { ArrowLeft, Pause, Play, SkipBack, SkipForward, Volume2, Maximize, Minimize } from "lucide-react";
import { formatTime } from "@/lib/utils";

export default function FullPlayer() {
  const navigate = useNavigate();
  const { state, toggle, seek, setVolume, next, prev, currentTrack } = useAudio();

  // Derive track fields safely
  const { title, artist, cover } = useMemo(() => {
    const t = currentTrack;
    if (!t) return { title: "Untitled", artist: "Unknown", cover: "" };
    
    return {
      title: t.title || "Untitled",
      artist: t.therapeutic_applications?.[0]?.frequency_band_primary?.toUpperCase() || t.genre || "Unknown",
      cover: "", // We'll add cover art later
    };
  }, [currentTrack]);

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") { 
        e.preventDefault(); 
        toggle(); 
      }
      else if (e.code === "ArrowRight") seek((state?.currentTime || 0) + 5);
      else if (e.code === "ArrowLeft") seek(Math.max(0, (state?.currentTime || 0) - 5));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [seek, toggle, state?.currentTime]);

  // Fullscreen toggle
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && wrapRef.current) {
        await wrapRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const progressPercentage = state?.duration ? (state.currentTime / state.duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-background via-background/95 to-primary/10 text-foreground flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Track Selected</h2>
          <button 
            onClick={() => navigate(-1)} 
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-colors"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="fixed inset-0 z-50 bg-gradient-to-br from-background via-background/95 to-primary/10 text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 h-16">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-xl hover:bg-accent transition-colors" 
          aria-label="Back"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="text-sm text-muted-foreground">Now Playing</div>
        <button 
          onClick={toggleFullscreen} 
          className="p-2 rounded-xl hover:bg-accent transition-colors" 
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        {/* Album Art */}
        <div className="relative mx-auto w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl mb-8">
          {/* Therapeutic Nature Background */}
          {(() => {
            const primaryApp = currentTrack?.therapeutic_applications?.[0]
            const frequencyBand = primaryApp?.frequency_band_primary || 'alpha'
            // Musical instrument variations for different genres/moods
            const musicalArtwork = [
              '/lovable-uploads/folk-instruments-meadow.png',
              '/lovable-uploads/classical-meadow-ensemble.png', 
              '/lovable-uploads/string-quartet-studio.png',
              '/lovable-uploads/european-classical-terrace.png',
              '/lovable-uploads/acoustic-sunset-field.png'
            ]
            
            const artworkMap = {
              delta: { 
                url: Math.random() > 0.5 ? '/lovable-uploads/delta-moonlit-lake.png' : musicalArtwork[Math.floor(Math.random() * musicalArtwork.length)],
                position: 'object-cover', // Moonlit scenes for deep sleep & healing
                gradient: 'from-purple-900/60 via-blue-900/40 to-indigo-800/60'
              },
              theta: { 
                url: Math.random() > 0.5 ? '/lovable-uploads/theta-misty-path.png' : musicalArtwork[Math.floor(Math.random() * musicalArtwork.length)],
                position: 'object-cover', // Misty forest paths for meditation
                gradient: 'from-amber-700/60 via-yellow-600/40 to-orange-700/60'
              },
              alpha: { 
                url: Math.random() > 0.5 ? '/lovable-uploads/alpha-mountain-lake.png' : musicalArtwork[Math.floor(Math.random() * musicalArtwork.length)],
                position: 'object-cover', // Serene mountain lakes for focus
                gradient: 'from-blue-800/60 via-cyan-600/40 to-teal-700/60'
              },
              beta: { 
                url: Math.random() > 0.5 ? '/lovable-uploads/beta-waterfall.png' : musicalArtwork[Math.floor(Math.random() * musicalArtwork.length)],
                position: 'object-cover', // Energetic waterfalls for concentration
                gradient: 'from-green-700/60 via-emerald-600/40 to-teal-700/60'
              },
              gamma: { 
                url: Math.random() > 0.5 ? '/lovable-uploads/gamma-sunbeam-forest.png' : musicalArtwork[Math.floor(Math.random() * musicalArtwork.length)],
                position: 'object-cover', // Golden sunbeam forests for peak performance
                gradient: 'from-yellow-600/60 via-orange-500/40 to-red-600/60'
              }
            }
            const artwork = artworkMap[frequencyBand] || artworkMap.alpha
            
            return (
              <>
                <img 
                  src={artwork.url}
                  alt={`${frequencyBand} band therapeutic nature scene`}
                  className={`w-full h-full object-cover ${artwork.position}`}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${artwork.gradient}`} />
                {/* Therapeutic frequency indicator */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                  <span className="text-xs font-medium text-white uppercase">
                    {frequencyBand} Hz Therapy
                  </span>
                </div>
              </>
            )
          })()}
          <button
            onClick={toggle}
            disabled={state?.isLoading}
            className="absolute inset-0 grid place-items-center group"
            aria-label={state?.isPlaying ? "Pause" : "Play"}
          >
            <div className="rounded-full backdrop-blur-md bg-background/20 p-6 border border-border/50 group-active:scale-95 transition">
              {state?.isLoading ? (
                <div className="animate-spin w-7 h-7 border-2 border-current border-t-transparent rounded-full" />
              ) : state?.isPlaying ? (
                <Pause size={28} />
              ) : (
                <Play size={28} className="ml-1" />
              )}
            </div>
          </button>
        </div>

        {/* Track Info */}
        <div className="text-center mb-8 max-w-md">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground mb-2">{artist} Band • {Math.round(currentTrack.bpm || 0)} BPM</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {currentTrack.therapeutic_applications?.[0]?.condition_targets?.slice(0, 3).map(condition => (
              <span key={condition} className="px-3 py-1 bg-secondary/50 text-secondary-foreground rounded-full text-xs">
                {condition.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <button 
            onClick={prev} 
            className="p-3 rounded-xl hover:bg-accent transition-colors" 
            aria-label="Previous"
          >
            <SkipBack size={24} />
          </button>
          <button 
            onClick={toggle} 
            disabled={state?.isLoading}
            className="p-4 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:opacity-50" 
            aria-label="Play/Pause"
          >
            {state?.isLoading ? (
              <div className="animate-spin w-7 h-7 border-2 border-current border-t-transparent rounded-full" />
            ) : state?.isPlaying ? (
              <Pause size={28} />
            ) : (
              <Play size={28} className="ml-1" />
            )}
          </button>
          <button 
            onClick={next} 
            className="p-3 rounded-xl hover:bg-accent transition-colors" 
            aria-label="Next"
          >
            <SkipForward size={24} />
          </button>
        </div>

        {/* Progress */}
        <div className="w-full max-w-md mb-6">
          <input
            type="range"
            min={0}
            max={state?.duration || 0}
            step={0.1}
            value={state?.currentTime || 0}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{formatTime(state?.currentTime || 0)}</span>
            <span>{formatTime(state?.duration || 0)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 w-full max-w-md">
          <Volume2 size={20} className="text-muted-foreground" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={state?.volume ?? 1}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Progress Indicator */}
        <div className="w-full max-w-md mt-6 h-1 rounded-full bg-secondary/50">
          <div 
            className="h-full rounded-full bg-primary transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }} 
          />
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid hsl(var(--background));
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid hsl(var(--background));
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
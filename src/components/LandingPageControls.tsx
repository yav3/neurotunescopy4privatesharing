import { useState } from 'react';
import { Play, Pause, SkipForward, Volume2, VolumeX, Waves, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtworkMedia } from '@/components/ui/ArtworkMedia';

type PlayerState = 'minimized' | 'standard' | 'expanded';

interface LandingPageControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  isSpatialAudio: boolean;
  currentTrack: {
    name: string;
    genre: string;
    artist?: string;
    therapeuticGoal?: string;
    artworkUrl?: string;
  } | null;
  onPlayPause: () => void;
  onSkip: () => void;
  onToggleMute: () => void;
  onToggleSpatial: () => void;
}

export const LandingPageControls = ({
  isPlaying,
  isMuted,
  isSpatialAudio,
  currentTrack,
  onPlayPause,
  onSkip,
  onToggleMute,
  onToggleSpatial
}: LandingPageControlsProps) => {
  const [playerState, setPlayerState] = useState<PlayerState>('minimized');

  // Auto-minimize when not playing
  const effectiveState = !isPlaying && playerState !== 'minimized' ? 'minimized' : playerState;

  const toggleState = () => {
    if (effectiveState === 'minimized') setPlayerState('standard');
    else if (effectiveState === 'standard') setPlayerState('expanded');
    else setPlayerState('minimized');
  };

  // Fake waveform bars for visual effect
  const WaveformBars = () => (
    <div className="flex items-center gap-0.5 h-8">
      {[...Array(32)].map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 bg-white/40 rounded-full"
          animate={{
            height: isPlaying ? [8, 20, 12, 24, 16, 8] : 8,
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
      className="fixed bottom-[120px] left-4 right-4 sm:left-6 sm:right-auto md:left-8 lg:left-12 z-[60]"
    >
      <motion.div
        layout
        onClick={toggleState}
        className="cursor-pointer backdrop-blur-2xl rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <AnimatePresence mode="wait">
          {/* Minimized State */}
          {effectiveState === 'minimized' && (
            <motion.div
              key="minimized"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-2 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center flex-shrink-0"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-white" fill="white" />
                  ) : (
                    <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                  )}
                </button>
                {/* Album art thumbnail */}
                {currentTrack?.artworkUrl && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                    <ArtworkMedia
                      src={currentTrack.artworkUrl}
                      alt={currentTrack.name}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white font-normal truncate">{currentTrack?.name}</div>
                  <div className="text-[10px] text-white/60 truncate">
                    {currentTrack?.therapeuticGoal}, {currentTrack?.genre}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white/70" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" />
                  )}
                </button>
                <ChevronUp className="w-4 h-4 text-white/60" />
              </div>
            </motion.div>
          )}

          {/* Standard State - All controls inline */}
          {effectiveState === 'standard' && (
            <motion.div
              key="standard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-3 py-1.5"
            >
              <div className="flex items-center gap-1.5">
                {/* Play/Pause & Skip */}
                <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={onPlayPause}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5 text-white" fill="white" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="white" />
                    )}
                  </button>
                  <button
                    onClick={onSkip}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
                  >
                    <SkipForward className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>

                <div className="w-px h-5 bg-white/20 mx-0.5" />

                {/* Track Info - Ultra Compact */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="text-[9px] text-white font-normal truncate leading-tight">{currentTrack?.name}</div>
                  <div className="text-[8px] text-white/50 font-light truncate leading-tight">
                    {currentTrack?.therapeuticGoal} • {currentTrack?.genre}
                  </div>
                </div>

                <div className="w-px h-5 bg-white/20 mx-0.5" />

                {/* Spatial & Volume - Inline */}
                <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={onToggleSpatial}
                    className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${
                      isSpatialAudio ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <Waves className={`w-3.5 h-3.5 ${isSpatialAudio ? 'text-white' : 'text-white/70'}`} />
                  </button>
                  <button
                    onClick={onToggleMute}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
                  >
                    {isMuted ? (
                      <VolumeX className="w-3.5 h-3.5 text-white/70" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-white" />
                    )}
                  </button>
                </div>

                <ChevronUp className="w-3.5 h-3.5 text-white/60 flex-shrink-0 ml-0.5" />
              </div>
            </motion.div>
          )}

          {/* Expanded State - With Waveform */}
          {effectiveState === 'expanded' && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 py-3"
            >
              {/* Waveform Visualization */}
              <div className="mb-3 px-2">
                <WaveformBars />
              </div>

              {/* Track Info */}
              <div className="mb-3 text-center">
                <div className="text-sm text-white font-normal mb-1">{currentTrack?.name}</div>
                <div className="text-xs text-white/60 font-light">
                  {currentTrack?.therapeuticGoal} • {currentTrack?.genre}
                </div>
              </div>

              {/* All Controls */}
              <div className="flex items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={onToggleSpatial}
                  className={`w-9 h-9 rounded-full transition-all flex items-center justify-center ${
                    isSpatialAudio ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <Waves className={`w-4 h-4 ${isSpatialAudio ? 'text-white' : 'text-white/70'}`} />
                </button>

                <button
                  onClick={onPlayPause}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" fill="white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                  )}
                </button>

                <button
                  onClick={onSkip}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
                >
                  <SkipForward className="w-4 h-4 text-white" />
                </button>

                <button
                  onClick={onToggleMute}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white/70" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>

              <div className="mt-3 flex justify-center">
                <ChevronDown className="w-4 h-4 text-white/60" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

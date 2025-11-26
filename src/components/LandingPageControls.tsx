import { Play, Pause, SkipForward, Volume2, VolumeX, Waves } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  isSpatialAudio: boolean;
  currentTrack: {
    name: string;
    genre: string;
    artist?: string;
    therapeuticGoal?: string;
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
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
      className="fixed bottom-[180px] left-4 sm:left-6 md:left-8 lg:left-12 z-[60]"
    >
      <div 
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full backdrop-blur-2xl"
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Playback Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={onPlayPause}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-sm"
            style={{ boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.2)' }}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="white" />
            ) : (
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white ml-0.5" fill="white" />
            )}
          </button>
          
          <button
            onClick={onSkip}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-sm"
            style={{ boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.2)' }}
          >
            <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/20" />

        {/* Track Info - Compact */}
        <div className="flex flex-col min-w-[100px] sm:min-w-[120px]">
          <div className="text-[8px] sm:text-[9px] text-white/60 font-light tracking-wide">
            {currentTrack?.therapeuticGoal || 'Loading...'}, {currentTrack?.genre || ''}
          </div>
          <div className="text-[9px] sm:text-[10px] text-white font-normal truncate">
            {currentTrack?.name || ''}
          </div>
          <div className="text-[8px] sm:text-[9px] text-white/70 font-light truncate">
            {currentTrack?.artist || ''}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/20" />

        {/* Spatial Audio Toggle */}
        <button
          onClick={onToggleSpatial}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all flex items-center justify-center backdrop-blur-sm ${
            isSpatialAudio 
              ? 'bg-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]' 
              : 'bg-white/10 hover:bg-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]'
          }`}
        >
          <Waves className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSpatialAudio ? 'text-white' : 'text-white/70'}`} />
        </button>

        {/* Volume Toggle */}
        <button
          onClick={onToggleMute}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-sm"
          style={{ boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.2)' }}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          )}
        </button>
      </div>
    </motion.div>
  );
};

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  THERAPEUTIC_BUCKETS, 
  canPreviewCategory, 
  markCategoryPreviewed,
  getPreviewTrackForBucket,
  type TherapeuticCategory 
} from '@/utils/therapeuticAudio';
import { toast } from 'sonner';

interface TherapeuticAudioPreviewProps {
  currentSlideIndex: number;
}

export const TherapeuticAudioPreview = ({ currentSlideIndex }: TherapeuticAudioPreviewProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);
  
  const currentBucket = THERAPEUTIC_BUCKETS[currentSlideIndex % THERAPEUTIC_BUCKETS.length];
  const canPlay = canPreviewCategory(currentBucket.category);

  // Load track when slide changes
  useEffect(() => {
    if (!canPlay) {
      setPlaying(false);
      setCurrentTrackUrl(null);
      return;
    }

    const loadTrack = async () => {
      setLoading(true);
      const url = await getPreviewTrackForBucket(currentBucket.bucket);
      setCurrentTrackUrl(url);
      setLoading(false);

      // Auto-resume if user was playing
      if (hasStartedPlayback && url && audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play().catch(() => {
          setPlaying(false);
        });
      }
    };

    loadTrack();
  }, [currentSlideIndex, canPlay, hasStartedPlayback]);

  // Handle track ending - mark as previewed
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      markCategoryPreviewed(currentBucket.category);
      setPlaying(false);
      toast.success(
        `You've completed your ${currentBucket.name} preview`,
        { description: 'Sign up to unlock unlimited listening' }
      );
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentBucket]);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrackUrl) return;

    if (!canPlay) {
      toast.error(
        `You've already previewed ${currentBucket.name}`,
        { description: 'Sign up to unlock full access' }
      );
      return;
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.src = currentTrackUrl;
      audioRef.current.play()
        .then(() => {
          setPlaying(true);
          setHasStartedPlayback(true);
        })
        .catch(error => {
          console.error('Playback failed:', error);
          toast.error('Unable to play audio');
        });
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <>
      <audio ref={audioRef} preload="auto" />

      <AnimatePresence>
        <motion.div
          key={currentSlideIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <div className="
            backdrop-blur-[22px] saturate-[180%] 
            bg-[rgba(20,20,20,0.55)] 
            border border-white/10 
            rounded-3xl 
            px-6 py-4 
            flex items-center gap-4 
            shadow-[0_8px_32px_rgba(0,0,0,0.8)]
            before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/[0.05] before:via-transparent before:to-transparent before:pointer-events-none
          ">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              disabled={loading || !currentTrackUrl}
              className="
                relative shrink-0 w-12 h-12 rounded-full 
                bg-white/10 hover:bg-white/20 
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center 
                transition-all duration-300
                group
              "
            >
              {!canPlay ? (
                <Lock size={20} className="text-white/60" />
              ) : loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : playing ? (
                <Pause size={20} className="text-white group-hover:scale-110 transition-transform" />
              ) : (
                <Play size={20} className="text-white group-hover:scale-110 transition-transform ml-0.5" />
              )}
            </button>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {currentBucket.name}
              </p>
              <p className="text-white/60 text-xs truncate">
                {!canPlay ? 'Preview used' : loading ? 'Loading...' : currentBucket.description}
              </p>
            </div>

            {/* Volume Control */}
            <button
              onClick={toggleMute}
              disabled={!playing}
              className="
                shrink-0 w-10 h-10 rounded-full 
                bg-white/5 hover:bg-white/10 
                disabled:opacity-30
                flex items-center justify-center 
                transition-all duration-300
              "
            >
              {muted ? (
                <VolumeX size={18} className="text-white/80" />
              ) : (
                <Volume2 size={18} className="text-white/80" />
              )}
            </button>
          </div>

          {/* Preview Status Indicator */}
          {!canPlay && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 text-center"
            >
              <p className="text-white/50 text-xs">
                🔒 Sign up to unlock unlimited listening
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

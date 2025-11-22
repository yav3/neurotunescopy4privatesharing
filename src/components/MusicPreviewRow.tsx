import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPreviewTrackForBucket, canPreviewCategory, markCategoryPreviewed, TherapeuticCategory } from '@/utils/therapeuticAudio';
import { toast } from 'sonner';

interface PreviewCategory {
  name: string;
  bucket: string;
  category: TherapeuticCategory;
  description: string;
}

const PREVIEW_CATEGORIES: PreviewCategory[] = [
  {
    name: "Focus & Flow",
    bucket: "NewAgeandWorldFocus",
    category: "focus",
    description: "Deep concentration"
  },
  {
    name: "Samba Energy",
    bucket: "samba",
    category: "energize",
    description: "Rhythmic vitality"
  },
  {
    name: "Mood Boosting House",
    bucket: "tropicalhouse",
    category: "boost",
    description: "Uplifting vibes"
  }
];

export const MusicPreviewRow: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<TherapeuticCategory | null>(null);
  const [loading, setLoading] = useState<TherapeuticCategory | null>(null);
  const [trackUrls, setTrackUrls] = useState<Record<TherapeuticCategory, string | null>>({
    focus: null,
    calm: null,
    boost: null,
    energize: null
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = async (preview: PreviewCategory) => {
    // Check if already previewed
    if (!canPreviewCategory(preview.category)) {
      toast.error('Preview already used', {
        description: 'Sign up to unlock unlimited listening'
      });
      return;
    }

    // If same category, toggle pause
    if (activeCategory === preview.category) {
      audioRef.current?.pause();
      setActiveCategory(null);
      return;
    }

    // Load and play new category
    setLoading(preview.category);
    
    // Change background video theme to match category
    window.dispatchEvent(new CustomEvent('categoryChange', { 
      detail: { category: preview.category } 
    }));

    // Get track URL
    let trackUrl = trackUrls[preview.category];
    if (!trackUrl) {
      trackUrl = await getPreviewTrackForBucket(preview.bucket);
      if (trackUrl) {
        setTrackUrls(prev => ({ ...prev, [preview.category]: trackUrl }));
      }
    }

    if (trackUrl && audioRef.current) {
      audioRef.current.src = trackUrl;
      try {
        await audioRef.current.play();
        setActiveCategory(preview.category);
        setLoading(null);
      } catch (error) {
        console.error('Playback failed:', error);
        toast.error('Playback failed', {
          description: 'Please try again'
        });
        setLoading(null);
      }
    } else {
      toast.error('No audio found', {
        description: 'Unable to load preview track'
      });
      setLoading(null);
    }
  };

  // Handle audio end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (activeCategory) {
        markCategoryPreviewed(activeCategory);
        toast.success('Preview complete', {
          description: 'Sign up to unlock unlimited listening'
        });
        setActiveCategory(null);
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [activeCategory]);

  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-0">
      <audio ref={audioRef} preload="auto" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PREVIEW_CATEGORIES.map((preview, index) => {
          const isActive = activeCategory === preview.category;
          const isLoading = loading === preview.category;
          const canPlay = canPreviewCategory(preview.category);

          return (
            <motion.div
              key={preview.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`
                relative group cursor-pointer
                backdrop-blur-xl bg-white/[0.12] border border-white/10
                rounded-3xl p-6 
                hover:bg-white/[0.15] hover:border-white/20
                transition-all duration-300
                ${isActive ? 'ring-2 ring-white/30 bg-white/[0.18]' : ''}
              `}
              onClick={() => handlePlay(preview)}
            >

              {/* Play/Pause Button */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`
                  w-14 h-14 rounded-full 
                  flex items-center justify-center
                  transition-all duration-300
                  ${isActive ? 'bg-white/20' : 'bg-white/10'}
                  group-hover:bg-white/20 group-hover:scale-105
                `}>
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isActive ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-white font-medium text-lg tracking-wide">
                    {preview.name}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {preview.description}
                  </p>
                </div>
              </div>

              {/* Status indicator */}
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>One preview track</span>
                {!canPlay && <span className="text-white/70">✓ Played</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

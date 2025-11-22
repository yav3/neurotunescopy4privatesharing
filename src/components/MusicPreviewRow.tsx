import React, { useState } from 'react';
import { Play, Pause, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { canPreviewCategory, TherapeuticCategory } from '@/utils/therapeuticAudio';
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
    name: "Nocturnes",
    bucket: "Nocturnes",
    category: "calm",
    description: "Peaceful relaxation"
  },
  {
    name: "Samba Jazz",
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
  const [autoPlayIndex, setAutoPlayIndex] = useState(0);

  // Auto-play carousel effect
  React.useEffect(() => {
    if (activeCategory) return; // Don't auto-play if user has selected something
    
    const interval = setInterval(() => {
      setAutoPlayIndex((prev) => (prev + 1) % PREVIEW_CATEGORIES.length);
    }, 6000); // 6 seconds per card
    
    return () => clearInterval(interval);
  }, [activeCategory]);

  const handlePlay = async (preview: PreviewCategory) => {
    // Check if already previewed
    if (!canPreviewCategory(preview.category)) {
      toast.error('Preview already used', {
        description: 'Sign up to unlock unlimited listening'
      });
      return;
    }

    // Change background video theme to match category
    window.dispatchEvent(new CustomEvent('categoryChange', { 
      detail: { category: preview.category } 
    }));

    // For now, just show a message - proper integration with main player coming soon
    toast.success(`${preview.name} selected`, {
      description: 'Full playback integration coming soon'
    });
    
    setActiveCategory(preview.category);
  };

  return (
    <div className="relative z-10 w-full overflow-hidden px-3 sm:px-6 lg:px-8">
      <div className="flex justify-start items-center gap-6 lg:gap-8 overflow-x-auto scrollbar-hide py-4 snap-x snap-mandatory">
        {PREVIEW_CATEGORIES.map((preview, index) => {
          const isActive = activeCategory === preview.category;
          const isLoading = loading === preview.category;
          const canPlay = canPreviewCategory(preview.category);
          const isAutoPlayActive = !activeCategory && index === autoPlayIndex;

          return (
            <motion.div
              key={preview.category}
              initial={{ opacity: 0, x: 50 }}
              animate={{ 
                opacity: activeCategory 
                  ? (activeCategory === preview.category ? 1 : 0.2)
                  : (isAutoPlayActive ? 1 : 0.35),
                x: 0,
                scale: (isActive || isAutoPlayActive) ? 1.05 : 1
              }}
              transition={{ 
                duration: 2.4,
                ease: [0.16, 1, 0.3, 1]
              }}
              className={`
                min-w-[320px] w-[320px] sm:min-w-[340px] sm:w-[340px] relative cursor-pointer snap-center
                rounded-[24px] border flex-shrink-0
                bg-white/[0.045] backdrop-blur-[28px] saturate-[180%]
                p-6
                shadow-[0_12px_35px_rgba(0,0,0,0.75),inset_0_0_18px_rgba(255,255,255,0.055)]
                transition-all duration-[2400ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                ${isActive 
                  ? 'border-white/[0.32] bg-white/[0.12]' 
                  : 'border-white/[0.14] hover:bg-white/[0.08] hover:border-white/[0.22]'
                }
              `}
              onClick={() => handlePlay(preview)}
            >

              {/* Play/Pause Button */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`
                  w-14 h-14 rounded-full 
                  flex items-center justify-center flex-shrink-0
                  transition-all duration-[2400ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                  ${(isActive || isAutoPlayActive) ? 'bg-white/20 scale-110' : 'bg-white/10'}
                  hover:bg-white/20 hover:scale-105
                `}>
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isActive ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg leading-tight">
                    {preview.name}
                  </h3>
                  <p className="text-white/60 text-sm mt-1 leading-snug">
                    {preview.description}
                  </p>
                </div>
              </div>

              {/* Status indicator */}
              <div className="flex items-center justify-between text-xs text-white/40 mt-4">
                <span>One preview track</span>
                {!canPlay && <span className="text-white/50">✓ Played</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

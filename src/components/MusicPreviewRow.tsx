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
    <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 lg:gap-8 lg:flex-nowrap">
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
                w-full max-w-[340px] sm:w-[270px] sm:max-w-none relative group cursor-pointer
                rounded-[18px] sm:rounded-[24px] border
                bg-white/[0.045] backdrop-blur-[28px] saturate-[180%]
                p-4 sm:p-[26px]
                shadow-[0_8px_24px_rgba(0,0,0,0.75),inset_0_0_12px_rgba(255,255,255,0.055)]
                sm:shadow-[0_12px_35px_rgba(0,0,0,0.75),inset_0_0_18px_rgba(255,255,255,0.055)]
                transition-all duration-[350ms] ease-out
                ${isActive 
                  ? 'border-white/[0.22] bg-white/[0.08] -translate-y-2 scale-[1.03]' 
                  : 'border-white/[0.14] hover:bg-white/[0.08] hover:border-white/[0.22] hover:-translate-y-2 hover:scale-[1.03]'
                }
              `}
              onClick={() => handlePlay(preview)}
            >

              {/* Play/Pause Button */}
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-full 
                  flex items-center justify-center flex-shrink-0
                  transition-all duration-300
                  ${isActive ? 'bg-white/20' : 'bg-white/10'}
                  group-hover:bg-white/20 group-hover:scale-105
                `}>
                  {isLoading ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isActive ? (
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-base sm:text-lg leading-tight tracking-wide">
                    {preview.name}
                  </h3>
                  <p className="text-white/60 text-[13px] sm:text-sm mt-0.5 leading-snug">
                    {preview.description}
                  </p>
                </div>
              </div>

              {/* Status indicator */}
              <div className="flex items-center justify-between text-[11px] sm:text-xs text-white/40 mt-3 sm:mt-4">
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

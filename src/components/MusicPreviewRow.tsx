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
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                rounded-3xl border-[0.5px]
                bg-white/[0.05] backdrop-blur-xl
                p-6 
                transition-all duration-300
                ${isActive 
                  ? 'border-white/20 bg-white/[0.12] shadow-[0_0_60px_rgba(255,255,255,0.12)] scale-[1.02]' 
                  : 'border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:bg-white/[0.10] hover:border-white/15 hover:scale-[1.015]'
                }
              `}
              onClick={() => handlePlay(preview)}
            >

              {/* Play/Pause Button */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`
                  w-12 h-12 rounded-full 
                  flex items-center justify-center
                  transition-all duration-300
                  ${isActive ? 'bg-white/20' : 'bg-white/10'}
                  group-hover:bg-white/20 group-hover:scale-105
                `}>
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isActive ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg leading-tight tracking-wide">
                    {preview.name}
                  </h3>
                  <p className="text-white/60 text-sm mt-0.5">
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

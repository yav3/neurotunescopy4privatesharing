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
    description: "New Age sample"
  },
  {
    name: "Nocturnes",
    bucket: "Nocturnes",
    category: "calm",
    description: "Crossover Classical for Deep Rest"
  },
  {
    name: "Serene Samba",
    bucket: "samba",
    category: "energize",
    description: "Samba Jazz for Social Relaxation"
  }
];

export const MusicPreviewRow: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<TherapeuticCategory | null>(null);
  const [loading, setLoading] = useState<TherapeuticCategory | null>(null);
  const [autoPlayIndex, setAutoPlayIndex] = useState(0);

  // Auto-play carousel effect - very slow
  React.useEffect(() => {
    if (activeCategory) return; // Don't auto-play if user has selected something
    
    const interval = setInterval(() => {
      setAutoPlayIndex((prev) => (prev + 1) % PREVIEW_CATEGORIES.length);
    }, 8000); // 8 seconds per card - slower breathing
    
    return () => clearInterval(interval);
  }, [activeCategory]);

  const handleCardClick = (preview: PreviewCategory) => {
    if (activeCategory === preview.category) {
      // If clicking active card, play it
      handlePlay(preview);
    } else {
      // Otherwise, just advance to this card
      setAutoPlayIndex(PREVIEW_CATEGORIES.findIndex(p => p.category === preview.category));
    }
  };

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
      <div className="flex justify-center items-center gap-8 lg:gap-12 py-4">
        {PREVIEW_CATEGORIES.map((preview, index) => {
          const isActive = activeCategory === preview.category;
          const isLoading = loading === preview.category;
          const canPlay = canPreviewCategory(preview.category);
          const isAutoPlayActive = !activeCategory && index === autoPlayIndex;
          const isHighlighted = isActive || isAutoPlayActive;
          
          // Calculate horizontal offset for carousel movement
          const offset = !activeCategory ? (autoPlayIndex - index) * 20 : 0;

          return (
            <motion.div
              key={preview.category}
              initial={{ opacity: 0, x: 50 }}
              animate={{ 
                opacity: isHighlighted ? 1 : 0.15,
                x: offset,
                scale: isHighlighted ? 1.4 : 0.85,
              }}
              transition={{ 
                duration: 3.2,
                ease: [0.16, 1, 0.3, 1]
              }}
              className={`
                min-w-[320px] w-[320px] sm:min-w-[380px] sm:w-[380px] relative cursor-pointer
                rounded-[24px] border flex-shrink-0
                bg-white/[0.045] backdrop-blur-[28px] saturate-[180%]
                p-8
                shadow-[0_12px_35px_rgba(0,0,0,0.75),inset_0_0_18px_rgba(255,255,255,0.055)]
                transition-all duration-[3200ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                ${isHighlighted
                  ? 'border-white/[0.32] bg-white/[0.12]' 
                  : 'border-white/[0.14] hover:bg-white/[0.08] hover:border-white/[0.22]'
                }
              `}
              onClick={() => handleCardClick(preview)}
              style={{
                animation: isHighlighted ? 'breathe 4s ease-in-out infinite' : 'none'
              }}
            >

              {/* Genre name */}
              <div className="mb-3">
                <h3 className="text-white text-lg leading-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                  {preview.name}
                </h3>
              </div>

              {/* Play/Pause Button */}
              <div className="flex justify-center mb-4">
                <div className={`
                  w-14 h-14 rounded-full 
                  flex items-center justify-center
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
              </div>

              {/* Description */}
              <div className="text-center">
                <p className="text-white/60 text-sm leading-snug" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                  {preview.description}
                </p>
              </div>

              {/* Status indicator */}
              <div className="flex items-center justify-center text-xs text-white/40 mt-4">
                {!canPlay && <span className="text-white/50">✓ Played</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

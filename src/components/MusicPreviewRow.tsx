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
    <div className="relative z-10 w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        {PREVIEW_CATEGORIES.map((preview, index) => {
          const isActive = activeCategory === preview.category;
          const isLoading = loading === preview.category;
          const canPlay = canPreviewCategory(preview.category);
          const isAutoPlayActive = !activeCategory && index === autoPlayIndex;
          const isHighlighted = isActive || isAutoPlayActive;
          
          // Calculate position relative to center
          const centerIndex = !activeCategory ? autoPlayIndex : PREVIEW_CATEGORIES.findIndex(p => p.category === activeCategory);
          const positionOffset = index - centerIndex;
          
          return (
            <motion.div
              key={preview.category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isHighlighted ? 1 : 0.08,
                scale: isHighlighted ? 1 : 0.75,
                filter: isHighlighted ? 'blur(0px) brightness(1)' : 'blur(12px) brightness(0.4)',
                x: `${positionOffset * 100}%`,
                zIndex: isHighlighted ? 20 : 10 - Math.abs(positionOffset)
              }}
              transition={{ 
                duration: 3.5,
                ease: [0.19, 1.0, 0.22, 1.0]
              }}
              className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[280px] sm:w-[320px] md:w-[360px] cursor-pointer
                rounded-[20px] border
                backdrop-blur-[40px] saturate-[200%]
                p-6 sm:p-7
                transition-all duration-[3500ms] ease-[cubic-bezier(0.19,1.0,0.22,1.0)]
                ${isHighlighted
                  ? 'bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.12] border-white/[0.35] shadow-[0_20px_60px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(255,255,255,0.08),0_0_80px_rgba(255,255,255,0.15)]' 
                  : 'bg-gradient-to-br from-white/[0.03] via-white/[0.02] to-black/[0.05] border-white/[0.08] shadow-[0_8px_20px_rgba(0,0,0,0.6)]'
                }
              `}
              onClick={() => handleCardClick(preview)}
              style={{
                animation: isHighlighted ? 'breathe 5.3s ease-in-out infinite, shimmer 8s ease-in-out infinite' : 'none',
                pointerEvents: isHighlighted ? 'auto' : 'none'
              }}
            >

              {/* Genre name */}
              <div className="mb-3 text-center">
                <h3 className="text-white text-base sm:text-lg font-light leading-tight tracking-wide" style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                  textShadow: isHighlighted ? '0 2px 20px rgba(255,255,255,0.3)' : 'none'
                }}>
                  {preview.name}
                </h3>
              </div>

              {/* Play/Pause Button */}
              <div className="flex justify-center mb-3">
                <motion.div 
                  animate={{
                    scale: isHighlighted ? [1, 1.05, 1] : 1,
                    boxShadow: isHighlighted 
                      ? ['0 0 20px rgba(255,255,255,0.2)', '0 0 40px rgba(255,255,255,0.4)', '0 0 20px rgba(255,255,255,0.2)']
                      : '0 0 0px rgba(255,255,255,0)'
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`
                    w-14 h-14 rounded-full 
                    flex items-center justify-center
                    transition-all duration-[3500ms] ease-[cubic-bezier(0.19,1.0,0.22,1.0)]
                    ${isHighlighted ? 'bg-white/25 backdrop-blur-xl' : 'bg-white/10'}
                  `}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isActive ? (
                    <Pause className="w-5 h-5 text-white drop-shadow-lg" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5 drop-shadow-lg" />
                  )}
                </motion.div>
              </div>

              {/* Description */}
              <div className="text-center">
                <p className="text-white/70 text-xs sm:text-sm leading-snug font-light" style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                  textShadow: isHighlighted ? '0 1px 10px rgba(255,255,255,0.2)' : 'none'
                }}>
                  {preview.description}
                </p>
              </div>

              {/* Status indicator */}
              {!canPlay && (
                <div className="flex items-center justify-center text-xs text-white/40 mt-3">
                  <span className="text-white/50">✓ Played</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

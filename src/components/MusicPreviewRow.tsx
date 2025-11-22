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

  // Auto-play carousel effect - 8 seconds per card
  React.useEffect(() => {
    if (activeCategory) return; // Don't auto-play if user has selected something
    
    const interval = setInterval(() => {
      setAutoPlayIndex((prev) => {
        const nextIndex = (prev + 1) % PREVIEW_CATEGORIES.length;
        // Dispatch event to sync background video
        window.dispatchEvent(new CustomEvent('carouselChange', { 
          detail: { category: PREVIEW_CATEGORIES[nextIndex].category } 
        }));
        return nextIndex;
      });
    }, 8000); // 8 seconds per card
    
    return () => clearInterval(interval);
  }, [activeCategory]);

  const handleCardClick = (preview: PreviewCategory) => {
    if (activeCategory === preview.category) {
      // If clicking active card, play it
      handlePlay(preview);
    } else {
      // Otherwise, just advance to this card
      const newIndex = PREVIEW_CATEGORIES.findIndex(p => p.category === preview.category);
      setAutoPlayIndex(newIndex);
      // Sync background video
      window.dispatchEvent(new CustomEvent('carouselChange', { 
        detail: { category: preview.category } 
      }));
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
    <div className="relative z-10 w-full flex items-center justify-center" style={{ minHeight: '400px' }}>
      {/* Swipe indicator - subtle arrow */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ 
          opacity: [0, 0.6, 0],
          x: [0, 10, 20]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut"
        }}
        className="absolute right-[10%] top-1/2 -translate-y-1/2 pointer-events-none z-20"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-[1px] bg-white/40"></div>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/40">
            <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.div>

      <div className="relative">
        {PREVIEW_CATEGORIES.map((preview, index) => {
          const isActive = activeCategory === preview.category;
          const isLoading = loading === preview.category;
          const canPlay = canPreviewCategory(preview.category);
          const isAutoPlayActive = !activeCategory && index === autoPlayIndex;
          const isHighlighted = isActive || isAutoPlayActive;
          
          // Only show the highlighted card
          if (!isHighlighted) return null;
          
          return (
            <motion.div
              key={preview.category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1,
                scale: 1,
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                duration: 2.5,
                ease: [0.19, 1.0, 0.22, 1.0]
              }}
              className="w-[200px] sm:w-[240px] cursor-pointer rounded-2xl p-4 backdrop-blur-sm bg-black/60 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
              onClick={() => handleCardClick(preview)}
            >

              {/* Genre name */}
              <div className="mb-2 text-center">
                <h3 className="text-white text-sm font-medium leading-tight tracking-wide" style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                  textShadow: '0 1px 8px rgba(0,0,0,0.8)'
                }}>
                  {preview.name}
                </h3>
              </div>

              {/* Play/Pause Button */}
              <div className="flex justify-center mb-2">
                <motion.div 
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/15 backdrop-blur-xl border border-white/25"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isActive ? (
                    <Pause className="w-4 h-4 text-white drop-shadow-lg" />
                  ) : (
                    <Play className="w-4 h-4 text-white ml-0.5 drop-shadow-lg" />
                  )}
                </motion.div>
              </div>

              {/* Description */}
              <div className="text-center">
                <p className="text-white/75 text-[10px] leading-snug font-light" style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                  textShadow: '0 1px 6px rgba(0,0,0,0.8)'
                }}>
                  {preview.description}
                </p>
              </div>

              {/* Status indicator */}
              {!canPlay && (
                <div className="flex items-center justify-center text-[10px] text-white/40 mt-2">
                  <span className="text-white/50">✓ Played</span>
                </div>
              )}
              
              {/* Instruction hint - only show on first card */}
              {index === 0 && !isActive && (
                <div className="text-center mt-2">
                  <p className="text-white/50 text-[9px] font-light" style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}>
                    Tap to play
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

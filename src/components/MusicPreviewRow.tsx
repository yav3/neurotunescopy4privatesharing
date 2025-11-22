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
  const [showWelcome, setShowWelcome] = useState(true);

  // Hide welcome message after 4 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-play carousel effect - 3 seconds per card
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
    }, 3000); // 3 seconds per card
    
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
    <div className="relative z-10 w-full h-screen overflow-hidden">
      {/* Welcome message - fades out after 4 seconds */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: showWelcome ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-30"
        style={{ display: showWelcome ? 'block' : 'none' }}
      >
        <h1 className="text-white text-3xl sm:text-4xl font-light mb-4" style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          textShadow: '0 2px 20px rgba(0,0,0,0.8)'
        }}>
          + NeuroTunes
        </h1>
        <p className="text-white/80 text-xs sm:text-sm font-light max-w-2xl px-6" style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          textShadow: '0 1px 10px rgba(0,0,0,0.8)',
          letterSpacing: '0.02em'
        }}>
          Neuroscience-backed • Clinically Validated • Patented • Medical-grade Therapeutic Music & AI Streaming
        </p>
      </motion.div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center items-center">
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
                x: positionOffset * 420,
                y: 0,
                zIndex: isHighlighted ? 20 : 10 - Math.abs(positionOffset)
              }}
              transition={{ 
                duration: 1.5,
                ease: [0.19, 1.0, 0.22, 1.0]
              }}
              className={`
                relative
                w-[280px] sm:w-[320px] md:w-[360px] cursor-pointer
                rounded-[24px] 
                p-4 sm:p-5
                transition-all duration-[3500ms] ease-[cubic-bezier(0.19,1.0,0.22,1.0)]
                ${isHighlighted
                  ? 'shadow-[0_0_2px_rgba(255,255,255,0.6),0_24px_80px_rgba(0,0,0,0.95),inset_0_2px_1px_rgba(255,255,255,0.2),inset_0_-2px_1px_rgba(0,0,0,0.6)]' 
                  : 'shadow-[0_8px_32px_rgba(0,0,0,0.8)]'
                }
              `}
              onClick={() => handleCardClick(preview)}
              style={{
                background: isHighlighted 
                  ? 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.92) 100%)'
                  : 'rgba(0,0,0,0.5)',
                border: isHighlighted 
                  ? '2px solid transparent' 
                  : '1px solid rgba(255,255,255,0.06)',
                borderImage: isHighlighted 
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.4) 100%) 1'
                  : 'none',
                backdropFilter: 'blur(2px) saturate(100%)',
                animation: isHighlighted ? 'breathe 5.3s ease-in-out infinite, shimmer 8s ease-in-out infinite' : 'none',
                pointerEvents: isHighlighted ? 'auto' : 'none'
              }}
            >
              {/* Diamond-cut frosted edge - very thin */}
              <div className="absolute inset-[1px] rounded-[23px] pointer-events-none"
                style={{
                  boxShadow: isHighlighted 
                    ? 'inset 0 0 0 1px rgba(255,255,255,0.3), inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -1px 2px rgba(0,0,0,0.8)'
                    : 'none',
                  background: 'transparent'
                }}
              />

              {/* Genre name */}
              <div className="mb-2 text-center">
                <h3 className="text-white text-sm sm:text-base font-normal leading-tight tracking-wide" style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                  textShadow: isHighlighted ? '0 1px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.15)' : 'none',
                  letterSpacing: '0.02em'
                }}>
                  {preview.name}
                </h3>
              </div>

              {/* Play/Pause Button */}
              <div className="flex justify-center mb-2">
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
                    w-12 h-12 rounded-full 
                    flex items-center justify-center
                    transition-all duration-[3500ms] ease-[cubic-bezier(0.19,1.0,0.22,1.0)]
                    ${isHighlighted ? 'bg-white/20 backdrop-blur-xl border border-white/30' : 'bg-white/8 border border-white/10'}
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
                <p className="text-white/85 text-[11px] sm:text-xs leading-snug font-normal" style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                  textShadow: isHighlighted ? '0 1px 4px rgba(0,0,0,0.6), 0 0 15px rgba(255,255,255,0.1)' : 'none',
                  letterSpacing: '0.01em'
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

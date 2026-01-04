import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PremiumHeroProps {
  onComplete?: () => void;
}

export const PremiumHero: React.FC<PremiumHeroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'hero' | 'fading'>('hero');

  // Auto-transition after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('fading');
      setTimeout(() => {
        onComplete?.();
      }, 800);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleClick = () => {
    setPhase('fading');
    setTimeout(() => {
      onComplete?.();
    }, 600);
  };

  return (
    <AnimatePresence>
      {phase !== 'fading' ? (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-obsidian-950 cursor-pointer"
          onClick={handleClick}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Hero Text */}
          <motion.h1
            className="text-white font-light tracking-tight text-center"
            style={{ 
              fontSize: '50px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
              letterSpacing: '-0.02em'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          >
            Focus. Engineered.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-white/80 font-light text-center mt-8"
            style={{ 
              fontSize: '28px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
              letterSpacing: '-0.01em'
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
          >
            Music as neural infrastructure.
          </motion.p>

          {/* Subtle enter prompt */}
          <motion.div
            className="absolute bottom-16 text-white/40 text-sm font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            Click anywhere to enter
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

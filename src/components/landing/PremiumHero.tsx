import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { WaveletSphere } from './WaveletSphere';

interface PremiumHeroProps {
  onComplete?: () => void;
}

export const PremiumHero: React.FC<PremiumHeroProps> = ({ onComplete }) => {
  const isMobile = useIsMobile();
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    // "demo" fades in over ~1s, stays briefly, then fades out
    const hideText = setTimeout(() => setShowText(false), 1800);
    // Auto-start the experience after text exits
    const autoStart = setTimeout(() => onComplete?.(), 2800);
    return () => {
      clearTimeout(hideText);
      clearTimeout(autoStart);
    };
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 z-40 overflow-hidden"
      style={{
        background: `linear-gradient(145deg, 
          hsl(200, 15%, 4%) 0%, 
          hsl(210, 12%, 6%) 40%,
          hsl(200, 10%, 5%) 100%
        )`
      }}
    >
      {/* Subtle ambient glow */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, 
            hsla(200, 30%, 12%, 0.15) 0%, 
            transparent 70%
          )`
        }}
      />

      {/* Background wavelet sphere */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: isMobile ? '300px' : '500px', height: isMobile ? '300px' : '500px' }}
        >
          <WaveletSphere dark />
        </motion.div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        {/* "demo" word — fades in then out, experience auto-starts after */}
        <AnimatePresence>
          {showText && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              style={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                fontSize: isMobile ? '36px' : '56px',
                fontWeight: 300,
                letterSpacing: '-0.025em',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              demo
            </motion.h1>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

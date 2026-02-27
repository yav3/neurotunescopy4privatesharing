import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface PremiumHeroProps {
  onComplete?: () => void;
}

export const PremiumHero: React.FC<PremiumHeroProps> = ({ onComplete }) => {
  const isMobile = useIsMobile();
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    const autoStart = setTimeout(() => onComplete?.(), 1800);
    return () => clearTimeout(autoStart);
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

      {/* Subtle ambient pulse — no particle animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: isMobile ? '300px' : '500px',
            height: isMobile ? '300px' : '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, hsla(200, 40%, 20%, 0.3) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        {/* "demo" word — fades in then out, experience auto-starts after */}
        <AnimatePresence>
        </AnimatePresence>
      </div>
    </div>
  );
};

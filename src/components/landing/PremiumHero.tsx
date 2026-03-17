import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface PremiumHeroProps {
  onComplete?: () => void;
}

export const PremiumHero: React.FC<PremiumHeroProps> = ({ onComplete }) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => onComplete?.(), 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-40 overflow-hidden flex items-center justify-center"
      style={{
        background: `linear-gradient(145deg, 
          hsl(200, 15%, 4%) 0%, 
          hsl(210, 12%, 6%) 40%,
          hsl(200, 10%, 5%) 100%
        )`,
      }}
    >
      {/* Subtle ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, 
            hsla(200, 30%, 12%, 0.15) 0%, 
            transparent 70%
          )`,
        }}
      />

      {/* Ambient pulse */}
      <motion.div
        className="absolute pointer-events-none"
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

      {/* Welcome text */}
      <AnimatePresence>
        <motion.div
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            style={{
              fontSize: isMobile ? '28px' : '44px',
              fontWeight: 300,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              color: 'hsla(0, 0%, 100%, 0.9)',
              fontFamily: 'var(--font-sf)',
            }}
          >
            Welcome to Neurotunes
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{
              fontSize: isMobile ? '13px' : '15px',
              fontWeight: 400,
              color: 'hsla(0, 0%, 100%, 0.45)',
              marginTop: '12px',
              letterSpacing: '0.04em',
            }}
          >
            Music that moves you. Data that proves it.
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

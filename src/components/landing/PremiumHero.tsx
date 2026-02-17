import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PremiumHeroProps {
  onComplete?: () => void;
}

export const PremiumHero: React.FC<PremiumHeroProps> = ({ onComplete }) => {
  const isMobile = useIsMobile();
  const handlePlay = () => {
    onComplete?.();
  };

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
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        
        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 sm:mb-16"
        >
          <h1 
            className="text-white"
            style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
              fontSize: isMobile ? '32px' : '50px',
              fontWeight: 300,
              letterSpacing: '-0.025em',
              lineHeight: 1.1
            }}
          >
            Atmosphere. Engineered.
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-4 sm:mt-6"
            style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
              fontSize: isMobile ? '16px' : '24px',
              fontWeight: 300,
              letterSpacing: '-0.01em',
              color: 'rgba(255, 255, 255, 0.5)'
            }}
          >
            Adaptive state music engine.
          </motion.p>
        </motion.div>
        
        {/* Play Button — responsive sizing */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          onClick={handlePlay}
          className={`group relative flex items-center justify-center rounded-full border-2 border-white/40 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/60 transition-all duration-500 cursor-pointer ${
            isMobile ? 'w-24 h-24' : 'w-40 h-40'
          }`}
        >
          <Play 
            className={`text-white group-hover:scale-110 transition-transform duration-500 ${
              isMobile ? 'w-10 h-10 ml-1' : 'w-16 h-16 ml-2'
            }`}
            fill="white" 
            strokeWidth={0}
          />
          <div className="absolute inset-[-4px] rounded-full border border-white/20 group-hover:border-white/30 transition-colors duration-500" />
          <div className="absolute inset-[-8px] rounded-full border border-white/10 group-hover:border-white/15 transition-colors duration-500" />
        </motion.button>
      </div>
      
      {/* Bottom hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 sm:bottom-10 left-0 right-0 text-center"
        style={{ 
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          fontSize: '13px',
          fontWeight: 400,
          letterSpacing: '0.02em',
          color: 'rgba(255, 255, 255, 0.25)'
        }}
      >
        Press to begin
      </motion.p>
    </div>
  );
};

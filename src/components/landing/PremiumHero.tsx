import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Play } from 'lucide-react';
import { MobiusStrip } from './MobiusStrip';

interface PremiumHeroProps {
  onComplete?: () => void;
}

export const PremiumHero: React.FC<PremiumHeroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'mobius' | 'transitioning' | 'play'>('mobius');
  const [mobiusOpacity, setMobiusOpacity] = useState(1);
  
  // Auto-transition after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('transitioning');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle transition phases
  useEffect(() => {
    if (phase === 'transitioning') {
      const fadeInterval = setInterval(() => {
        setMobiusOpacity((prev) => {
          if (prev <= 0) {
            clearInterval(fadeInterval);
            setPhase('play');
            return 0;
          }
          return prev - 0.04;
        });
      }, 40);
      
      return () => clearInterval(fadeInterval);
    }
  }, [phase]);
  
  const handlePlay = () => {
    onComplete?.();
  };
  
  const handleSkipToPlay = () => {
    if (phase === 'mobius') {
      setPhase('transitioning');
    } else if (phase === 'play') {
      handlePlay();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black cursor-pointer overflow-hidden"
      onClick={handleSkipToPlay}
    >
      {/* Centered content container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        
        {/* Hero Text - positioned above center */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h1 
            className="text-white"
            style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
              fontSize: '50px',
              fontWeight: 300,
              letterSpacing: '-0.025em',
              lineHeight: 1.1
            }}
          >
            Focus. Engineered.
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.2 }}
            className="mt-8"
            style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
              fontSize: '28px',
              fontWeight: 300,
              letterSpacing: '-0.015em',
              color: 'rgba(255, 255, 255, 0.6)'
            }}
          >
            Music as neural infrastructure.
          </motion.p>
        </motion.div>
        
        {/* 3D Möbius Strip - centered */}
        <AnimatePresence mode="wait">
          {(phase === 'mobius' || phase === 'transitioning') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-72 h-72 md:w-96 md:h-96"
            >
              <Canvas 
                camera={{ position: [0, 0, 4], fov: 45 }}
                style={{ background: 'transparent' }}
              >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <directionalLight position={[-3, -3, -3]} intensity={0.4} />
                <pointLight position={[0, 0, 4]} intensity={0.8} color="#ffffff" />
                <Suspense fallback={null}>
                  <MobiusStrip opacity={mobiusOpacity} scale={1.4} />
                </Suspense>
              </Canvas>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Play Button - replaces Möbius */}
        <AnimatePresence>
          {phase === 'play' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => {
                e.stopPropagation();
                handlePlay();
              }}
              className="group relative flex items-center justify-center w-28 h-28 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-500"
            >
              <Play 
                className="w-12 h-12 text-white ml-1.5 group-hover:scale-110 transition-transform duration-500" 
                fill="white" 
                strokeWidth={0}
              />
              
              {/* Glow ring */}
              <div className="absolute inset-[-2px] rounded-full border border-white/10 group-hover:border-white/20 transition-colors duration-500" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      {/* Bottom hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-0 right-0 text-center"
        style={{ 
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          fontSize: '13px',
          fontWeight: 400,
          letterSpacing: '0.02em',
          color: 'rgba(255, 255, 255, 0.25)'
        }}
      >
        {phase === 'play' ? 'Press to begin' : 'Click to continue'}
      </motion.p>
    </div>
  );
};

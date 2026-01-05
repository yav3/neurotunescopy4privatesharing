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
  
  // Auto-transition after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('transitioning');
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle transition phases
  useEffect(() => {
    if (phase === 'transitioning') {
      // Fade out Möbius strip
      const fadeInterval = setInterval(() => {
        setMobiusOpacity((prev) => {
          if (prev <= 0) {
            clearInterval(fadeInterval);
            setPhase('play');
            return 0;
          }
          return prev - 0.05;
        });
      }, 50);
      
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
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center cursor-pointer"
      onClick={handleSkipToPlay}
    >
      {/* Hero Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute top-1/4 text-center z-10"
      >
        <h1 
          className="text-white font-light tracking-tight"
          style={{ 
            fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '50px',
            letterSpacing: '-0.02em'
          }}
        >
          Focus. Engineered.
        </h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-white/70 font-light mt-6"
          style={{ 
            fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '28px',
            letterSpacing: '-0.01em'
          }}
        >
          Music as neural infrastructure.
        </motion.p>
      </motion.div>
      
      {/* 3D Möbius Strip */}
      <AnimatePresence>
        {(phase === 'mobius' || phase === 'transitioning') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-64 h-64 md:w-80 md:h-80"
            style={{ marginTop: '4rem' }}
          >
            <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <directionalLight position={[-5, -5, -5]} intensity={0.3} />
              <pointLight position={[0, 0, 3]} intensity={0.5} color="#ffffff" />
              <Suspense fallback={null}>
                <MobiusStrip opacity={mobiusOpacity} scale={1.2} />
              </Suspense>
            </Canvas>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Play Button */}
      <AnimatePresence>
        {phase === 'play' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
            className="group relative flex items-center justify-center w-24 h-24 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/40 transition-all duration-300"
            style={{ marginTop: '4rem' }}
          >
            <Play 
              className="w-10 h-10 text-white ml-1 group-hover:scale-110 transition-transform duration-300" 
              fill="white" 
              strokeWidth={0}
            />
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-full bg-white/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 text-white/30 text-sm font-light tracking-wide"
        style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        {phase === 'play' ? 'Press to begin' : 'Click anywhere to continue'}
      </motion.p>
    </div>
  );
};

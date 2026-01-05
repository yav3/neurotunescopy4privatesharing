import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import atmosphereImage from '@/assets/atmosphere-engineered.jpeg';

interface LovableLandingPageProps {
  onExplore?: () => void;
}

export const LovableLandingPage: React.FC<LovableLandingPageProps> = ({ onExplore }) => {
  const sfPro = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

  return (
    <div 
      className="min-h-screen w-full"
      style={{ 
        backgroundColor: 'hsl(240 8% 4%)',
        fontFamily: sfPro 
      }}
    >
      {/* HERO SECTION - Full bleed image with play button */}
      <section className="min-h-screen relative flex items-center justify-center">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${atmosphereImage})`,
          }}
        />
        
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(240_8%_4%)] via-transparent to-transparent opacity-60" />
        
        {/* Play button */}
        <motion.button
          className="relative z-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
          whileTap={{ scale: 0.95 }}
          aria-label="Play"
        >
          <Play className="w-8 h-8 text-white ml-1" fill="white" fillOpacity={0.9} />
        </motion.button>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/20 text-xs font-light tracking-[0.3em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          Scroll
        </motion.div>
      </section>

      {/* DIFFERENTIATION SECTION */}
      <section className="py-32 flex flex-col items-center justify-center px-6">
        <motion.div
          className="max-w-3xl text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <p
            className="text-white/50 font-light"
            style={{ 
              fontSize: 'clamp(18px, 2vw, 22px)',
              lineHeight: 1.7,
            }}
          >
            Most music platforms optimize for preference and engagement.
          </p>
          <p
            className="text-white/70 font-light"
            style={{ 
              fontSize: 'clamp(18px, 2vw, 22px)',
              lineHeight: 1.7,
            }}
          >
            NeuroTunes AI optimizes for regulation — using structured musical parameters 
            informed by neuroscience research to support how the brain actually functions under load.
          </p>
        </motion.div>
      </section>

      {/* NOT A PLAYLIST SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-32">
        <motion.h2
          className="text-white font-medium text-center mb-12"
          style={{ 
            fontSize: 'clamp(28px, 5vw, 44px)',
            letterSpacing: '-0.02em',
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          Not a playlist. Not a wellness app.
        </motion.h2>

        <motion.div
          className="max-w-3xl text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p
            className="text-white/60 font-light"
            style={{ 
              fontSize: 'clamp(18px, 2vw, 22px)',
              lineHeight: 1.7,
            }}
          >
            NeuroTunes AI is an adaptive music system designed using neuroscience principles 
            to support focus, calm, and cognitive performance.
          </p>
          <p
            className="text-white/60 font-light"
            style={{ 
              fontSize: 'clamp(18px, 2vw, 22px)',
              lineHeight: 1.7,
            }}
          >
            It is built for environments where regulation matters — not distraction.
          </p>
        </motion.div>
      </section>

    </div>
  );
};

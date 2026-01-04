import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface LovableLandingPageProps {
  onExplore?: () => void;
}

// A/B Test Variants
type Variant = 'A' | 'B';

const VARIANTS = {
  A: {
    headline: 'FOCUS. ENGINEERED.',
    subheadline: 'Clinically informed music designed to regulate attention and stress.',
  },
  B: {
    headline: 'REGULATE YOUR BRAIN.',
    subheadline: 'Adaptive music designed with neuroscience.',
  },
};

export const LovableLandingPage: React.FC<LovableLandingPageProps> = ({ onExplore }) => {
  // For now, default to Variant A. Can be controlled via props or localStorage for A/B testing
  const [variant] = useState<Variant>('A');
  const content = VARIANTS[variant];

  const sfPro = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

  return (
    <div 
      className="min-h-screen w-full"
      style={{ 
        backgroundColor: 'hsl(240 8% 4%)', // True obsidian
        fontFamily: sfPro 
      }}
    >
      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        <motion.h1
          className="text-white font-semibold text-center"
          style={{ 
            fontSize: 'clamp(40px, 8vw, 72px)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {content.headline}
        </motion.h1>

        <motion.p
          className="text-white/70 font-light text-center mt-8 max-w-2xl"
          style={{ 
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            letterSpacing: '-0.01em',
            lineHeight: 1.5,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          {content.subheadline}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        >
          <Button
            onClick={onExplore}
            className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg font-medium rounded-none"
            style={{ fontFamily: sfPro }}
          >
            Explore NeuroTunes AI
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 text-white/30 text-sm font-light tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          Scroll
        </motion.div>
      </section>

      {/* SECOND SECTION - Not a playlist */}
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

      {/* THIRD SECTION - Outcomes */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-32">
        <motion.h2
          className="text-white font-medium text-center mb-16"
          style={{ 
            fontSize: 'clamp(28px, 5vw, 44px)',
            letterSpacing: '-0.02em',
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          What NeuroTunes AI Supports
        </motion.h2>

        <motion.ul
          className="max-w-2xl space-y-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {[
            'Sustained focus without overstimulation',
            'Reduced cognitive and emotional load',
            'A calmer baseline nervous system state',
            'Better task engagement over time',
          ].map((outcome, index) => (
            <motion.li
              key={index}
              className="text-white/60 font-light"
              style={{ 
                fontSize: 'clamp(18px, 2vw, 22px)',
                lineHeight: 1.6,
              }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              {outcome}
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* DIFFERENTIATION SECTION */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-32">
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

      {/* FINAL CTA */}
      <section className="min-h-[50vh] flex flex-col items-center justify-center px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <Button
            onClick={onExplore}
            className="bg-white text-black hover:bg-white/90 px-10 py-7 text-xl font-medium rounded-none"
            style={{ fontFamily: sfPro }}
          >
            Explore NeuroTunes AI
          </Button>
        </motion.div>
      </section>

      {/* TRUST SIGNAL FOOTER */}
      <footer className="py-16 px-6 border-t border-white/5">
        <motion.p
          className="text-white/30 text-center font-light text-sm tracking-wide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Designed with neuroscientists and clinicians. Used in research-informed environments.
        </motion.p>
      </footer>
    </div>
  );
};

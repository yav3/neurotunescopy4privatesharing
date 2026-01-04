import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { NeuralSignalGraphic } from './NeuralSignalGraphic';

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
  const [variant] = useState<Variant>('A');
  const content = VARIANTS[variant];

  const sfPro = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

  return (
    <div 
      className="min-h-screen w-full"
      style={{ 
        backgroundColor: 'hsl(240 8% 4%)',
        fontFamily: sfPro 
      }}
    >
      {/* HERO SECTION - Split Layout */}
      <section className="min-h-screen flex items-center justify-center px-6 lg:px-16 xl:px-24 relative">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* LEFT - Typography */}
          <div className="space-y-8">
            {/* Overline */}
            <motion.p
              className="text-white/40 text-xs tracking-[0.2em] uppercase font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              Clinically Informed • Adaptive Music
            </motion.p>

            {/* Headline */}
            <motion.h1
              className="text-white font-semibold"
              style={{ 
                fontSize: 'clamp(36px, 5vw, 56px)',
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            >
              Music, Precisely Tuned<br />
              to the Nervous System
            </motion.h1>

            {/* Subhead */}
            <motion.p
              className="text-white/50 font-light max-w-md"
              style={{ 
                fontSize: 'clamp(16px, 1.5vw, 20px)',
                letterSpacing: '-0.01em',
                lineHeight: 1.6,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            >
              Adaptive compositions engineered to regulate
              attention and stress in real time.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              className="pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
            >
              <Button
                onClick={onExplore}
                className="bg-white text-black hover:bg-white/90 px-8 py-6 text-base font-medium rounded-none"
                style={{ fontFamily: sfPro }}
              >
                Start a Focus Session
              </Button>
            </motion.div>
          </div>

          {/* RIGHT - Signal Graphic */}
          <motion.div
            className="h-80 lg:h-96 flex items-center justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
          >
            <NeuralSignalGraphic />
          </motion.div>
        </div>

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

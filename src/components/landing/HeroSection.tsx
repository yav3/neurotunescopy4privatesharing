import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WaveletSphere } from './WaveletSphere';

export const HeroSection: React.FC = () => {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: `linear-gradient(160deg, 
          hsl(195, 75%, 45%) 0%, 
          hsl(205, 65%, 50%) 30%,
          hsl(215, 60%, 52%) 60%,
          hsl(225, 55%, 48%) 100%
        )`
      }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 70% 50%, 
            hsla(195, 80%, 65%, 0.25) 0%, 
            transparent 70%
          )`
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 py-24 sm:py-32 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: Glass card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            }}
          >
            <p
              className="uppercase tracking-widest mb-3 sm:mb-4"
              style={{
                fontSize: '10px',
                fontWeight: 400,
                letterSpacing: '0.15em',
                color: 'hsla(0, 0%, 100%, 0.6)',
              }}
            >
              Patented music technology
            </p>

            <h1
              style={{
                fontSize: 'clamp(32px, 6vw, 48px)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                color: 'hsl(0, 0%, 100%)',
              }}
            >
              Feel better,{' '}
              <span style={{ color: 'hsla(0, 0%, 100%, 0.7)' }}>on demand</span>
            </h1>

            <motion.p
              className="mt-4 sm:mt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 6, times: [0, 0.15, 0.75, 1], repeat: Infinity, repeatDelay: 1 }}
              style={{
                fontSize: 'clamp(14px, 2vw, 16px)',
                fontWeight: 400,
                lineHeight: 1.65,
                color: 'hsla(0, 0%, 100%, 0.75)',
              }}
            >
              Algorithmic compositions for anxiety relief and focus enhancement.
            </motion.p>

            {/* Stats row */}
            <div className="flex gap-6 sm:gap-10 mt-8">
              {[
                { value: '7,000+', label: 'TRACKS' },
                { value: '8+', label: 'YEARS R&D' },
                { value: '15,000+', label: 'STUDIES' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 400, color: 'hsl(0, 0%, 100%)' }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: '9px', fontWeight: 400, letterSpacing: '0.1em', color: 'hsla(0, 0%, 100%, 0.5)' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Animated orb with scrolling text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex items-center justify-center"
          >
            <Link to="/demo" className="group relative cursor-pointer">
              <div className="w-72 h-72 xl:w-80 xl:h-80 relative group-hover:scale-105 transition-transform duration-700">
                <WaveletSphere />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-0 right-0 text-center"
      >
        <p
          className="uppercase tracking-widest mb-3"
          style={{
            fontSize: '11px',
            fontWeight: 400,
            letterSpacing: '0.15em',
            color: 'hsla(0, 0%, 100%, 0.5)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          }}
        >
          Scroll to explore
        </p>
        <div className="w-6 h-10 mx-auto rounded-full border-2 border-current flex items-start justify-center pt-2"
          style={{ color: 'hsla(0, 0%, 100%, 0.4)' }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 rounded-full bg-current"
          />
        </div>
      </motion.div>
    </section>
  );
};

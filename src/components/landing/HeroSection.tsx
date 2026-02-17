import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WaveletSphere } from './WaveletSphere';

export const HeroSection: React.FC = () => {

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Ambient glass glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 60% 40%, hsla(210, 50%, 25%, 0.15) 0%, transparent 70%),
            radial-gradient(ellipse 40% 50% at 30% 60%, hsla(220, 40%, 15%, 0.1) 0%, transparent 60%)
          `
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Copy */}
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
                color: 'hsla(0, 0%, 100%, 0.5)',
              }}
            >
              2 patents granted
            </p>

            <h1
              style={{
                fontSize: 'clamp(32px, 6vw, 48px)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                color: 'hsla(0, 0%, 92%, 0.95)',
              }}
            >
              Music that moves you.{' '}
              <span style={{ color: 'hsla(0, 0%, 100%, 0.45)' }}>Data that proves it.</span>
            </h1>

            <p
              className="mt-4 sm:mt-5"
              style={{
                fontSize: 'clamp(14px, 2vw, 16px)',
                fontWeight: 400,
                lineHeight: 1.65,
                color: 'hsla(0, 0%, 100%, 0.55)',
              }}
            >
              A patented closed-loop engine that adapts therapeutic music in real time — then aggregates every session into longitudinal biomarker insights clinicians can act on.
            </p>

            {/* CTA */}
            <div className="mt-7 flex gap-4 items-center">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-500 hover:scale-105"
                style={{
                  background: 'hsla(200, 80%, 55%, 0.9)',
                  color: 'hsla(0, 0%, 100%, 0.95)',
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                }}
              >
                Experience the platform
                <span style={{ fontSize: '16px' }}>→</span>
              </Link>
              <Link
                to="/story"
                className="inline-flex items-center gap-1 px-4 py-3 rounded-full transition-colors duration-300"
                style={{
                  color: 'hsla(0, 0%, 100%, 0.45)',
                  fontSize: '14px',
                  fontWeight: 400,
                }}
              >
                Our science
              </Link>
            </div>

            {/* Stats row — glass strip */}
            <div
              className="flex gap-6 sm:gap-10 mt-8 px-5 py-4 rounded-xl"
              style={{
                background: 'hsla(220, 20%, 12%, 0.5)',
                border: '1px solid hsla(0, 0%, 100%, 0.08)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {[
                { value: '8,000+', label: 'PURPOSE-COMPOSED TRACKS' },
                { value: '14K+', label: 'SUBJECTS ANALYZED' },
                { value: 'Columbia · Cornell', label: '8+ YEARS R&D' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 400, color: 'hsla(0, 0%, 92%, 0.9)' }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: '9px', fontWeight: 400, letterSpacing: '0.1em', color: 'hsla(0, 0%, 100%, 0.4)' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Crystal sphere — always visible */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            <Link to="/demo" className="group relative cursor-pointer">
              <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 xl:w-96 xl:h-96 relative group-hover:scale-105 transition-transform duration-700">
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
            color: 'hsla(0, 0%, 100%, 0.4)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          }}
        >
          Scroll to explore
        </p>
        <div className="w-6 h-10 mx-auto rounded-full border-2 border-current flex items-start justify-center pt-2"
          style={{ color: 'hsla(0, 0%, 100%, 0.3)' }}
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

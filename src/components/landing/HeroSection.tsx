import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WaveletSphere } from './WaveletSphere';

const GRADIENT = 'linear-gradient(135deg, #06b6d4, #2563eb)';

export const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
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
              <span style={{
                background: GRADIENT,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Data that proves it.
              </span>
            </h1>

            {/* Stats row */}
            <div className="flex gap-8 sm:gap-12 mt-8">
              {[
                { value: '8,000+', label: 'PURPOSE-COMPOSED TRACKS' },
                { value: '14K+', label: 'SUBJECTS ANALYZED' },
              ].map((stat, i) => (
                <div key={stat.label} className="flex flex-col" style={{ borderLeft: i > 0 ? '1px solid hsla(0, 0%, 100%, 0.1)' : 'none', paddingLeft: i > 0 ? '24px' : '0' }}>
                  <p style={{
                    fontSize: 'clamp(20px, 3vw, 28px)',
                    fontWeight: 400,
                    background: GRADIENT,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: '9px', fontWeight: 400, letterSpacing: '0.1em', color: 'hsla(0, 0%, 100%, 0.4)', marginTop: '2px' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-7">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-500 hover:scale-105"
                style={{
                  background: GRADIENT,
                  color: 'hsla(0, 0%, 100%, 0.95)',
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
                }}
              >
                Demo
                <span style={{ fontSize: '16px' }}>→</span>
              </Link>
            </div>
          </motion.div>

          {/* Right: Crystal sphere */}
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
        <div className="w-6 h-10 mx-auto rounded-full border-2 flex items-start justify-center pt-2"
          style={{ borderColor: 'hsla(0, 0%, 100%, 0.15)' }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: GRADIENT }}
          />
        </div>
      </motion.div>
    </section>
  );
};

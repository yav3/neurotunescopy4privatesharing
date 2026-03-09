import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WaveletSphere } from './WaveletSphere';

const GRADIENT = 'linear-gradient(135deg, #06b6d4, #2563eb)';

export const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      <div className="relative z-10 container mx-auto px-5 sm:px-8 md:px-12 lg:px-20 pt-24 sm:pt-20 md:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(30px, 5.5vw, 58px)',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
                color: 'hsl(210, 50%, 15%)',
              }}
            >
              Music that moves you.
              <br />
              <span style={{
                background: GRADIENT,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Data that proves it.
              </span>
            </h1>

            {/* Stats row */}
            <div className="flex gap-6 sm:gap-10 md:gap-14 mt-8 sm:mt-10 md:mt-12">
              {[
                { value: '8,000+', label: 'PURPOSE-COMPOSED TRACKS' },
                { value: '52 Genres', label: '8 LANGUAGES' },
              ].map((stat, i) => (
                <div key={stat.label} className="flex flex-col" style={{ borderLeft: i > 0 ? '1px solid hsla(190, 80%, 50%, 0.3)' : 'none', paddingLeft: i > 0 ? '20px' : '0' }}>
                  <p style={{
                    fontSize: 'clamp(22px, 3vw, 34px)',
                    fontWeight: 400,
                    background: GRADIENT,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.12em', color: 'hsl(195, 70%, 38%)', marginTop: '4px' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Evidence line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-5"
              style={{ fontSize: '12px', fontWeight: 400, color: 'hsl(200, 30%, 45%)', lineHeight: 1.6 }}
            >
              15,000+ study meta-analysis · R&D at Columbia, Cornell Tech & Stanford
            </motion.p>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 flex items-center gap-4">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full transition-all duration-500 hover:scale-105"
                style={{
                  background: GRADIENT,
                  color: 'hsl(0, 0%, 100%)',
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                  boxShadow: '0 4px 24px hsla(190, 80%, 50%, 0.35), 0 1px 3px hsla(210, 80%, 50%, 0.15)',
                }}
              >
                Experience Demo
                <span style={{ fontSize: '16px' }}>→</span>
              </Link>
              <Link
                to="/free-trial"
                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  fontSize: '14px',
                  fontWeight: 400,
                  color: 'hsl(210, 50%, 20%)',
                  border: '1px solid hsla(200, 50%, 50%, 0.3)',
                  background: 'hsla(0, 0%, 100%, 0.5)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                Request Access
              </Link>
            </div>
          </motion.div>

          {/* Right: Crystal sphere */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center -mt-4 sm:mt-0"
          >
            <Link to="/demo" className="group relative cursor-pointer">
              <div className="w-56 h-56 sm:w-68 sm:h-68 md:w-80 md:h-80 lg:w-[360px] lg:h-[360px] xl:w-[420px] xl:h-[420px] relative group-hover:scale-105 transition-transform duration-700">
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
        className="absolute bottom-6 sm:bottom-10 left-0 right-0 text-center hidden sm:block"
      >
        <div className="w-6 h-10 mx-auto rounded-full border-2 flex items-start justify-center pt-2"
          style={{ borderColor: 'hsla(190, 70%, 50%, 0.3)' }}
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
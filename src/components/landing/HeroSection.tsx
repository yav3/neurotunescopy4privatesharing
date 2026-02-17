import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WaveletSphere } from './WaveletSphere';

export const HeroSection: React.FC = () => {
  const [pulseKey, setPulseKey] = useState(0);

  // Re-trigger the "musical" pulse cycle every 8s
  useEffect(() => {
    const interval = setInterval(() => setPulseKey((k) => k + 1), 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: `linear-gradient(160deg, 
          hsl(200, 85%, 20%) 0%, 
          hsl(210, 80%, 30%) 25%,
          hsl(200, 75%, 40%) 50%,
          hsl(190, 70%, 45%) 75%,
          hsl(195, 65%, 50%) 100%
        )`
      }}
    >
      {/* Glassmorphism radial overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 65% 45%, 
              hsla(195, 90%, 60%, 0.2) 0%, 
              transparent 60%
            ),
            radial-gradient(ellipse 40% 40% at 30% 70%, 
              hsla(220, 80%, 40%, 0.15) 0%, 
              transparent 50%
            )
          `
        }}
      />
      {/* Frosted glass noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
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
              key={pulseKey}
              className="mt-4 sm:mt-5"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.85, 0.5, 0.9, 0.6, 1, 0.7, 0.95, 0.4, 0],
              }}
              transition={{
                duration: 8,
                times: [0, 0.08, 0.15, 0.25, 0.35, 0.5, 0.65, 0.75, 0.88, 1],
                ease: 'easeInOut',
              }}
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

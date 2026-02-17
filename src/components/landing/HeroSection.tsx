import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: `linear-gradient(160deg, 
          hsl(195, 60%, 88%) 0%, 
          hsl(200, 55%, 82%) 30%,
          hsl(210, 50%, 78%) 60%,
          hsl(185, 45%, 70%) 100%
        )`
      }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 70% 50%, 
            hsla(180, 50%, 80%, 0.4) 0%, 
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
            className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 max-w-md"
            style={{
              background: 'rgba(255, 255, 255, 0.82)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            }}
          >
            <p
              className="uppercase tracking-widest mb-3 sm:mb-4"
              style={{
                fontSize: '10px',
                fontWeight: 400,
                letterSpacing: '0.15em',
                color: 'hsl(210, 45%, 25%)',
              }}
            >
              Patented music technology
            </p>

            <h1
              style={{
                fontSize: 'clamp(24px, 5vw, 36px)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: 'hsl(220, 40%, 6%)',
              }}
            >
              Medical-grade music,{' '}
              <span style={{ color: 'hsl(220, 30%, 15%)' }}>on demand</span>
            </h1>

            <p
              className="mt-3 sm:mt-4"
              style={{
                fontSize: 'clamp(13px, 2vw, 15px)',
                fontWeight: 400,
                lineHeight: 1.65,
                color: 'hsl(220, 25%, 20%)',
              }}
            >
              Algorithmic compositions for anxiety relief and focus enhancement.
            </p>

            {/* Divider */}
            <div className="my-4 sm:my-5" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)' }} />

            {/* Stats row */}
            <div className="flex gap-5 sm:gap-8">
              {[
                { value: '7,000+', label: 'TRACKS' },
                { value: '8+', label: 'YEARS R&D' },
                { value: '15,000+', label: 'STUDIES' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 400, color: 'hsl(220, 40%, 6%)' }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: '9px', fontWeight: 400, letterSpacing: '0.1em', color: 'hsl(220, 20%, 30%)' }}>
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
              {/* Outer glass sphere */}
              <div
                className="w-72 h-72 xl:w-80 xl:h-80 rounded-full relative flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-700"
                style={{
                  background: `radial-gradient(circle at 40% 40%, 
                    hsla(210, 80%, 95%, 0.9) 0%, 
                    hsla(210, 60%, 80%, 0.4) 50%,
                    hsla(210, 40%, 70%, 0.1) 100%
                  )`,
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 30px 80px rgba(100, 150, 220, 0.2), inset 0 -20px 40px rgba(255, 255, 255, 0.3)',
                }}
              >
                {/* Highlight */}
                <div
                  className="absolute inset-4 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, 
                      hsla(210, 90%, 98%, 0.8) 0%, 
                      transparent 60%
                    )`,
                  }}
                />

                {/* Scrolling text ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-48 h-48 xl:w-56 xl:h-56">
                    <defs>
                      <path
                        id="textCircle"
                        d="M 100,100 m -65,0 a 65,65 0 1,1 130,0 a 65,65 0 1,1 -130,0"
                        fill="none"
                      />
                    </defs>
                    <motion.g
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      <text
                        fill="hsl(220, 20%, 40%)"
                        style={{
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                          fontSize: '11px',
                          fontWeight: 400,
                          letterSpacing: '0.2em',
                        }}
                      >
                        <textPath href="#textCircle">
                          ENTER · EXPERIENCE NOW · ENTER · EXPERIENCE NOW ·{' '}
                        </textPath>
                      </text>
                    </motion.g>
                  </svg>
                </div>

                {/* Center arrow */}
                <motion.div
                  className="relative z-10"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="hsl(220, 20%, 35%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
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
            color: 'hsl(220, 15%, 35%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          }}
        >
          Scroll to explore
        </p>
        <div className="w-6 h-10 mx-auto rounded-full border-2 border-current opacity-30 flex items-start justify-center pt-2"
          style={{ color: 'hsl(220, 15%, 35%)' }}
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

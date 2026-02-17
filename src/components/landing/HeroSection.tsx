import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Music, Brain, Activity } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: `linear-gradient(180deg, 
          hsl(210, 60%, 92%) 0%, 
          hsl(210, 65%, 85%) 50%,
          hsl(210, 70%, 78%) 100%
        )`
      }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 70% 50%, 
            hsla(210, 80%, 90%, 0.5) 0%, 
            transparent 70%
          )`
        }}
      />

      <div className="relative z-10 container mx-auto px-6 md:px-12 py-32 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Glass card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl p-8 md:p-10 max-w-md"
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            }}
          >
            <p
              className="uppercase tracking-widest mb-4"
              style={{
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '0.15em',
                color: 'hsl(210, 70%, 45%)',
              }}
            >
              Patented therapeutic music technology
            </p>

            <h1
              style={{
                fontSize: 'clamp(28px, 4vw, 38px)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                color: 'hsl(220, 25%, 15%)',
              }}
            >
              Medical-grade music,{' '}
              <span style={{ color: 'hsl(220, 20%, 30%)' }}>on demand</span>
            </h1>

            <p
              className="mt-5"
              style={{
                fontSize: '15px',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'hsl(220, 12%, 40%)',
              }}
            >
              Purpose-composed music developed using patented algorithmic methods.
              An on-demand tool to address symptoms of anxiety, boost focus,
              and support clinical outcomes.
            </p>

            {/* Divider */}
            <div className="my-6" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)' }} />

            {/* Stats row */}
            <div className="flex gap-8">
              {[
                { value: '7,000+', label: 'TRACKS' },
                { value: '8+', label: 'YEARS R&D' },
                { value: '15,000+', label: 'STUDIES' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p style={{ fontSize: '24px', fontWeight: 400, color: 'hsl(220, 25%, 15%)' }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.1em', color: 'hsl(220, 10%, 50%)' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Abstract visual sphere placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex items-center justify-center"
          >
            <div
              className="w-80 h-80 rounded-full relative"
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
              <div
                className="absolute inset-4 rounded-full"
                style={{
                  background: `radial-gradient(circle at 35% 35%, 
                    hsla(210, 90%, 98%, 0.8) 0%, 
                    transparent 60%
                  )`,
                }}
              />
            </div>
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
            color: 'hsl(220, 20%, 40%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          }}
        >
          Scroll to explore
        </p>
        <div className="w-6 h-10 mx-auto rounded-full border-2 border-current opacity-30 flex items-start justify-center pt-2"
          style={{ color: 'hsl(220, 20%, 40%)' }}
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

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LissajousLogo } from '@/components/brand/LissajousLogo';

const pairings = [
  { genre: 'New Age & World', goal: 'Stress & Anxiety Reduction', match: 94 },
  { genre: 'Classical', goal: 'Focus & Concentration', match: 89 },
  { genre: 'Chopin', goal: 'Pain Distraction', match: 91 },
  { genre: 'Pop', goal: 'Energy & Mood Boost', match: 86 },
  { genre: 'Electronic', goal: 'HIIT & Cardio', match: 92 },
];

export const DataFlowSection: React.FC = () => {
  const [activeRow, setActiveRow] = useState(0);
  const [phase, setPhase] = useState<'scanning' | 'matched'>('matched');

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRow((prev) => {
        setPhase('scanning');
        return (prev + 1) % pairings.length;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === 'scanning') {
      const t = setTimeout(() => setPhase('matched'), 1200);
      return () => clearTimeout(t);
    }
  }, [phase, activeRow]);

  const active = pairings[activeRow];

  return (
    <section
      id="science"
      className="relative py-14 md:py-20 overflow-hidden"
      style={{ background: 'hsl(var(--landing-bg))', fontFamily: 'var(--font-sf)' }}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-4xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-1.5"
          style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', color: 'hsl(var(--landing-ink-muted))' }}
        >
          CLINICAL MATCHING
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
          style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'hsl(var(--landing-ink))' }}
        >
          Genre–goal pairings
        </motion.h2>

        {/* Matching showcase */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-0">
            {/* Goal */}
            <div className="flex-1 py-3 px-5 rounded-l-xl" style={{ background: 'hsl(var(--landing-electric-1) / 0.04)' }}>
              <p style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'hsl(var(--landing-electric-1))', marginBottom: 3, fontWeight: 600 }}>
                THERAPEUTIC GOAL
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={active.goal}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  style={{ fontSize: '15px', fontWeight: 400, color: 'hsl(var(--landing-ink))' }}
                >
                  {active.goal}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Logo connector */}
            <div className="flex flex-col items-center gap-0.5 px-4 shrink-0">
              <motion.div
                animate={phase === 'scanning' ? { rotate: 360 } : { rotate: 0 }}
                transition={phase === 'scanning' ? { duration: 1, repeat: Infinity, ease: 'linear' } : { duration: 0.3 }}
              >
                <LissajousLogo
                  size={20}
                  animated={phase === 'scanning'}
                  color={phase === 'matched' ? 'hsl(var(--landing-electric-1))' : 'hsl(var(--landing-ink-muted))'}
                />
              </motion.div>
              <span style={{
                fontSize: '9px',
                letterSpacing: '0.06em',
                fontWeight: 500,
                color: phase === 'matched' ? 'hsl(var(--landing-electric-1))' : 'hsl(var(--landing-ink-muted))',
                transition: 'color 0.3s',
              }}>
                {phase === 'scanning' ? 'MATCHING' : `${active.match}%`}
              </span>
            </div>

            {/* Genre */}
            <div className="flex-1 py-3 px-5 rounded-r-xl" style={{ background: 'hsl(var(--landing-electric-1) / 0.04)' }}>
              <p style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'hsl(var(--landing-electric-1))', marginBottom: 3, fontWeight: 600 }}>
                MATCHED GENRE
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={active.genre}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: phase === 'matched' ? 1 : 0.3, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  style={{ fontSize: '15px', fontWeight: 400, color: 'hsl(var(--landing-ink))' }}
                >
                  {active.genre}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {pairings.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveRow(i); setPhase('scanning'); }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeRow ? 16 : 5,
                  height: 5,
                  background: i === activeRow
                    ? 'linear-gradient(90deg, hsl(var(--landing-electric-1)), hsl(var(--landing-electric-2)))'
                    : 'hsl(var(--landing-ink-muted) / 0.25)',
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

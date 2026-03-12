import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const pairings = [
  { genre: 'New Age & World', goal: 'Stress & Anxiety Reduction', match: 94 },
  { genre: 'Classical', goal: 'Focus & Concentration', match: 89 },
  { genre: 'Chopin', goal: 'Pain Distraction', match: 91 },
  { genre: 'Pop', goal: 'Energy & Mood Boost', match: 86 },
  { genre: 'Electronic', goal: 'HIIT & Cardio', match: 92 },
];

const GLASS_ACTIVE = {
  background: 'linear-gradient(135deg, hsla(190, 95%, 92%, 0.88) 0%, hsla(215, 90%, 90%, 0.88) 100%)',
  border: '1px solid hsla(200, 85%, 72%, 0.8)',
  backdropFilter: 'blur(28px) saturate(1.7)',
  WebkitBackdropFilter: 'blur(28px) saturate(1.7)',
  boxShadow: '0 8px 32px hsla(200, 70%, 50%, 0.12), inset 0 1px 0 hsla(0, 0%, 100%, 0.95)',
} as const;

export const DataFlowSection: React.FC = () => {
  const [activeRow, setActiveRow] = useState(0);
  const [phase, setPhase] = useState<'scanning' | 'matched'>('matched');

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRow((prev) => {
        const next = (prev + 1) % pairings.length;
        setPhase('scanning');
        return next;
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
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ background: 'hsl(var(--landing-bg))', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-5xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-2"
          style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', color: 'hsl(var(--landing-ink-muted))' }}
        >
          CLINICAL MATCHING
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
          style={{
            fontSize: 'clamp(24px, 4vw, 38px)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: 'hsl(var(--landing-ink))',
          }}
        >
          Genre–goal pairings
        </motion.h2>

        {/* Active matching showcase */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-6 md:p-8 overflow-hidden"
          style={GLASS_ACTIVE}
        >
          <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Goal card */}
            <div
              className="flex-1 w-full rounded-2xl p-5 relative"
              style={{
                background: 'hsla(192, 90%, 95%, 0.82)',
                border: '1px solid hsla(200, 75%, 80%, 0.65)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <p style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'hsl(200, 50%, 45%)', marginBottom: 8, fontWeight: 500 }}>
                THERAPEUTIC GOAL
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={active.goal}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  style={{ fontSize: '18px', fontWeight: 300, color: 'hsl(var(--landing-ink))' }}
                >
                  {active.goal}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Connection indicator */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'hsla(0, 0%, 100%, 0.9)',
                  border: '1px solid hsla(200, 50%, 80%, 0.6)',
                }}
              >
                {phase === 'scanning' ? (
                  <motion.div
                    className="w-4 h-4 rounded-full border-2 border-t-transparent"
                    style={{ borderColor: 'hsl(200, 60%, 55%)', borderTopColor: 'transparent' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <Sparkles className="w-4 h-4" style={{ color: 'hsl(200, 70%, 50%)' }} />
                )}
              </div>
              <span style={{ fontSize: '9px', letterSpacing: '0.1em', fontWeight: 600, color: phase === 'matched' ? 'hsl(192, 85%, 35%)' : 'hsl(var(--landing-ink-muted))' }}>
                {phase === 'scanning' ? 'MATCHING' : `${active.match}%`}
              </span>
            </div>

            {/* Genre result card */}
            <div
              className="flex-1 w-full rounded-2xl p-5 relative"
              style={{
                background: 'hsla(192, 90%, 95%, 0.82)',
                border: '1px solid hsla(200, 75%, 80%, 0.65)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <p style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'hsl(200, 50%, 45%)', marginBottom: 8, fontWeight: 500 }}>
                MATCHED GENRE
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={active.genre}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: phase === 'matched' ? 1 : 0.3, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  style={{ fontSize: '18px', fontWeight: 300, color: 'hsl(var(--landing-ink))' }}
                >
                  {active.genre}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Pairing dots */}
          <div className="flex justify-center gap-2 mt-6">
            {pairings.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveRow(i); setPhase('scanning'); }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeRow ? 20 : 6,
                  height: 6,
                  background: i === activeRow
                    ? 'linear-gradient(90deg, hsl(var(--landing-electric-1)), hsl(var(--landing-electric-2)))'
                    : 'hsla(200, 30%, 75%, 0.5)',
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

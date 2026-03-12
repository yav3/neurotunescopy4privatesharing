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

/* Electric-blue liquid glass tokens */
const GLASS = {
  background: 'linear-gradient(135deg, hsla(192, 90%, 94%, 0.75) 0%, hsla(210, 88%, 92%, 0.75) 100%)',
  border: '1px solid hsla(200, 80%, 78%, 0.65)',
  backdropFilter: 'blur(20px) saturate(1.5)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
  boxShadow: '0 2px 16px hsla(200, 70%, 50%, 0.08), inset 0 1px 0 hsla(0, 0%, 100%, 0.85)',
} as const;

const GLASS_ACTIVE = {
  background: 'linear-gradient(135deg, hsla(190, 95%, 92%, 0.88) 0%, hsla(215, 90%, 90%, 0.88) 100%)',
  border: '1px solid hsla(200, 85%, 72%, 0.8)',
  backdropFilter: 'blur(28px) saturate(1.7)',
  WebkitBackdropFilter: 'blur(28px) saturate(1.7)',
  boxShadow: '0 8px 32px hsla(200, 70%, 50%, 0.12), 0 1px 3px hsla(190, 80%, 50%, 0.08), inset 0 1px 0 hsla(0, 0%, 100%, 0.95)',
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
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: 'hsl(var(--landing-bg))', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
    >
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-3"
          style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', color: 'hsl(var(--landing-ink-muted))' }}
        >
          CLINICAL MATCHING
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-3"
          style={{
            fontSize: 'clamp(24px, 4vw, 38px)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: 'hsl(var(--landing-ink))',
          }}
        >
          Genre–goal pairings
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
          style={{ fontSize: '14px', fontWeight: 300, color: 'hsl(var(--landing-ink-soft))' }}
        >
          Each genre matched to therapeutic outcomes via clinical mapping
        </motion.p>

        {/* Active matching showcase */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-6 md:p-8 mb-6 overflow-hidden"
          style={GLASS_ACTIVE}
        >
          {/* Top refraction */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 5%, hsla(0, 0%, 100%, 0.9) 50%, transparent 95%)' }}
          />

          {/* Interior sheen */}
          <div
            className="absolute top-0 left-0 w-full h-1/2 rounded-t-3xl pointer-events-none"
            style={{ background: 'linear-gradient(180deg, hsla(0, 0%, 100%, 0.5) 0%, transparent 100%)' }}
          />

          {/* Animated glow orb */}
          <motion.div
            className="absolute pointer-events-none rounded-full"
            style={{
              width: 200,
              height: 200,
              background: 'radial-gradient(circle, hsla(190, 80%, 60%, 0.08), transparent 70%)',
              filter: 'blur(40px)',
            }}
            animate={{
              x: phase === 'scanning' ? ['-20%', '80%'] : '80%',
              y: ['-10%', '20%'],
            }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />

          <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Goal card */}
            <motion.div
              className="flex-1 w-full rounded-2xl p-5 relative overflow-hidden"
              style={{
                background: phase === 'scanning'
                  ? 'linear-gradient(135deg, hsla(190, 95%, 93%, 0.92) 0%, hsla(210, 90%, 91%, 0.92) 100%)'
                  : 'linear-gradient(135deg, hsla(192, 90%, 95%, 0.82) 0%, hsla(212, 85%, 93%, 0.82) 100%)',
                border: phase === 'scanning'
                  ? '1px solid hsla(200, 85%, 72%, 0.8)'
                  : '1px solid hsla(200, 75%, 80%, 0.65)',
                backdropFilter: 'blur(16px)',
                transition: 'all 0.6s ease',
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, hsla(0, 0%, 100%, 0.8), transparent)' }}
              />
              <p style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'hsl(200, 50%, 45%)', marginBottom: 8, fontWeight: 500 }}>
                THERAPEUTIC GOAL
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={active.goal}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4 }}
                  style={{ fontSize: '18px', fontWeight: 300, color: 'hsl(var(--landing-ink))' }}
                >
                  {active.goal}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Animated connection */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center relative"
                style={{
                  background: phase === 'matched'
                    ? 'hsla(0, 0%, 100%, 0.9)'
                    : 'hsla(210, 40%, 96%, 0.8)',
                  border: '1px solid hsla(200, 50%, 80%, 0.6)',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.5s',
                }}
              >
                {phase === 'scanning' ? (
                  <motion.div
                    className="w-5 h-5 rounded-full border-2 border-t-transparent"
                    style={{ borderColor: 'hsl(200, 60%, 55%)', borderTopColor: 'transparent' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Sparkles className="w-5 h-5" style={{ color: 'hsl(200, 70%, 50%)' }} />
                  </motion.div>
                )}
              </motion.div>
              <motion.span
                style={{ fontSize: '9px', letterSpacing: '0.1em', fontWeight: 600 }}
                animate={{ color: phase === 'scanning' ? 'hsl(215, 15%, 55%)' : 'hsl(160, 65%, 40%)' }}
              >
                {phase === 'scanning' ? 'MATCHING' : `${active.match}% MATCH`}
              </motion.span>
            </div>

            {/* Genre result card */}
            <motion.div
              className="flex-1 w-full rounded-2xl p-5 relative overflow-hidden"
              style={{
                background: phase === 'matched'
                  ? 'linear-gradient(135deg, hsla(190, 95%, 93%, 0.92) 0%, hsla(210, 90%, 91%, 0.92) 100%)'
                  : 'linear-gradient(135deg, hsla(192, 90%, 95%, 0.82) 0%, hsla(212, 85%, 93%, 0.82) 100%)',
                border: phase === 'matched'
                  ? '1px solid hsla(200, 85%, 72%, 0.8)'
                  : '1px solid hsla(200, 75%, 80%, 0.65)',
                backdropFilter: 'blur(16px)',
                transition: 'all 0.6s ease',
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, hsla(0, 0%, 100%, 0.8), transparent)' }}
              />
              {phase === 'matched' && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(105deg, transparent 35%, hsla(190, 80%, 60%, 0.06) 50%, transparent 65%)',
                  }}
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 1.8, ease: 'easeInOut' }}
                />
              )}
              <p style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'hsl(200, 50%, 45%)', marginBottom: 8, fontWeight: 500 }}>
                MATCHED GENRE
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={active.genre}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: phase === 'matched' ? 1 : 0.3, y: 0, filter: phase === 'matched' ? 'blur(0px)' : 'blur(2px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4 }}
                  style={{ fontSize: '18px', fontWeight: 300, color: 'hsl(215, 25%, 15%)' }}
                >
                  {active.genre}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        {/* Pairing cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {pairings.map((p, i) => {
            const isActive = i === activeRow;
            return (
              <motion.div
                key={p.genre}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                onClick={() => { setActiveRow(i); setPhase('scanning'); }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative rounded-2xl p-4 cursor-pointer overflow-hidden"
                style={{
                  ...(isActive ? GLASS_ACTIVE : GLASS),
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Top refraction */}
                <div
                  className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
                  style={{
                    background: isActive
                      ? 'linear-gradient(90deg, transparent, hsla(0, 0%, 100%, 0.95), transparent)'
                      : 'linear-gradient(90deg, transparent, hsla(0, 0%, 100%, 0.6), transparent)',
                  }}
                />

                {/* Interior sheen */}
                <div
                  className="absolute top-0 left-0 w-full h-1/2 rounded-t-2xl pointer-events-none"
                  style={{
                    background: isActive
                      ? 'linear-gradient(180deg, hsla(0, 0%, 100%, 0.6) 0%, transparent 100%)'
                      : 'linear-gradient(180deg, hsla(0, 0%, 100%, 0.3) 0%, transparent 100%)',
                  }}
                />

                {/* Match score ring */}
                <div className="relative flex justify-center mb-3">
                  <svg width="44" height="44" viewBox="0 0 44 44">
                    <circle cx="22" cy="22" r="18" fill="none" stroke="hsla(210, 30%, 80%, 0.5)" strokeWidth="2" />
                    <motion.circle
                      cx="22" cy="22" r="18"
                      fill="none"
                      stroke="url(#matchGradWhite)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 18}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 18 }}
                      whileInView={{ strokeDashoffset: 2 * Math.PI * 18 * (1 - p.match / 100) }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      transform="rotate(-90 22 22)"
                    />
                    <defs>
                      <linearGradient id="matchGradWhite" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="hsl(190, 80%, 45%)" />
                        <stop offset="100%" stopColor="hsl(220, 80%, 55%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      fontSize: '11px',
                      fontWeight: 500,
                      color: isActive ? 'hsl(215, 25%, 15%)' : 'hsl(215, 20%, 35%)',
                      transition: 'color 0.4s',
                    }}
                  >
                    {p.match}%
                  </span>
                </div>

                <p
                  className="relative text-center mb-1"
                  style={{
                    fontSize: '13px',
                    fontWeight: 400,
                    color: 'hsl(215, 25%, 15%)',
                    transition: 'color 0.4s',
                  }}
                >
                  {p.genre}
                </p>
                <p
                  className="relative text-center"
                  style={{
                    fontSize: '11px',
                    fontWeight: 300,
                    color: 'hsl(215, 15%, 45%)',
                    transition: 'color 0.4s',
                  }}
                >
                  {p.goal}
                </p>

                {/* Bottom accent */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{
                    background: 'linear-gradient(90deg, #06b6d4, #2563eb)',
                    transformOrigin: 'left',
                  }}
                  animate={{
                    scaleX: isActive ? 1 : 0,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

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
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
    >
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-3"
          style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.15em', color: 'hsl(195, 90%, 85%)' }}
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
            color: 'hsl(0, 0%, 100%)',
          }}
        >
          Genre–goal pairings
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
          style={{ fontSize: '14px', fontWeight: 300, color: 'hsla(195, 80%, 90%, 0.8)' }}
        >
          Each genre matched to therapeutic outcomes via clinical mapping
        </motion.p>

        {/* Active matching showcase */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-6 md:p-8 mb-6 overflow-hidden"
          style={{
            background: 'hsla(200, 100%, 98%, 0.12)',
            border: '1px solid hsla(190, 80%, 70%, 0.25)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            boxShadow: '0 24px 80px -12px hsla(200, 80%, 40%, 0.2), inset 0 1px 0 hsla(190, 80%, 90%, 0.1)',
          }}
        >
          {/* Glass sheen */}
          <div
            className="absolute top-0 left-0 w-full h-1/2 rounded-t-3xl pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, hsla(190, 80%, 90%, 0.08) 0%, transparent 100%)',
            }}
          />
          {/* Animated glow orb */}
          <motion.div
            className="absolute pointer-events-none rounded-full"
            style={{
              width: 200,
              height: 200,
              background: 'radial-gradient(circle, hsla(190, 90%, 60%, 0.15), transparent 70%)',
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
                  ? 'hsla(190, 80%, 95%, 0.15)'
                  : 'hsla(200, 80%, 98%, 0.08)',
                border: phase === 'scanning'
                  ? '1px solid hsla(190, 80%, 60%, 0.35)'
                  : '1px solid hsla(195, 60%, 70%, 0.15)',
                backdropFilter: 'blur(16px)',
                transition: 'all 0.6s ease',
              }}
            >
              <p style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'hsl(190, 80%, 75%)', marginBottom: 8, fontWeight: 500 }}>
                THERAPEUTIC GOAL
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={active.goal}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4 }}
                  style={{ fontSize: '18px', fontWeight: 300, color: 'hsl(0, 0%, 100%)' }}
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
                    ? 'hsla(190, 80%, 55%, 0.2)'
                    : 'hsla(200, 60%, 80%, 0.1)',
                  border: '1px solid hsla(190, 70%, 60%, 0.3)',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.5s',
                }}
              >
                {phase === 'scanning' ? (
                  <motion.div
                    className="w-5 h-5 rounded-full border-2 border-t-transparent"
                    style={{ borderColor: 'hsla(190, 80%, 65%, 0.6)', borderTopColor: 'transparent' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Sparkles className="w-5 h-5" style={{ color: 'hsl(190, 80%, 70%)' }} />
                  </motion.div>
                )}
              </motion.div>
              <motion.span
                style={{ fontSize: '9px', letterSpacing: '0.1em', fontWeight: 500 }}
                animate={{ color: phase === 'scanning' ? 'hsl(190, 70%, 70%)' : 'hsl(160, 60%, 60%)' }}
              >
                {phase === 'scanning' ? 'MATCHING' : `${active.match}% MATCH`}
              </motion.span>
            </div>

            {/* Genre result card */}
            <motion.div
              className="flex-1 w-full rounded-2xl p-5 relative overflow-hidden"
              style={{
                background: phase === 'matched'
                  ? 'hsla(190, 80%, 95%, 0.15)'
                  : 'hsla(200, 80%, 98%, 0.08)',
                border: phase === 'matched'
                  ? '1px solid hsla(190, 80%, 60%, 0.35)'
                  : '1px solid hsla(195, 60%, 70%, 0.15)',
                backdropFilter: 'blur(16px)',
                transition: 'all 0.6s ease',
              }}
            >
              {phase === 'matched' && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(105deg, transparent 40%, hsla(190, 80%, 80%, 0.08) 50%, transparent 60%)',
                  }}
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
              )}
              <p style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'hsl(190, 80%, 75%)', marginBottom: 8, fontWeight: 500 }}>
                MATCHED GENRE
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={active.genre}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: phase === 'matched' ? 1 : 0.3, y: 0, filter: phase === 'matched' ? 'blur(0px)' : 'blur(2px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4 }}
                  style={{ fontSize: '18px', fontWeight: 300, color: 'hsl(0, 0%, 100%)' }}
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
                className="relative rounded-2xl p-4 cursor-pointer overflow-hidden group"
                style={{
                  background: isActive
                    ? 'hsla(190, 80%, 95%, 0.18)'
                    : 'hsla(200, 80%, 98%, 0.08)',
                  border: isActive
                    ? '1px solid hsla(190, 80%, 60%, 0.35)'
                    : '1px solid hsla(195, 60%, 70%, 0.15)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  transition: 'all 0.4s ease',
                }}
              >
                {/* Glass top sheen */}
                <div
                  className="absolute top-0 left-0 w-full h-1/2 rounded-t-2xl pointer-events-none"
                  style={{
                    background: isActive
                      ? 'linear-gradient(180deg, hsla(190, 80%, 80%, 0.1) 0%, transparent 100%)'
                      : 'linear-gradient(180deg, hsla(200, 60%, 90%, 0.06) 0%, transparent 100%)',
                  }}
                />

                {/* Match score ring */}
                <div className="relative flex justify-center mb-3">
                  <svg width="44" height="44" viewBox="0 0 44 44">
                    <circle cx="22" cy="22" r="18" fill="none" stroke="hsla(195, 60%, 70%, 0.2)" strokeWidth="2" />
                    <motion.circle
                      cx="22" cy="22" r="18"
                      fill="none"
                      stroke="url(#matchGrad)"
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
                      <linearGradient id="matchGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="hsl(190, 80%, 55%)" />
                        <stop offset="100%" stopColor="hsl(210, 80%, 55%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      fontSize: '11px',
                      fontWeight: 400,
                      color: isActive ? 'hsl(190, 80%, 80%)' : 'hsl(195, 60%, 75%)',
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
                    color: isActive ? 'hsl(0, 0%, 100%)' : 'hsla(195, 60%, 92%, 0.9)',
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
                    color: isActive ? 'hsl(190, 60%, 78%)' : 'hsla(195, 50%, 80%, 0.7)',
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

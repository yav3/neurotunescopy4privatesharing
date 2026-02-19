import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Brain, Music2, ArrowRight, Sparkles } from 'lucide-react';

const pairings = [
  { genre: 'New Age & World', goal: 'Stress & Anxiety Reduction', match: 94 },
  { genre: 'Classical', goal: 'Focus & Concentration', match: 89 },
  { genre: 'Chopin', goal: 'Pain Relief', match: 91 },
  { genre: 'Pop', goal: 'Energy & Mood Boost', match: 86 },
  { genre: 'Electronic', goal: 'HIIT & Cardio', match: 92 },
];

const steps = ['Ingest', 'Map', 'Personalize', 'Deliver'];

export const DataFlowSection: React.FC = () => {
  const [activeRow, setActiveRow] = useState(0);
  const [matchPhase, setMatchPhase] = useState<'select' | 'match' | 'done'>('done');

  // Auto-cycle through rows
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRow((prev) => {
        const next = (prev + 1) % pairings.length;
        setMatchPhase('select');
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Animate through phases: select → match → done
  useEffect(() => {
    if (matchPhase === 'select') {
      const t1 = setTimeout(() => setMatchPhase('match'), 800);
      return () => clearTimeout(t1);
    }
    if (matchPhase === 'match') {
      const t2 = setTimeout(() => setMatchPhase('done'), 1000);
      return () => clearTimeout(t2);
    }
  }, [matchPhase]);

  const activePairing = pairings[activeRow];

  return (
    <section
      id="science"
      className="relative py-16 md:py-20 overflow-hidden"
      style={{
        background: 'transparent',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-2"
          style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.15em', color: 'hsl(0, 0%, 50%)' }}
        >
          DATA ARCHITECTURE
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-2"
          style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'hsl(0, 0%, 96%)' }}
        >
          Genre–goal pairings
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10"
          style={{ fontSize: '13px', fontWeight: 300, color: 'hsl(0, 0%, 45%)' }}
        >
          Each genre matched to therapeutic outcomes via clinical mapping
        </motion.p>

        {/* Preference → Matching flow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 md:gap-5 mb-8 flex-wrap"
        >
          {/* User preference */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{
              background: matchPhase === 'select' ? 'hsla(210, 60%, 45%, 0.12)' : 'hsla(220, 20%, 12%, 0.5)',
              border: matchPhase === 'select' ? '1px solid hsla(210, 60%, 50%, 0.2)' : '1px solid hsla(0, 0%, 100%, 0.06)',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.5s ease',
            }}
          >
            <User className="w-4 h-4" style={{ color: 'hsl(210, 60%, 60%)' }} />
            <div>
              <p style={{ fontSize: '9px', letterSpacing: '0.1em', color: 'hsl(0, 0%, 45%)', fontWeight: 400 }}>USER GOAL</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={activePairing.goal}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  style={{ fontSize: '13px', fontWeight: 400, color: 'hsl(0, 0%, 90%)' }}
                >
                  {activePairing.goal}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Animated arrow with pulse */}
          <motion.div
            animate={{
              x: matchPhase === 'match' ? [0, 6, 0] : 0,
              opacity: matchPhase === 'match' ? [0.4, 1, 0.4] : 0.3,
            }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <ArrowRight className="w-4 h-4" style={{ color: 'hsl(210, 60%, 55%)' }} />
          </motion.div>

          {/* Matching engine */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{
              background: matchPhase === 'match' ? 'hsla(180, 40%, 35%, 0.12)' : 'hsla(220, 20%, 12%, 0.5)',
              border: matchPhase === 'match' ? '1px solid hsla(180, 50%, 50%, 0.2)' : '1px solid hsla(0, 0%, 100%, 0.06)',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.5s ease',
            }}
          >
            <motion.div
              animate={matchPhase === 'match' ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <Brain className="w-4 h-4" style={{ color: 'hsl(180, 50%, 55%)' }} />
            </motion.div>
            <div>
              <p style={{ fontSize: '9px', letterSpacing: '0.1em', color: 'hsl(0, 0%, 45%)', fontWeight: 400 }}>MATCHING</p>
              <p style={{ fontSize: '13px', fontWeight: 400, color: 'hsl(0, 0%, 70%)' }}>
                {matchPhase === 'match' ? 'Analyzing...' : 'Clinical engine'}
              </p>
            </div>
          </div>

          {/* Arrow */}
          <motion.div
            animate={{
              x: matchPhase === 'done' ? [0, 6, 0] : 0,
              opacity: matchPhase === 'done' ? [0.4, 1, 0.4] : 0.3,
            }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <ArrowRight className="w-4 h-4" style={{ color: 'hsl(210, 60%, 55%)' }} />
          </motion.div>

          {/* Result */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{
              background: matchPhase === 'done' ? 'hsla(210, 60%, 45%, 0.12)' : 'hsla(220, 20%, 12%, 0.5)',
              border: matchPhase === 'done' ? '1px solid hsla(210, 60%, 50%, 0.2)' : '1px solid hsla(0, 0%, 100%, 0.06)',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.5s ease',
            }}
          >
            <Music2 className="w-4 h-4" style={{ color: 'hsl(210, 80%, 60%)' }} />
            <div>
              <p style={{ fontSize: '9px', letterSpacing: '0.1em', color: 'hsl(0, 0%, 45%)', fontWeight: 400 }}>MATCHED GENRE</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={activePairing.genre}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: matchPhase === 'done' ? 1 : 0.3, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  style={{ fontSize: '13px', fontWeight: 400, color: 'hsl(0, 0%, 90%)' }}
                >
                  {activePairing.genre}
                </motion.p>
              </AnimatePresence>
            </div>
            {matchPhase === 'done' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-1"
              >
                <Sparkles className="w-3 h-3" style={{ color: 'hsl(45, 80%, 60%)' }} />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Pairings table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-5 md:p-6 mb-5"
          style={{
            background: 'hsla(220, 20%, 10%, 0.55)',
            border: '1px solid hsla(0, 0%, 100%, 0.08)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 8px 32px hsla(0, 0%, 0%, 0.4), inset 0 1px 0 hsla(0, 0%, 100%, 0.04)',
          }}
        >
          {/* Column headers */}
          <div className="grid grid-cols-3 mb-2 px-1">
            {['GENRE', 'THERAPEUTIC GOAL', 'MATCH'].map((h) => (
              <p key={h} style={{ fontSize: '9px', fontWeight: 400, letterSpacing: '0.12em', color: 'hsl(0, 0%, 35%)' }}>
                {h}
              </p>
            ))}
          </div>
          {/* Rows */}
          {pairings.map((p, i) => {
            const isActive = i === activeRow;
            return (
              <motion.div
                key={p.genre}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => { setActiveRow(i); setMatchPhase('select'); }}
                className="grid grid-cols-3 items-center py-2.5 px-1 rounded-lg cursor-pointer"
                style={{
                  borderTop: i > 0 ? '1px solid hsla(0, 0%, 100%, 0.06)' : 'none',
                  background: isActive ? 'hsla(210, 60%, 45%, 0.06)' : 'transparent',
                  transition: 'background 0.4s',
                }}
              >
                <span style={{
                  fontSize: '13px', fontWeight: 400,
                  color: isActive ? 'hsl(210, 80%, 70%)' : 'hsl(0, 0%, 92%)',
                  transition: 'color 0.4s',
                }}>
                  {p.genre}
                </span>
                <span style={{
                  fontSize: '13px', fontWeight: 400,
                  color: isActive ? 'hsl(0, 0%, 80%)' : 'hsl(0, 0%, 60%)',
                  transition: 'color 0.4s',
                }}>
                  {p.goal}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-14 h-1 rounded-full overflow-hidden" style={{ background: 'hsla(0, 0%, 100%, 0.1)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${p.match}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 + 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{
                        background: isActive
                          ? 'linear-gradient(90deg, hsl(180, 60%, 55%), hsl(210, 80%, 60%))'
                          : 'linear-gradient(90deg, hsl(180, 50%, 55%), hsl(200, 60%, 60%))',
                        boxShadow: isActive ? '0 0 8px hsla(200, 70%, 55%, 0.4)' : 'none',
                        transition: 'box-shadow 0.4s',
                      }}
                    />
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: 400,
                    color: isActive ? 'hsl(0, 0%, 70%)' : 'hsl(0, 0%, 45%)',
                    transition: 'color 0.4s',
                  }}>
                    {p.match}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-1.5 flex-wrap"
        >
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <span
                className="px-2.5 py-1 rounded-full"
                style={{
                  fontSize: '11px',
                  fontWeight: 400,
                  color: 'hsl(0, 0%, 60%)',
                  background: 'hsla(220, 20%, 12%, 0.5)',
                  border: '1px solid hsla(0, 0%, 100%, 0.08)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {step}
              </span>
              {i < steps.length - 1 && (
                <span style={{ color: 'hsl(0, 0%, 20%)', fontSize: '10px' }}>→</span>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

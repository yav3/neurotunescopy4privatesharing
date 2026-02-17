import React from 'react';
import { motion } from 'framer-motion';

const pairings = [
  { genre: 'New Age & World', goal: 'Stress & Anxiety Reduction', match: '94%' },
  { genre: 'Classical', goal: 'Focus & Concentration', match: '89%' },
  { genre: 'Chopin', goal: 'Pain Relief', match: '91%' },
  { genre: 'Pop', goal: 'Energy & Mood Boost', match: '86%' },
  { genre: 'Electronic', goal: 'HIIT & Cardio', match: '92%' },
];

const steps = ['Ingest', 'Map', 'Personalize', 'Deliver'];

export const DataFlowSection: React.FC = () => {
  return (
    <section
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
          style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)' }}
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
          className="text-center mb-8"
          style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.45)' }}
        >
          Each genre matched to therapeutic outcomes via clinical mapping
        </motion.p>

        {/* Pairings table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl p-4 md:p-5 mb-5"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Column headers */}
          <div className="grid grid-cols-3 mb-2 px-1">
            {['GENRE', 'THERAPEUTIC GOAL', 'MATCH'].map((h) => (
              <p key={h} style={{ fontSize: '9px', fontWeight: 400, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)' }}>
                {h}
              </p>
            ))}
          </div>
          {/* Rows */}
          {pairings.map((p, i) => (
            <motion.div
              key={p.genre}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="grid grid-cols-3 items-center py-2 px-1"
              style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
            >
              <span style={{ fontSize: '13px', fontWeight: 400, color: 'hsl(0, 0%, 92%)' }}>{p.genre}</span>
              <span style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>{p.goal}</span>
              <div className="flex items-center gap-2">
                <div className="w-14 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: p.match }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 + 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, hsl(180,50%,55%), hsl(200,60%,60%))' }}
                  />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(255,255,255,0.45)' }}>{p.match}</span>
              </div>
            </motion.div>
          ))}
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
                  color: 'rgba(255,255,255,0.6)',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {step}
              </span>
              {i < steps.length - 1 && (
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>→</span>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

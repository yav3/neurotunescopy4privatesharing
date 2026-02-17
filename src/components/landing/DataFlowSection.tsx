import React from 'react';
import { motion } from 'framer-motion';

const pairings = [
  { genre: 'Ambient', goal: 'Anxiety Relief', match: '94%' },
  { genre: 'Classical', goal: 'Focus Enhancement', match: '89%' },
  { genre: 'Lo-Fi', goal: 'Sleep Induction', match: '91%' },
  { genre: 'Nature', goal: 'Pain Management', match: '86%' },
  { genre: 'Binaural', goal: 'Deep Work', match: '92%' },
];

const steps = ['Ingest', 'Map', 'Personalize', 'Deliver'];

export const DataFlowSection: React.FC = () => {
  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background: `linear-gradient(155deg, 
          hsl(220, 20%, 8%) 0%, 
          hsl(220, 25%, 10%) 40%,
          hsl(225, 20%, 9%) 100%
        )`,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-3"
          style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.6)' }}
        >
          DATA ARCHITECTURE
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-3"
          style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'white' }}
        >
          Genre–goal pairings
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
          style={{ fontSize: '15px', fontWeight: 300, color: 'rgba(255,255,255,0.55)' }}
        >
          Each genre is matched to therapeutic outcomes via clinical mapping
        </motion.p>

        {/* Pairings table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-5 md:p-6 mb-6"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Column headers */}
          <div className="grid grid-cols-3 mb-3 px-1">
            {['GENRE', 'THERAPEUTIC GOAL', 'MATCH'].map((h) => (
              <p key={h} style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)' }}>
                {h}
              </p>
            ))}
          </div>
          {/* Rows */}
          {pairings.map((p, i) => (
            <motion.div
              key={p.genre}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="grid grid-cols-3 items-center py-2.5 px-1"
              style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}
            >
              <span style={{ fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.9)' }}>{p.genre}</span>
              <span style={{ fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>{p.goal}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: p.match }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 + 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, hsl(180,55%,50%), hsl(200,65%,55%))' }}
                  />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>{p.match}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pipeline — minimal inline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-2 flex-wrap"
        >
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <span
                className="px-3 py-1.5 rounded-full"
                style={{
                  fontSize: '12px',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.7)',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                {step}
              </span>
              {i < steps.length - 1 && (
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>→</span>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

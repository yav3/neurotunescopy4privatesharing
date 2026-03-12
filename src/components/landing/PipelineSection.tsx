import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Zap, Target, BarChart3 } from 'lucide-react';

const steps = [
  { number: 1, icon: Music, title: 'Compose', description: 'Algorithmic composition' },
  { number: 2, icon: Zap, title: 'Annotate', description: 'Feature extraction' },
  { number: 3, icon: Target, title: 'Classify', description: 'Therapeutic mapping' },
  { number: 4, icon: BarChart3, title: 'Deliver', description: 'Adaptive playback' },
];

const stageOutputs = [
  { label: 'Generating', detail: '120 BPM · C major · 4/4' },
  { label: 'Extracting', detail: 'Tempo · Key · Spectral centroid' },
  { label: 'Mapping', detail: 'Focus & Concentration → 89%' },
  { label: 'Delivering', detail: 'Adaptive session · 25 min' },
];

/* Smooth animated sine wave SVG */
const SineWave: React.FC = () => {
  return (
    <div className="relative w-full h-12 overflow-hidden">
      <svg
        viewBox="0 0 400 48"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="sineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(192, 85%, 45%)" stopOpacity="0.1" />
            <stop offset="30%" stopColor="hsl(192, 85%, 45%)" stopOpacity="0.8" />
            <stop offset="70%" stopColor="hsl(210, 80%, 50%)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(210, 80%, 50%)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {/* Primary sine wave */}
        <motion.path
          d="M0,24 C25,8 50,8 75,24 C100,40 125,40 150,24 C175,8 200,8 225,24 C250,40 275,40 300,24 C325,8 350,8 375,24 C400,40 400,40 400,24"
          fill="none"
          stroke="url(#sineGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ x: [0, -75] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        {/* Secondary subtle wave (gamma-like higher frequency) */}
        <motion.path
          d="M0,24 C12,16 25,16 37,24 C50,32 62,32 75,24 C87,16 100,16 112,24 C125,32 137,32 150,24 C162,16 175,16 187,24 C200,32 212,32 225,24 C237,16 250,16 262,24 C275,32 287,32 300,24 C312,16 325,16 337,24 C350,32 362,32 375,24 C387,16 400,16 400,24"
          fill="none"
          stroke="hsl(192, 85%, 45%)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.2"
          animate={{ x: [0, -37] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
    </div>
  );
};

const GLASS = {
  background: 'hsla(200, 60%, 97%, 0.65)',
  border: '1px solid hsla(200, 70%, 85%, 0.5)',
  backdropFilter: 'blur(24px) saturate(1.6)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
  boxShadow: '0 2px 16px hsla(200, 80%, 55%, 0.06), inset 0 1px 0 hsla(0, 0%, 100%, 0.7)',
} as const;

const GLASS_ACTIVE = {
  background: 'hsla(200, 70%, 97%, 0.8)',
  border: '1px solid hsla(195, 80%, 75%, 0.6)',
  backdropFilter: 'blur(32px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
  boxShadow: '0 8px 32px hsla(195, 90%, 50%, 0.1), 0 1px 3px hsla(195, 80%, 50%, 0.06), inset 0 1px 0 hsla(0, 0%, 100%, 0.85)',
} as const;

export const PipelineSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="technology"
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        background: 'hsl(var(--landing-bg))',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-5xl">
        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-2"
          style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', color: 'hsl(var(--landing-ink-muted))' }}
        >
          COMPOSITION ENGINE
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-12"
          style={{
            fontSize: 'clamp(24px, 4vw, 38px)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: 'hsl(var(--landing-ink))',
          }}
        >
          Algorithmic music pipeline
        </motion.h2>

        {/* Pipeline step cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === activeStep;
            const isPast = i < activeStep;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                onHoverStart={() => setActiveStep(i)}
                className="relative rounded-2xl p-5 cursor-pointer overflow-hidden"
                style={{
                  ...(isActive ? GLASS_ACTIVE : GLASS),
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Step header */}
                <div className="relative flex items-center justify-between mb-4">
                  <Icon
                    className="w-5 h-5"
                    strokeWidth={1.5}
                    style={{
                      color: isActive ? 'hsl(192, 85%, 35%)' : 'hsl(200, 30%, 45%)',
                      transition: 'all 0.4s',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 400,
                      color: isActive ? 'hsl(192, 70%, 30%)' : 'hsl(200, 25%, 50%)',
                      fontVariantNumeric: 'tabular-nums',
                      transition: 'color 0.4s',
                    }}
                  >
                    0{step.number}
                  </span>
                </div>

                <h3
                  className="relative"
                  style={{
                    fontSize: '16px',
                    fontWeight: 400,
                    marginBottom: '4px',
                    transition: 'all 0.4s',
                    ...(isActive
                      ? { background: 'linear-gradient(135deg, hsl(var(--landing-electric-1)), hsl(var(--landing-electric-2)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                      : { color: 'hsl(var(--landing-ink))' }),
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="relative"
                  style={{
                    fontSize: '12px',
                    fontWeight: 300,
                    color: isActive ? 'hsl(200, 35%, 28%)' : 'hsl(200, 20%, 42%)',
                    transition: 'color 0.4s',
                  }}
                >
                  {step.description}
                </p>

                {/* Bottom accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl"
                  style={{
                    background: 'linear-gradient(90deg, hsl(var(--landing-electric-1)), hsl(var(--landing-electric-2)))',
                    transformOrigin: 'left',
                  }}
                  animate={{
                    scaleX: isActive ? 1 : isPast ? 0.5 : 0,
                    opacity: isActive ? 1 : isPast ? 0.35 : 0,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Live Pipeline Demo — glass panel with sine wave */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="relative rounded-2xl p-5 md:p-6 overflow-hidden"
          style={{
            ...GLASS,
            background: 'hsla(200, 70%, 97%, 0.7)',
          }}
        >
          {/* Sine wave visualization */}
          <SineWave />

          {/* Stage output */}
          <div className="relative flex items-center gap-6 mt-3">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: 'hsl(160, 70%, 42%)' }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                    <span style={{ fontSize: '10px', letterSpacing: '0.12em', fontWeight: 600, color: 'hsl(160, 55%, 32%)' }}>
                      {stageOutputs[activeStep].label.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 300, color: 'hsl(205, 40%, 20%)' }}>
                    {stageOutputs[activeStep].detail}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="text-right">
              <span style={{
                fontSize: '28px',
                fontWeight: 300,
                fontVariantNumeric: 'tabular-nums',
                background: 'linear-gradient(135deg, hsl(var(--landing-electric-1)), hsl(var(--landing-electric-2)))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                0{activeStep + 1}
              </span>
              <span style={{ fontSize: '13px', color: 'hsl(200, 25%, 45%)' }}> / 04</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

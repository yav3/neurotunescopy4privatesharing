import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LissajousCompose, LissajousAnnotate, LissajousClassify, LissajousDeliver } from '@/components/brand/LissajousVariants';

const steps = [
  { number: 1, Logo: LissajousCompose, title: 'Compose', description: 'Algorithmic composition' },
  { number: 2, Logo: LissajousAnnotate, title: 'Annotate', description: 'Feature extraction' },
  { number: 3, Logo: LissajousClassify, title: 'Classify', description: 'Therapeutic mapping' },
  { number: 4, Logo: LissajousDeliver, title: 'Deliver', description: 'Adaptive playback' },
];

const stageOutputs = [
  { label: 'Generating', detail: '120 BPM · C major · 4/4' },
  { label: 'Extracting', detail: 'Tempo · Key · Spectral centroid' },
  { label: 'Mapping', detail: 'Focus & Concentration → 89%' },
  { label: 'Delivering', detail: 'Adaptive session · 25 min' },
];

const SineWave: React.FC = () => (
  <div className="relative w-full h-12 overflow-hidden">
    <svg viewBox="0 0 400 48" preserveAspectRatio="none" className="w-full h-full" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="sineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(192, 85%, 45%)" stopOpacity="0.1" />
          <stop offset="30%" stopColor="hsl(192, 85%, 45%)" stopOpacity="0.8" />
          <stop offset="70%" stopColor="hsl(210, 80%, 50%)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(210, 80%, 50%)" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0,24 C25,8 50,8 75,24 C100,40 125,40 150,24 C175,8 200,8 225,24 C250,40 275,40 300,24 C325,8 350,8 375,24 C400,40 400,40 400,24"
        fill="none" stroke="url(#sineGrad)" strokeWidth="2" strokeLinecap="round"
        animate={{ x: [0, -75] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <motion.path
        d="M0,24 C12,16 25,16 37,24 C50,32 62,32 75,24 C87,16 100,16 112,24 C125,32 137,32 150,24 C162,16 175,16 187,24 C200,32 212,32 225,24 C237,16 250,16 262,24 C275,32 287,32 300,24 C312,16 325,16 337,24 C350,32 362,32 375,24 C387,16 400,16 400,24"
        fill="none" stroke="hsl(192, 85%, 45%)" strokeWidth="1" strokeLinecap="round" opacity="0.2"
        animate={{ x: [0, -37] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  </div>
);

const GLASS = {
  background: 'hsla(200, 20%, 12%, 0.6)',
  border: '1px solid hsla(200, 40%, 30%, 0.25)',
  backdropFilter: 'blur(24px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
  boxShadow: '0 2px 16px hsla(200, 80%, 10%, 0.3), inset 0 1px 0 hsla(0, 0%, 100%, 0.05)',
} as const;

const GLASS_ACTIVE = {
  background: 'hsla(200, 30%, 14%, 0.75)',
  border: '1px solid hsla(195, 80%, 45%, 0.3)',
  backdropFilter: 'blur(32px) saturate(1.6)',
  WebkitBackdropFilter: 'blur(32px) saturate(1.6)',
  boxShadow: '0 8px 32px hsla(195, 90%, 30%, 0.15), 0 1px 3px hsla(195, 80%, 50%, 0.08), inset 0 1px 0 hsla(0, 0%, 100%, 0.08)',
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
      className="relative py-14 md:py-20 overflow-hidden"
      style={{ background: 'hsl(var(--landing-bg))', fontFamily: 'var(--font-sf)' }}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-1.5"
          style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', color: 'hsl(var(--landing-ink-muted))' }}
        >
          COMPOSITION ENGINE
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
          style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'hsl(var(--landing-ink))' }}
        >
          Algorithmic music pipeline
        </motion.h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {steps.map((step, i) => {
            const Logo = step.Logo;
            const isActive = i === activeStep;
            const isPast = i < activeStep;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -3 }}
                onHoverStart={() => setActiveStep(i)}
                className="relative rounded-2xl p-4 cursor-pointer overflow-hidden"
                style={{
                  ...(isActive ? GLASS_ACTIVE : GLASS),
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <Logo
                    size={22}
                    animated={isActive}
                    color={isActive ? 'hsl(192, 85%, 50%)' : 'hsl(200, 20%, 45%)'}
                  />
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 400,
                    fontVariantNumeric: 'tabular-nums',
                    color: isActive ? 'hsl(192, 70%, 55%)' : 'hsl(200, 15%, 40%)',
                    transition: 'color 0.4s',
                  }}>
                    0{step.number}
                  </span>
                </div>

                <h3 style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  marginBottom: '3px',
                  transition: 'all 0.4s',
                  ...(isActive
                    ? { background: 'linear-gradient(135deg, hsl(var(--landing-electric-1)), hsl(var(--landing-electric-2)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                    : { color: 'hsl(var(--landing-ink))' }),
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: '12px',
                  fontWeight: 300,
                  color: isActive ? 'hsl(200, 20%, 60%)' : 'hsl(200, 10%, 40%)',
                  transition: 'color 0.4s',
                }}>
                  {step.description}
                </p>

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

        {/* Live output panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="relative rounded-2xl p-4 md:p-5 overflow-hidden"
          style={{ ...GLASS, background: 'hsla(200, 25%, 10%, 0.7)' }}
        >
          <SineWave />
          <div className="relative flex items-center gap-6 mt-2">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: 'hsl(160, 70%, 42%)' }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                    <span style={{ fontSize: '10px', letterSpacing: '0.1em', fontWeight: 600, color: 'hsl(160, 55%, 45%)' }}>
                      {stageOutputs[activeStep].label.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 300, color: 'hsl(0, 0%, 75%)' }}>
                    {stageOutputs[activeStep].detail}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="text-right">
              <span style={{
                fontSize: '26px',
                fontWeight: 300,
                fontVariantNumeric: 'tabular-nums',
                background: 'linear-gradient(135deg, hsl(var(--landing-electric-1)), hsl(var(--landing-electric-2)))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                0{activeStep + 1}
              </span>
              <span style={{ fontSize: '13px', color: 'hsl(0, 0%, 40%)' }}> / 04</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LissajousLogo } from '@/components/brand/LissajousLogo';
import {
  LissajousCompose,
  LissajousAnnotate,
  LissajousClassify,
  LissajousDeliver,
} from '@/components/brand/LissajousVariants';

const steps = [
  {
    number: '01',
    title: 'Feature Annotation',
    description: 'Tempo, key, harmony, and spectral parameters defined upfront.',
    marking: 'Adagio',
    Icon: LissajousCompose,
  },
  {
    number: '02',
    title: 'Therapeutic Mapping',
    description: 'Clinical classification for anxiety, focus, and pain.',
    marking: 'Andante',
    Icon: LissajousAnnotate,
  },
  {
    number: '03',
    title: 'Personalization',
    description: 'Adaptive algorithms matched to symptom profiles.',
    marking: 'Moderato',
    Icon: LissajousClassify,
  },
  {
    number: '04',
    title: 'Session Delivery',
    description: 'Real-time streaming with biomarker feedback.',
    marking: 'Allegro',
    Icon: LissajousDeliver,
  },
  {
    number: '05',
    title: 'Outcome Reporting',
    description: 'Structured data for clinical validation.',
    marking: 'Finale',
    Icon: LissajousCompose,
  },
];

const GRADIENT = 'linear-gradient(135deg, hsl(var(--landing-electric-1)), hsl(var(--landing-electric-2)))';

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative py-12 md:py-16 overflow-hidden"
      style={{ background: 'hsl(var(--landing-bg))', fontFamily: 'var(--font-sf)' }}
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-10 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mb-1"
        >
          <div className="h-px w-6" style={{ background: GRADIENT, opacity: 0.25 }} />
          <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', color: 'hsl(var(--landing-ink-muted))' }}>
            ORCHESTRATION
          </p>
          <div className="h-px w-6" style={{ background: GRADIENT, opacity: 0.25 }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
          style={{ fontSize: 'clamp(20px, 3.5vw, 32px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'hsl(var(--landing-ink))' }}
        >
          Composition to clinical outcomes
        </motion.h2>

        {/* Tempo header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-5"
        >
          <LissajousLogo size={12} color="hsl(var(--landing-ink-muted))" />
          <span style={{ fontSize: '9px', fontWeight: 400, letterSpacing: '0.06em', color: 'hsl(var(--landing-ink-muted))', opacity: 0.5 }}>
            ♩= 72 · 4/4
          </span>
        </motion.div>

        {/* Score — horizontal grid */}
        <div className="relative">
          {/* Staff lines spanning full width */}
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.05 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute w-full"
                style={{ top: `${30 + i * 20}%`, height: '1px', background: 'hsl(var(--landing-electric-1))' }}
              />
            ))}
          </div>

          {/* Horizontal steps grid */}
          <div className="grid grid-cols-5 gap-px relative">
            {steps.map((step, i) => {
              const isActive = i === activeStep;
              const isPast = i < activeStep;

              return (
                <motion.button
                  key={step.number}
                  onClick={() => setActiveStep(i)}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="relative cursor-pointer flex flex-col items-center text-center group"
                  style={{ padding: '0 4px' }}
                >
                  {/* Marking above */}
                  <span
                    style={{
                      fontSize: '9px',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      color: isActive ? 'hsl(var(--landing-electric-1))' : 'hsl(var(--landing-ink-muted))',
                      opacity: isActive ? 0.9 : 0.3,
                      transition: 'all 0.3s',
                      marginBottom: '6px',
                    }}
                  >
                    {step.marking}
                  </span>

                  {/* Lissajous notehead */}
                  <div
                    className="relative flex items-center justify-center rounded-full"
                    style={{
                      width: 44,
                      height: 44,
                      background: isActive ? 'hsl(var(--landing-electric-1) / 0.06)' : 'transparent',
                      border: isActive ? '1px solid hsl(var(--landing-electric-1) / 0.15)' : '1px solid hsl(var(--landing-ink-muted) / 0.08)',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <step.Icon
                      size={22}
                      color={
                        isActive
                          ? 'hsl(var(--landing-electric-1))'
                          : isPast
                          ? 'hsl(var(--landing-ink-muted))'
                          : 'hsl(var(--landing-ink-soft))'
                      }
                      animated={isActive}
                    />
                    {/* Pulse ring */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ border: '1px solid hsl(var(--landing-electric-1))' }}
                        animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </div>

                  {/* Connector line between noteheads */}
                  {i < steps.length - 1 && (
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/2 h-px"
                      style={{
                        width: 'calc(100% - 52px)',
                        left: 'calc(50% + 26px)',
                        background: i < activeStep
                          ? 'hsl(var(--landing-electric-1) / 0.2)'
                          : 'hsl(var(--landing-ink-muted) / 0.08)',
                        transition: 'background 0.3s',
                      }}
                    />
                  )}

                  {/* Number */}
                  <span
                    className="mt-2"
                    style={{
                      fontSize: '10px',
                      fontWeight: 400,
                      fontVariantNumeric: 'tabular-nums',
                      ...(isActive
                        ? { background: GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                        : { color: 'hsl(var(--landing-ink-muted))', opacity: isPast ? 0.35 : 0.5 }),
                      transition: 'opacity 0.3s',
                    }}
                  >
                    {step.number}
                  </span>

                  {/* Title */}
                  <h3
                    className="mt-1"
                    style={{
                      fontSize: '12px',
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? 'hsl(var(--landing-ink))' : 'hsl(var(--landing-ink-soft))',
                      transition: 'all 0.3s',
                      lineHeight: 1.3,
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Description — only active */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden mt-1.5"
                        style={{
                          fontSize: '10px',
                          fontWeight: 400,
                          lineHeight: 1.45,
                          color: 'hsl(var(--landing-ink-soft))',
                          maxWidth: '140px',
                        }}
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Progress bar at bottom */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px rounded-full"
                      style={{ background: GRADIENT }}
                      initial={{ width: '0%' }}
                      animate={{ width: '80%' }}
                      transition={{ duration: 3.5, ease: 'linear' }}
                      key={`p-${activeStep}`}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Double barline */}
          <div className="flex items-center justify-end gap-0.5 mt-4 pr-2">
            <div style={{ width: '1px', height: '12px', background: 'hsl(var(--landing-ink-muted))', opacity: 0.1 }} />
            <div style={{ width: '2px', height: '12px', background: 'hsl(var(--landing-ink-muted))', opacity: 0.1 }} />
            <span className="ml-1.5" style={{ fontSize: '8px', fontStyle: 'italic', color: 'hsl(var(--landing-ink-muted))', opacity: 0.25 }}>
              Fine
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

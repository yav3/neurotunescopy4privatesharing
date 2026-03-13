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
      className="relative py-10 md:py-14 overflow-hidden"
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

        {/* Score layout */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Tempo header */}
          <div className="flex items-center gap-2 mb-4">
            <LissajousLogo size={10} color="hsl(var(--landing-ink-muted))" />
            <span style={{ fontSize: '9px', fontWeight: 400, letterSpacing: '0.06em', color: 'hsl(var(--landing-ink-muted))', opacity: 0.4 }}>
              ♩= 72 · 4/4
            </span>
          </div>

          {/* Horizontal step rail */}
          <div className="relative flex items-start justify-between">
            {/* Connecting line behind noteheads */}
            <div
              className="absolute left-0 right-0 pointer-events-none"
              style={{ top: 38, height: '1px', background: 'hsl(var(--landing-ink-muted) / 0.1)' }}
            />
            {/* Progress line */}
            <motion.div
              className="absolute left-0 pointer-events-none"
              style={{ top: 38, height: '1px', background: GRADIENT }}
              animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />

            {steps.map((step, i) => {
              const isActive = i === activeStep;
              const isPast = i < activeStep;

              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(i)}
                  className="relative flex flex-col items-center cursor-pointer group"
                  style={{ width: `${100 / steps.length}%`, padding: '0 2px' }}
                >
                  {/* Marking */}
                  <span
                    style={{
                      fontSize: '9px',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      color: isActive ? 'hsl(var(--landing-electric-1))' : 'hsl(var(--landing-ink-muted))',
                      opacity: isActive ? 0.9 : 0.25,
                      transition: 'all 0.3s',
                      marginBottom: 4,
                    }}
                  >
                    {step.marking}
                  </span>

                  {/* Notehead */}
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: isActive
                        ? 'hsl(var(--landing-electric-1) / 0.08)'
                        : isPast
                        ? 'hsl(var(--landing-electric-1) / 0.03)'
                        : 'transparent',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <step.Icon
                      size={18}
                      color={
                        isActive
                          ? 'hsl(var(--landing-electric-1))'
                          : isPast
                          ? 'hsl(var(--landing-ink-muted))'
                          : 'hsl(var(--landing-ink-soft))'
                      }
                      animated={isActive}
                    />
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ border: '1px solid hsl(var(--landing-electric-1) / 0.3)' }}
                        animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </div>

                  {/* Number */}
                  <span
                    className="mt-1.5"
                    style={{
                      fontSize: '10px',
                      fontWeight: 400,
                      fontVariantNumeric: 'tabular-nums',
                      ...(isActive || isPast
                        ? { background: GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                        : { color: 'hsl(var(--landing-ink-muted))', opacity: 0.4 }),
                      transition: 'opacity 0.3s',
                    }}
                  >
                    {step.number}
                  </span>

                  {/* Title */}
                  <h3
                    className="mt-0.5"
                    style={{
                      fontSize: '11px',
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
                        className="overflow-hidden mt-1"
                        style={{
                          fontSize: '10px',
                          fontWeight: 400,
                          lineHeight: 1.4,
                          color: 'hsl(var(--landing-ink-soft))',
                          maxWidth: '130px',
                        }}
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          {/* Double barline */}
          <div className="flex items-center justify-end gap-0.5 mt-3 pr-2">
            <div style={{ width: '1px', height: '10px', background: 'hsl(var(--landing-ink-muted))', opacity: 0.1 }} />
            <div style={{ width: '2px', height: '10px', background: 'hsl(var(--landing-ink-muted))', opacity: 0.1 }} />
            <span className="ml-1" style={{ fontSize: '8px', fontStyle: 'italic', color: 'hsl(var(--landing-ink-muted))', opacity: 0.2 }}>
              Fine
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

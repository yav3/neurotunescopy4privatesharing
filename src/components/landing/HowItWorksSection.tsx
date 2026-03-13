import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LissajousLogo } from '@/components/brand/LissajousLogo';

const steps = [
  { number: '01', title: 'Feature Annotation', description: 'Tempo, key, harmony, and spectral parameters defined upfront.', marking: 'Adagio' },
  { number: '02', title: 'Therapeutic Mapping', description: 'Clinical classification for anxiety, focus, and pain.', marking: 'Andante' },
  { number: '03', title: 'Personalization', description: 'Adaptive algorithms matched to symptom profiles.', marking: 'Moderato' },
  { number: '04', title: 'Session Delivery', description: 'Real-time streaming with biomarker feedback.', marking: 'Allegro' },
  { number: '05', title: 'Outcome Reporting', description: 'Structured data for clinical validation.', marking: 'Finale' },
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
      className="relative py-14 md:py-20 overflow-hidden"
      style={{ background: 'hsl(var(--landing-bg))', fontFamily: 'var(--font-sf)' }}
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mb-1.5"
        >
          <div className="h-px w-6" style={{ background: GRADIENT, opacity: 0.25 }} />
          <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', color: 'hsl(var(--landing-ink-muted))' }}>
            ORCHESTRATION
          </p>
          <div className="h-px w-6" style={{ background: GRADIENT, opacity: 0.25 }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
          style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'hsl(var(--landing-ink))' }}
        >
          Composition to clinical outcomes
        </motion.h2>

        {/* Score */}
        <div className="relative max-w-2xl mx-auto">
          {/* Staff lines */}
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.06 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="absolute w-full"
                style={{ top: `${20 + i * 15}%`, height: '1px', background: 'hsl(var(--landing-electric-1))' }}
              />
            ))}
          </div>

          {/* Tempo header */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <LissajousLogo size={14} color="hsl(var(--landing-ink-muted))" />
            <span style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.06em', color: 'hsl(var(--landing-ink-muted))', opacity: 0.5 }}>
              ♩= 72 · 4/4
            </span>
          </motion.div>

          {/* Steps */}
          <div className="space-y-0.5">
            {steps.map((step, i) => {
              const isActive = i === activeStep;
              const isPast = i < activeStep;

              return (
                <motion.button
                  key={step.number}
                  onClick={() => setActiveStep(i)}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="w-full text-left relative cursor-pointer flex items-start"
                  style={{ padding: '10px 0' }}
                >
                  {/* Marking */}
                  <span
                    className="shrink-0 text-right pr-3"
                    style={{
                      width: '56px',
                      fontSize: '9px',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      color: isActive ? 'hsl(var(--landing-electric-1))' : 'hsl(var(--landing-ink-muted))',
                      opacity: isActive ? 0.8 : 0.3,
                      transition: 'all 0.3s',
                      paddingTop: '2px',
                    }}
                  >
                    {step.marking}
                  </span>

                  {/* Barline */}
                  <div
                    className="shrink-0 self-stretch"
                    style={{
                      width: '1px',
                      background: isActive ? 'hsl(var(--landing-electric-1))' : 'hsl(var(--landing-ink-muted))',
                      opacity: isActive ? 0.5 : 0.1,
                      transition: 'all 0.3s',
                    }}
                  />

                  {/* Content */}
                  <div
                    className="flex-1 min-w-0 rounded-lg px-4 py-2.5 relative overflow-hidden ml-3"
                    style={{
                      background: isActive ? 'hsl(var(--landing-electric-1) / 0.04)' : 'transparent',
                      border: isActive ? '1px solid hsl(var(--landing-electric-1) / 0.12)' : '1px solid transparent',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <div className="flex items-baseline gap-2.5">
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 400,
                          fontVariantNumeric: 'tabular-nums',
                          ...(isActive
                            ? { background: GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                            : { color: 'hsl(var(--landing-ink-muted))', opacity: isPast ? 0.4 : 0.6 }),
                        }}
                      >
                        {step.number}
                      </span>
                      <h3 style={{
                        fontSize: '14px',
                        fontWeight: isActive ? 500 : 400,
                        color: isActive ? 'hsl(var(--landing-ink))' : 'hsl(var(--landing-ink-soft))',
                        transition: 'all 0.3s',
                      }}>
                        {step.title}
                      </h3>
                    </div>

                    <AnimatePresence>
                      {isActive && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden mt-1 pl-[34px]"
                          style={{ fontSize: '12px', fontWeight: 400, lineHeight: 1.5, color: 'hsl(var(--landing-ink-soft))' }}
                        >
                          {step.description}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Progress bar */}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-px"
                        style={{ background: GRADIENT }}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 3.5, ease: 'linear' }}
                        key={`p-${activeStep}`}
                      />
                    )}
                  </div>

                  {/* Status dot */}
                  <div className="shrink-0 flex items-center justify-center w-5 pt-1">
                    {isActive && (
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: GRADIENT }}
                      />
                    )}
                    {isPast && (
                      <div className="w-1 h-1 rounded-full" style={{ background: 'hsl(var(--landing-ink-muted))', opacity: 0.25 }} />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Double barline */}
          <div className="flex items-center gap-0.5 mt-3 ml-[56px]">
            <div style={{ width: '1px', height: '14px', background: 'hsl(var(--landing-ink-muted))', opacity: 0.12 }} />
            <div style={{ width: '2px', height: '14px', background: 'hsl(var(--landing-ink-muted))', opacity: 0.12 }} />
            <span className="ml-2" style={{ fontSize: '9px', fontStyle: 'italic', color: 'hsl(var(--landing-ink-muted))', opacity: 0.3 }}>
              Fine
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { number: '01', title: 'Feature Annotation', description: 'Tempo, key, harmony, and spectral parameters defined upfront.' },
  { number: '02', title: 'Therapeutic Mapping', description: 'Clinical classification for anxiety, focus, and pain.' },
  { number: '03', title: 'Personalization', description: 'Adaptive algorithms matched to symptom profiles.' },
  { number: '04', title: 'Session Delivery', description: 'Real-time streaming with biomarker feedback.' },
  { number: '05', title: 'Outcome Reporting', description: 'Structured data for clinical validation.' },
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
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ background: 'hsl(var(--landing-bg))', fontFamily: 'var(--font-sf)' }}
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 max-w-5xl">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-2"
          style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', color: 'hsl(var(--landing-ink-muted))' }}>
          HOW IT WORKS
        </motion.p>

        <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12"
          style={{ fontSize: 'clamp(22px, 4vw, 38px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'hsl(var(--landing-ink))' }}>
          Composition to clinical outcomes
        </motion.h2>

        {/* Simple vertical list */}
        <div className="max-w-2xl mx-auto space-y-3">
          {steps.map((step, i) => {
            const isActive = i === activeStep;
            return (
              <motion.button
                key={step.number}
                onClick={() => setActiveStep(i)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="w-full text-left rounded-2xl p-5 relative overflow-hidden cursor-pointer flex items-start gap-4"
                style={{
                  background: isActive ? 'hsl(var(--landing-electric-1) / 0.06)' : 'transparent',
                  border: isActive ? '1px solid hsla(200, 70%, 80%, 0.5)' : '1px solid transparent',
                  transition: 'all 0.4s ease',
                }}
              >
                <span
                  className="shrink-0 mt-0.5"
                  style={{
                    fontSize: '13px',
                    fontWeight: 400,
                    ...(isActive
                      ? { background: GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                      : { color: 'hsl(var(--landing-ink-muted))' }),
                  }}
                >
                  {step.number}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: 400,
                    color: isActive ? 'hsl(var(--landing-ink))' : 'hsl(var(--landing-ink-soft))',
                    transition: 'color 0.3s',
                  }}>
                    {step.title}
                  </h3>
                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden mt-1"
                        style={{ fontSize: '13px', fontWeight: 400, lineHeight: 1.5, color: 'hsl(var(--landing-ink-soft))' }}
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                {/* Active bar */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
                  style={{ background: GRADIENT }}
                  animate={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

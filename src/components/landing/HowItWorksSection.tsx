import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { number: '01', title: 'Feature Annotation', description: 'Music composed to spec — tempo, key, harmony, and spectral parameters defined upfront.' },
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
      className="relative py-16 md:py-28 overflow-hidden"
      style={{ background: 'hsl(var(--landing-bg))', fontFamily: 'var(--font-sf)' }}
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center mb-4">
          <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', color: 'hsl(var(--landing-ink-muted))' }}>HOW IT WORKS</span>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-4"
          style={{ fontSize: 'clamp(22px, 4vw, 38px)', fontWeight: 400, letterSpacing: '-0.02em', color: 'hsl(var(--landing-ink))' }}>
          Composition to clinical outcomes
        </motion.h2>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10 md:mb-14"
          style={{ fontSize: '14px', fontWeight: 400, color: 'hsl(var(--landing-ink-soft))' }}>
          Five stages from algorithmic composition to validated therapeutic delivery
        </motion.p>

        {/* ── Desktop: horizontal progress track ── */}
        <div className="relative max-w-5xl mx-auto mb-8 md:mb-12 hidden lg:block">
          <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2" style={{ background: 'hsl(var(--landing-track))' }} />
          <motion.div
            className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 origin-left rounded-full"
            style={{ background: GRADIENT, boxShadow: '0 0 16px hsl(var(--landing-electric-1) / 0.3)' }}
            animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="relative h-20 md:h-28 flex items-center justify-between px-4">
            {steps.map((_, i) => {
              const isActive = i === activeStep;
              const isPast = i < activeStep;
              return (
                <motion.button key={i} onClick={() => setActiveStep(i)} className="relative z-10 rounded-full cursor-pointer"
                  animate={{ width: isActive ? 48 : 10, height: isActive ? 48 : 10 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    background: isActive
                      ? 'hsl(var(--landing-electric-1) / 0.15)'
                      : isPast ? GRADIENT : 'hsl(var(--landing-electric-1) / 0.12)',
                    border: isActive ? '1px solid hsl(var(--landing-border))' : isPast ? '1px solid hsl(var(--landing-electric-1) / 0.6)' : '1px solid hsl(var(--landing-border-soft))',
                    backdropFilter: isActive ? 'blur(20px)' : 'none',
                    boxShadow: isActive ? '0 0 30px hsl(var(--landing-electric-1) / 0.22)' : isPast ? '0 0 12px hsl(var(--landing-electric-1) / 0.28)' : 'none',
                  }}>
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                        style={{ fontSize: '16px', fontWeight: 400, color: 'hsl(var(--landing-ink))', position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {steps[activeStep].number}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Desktop: 5-col cards ── */}
        <div className="max-w-5xl mx-auto hidden lg:grid lg:grid-cols-5 gap-3">
          {steps.map((step, i) => {
            const isActive = i === activeStep;
            return (
              <motion.button key={step.number} onClick={() => setActiveStep(i)}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}
                className="text-left rounded-2xl p-5 cursor-pointer relative overflow-hidden"
                style={{
                  background: isActive
                    ? 'hsl(var(--landing-electric-1) / 0.08)'
                    : 'hsl(var(--landing-electric-1) / 0.04)',
                  border: isActive ? '1px solid hsl(var(--landing-border))' : '1px solid hsl(var(--landing-border-soft))',
                  backdropFilter: 'blur(20px)',
                  boxShadow: isActive ? '0 12px 40px -8px hsl(var(--landing-electric-2) / 0.12)' : 'none',
                  transition: 'all 0.4s ease',
                }}>
                {isActive && (
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(105deg, transparent 40%, hsl(var(--landing-electric-1) / 0.06) 50%, transparent 60%)' }}
                    initial={{ x: '-100%' }} animate={{ x: '200%' }} transition={{ duration: 2, ease: 'easeInOut' }} />
                )}
                <p className="relative mb-2" style={{
                  fontSize: '13px', fontWeight: 400, letterSpacing: '0.05em',
                  ...(isActive
                    ? { background: GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                    : { color: 'hsl(var(--landing-ink-muted))' }),
                }}>{step.number}</p>
                <h3 className="relative" style={{ fontSize: '15px', fontWeight: 400, color: isActive ? 'hsl(var(--landing-ink))' : 'hsl(var(--landing-ink-soft))' }}>
                  {step.title}
                </h3>
                <AnimatePresence>
                  {isActive && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                      className="relative mt-2 overflow-hidden" style={{ fontSize: '12px', fontWeight: 400, lineHeight: 1.6, color: 'hsl(var(--landing-ink-soft))' }}>
                      {step.description}
                    </motion.p>
                  )}
                </AnimatePresence>
                <motion.div className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: GRADIENT, transformOrigin: 'left' }}
                  animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
              </motion.button>
            );
          })}
        </div>

        {/* ── Mobile: vertical timeline ── */}
        <div className="lg:hidden max-w-lg mx-auto">
          {steps.map((step, i) => {
            const isActive = i === activeStep;
            const isPast = i <= activeStep;
            return (
              <motion.div key={step.number} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }} className="flex gap-4">
                {/* Timeline rail */}
                <div className="flex flex-col items-center shrink-0">
                  <motion.div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-normal"
                    animate={{
                      background: isActive ? 'linear-gradient(135deg, hsl(var(--landing-electric-1)), hsl(var(--landing-electric-2)))' : isPast ? 'hsl(var(--landing-electric-1) / 0.15)' : 'hsl(var(--landing-electric-1) / 0.08)',
                      color: isActive ? '#fff' : 'hsl(var(--landing-ink-soft))',
                      boxShadow: isActive ? '0 0 16px hsl(var(--landing-electric-1) / 0.4)' : '0 0 0 transparent',
                    }}
                    transition={{ duration: 0.4 }}>
                    {step.number}
                  </motion.div>
                  {i < steps.length - 1 && (
                    <motion.div className="w-[2px] flex-1 min-h-[16px] rounded-full"
                      animate={{ background: isPast ? GRADIENT : 'hsl(var(--landing-border-soft))' }}
                      transition={{ duration: 0.5 }} />
                  )}
                </div>
                {/* Content card */}
                <motion.button onClick={() => setActiveStep(i)}
                  className="text-left rounded-2xl p-4 mb-3 flex-1 relative overflow-hidden cursor-pointer"
                  style={{
                    background: isActive ? 'hsl(var(--landing-electric-1) / 0.08)' : 'hsl(var(--landing-electric-1) / 0.04)',
                    border: isActive ? '1px solid hsl(var(--landing-border))' : '1px solid hsl(var(--landing-border-soft))',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.4s ease',
                  }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 400, color: isActive ? 'hsl(var(--landing-ink))' : 'hsl(var(--landing-ink-soft))' }}>
                    {step.title}
                  </h3>
                  <AnimatePresence>
                    {isActive && (
                      <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                        className="overflow-hidden mt-1.5" style={{ fontSize: '13px', fontWeight: 400, lineHeight: 1.6, color: 'hsl(var(--landing-ink-soft))' }}>
                        {step.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <motion.div className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{ background: GRADIENT, transformOrigin: 'left' }}
                    animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

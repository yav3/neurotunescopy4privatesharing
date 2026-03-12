import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { number: '01', title: 'Feature Annotation', description: 'Music composed to spec — tempo, key, harmony, and spectral parameters defined upfront.' },
  { number: '02', title: 'Therapeutic Mapping', description: 'Clinical classification for anxiety, focus, and pain.' },
  { number: '03', title: 'Personalization', description: 'Adaptive algorithms matched to symptom profiles.' },
  { number: '04', title: 'Session Delivery', description: 'Real-time streaming with biomarker feedback.' },
  { number: '05', title: 'Outcome Reporting', description: 'Structured data for clinical validation.' },
];

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
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background: 'hsl(var(--landing-bg))',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      <div className="relative z-10 container mx-auto px-6 md:px-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-4"
        >
          <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', color: 'hsl(var(--landing-ink-muted))' }}>
            HOW IT WORKS
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
          style={{
            fontSize: 'clamp(26px, 4vw, 40px)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: 'hsl(var(--landing-ink))',
          }}
        >
          Composition to clinical outcomes
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
          style={{ fontSize: '14px', fontWeight: 300, color: 'hsl(var(--landing-ink-soft))' }}
        >
          Five stages from algorithmic composition to validated therapeutic delivery
        </motion.p>

        {/* Progress track */}
        <div className="relative max-w-5xl mx-auto mb-12">
          <div
            className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2"
            style={{ background: 'hsl(var(--landing-track))' }}
          />
          <motion.div
            className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 origin-left rounded-full"
            style={{
              background: 'linear-gradient(90deg, hsl(var(--landing-electric-1)), hsl(var(--landing-electric-2)))',
              boxShadow: '0 0 16px hsl(var(--landing-electric-1) / 0.3)',
            }}
            animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className="relative h-24 md:h-28 flex items-center justify-between max-w-5xl mx-auto px-4">
            {steps.map((_, i) => {
              const isActive = i === activeStep;
              const isPast = i < activeStep;
              return (
                <motion.button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className="relative z-10 rounded-full cursor-pointer"
                  animate={{
                    width: isActive ? 56 : 12,
                    height: isActive ? 56 : 12,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, hsl(var(--landing-electric-1) / 0.28) 0%, hsl(var(--landing-electric-2) / 0.28) 100%)'
                      : isPast
                        ? 'linear-gradient(135deg, hsl(var(--landing-electric-1)), hsl(var(--landing-electric-2)))'
                        : 'linear-gradient(135deg, hsl(var(--landing-electric-1) / 0.18) 0%, hsl(var(--landing-electric-2) / 0.18) 100%)',
                    border: isActive
                      ? '1px solid hsl(var(--landing-border))'
                      : isPast
                        ? '1px solid hsl(var(--landing-electric-1) / 0.6)'
                        : '1px solid hsl(var(--landing-border-soft))',
                    backdropFilter: isActive ? 'blur(20px)' : 'none',
                    boxShadow: isActive
                      ? '0 0 30px hsl(var(--landing-electric-1) / 0.22), inset 0 1px 0 hsl(var(--landing-bg) / 0.65)'
                      : isPast
                        ? '0 0 12px hsl(var(--landing-electric-1) / 0.28)'
                        : 'none',
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        style={{
                          fontSize: '18px',
                          fontWeight: 300,
                          color: 'hsl(var(--landing-ink))',
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {steps[activeStep].number}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Step cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {steps.map((step, i) => {
            const isActive = i === activeStep;
            const isPast = i <= activeStep;

            return (
              <motion.button
                key={step.number}
                onClick={() => setActiveStep(i)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="text-left rounded-2xl p-4 md:p-5 cursor-pointer relative overflow-hidden"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, hsl(var(--landing-electric-1) / 0.3) 0%, hsl(var(--landing-electric-2) / 0.3) 100%)'
                    : 'linear-gradient(135deg, hsl(var(--landing-electric-1) / 0.2) 0%, hsl(var(--landing-electric-2) / 0.2) 100%)',
                  border: isActive
                    ? '1px solid hsl(var(--landing-border))'
                    : '1px solid hsl(var(--landing-border-soft))',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: isActive
                    ? '0 12px 40px -8px hsl(var(--landing-electric-2) / 0.18), inset 0 1px 0 hsl(var(--landing-bg) / 0.75)'
                    : 'inset 0 1px 0 hsl(var(--landing-bg) / 0.45)',
                  transition: 'all 0.4s ease',
                }}
              >
                {/* Glass sheen */}
                <div
                  className="absolute top-0 left-0 w-full h-1/2 rounded-t-2xl pointer-events-none"
                  style={{
                    background: isActive
                      ? 'linear-gradient(180deg, hsl(var(--landing-bg) / 0.55) 0%, transparent 100%)'
                      : 'linear-gradient(180deg, hsl(var(--landing-bg) / 0.35) 0%, transparent 100%)',
                  }}
                />

                {/* Sweep sheen on active */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg, transparent 40%, hsl(var(--landing-electric-1) / 0.14) 50%, transparent 60%)',
                    }}
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                  />
                )}

                <p
                  className="relative transition-colors duration-300 mb-2"
                  style={{
                    fontSize: '13px',
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                    ...(isActive
                      ? {
                          background: 'linear-gradient(135deg, hsl(var(--landing-electric-1)), hsl(var(--landing-electric-2)))',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }
                      : {
                          color: isPast ? 'hsl(var(--landing-ink-soft))' : 'hsl(var(--landing-ink-muted))',
                        }),
                  }}
                >
                  {step.number}
                </p>
                <h3
                  className="relative transition-colors duration-300"
                  style={{
                    fontSize: 'clamp(13px, 1.3vw, 15px)',
                    fontWeight: 400,
                    color: isActive
                      ? 'hsl(215, 25%, 15%)'
                      : isPast
                        ? 'hsl(215, 20%, 25%)'
                        : 'hsl(215, 15%, 50%)',
                  }}
                >
                  {step.title}
                </h3>
                <AnimatePresence>
                  {isActive && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative mt-2 overflow-hidden"
                      style={{
                        fontSize: '12px',
                        fontWeight: 300,
                        lineHeight: 1.6,
                        color: 'hsl(215, 15%, 40%)',
                      }}
                    >
                      {step.description}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Bottom accent */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{
                    background: 'linear-gradient(90deg, #06b6d4, #2563eb)',
                    transformOrigin: 'left',
                  }}
                  animate={{
                    scaleX: isActive ? 1 : 0,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

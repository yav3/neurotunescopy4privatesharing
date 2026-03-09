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
        background: 'transparent',
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
          <span style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.15em', color: 'hsla(0, 0%, 100%, 0.7)' }}>
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
            color: 'hsl(0, 0%, 100%)',
          }}
        >
          Composition to clinical outcomes
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
          style={{ fontSize: '14px', fontWeight: 300, color: 'hsla(0, 0%, 100%, 0.7)' }}
        >
          Five stages from algorithmic composition to validated therapeutic delivery
        </motion.p>

        {/* Progress track */}
        <div className="relative max-w-5xl mx-auto mb-12">
          <div
            className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2"
            style={{ background: 'hsla(0, 0%, 100%, 0.15)' }}
          />
          <motion.div
            className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 origin-left rounded-full"
            style={{
              background: 'linear-gradient(90deg, #06b6d4, #2563eb)',
              boxShadow: '0 0 16px hsla(190, 90%, 55%, 0.35)',
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
                      ? 'hsla(0, 0%, 100%, 0.12)'
                      : isPast
                        ? 'linear-gradient(135deg, #06b6d4, #2563eb)'
                        : 'hsla(0, 0%, 100%, 0.15)',
                    border: isActive
                      ? '1px solid hsla(0, 0%, 100%, 0.3)'
                      : isPast
                        ? '1px solid hsla(190, 70%, 55%, 0.4)'
                        : '1px solid hsla(0, 0%, 100%, 0.15)',
                    backdropFilter: isActive ? 'blur(20px)' : 'none',
                    boxShadow: isActive
                      ? '0 0 30px hsla(190, 80%, 55%, 0.25), inset 0 1px 0 hsla(0, 0%, 100%, 0.1)'
                      : isPast
                        ? '0 0 12px hsla(190, 70%, 50%, 0.3)'
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
                          color: 'hsla(0, 0%, 100%, 0.9)',
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
                    ? 'hsla(0, 0%, 100%, 0.15)'
                    : 'hsla(0, 0%, 100%, 0.06)',
                  border: isActive
                    ? '1px solid hsla(0, 0%, 100%, 0.35)'
                    : '1px solid hsla(0, 0%, 100%, 0.12)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: isActive
                    ? '0 12px 40px -8px hsla(200, 60%, 30%, 0.2), inset 0 1px 0 hsla(0, 0%, 100%, 0.1)'
                    : 'inset 0 1px 0 hsla(0, 0%, 100%, 0.04)',
                  transition: 'all 0.4s ease',
                }}
              >
                {/* Glass sheen */}
                <div
                  className="absolute top-0 left-0 w-full h-1/2 rounded-t-2xl pointer-events-none"
                  style={{
                    background: isActive
                      ? 'linear-gradient(180deg, hsla(0, 0%, 100%, 0.1) 0%, transparent 100%)'
                      : 'linear-gradient(180deg, hsla(0, 0%, 100%, 0.04) 0%, transparent 100%)',
                  }}
                />

                {/* Sweep sheen on active */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg, transparent 40%, hsla(0, 0%, 100%, 0.08) 50%, transparent 60%)',
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
                          background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }
                      : {
                          color: isPast ? 'hsla(0, 0%, 100%, 0.7)' : 'hsla(0, 0%, 100%, 0.4)',
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
                      ? 'hsl(0, 0%, 100%)'
                      : isPast
                        ? 'hsla(0, 0%, 100%, 0.85)'
                        : 'hsla(0, 0%, 100%, 0.5)',
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
                        color: 'hsla(0, 0%, 100%, 0.7)',
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
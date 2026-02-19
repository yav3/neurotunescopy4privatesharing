import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Feature Annotation',
    description: 'Music composed to spec — tempo, key, harmony, and spectral parameters defined upfront.',
  },
  {
    number: '02',
    title: 'Therapeutic Mapping',
    description: 'Clinical classification for anxiety, focus, and pain.',
  },
  {
    number: '03',
    title: 'Personalization',
    description: 'Adaptive algorithms matched to symptom profiles.',
  },
  {
    number: '04',
    title: 'Session Delivery',
    description: 'Real-time streaming with biomarker feedback.',
  },
  {
    number: '05',
    title: 'Outcome Reporting',
    description: 'Structured data for clinical validation.',
  },
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
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 40%, 
            hsla(200, 80%, 50%, 0.06) 0%, 
            transparent 70%
          )`,
        }}
      />

      <div className="relative z-10 container mx-auto px-6 md:px-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-6"
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full"
            style={{
              background: 'hsla(200, 80%, 50%, 0.08)',
              border: '1px solid hsla(200, 80%, 50%, 0.15)',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '0.15em', color: 'hsla(200, 60%, 70%, 0.8)' }}>
              HOW IT WORKS
            </span>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
          style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: 'hsla(0, 0%, 90%, 0.95)',
          }}
        >
          Composition to clinical outcomes
        </motion.h2>

        {/* Sphere track area */}
        <div className="relative max-w-5xl mx-auto mb-10">
          {/* Horizontal track line */}
          <div
            className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2"
            style={{ background: 'hsla(200, 60%, 50%, 0.15)' }}
          />
          {/* Progress fill */}
          <motion.div
            className="absolute top-1/2 left-0 h-px -translate-y-1/2 origin-left"
            style={{ 
              background: 'linear-gradient(90deg, hsl(200, 100%, 50%), hsl(180, 80%, 55%))',
              boxShadow: '0 0 12px hsla(200, 100%, 50%, 0.4)',
            }}
            animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Floating sphere */}
          <div className="relative h-32 md:h-36">
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              animate={{ left: `${(activeStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginLeft: '-40px' }}
            >
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full relative"
                style={{
                  background: `radial-gradient(circle at 38% 38%, 
                    hsla(200, 80%, 70%, 0.3) 0%, 
                    hsla(210, 60%, 40%, 0.2) 60%,
                    hsla(220, 50%, 30%, 0.15) 100%
                  )`,
                  boxShadow: `
                    0 0 40px hsla(200, 100%, 50%, 0.15),
                    0 0 80px hsla(200, 100%, 50%, 0.05),
                    inset 0 1px 0 hsla(200, 80%, 80%, 0.15)
                  `,
                  border: '1px solid hsla(200, 80%, 60%, 0.12)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Highlight */}
                <div
                  className="absolute inset-2 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, 
                      hsla(200, 90%, 80%, 0.2) 0%, 
                      transparent 55%
                    )`,
                  }}
                />
                {/* Step number inside */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeStep}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        fontSize: '24px',
                        fontWeight: 400,
                        color: 'hsla(200, 80%, 70%, 0.9)',
                      }}
                    >
                      {steps[activeStep].number}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Step cards */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-5 gap-2 md:gap-3">
            {steps.map((step, i) => {
              const isActive = i === activeStep;

              return (
                <motion.button
                  key={step.number}
                  onClick={() => setActiveStep(i)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="text-left rounded-xl p-3 md:p-4 transition-all duration-300 cursor-pointer"
                  style={{
                    background: isActive
                      ? 'hsla(200, 80%, 50%, 0.08)'
                      : 'transparent',
                    border: isActive
                      ? '1px solid hsla(200, 80%, 50%, 0.15)'
                      : '1px solid transparent',
                  }}
                >
                  <p
                    className="transition-colors duration-300"
                    style={{
                      fontSize: '13px',
                      fontWeight: 400,
                      letterSpacing: '0.05em',
                      color: isActive
                        ? 'hsl(200, 100%, 60%)'
                        : 'hsla(0, 0%, 100%, 0.35)',
                      marginBottom: '6px',
                    }}
                  >
                    {step.number}
                  </p>
                  <h3
                    className="transition-colors duration-300"
                    style={{
                      fontSize: 'clamp(13px, 1.3vw, 16px)',
                      fontWeight: 400,
                      color: isActive
                        ? 'hsla(0, 0%, 100%, 0.9)'
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
                        className="mt-2 overflow-hidden"
                        style={{
                          fontSize: '13px',
                          fontWeight: 400,
                          lineHeight: 1.5,
                          color: 'hsla(0, 0%, 100%, 0.45)',
                        }}
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

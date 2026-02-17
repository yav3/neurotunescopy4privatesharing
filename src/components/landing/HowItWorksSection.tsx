import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Feature Extraction',
    description: 'Tempo, key, harmony, timbre, and spectral analysis.',
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

  // Sphere position: moves from right (100%) to left (0%) across the step positions
  const sphereXPercent = 100 - (activeStep / (steps.length - 1)) * 100;

  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, 
          hsl(220, 8%, 96%) 0%, 
          hsl(220, 10%, 93%) 100%
        )`,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      <div className="container mx-auto px-6 md:px-12">
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
              background: 'rgba(0, 0, 0, 0.06)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '0.15em', color: 'hsl(220, 20%, 25%)' }}>
              HOW IT WORKS
            </span>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
          style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: 'hsl(220, 30%, 8%)',
          }}
        >
          Composition to clinical outcomes
        </motion.h2>

        {/* Sphere track area */}
        <div className="relative max-w-5xl mx-auto mb-12">
          {/* Horizontal track line */}
          <div
            className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2"
            style={{ background: 'rgba(0, 0, 0, 0.1)' }}
          />
          {/* Progress fill */}
          <motion.div
            className="absolute top-1/2 left-0 h-px -translate-y-1/2 origin-left"
            style={{ background: 'hsl(210, 70%, 50%)' }}
            animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Floating sphere */}
          <div className="relative h-40 md:h-48">
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              animate={{ left: `${(activeStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginLeft: '-48px' }}
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full relative"
                style={{
                  background: `radial-gradient(circle at 38% 38%, 
                    hsl(210, 45%, 88%) 0%, 
                    hsl(210, 40%, 75%) 60%,
                    hsl(210, 35%, 65%) 100%
                  )`,
                  boxShadow: '0 12px 40px rgba(80, 120, 180, 0.25), inset 0 -8px 20px rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                }}
              >
                {/* Highlight */}
                <div
                  className="absolute inset-2 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, 
                      hsla(210, 80%, 96%, 0.7) 0%, 
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
                        fontSize: '28px',
                        fontWeight: 400,
                        color: 'hsl(220, 25%, 18%)',
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

        {/* Step cards carousel */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-5 gap-2 md:gap-4">
            {steps.map((step, i) => {
              const isActive = i === activeStep;
              const isPast = i < activeStep;

              return (
                <motion.button
                  key={step.number}
                  onClick={() => setActiveStep(i)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="text-left rounded-xl p-3 md:p-5 transition-all duration-300 cursor-pointer"
                  style={{
                    background: isActive
                      ? 'rgba(0, 0, 0, 0.07)'
                      : 'transparent',
                    border: isActive
                      ? '1px solid rgba(0, 0, 0, 0.12)'
                      : '1px solid transparent',
                  }}
                >
                  <p
                    className="transition-colors duration-300"
                    style={{
                      fontSize: '12px',
                      fontWeight: 400,
                      letterSpacing: '0.05em',
                      color: isActive
                        ? 'hsl(210, 70%, 45%)'
                        : isPast
                        ? 'hsl(220, 15%, 50%)'
                        : 'hsl(220, 10%, 60%)',
                      marginBottom: '6px',
                    }}
                  >
                    {step.number}
                  </p>
                  <h3
                    className="transition-colors duration-300"
                    style={{
                      fontSize: 'clamp(12px, 1.2vw, 15px)',
                      fontWeight: 400,
                      color: isActive
                        ? 'hsl(220, 30%, 8%)'
                        : isPast
                        ? 'hsl(220, 15%, 30%)'
                        : 'hsl(220, 10%, 45%)',
                      lineHeight: 1.3,
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
                          fontSize: '12px',
                          fontWeight: 400,
                          lineHeight: 1.5,
                          color: 'hsl(220, 15%, 28%)',
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

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const steps = [
  {
    title: 'Audio Feature Extraction',
    description: 'Automated annotation of tempo, key, harmony, timbre, and spectral features across the entire catalog.',
    detail: 'BPM, VAD mapping, spectral centroid',
    completed: false,
  },
  {
    title: 'Therapeutic Classification',
    description: 'Each track is mapped to clinical use cases—anxiety reduction, focus enhancement, pain management—using validated frameworks.',
    detail: 'Evidence-based protocols',
    completed: false,
  },
  {
    title: 'Adaptive Personalization',
    description: 'Real-time selection algorithms match music to individual symptom profiles and listening context.',
    detail: 'Closed-loop optimization',
    completed: false,
  },
  {
    title: 'Session Delivery',
    description: 'Streaming therapeutic sessions with continuous biomarker feedback and outcome tracking.',
    detail: 'Clinical-grade monitoring',
    completed: false,
  },
  {
    title: 'Outcome Reporting',
    description: 'Structured outcome data for clinical validation, population health insights, and regulatory evidence.',
    detail: '',
    completed: false,
  },
];

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative py-28 md:py-36 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, 
          hsl(220, 5%, 95%) 0%, 
          hsl(220, 8%, 92%) 100%
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
          className="flex justify-center mb-8"
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full"
            style={{
              background: 'rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '0.15em', color: 'hsl(220, 10%, 40%)' }}>
              HOW IT WORKS
            </span>
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(210, 80%, 55%)' }} />
              ))}
            </span>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 300,
            letterSpacing: '-0.025em',
            color: 'hsl(220, 20%, 12%)',
          }}
        >
          From composition to clinical outcomes
        </motion.h2>

        {/* Progress bar */}
        <div className="max-w-3xl mx-auto mb-16 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(0, 0, 0, 0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'hsl(210, 80%, 55%)' }}
            animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Left: Steps */}
          <div className="space-y-2">
            {steps.map((step, i) => {
              const isActive = i === activeStep;
              const isDone = i < activeStep;

              return (
                <motion.div
                  key={step.title}
                  className="flex gap-4 cursor-pointer"
                  onClick={() => setActiveStep(i)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                      style={{
                        background: isDone
                          ? 'hsl(210, 70%, 85%)'
                          : isActive
                          ? 'hsl(210, 80%, 55%)'
                          : 'rgba(0, 0, 0, 0.05)',
                        color: isDone || isActive ? 'white' : 'hsl(220, 10%, 50%)',
                      }}
                    >
                      {isDone ? (
                        <Check className="w-4 h-4" strokeWidth={2} />
                      ) : (
                        <span style={{ fontSize: '13px', fontWeight: 400 }}>{String(i + 1).padStart(2, '0')}</span>
                      )}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-px h-full min-h-[32px]" style={{ background: 'rgba(0, 0, 0, 0.08)' }} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-6">
                    <h3
                      className="transition-colors duration-300"
                      style={{
                        fontSize: '17px',
                        fontWeight: isActive ? 400 : 300,
                        color: isActive ? 'hsl(220, 20%, 12%)' : 'hsl(220, 10%, 45%)',
                      }}
                    >
                      {step.title}
                    </h3>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="mt-2" style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.6, color: 'hsl(220, 10%, 40%)' }}>
                            {step.description}
                          </p>
                          {step.detail && (
                            <p className="mt-2" style={{ fontSize: '12px', fontWeight: 400, color: 'hsl(210, 80%, 50%)' }}>
                              {step.detail}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Visual sphere */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              <div
                className="w-72 h-72 rounded-full"
                style={{
                  background: `radial-gradient(circle at 40% 40%, 
                    hsl(210, 80%, 92%) 0%, 
                    hsl(210, 60%, 82%) 50%,
                    hsl(210, 40%, 75%) 100%
                  )`,
                  boxShadow: '0 20px 60px rgba(100, 150, 220, 0.15)',
                }}
              />
              {/* Orbit ring */}
              <div
                className="absolute inset-[-16px] rounded-full"
                style={{
                  border: '2px solid hsl(210, 80%, 55%)',
                  clipPath: `polygon(${50 + 50 * Math.cos(-Math.PI / 4)}% ${50 + 50 * Math.sin(-Math.PI / 4)}%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)`,
                }}
              />
              {/* Counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  key={activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ fontSize: '48px', fontWeight: 300, color: 'hsl(220, 20%, 25%)' }}
                >
                  {String(activeStep + 1).padStart(2, '0')}
                </motion.span>
                <span style={{ fontSize: '12px', fontWeight: 400, color: 'hsl(220, 10%, 50%)', letterSpacing: '0.1em' }}>
                  OF {String(steps.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

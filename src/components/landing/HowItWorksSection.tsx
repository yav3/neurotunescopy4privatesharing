import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { number: '01', title: 'Feature Annotation', description: 'Tempo, key, harmony, and spectral parameters defined upfront.', notation: '𝄞', dynamic: 'pp', instrument: 'Strings' },
  { number: '02', title: 'Therapeutic Mapping', description: 'Clinical classification for anxiety, focus, and pain.', notation: '𝄢', dynamic: 'mp', instrument: 'Winds' },
  { number: '03', title: 'Personalization', description: 'Adaptive algorithms matched to symptom profiles.', notation: '♩', dynamic: 'mf', instrument: 'Brass' },
  { number: '04', title: 'Session Delivery', description: 'Real-time streaming with biomarker feedback.', notation: '♬', dynamic: 'f', instrument: 'Percussion' },
  { number: '05', title: 'Outcome Reporting', description: 'Structured data for clinical validation.', notation: '𝄐', dynamic: 'ff', instrument: 'Tutti' },
];

const GRADIENT = 'linear-gradient(135deg, hsl(var(--landing-electric-1)), hsl(var(--landing-electric-2)))';

// Staff line positions (5 lines of a musical staff)
const STAFF_LINES = [0, 1, 2, 3, 4];

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [playheadProgress, setPlayheadProgress] = useState(0);

  useEffect(() => {
    const STEP_DURATION = 3500;
    let startTime = Date.now();

    const frame = () => {
      const elapsed = Date.now() - startTime;
      const stepProgress = (elapsed % STEP_DURATION) / STEP_DURATION;
      const currentStep = Math.floor((elapsed / STEP_DURATION)) % steps.length;

      setActiveStep(currentStep);
      // Overall progress across all steps
      const overallProgress = (currentStep + stepProgress) / steps.length;
      setPlayheadProgress(overallProgress);

      animId = requestAnimationFrame(frame);
    };

    let animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative py-16 md:py-28 overflow-hidden"
      style={{ background: 'hsl(var(--landing-bg))', fontFamily: 'var(--font-sf)' }}
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 max-w-5xl">
        {/* Header with orchestration styling */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mb-2"
        >
          <div className="h-px w-8" style={{ background: GRADIENT, opacity: 0.3 }} />
          <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', color: 'hsl(var(--landing-ink-muted))' }}>
            ORCHESTRATION
          </p>
          <div className="h-px w-8" style={{ background: GRADIENT, opacity: 0.3 }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
          style={{ fontSize: 'clamp(22px, 4vw, 38px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'hsl(var(--landing-ink))' }}
        >
          Composition to clinical outcomes
        </motion.h2>

        {/* Musical score container */}
        <div className="relative max-w-3xl mx-auto">

          {/* Staff lines SVG background */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            style={{ opacity: 0.08 }}
          >
            {STAFF_LINES.map((line) => {
              const y = `${18 + line * 16}%`;
              return (
                <line
                  key={line}
                  x1="0"
                  y1={y}
                  x2="100%"
                  y2={y}
                  stroke="hsl(var(--landing-electric-1))"
                  strokeWidth="1"
                />
              );
            })}
          </svg>

          {/* Animated playhead */}
          <motion.div
            className="absolute top-0 bottom-0 w-px z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, hsl(var(--landing-electric-1)) 20%, hsl(var(--landing-electric-2)) 80%, transparent 100%)',
              left: `${playheadProgress * 100}%`,
              opacity: 0.5,
            }}
          />

          {/* Tempo & time signature header */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-baseline gap-6 mb-8 pl-2"
          >
            <span style={{ fontSize: '28px', fontWeight: 300, color: 'hsl(var(--landing-ink-muted))', opacity: 0.4 }}>
              𝄞
            </span>
            <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', color: 'hsl(var(--landing-ink-muted))', opacity: 0.5 }}>
              ♩= 72 BPM
            </span>
            <span style={{ fontSize: '10px', fontWeight: 400, color: 'hsl(var(--landing-ink-muted))', opacity: 0.4 }}>
              4/4
            </span>
            <span className="ml-auto" style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.05em', color: 'hsl(var(--landing-ink-muted))', opacity: 0.4 }}>
              Andante con moto
            </span>
          </motion.div>

          {/* Steps as orchestral parts */}
          <div className="space-y-1">
            {steps.map((step, i) => {
              const isActive = i === activeStep;
              const isPast = i < activeStep;

              return (
                <motion.button
                  key={step.number}
                  onClick={() => setActiveStep(i)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full text-left relative cursor-pointer group"
                  style={{ padding: '14px 0' }}
                >
                  <div className="flex items-start gap-0">
                    {/* Instrument label (left margin like a score) */}
                    <div
                      className="shrink-0 text-right pr-4"
                      style={{
                        width: '72px',
                        fontSize: '9px',
                        fontWeight: 500,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: isActive ? 'hsl(var(--landing-electric-1))' : 'hsl(var(--landing-ink-muted))',
                        opacity: isActive ? 1 : 0.4,
                        transition: 'all 0.4s ease',
                        paddingTop: '4px',
                      }}
                    >
                      {step.instrument}
                    </div>

                    {/* Vertical barline */}
                    <div
                      className="shrink-0 self-stretch"
                      style={{
                        width: '1px',
                        background: isActive
                          ? 'hsl(var(--landing-electric-1))'
                          : 'hsl(var(--landing-ink-muted))',
                        opacity: isActive ? 0.6 : 0.12,
                        transition: 'all 0.4s ease',
                      }}
                    />

                    {/* Dynamic marking */}
                    <div
                      className="shrink-0 flex items-center justify-center"
                      style={{
                        width: '36px',
                        fontSize: '11px',
                        fontStyle: 'italic',
                        fontWeight: 400,
                        color: isActive ? 'hsl(var(--landing-electric-1))' : 'hsl(var(--landing-ink-muted))',
                        opacity: isActive ? 0.9 : 0.3,
                        transition: 'all 0.4s ease',
                        paddingTop: '3px',
                      }}
                    >
                      {step.dynamic}
                    </div>

                    {/* Main content area */}
                    <div
                      className="flex-1 min-w-0 rounded-xl px-5 py-3 relative overflow-hidden"
                      style={{
                        background: isActive ? 'hsl(var(--landing-electric-1) / 0.05)' : 'transparent',
                        border: isActive ? '1px solid hsl(var(--landing-electric-1) / 0.15)' : '1px solid transparent',
                        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      <div className="flex items-baseline gap-3">
                        {/* Measure number */}
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 400,
                            fontVariantNumeric: 'tabular-nums',
                            ...(isActive
                              ? { background: GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                              : { color: 'hsl(var(--landing-ink-muted))', opacity: isPast ? 0.5 : 0.7 }),
                            transition: 'opacity 0.3s',
                          }}
                        >
                          {step.number}
                        </span>

                        {/* Musical notation symbol */}
                        <motion.span
                          animate={{
                            scale: isActive ? [1, 1.15, 1] : 1,
                            opacity: isActive ? 1 : 0.3,
                          }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          style={{
                            fontSize: '16px',
                            color: isActive ? 'hsl(var(--landing-electric-1))' : 'hsl(var(--landing-ink-muted))',
                          }}
                        >
                          {step.notation}
                        </motion.span>

                        <h3 style={{
                          fontSize: '15px',
                          fontWeight: isActive ? 500 : 400,
                          color: isActive ? 'hsl(var(--landing-ink))' : isPast ? 'hsl(var(--landing-ink-soft))' : 'hsl(var(--landing-ink-soft))',
                          transition: 'all 0.3s',
                        }}>
                          {step.title}
                        </h3>
                      </div>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <p
                              className="mt-2 pl-[52px]"
                              style={{
                                fontSize: '13px',
                                fontWeight: 400,
                                lineHeight: 1.6,
                                color: 'hsl(var(--landing-ink-soft))',
                              }}
                            >
                              {step.description}
                            </p>

                            {/* Mini waveform visualization for active step */}
                            <div className="mt-3 pl-[52px]">
                              <svg width="120" height="20" viewBox="0 0 120 20" style={{ opacity: 0.4 }}>
                                <motion.path
                                  d="M0,10 Q5,2 10,10 Q15,18 20,10 Q25,2 30,10 Q35,18 40,10 Q45,2 50,10 Q55,18 60,10 Q65,2 70,10 Q75,18 80,10 Q85,2 90,10 Q95,18 100,10 Q105,2 110,10 Q115,18 120,10"
                                  fill="none"
                                  stroke="url(#howGrad)"
                                  strokeWidth="1.5"
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 1.2, ease: 'easeOut' }}
                                />
                                <defs>
                                  <linearGradient id="howGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="hsl(var(--landing-electric-1))" />
                                    <stop offset="100%" stopColor="hsl(var(--landing-electric-2))" />
                                  </linearGradient>
                                </defs>
                              </svg>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Crescendo bar (progress within step) */}
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-0 h-[1px]"
                          style={{ background: GRADIENT }}
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 3.5, ease: 'linear' }}
                          key={`progress-${activeStep}`}
                        />
                      )}
                    </div>

                    {/* Rehearsal mark (right side) */}
                    <div
                      className="shrink-0 flex items-center justify-center"
                      style={{
                        width: '28px',
                        paddingTop: '3px',
                      }}
                    >
                      {isPast && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: GRADIENT, opacity: 0.4 }}
                        />
                      )}
                      {isActive && (
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-2 h-2 rounded-full"
                          style={{ background: GRADIENT }}
                        />
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Bottom double barline */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1 mt-6 ml-[72px]"
          >
            <div className="h-6" style={{ width: '1px', background: 'hsl(var(--landing-ink-muted))', opacity: 0.15 }} />
            <div className="h-6" style={{ width: '2px', background: 'hsl(var(--landing-ink-muted))', opacity: 0.15 }} />
            <span className="ml-3" style={{ fontSize: '9px', fontWeight: 400, fontStyle: 'italic', color: 'hsl(var(--landing-ink-muted))', opacity: 0.35 }}>
              Fine
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

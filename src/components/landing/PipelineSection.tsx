import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Zap, Target, BarChart3 } from 'lucide-react';

const steps = [
  { number: 1, icon: Music, title: 'Compose', description: 'Algorithmic composition' },
  { number: 2, icon: Zap, title: 'Annotate', description: 'Feature extraction' },
  { number: 3, icon: Target, title: 'Classify', description: 'Therapeutic mapping' },
  { number: 4, icon: BarChart3, title: 'Deliver', description: 'Adaptive playback' },
];

const stageOutputs = [
  { label: 'Generating', detail: '120 BPM · C major · 4/4', color: 'hsl(210, 80%, 60%)' },
  { label: 'Extracting', detail: 'Tempo · Key · Spectral centroid', color: 'hsl(180, 60%, 55%)' },
  { label: 'Mapping', detail: 'Focus & Concentration → 89%', color: 'hsl(150, 60%, 50%)' },
  { label: 'Delivering', detail: 'Adaptive session · 25 min', color: 'hsl(45, 70%, 55%)' },
];

/* ── Animated flowing particle ── */
const FlowParticle: React.FC<{ activeStep: number; total: number }> = ({ activeStep, total }) => {
  const progress = (activeStep + 1) / total;
  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
      style={{
        background: 'hsl(210, 80%, 60%)',
        boxShadow: '0 0 12px hsla(210, 80%, 60%, 0.6), 0 0 24px hsla(210, 80%, 60%, 0.3)',
      }}
      animate={{ left: `${progress * 100}%` }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    />
  );
};

/* ── Waveform mini-visualization ── */
const MiniWaveform: React.FC<{ active: boolean }> = ({ active }) => {
  const bars = 16;
  return (
    <div className="flex items-end gap-[2px] h-6">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[2px] rounded-full"
          style={{ background: 'hsl(210, 70%, 55%)' }}
          animate={{
            height: active
              ? [4, 8 + Math.sin(i * 0.8) * 12, 4]
              : 3,
            opacity: active ? [0.3, 0.8, 0.3] : 0.15,
          }}
          transition={{
            duration: 1.2 + (i % 3) * 0.2,
            repeat: Infinity,
            delay: i * 0.05,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export const PipelineSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative py-20 md:py-24 overflow-hidden"
      style={{
        background: 'transparent',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-2"
          style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.15em', color: 'hsl(0, 0%, 50%)' }}
        >
          COMPOSITION ENGINE
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-2"
          style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'hsl(0, 0%, 89%)' }}
        >
          Algorithmic music pipeline
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
          style={{ fontSize: '14px', fontWeight: 300, color: 'hsl(0, 0%, 55%)' }}
        >
          From patented composition to adaptive therapeutic delivery
        </motion.p>

        {/* Pipeline step cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === activeStep;
            const isPast = i < activeStep;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.04, y: -2 }}
                onHoverStart={() => setActiveStep(i)}
                className="relative rounded-xl p-5 cursor-pointer"
                style={{
                  background: isActive ? 'hsla(210, 60%, 45%, 0.1)' : 'hsla(220, 20%, 12%, 0.4)',
                  border: isActive ? '1px solid hsla(210, 60%, 50%, 0.2)' : '1px solid hsla(0, 0%, 100%, 0.06)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: isActive ? '0 0 24px hsla(210, 70%, 50%, 0.08), inset 0 1px 0 hsla(210, 60%, 70%, 0.06)' : 'none',
                  transition: 'background 0.5s, border 0.5s, box-shadow 0.5s',
                }}
              >
                <motion.div
                  animate={isActive ? { scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] } : { scale: 1, opacity: isPast ? 0.8 : 0.5 }}
                  transition={isActive ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
                >
                  <Icon
                    className="w-6 h-6 mb-3"
                    strokeWidth={1.2}
                    style={{ color: isActive ? 'hsl(210, 80%, 60%)' : isPast ? 'hsl(210, 40%, 55%)' : 'hsl(0, 0%, 50%)' }}
                  />
                </motion.div>
                <h3 style={{ fontSize: '15px', fontWeight: 400, color: isActive ? 'hsl(0, 0%, 95%)' : 'hsl(0, 0%, 72%)', marginBottom: '2px', transition: 'color 0.4s' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '12px', fontWeight: 300, color: isActive ? 'hsl(0, 0%, 60%)' : 'hsl(0, 0%, 42%)', transition: 'color 0.4s' }}>
                  {step.description}
                </p>

                {i < steps.length - 1 && (
                  <motion.span
                    className="hidden lg:block absolute top-1/2 -right-2.5"
                    style={{ fontSize: '12px' }}
                    animate={{
                      color: isActive ? 'hsl(210, 60%, 55%)' : 'hsl(0, 0%, 28%)',
                      x: isActive ? [0, 3, 0] : 0,
                    }}
                    transition={isActive ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
                  >
                    →
                  </motion.span>
                )}

                <motion.div
                  className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                  style={{ background: 'hsl(210, 80%, 55%)' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isActive ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* ── Live Pipeline Demo ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-5 md:p-6 mb-6"
          style={{
            background: 'hsla(220, 20%, 8%, 0.6)',
            border: '1px solid hsla(0, 0%, 100%, 0.06)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Progress track */}
          <div className="relative h-1 rounded-full mb-5 overflow-hidden" style={{ background: 'hsla(0, 0%, 100%, 0.06)' }}>
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: 'linear-gradient(90deg, hsl(210, 80%, 55%), hsl(180, 60%, 55%))' }}
              animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Glow dot at leading edge */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
              style={{
                background: 'hsl(210, 80%, 60%)',
                boxShadow: '0 0 10px hsla(210, 80%, 60%, 0.5), 0 0 20px hsla(210, 80%, 60%, 0.25)',
              }}
              animate={{ left: `calc(${((activeStep + 1) / steps.length) * 100}% - 6px)` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* Stage output content */}
          <div className="flex items-center gap-6 min-h-[48px]">
            {/* Mini waveform */}
            <div className="hidden sm:block">
              <MiniWaveform active={activeStep === 0} />
            </div>

            {/* Output text */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: stageOutputs[activeStep].color }}
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span style={{ fontSize: '10px', letterSpacing: '0.1em', fontWeight: 400, color: stageOutputs[activeStep].color }}>
                      {stageOutputs[activeStep].label.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: 300, color: 'hsl(0, 0%, 80%)' }}>
                    {stageOutputs[activeStep].detail}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Step counter */}
            <div className="text-right">
              <span style={{ fontSize: '22px', fontWeight: 300, color: 'hsl(0, 0%, 85%)' }}>
                0{activeStep + 1}
              </span>
              <span style={{ fontSize: '13px', color: 'hsl(0, 0%, 35%)' }}> / 04</span>
            </div>
          </div>

          {/* Stage dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {steps.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveStep(i)}
                className="w-2 h-2 rounded-full cursor-pointer"
                animate={{
                  background: i === activeStep ? 'hsl(210, 80%, 60%)' : i < activeStep ? 'hsl(210, 40%, 45%)' : 'hsl(0, 0%, 25%)',
                  scale: i === activeStep ? 1.3 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Two compact info rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl p-5 cursor-default"
            style={{ background: 'hsla(220, 20%, 12%, 0.4)', border: '1px solid hsla(0, 0%, 100%, 0.06)', backdropFilter: 'blur(12px)' }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: 400, color: 'hsl(0, 0%, 89%)', marginBottom: '10px' }}>
              Why algorithmic composition
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Precision dosing', 'Reproducible', 'Scalable', 'Evidence-based'].map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  whileHover={{ scale: 1.08, borderColor: 'hsla(210, 60%, 50%, 0.2)' }}
                  className="px-2.5 py-1 rounded-full"
                  style={{
                    fontSize: '11px',
                    background: 'hsla(220, 20%, 14%, 0.5)',
                    border: '1px solid hsla(0, 0%, 100%, 0.06)',
                    color: 'hsl(0, 0%, 65%)',
                    fontWeight: 400,
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl p-5 cursor-default"
            style={{ background: 'hsla(220, 20%, 12%, 0.4)', border: '1px solid hsla(0, 0%, 100%, 0.06)', backdropFilter: 'blur(12px)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <h3 style={{ fontSize: '14px', fontWeight: 400, color: 'hsl(0, 0%, 89%)' }}>
                Feature annotation
              </h3>
              <motion.span
                className="px-2 py-0.5 rounded text-[9px]"
                style={{ background: 'hsl(150, 60%, 40%)', color: 'hsl(0, 0%, 96%)' }}
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                LIVE
              </motion.span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Signal Processing', count: 24 },
                { label: 'Neural Networks', count: 18 },
                { label: 'Statistical Models', count: 15 },
              ].map((method, i) => (
                <motion.span
                  key={method.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.45 + i * 0.06 }}
                  whileHover={{ scale: 1.08, borderColor: 'hsla(210, 60%, 50%, 0.2)' }}
                  className="px-2.5 py-1 rounded-full flex items-center gap-1.5"
                  style={{
                    fontSize: '11px',
                    background: 'hsla(220, 20%, 14%, 0.5)',
                    border: '1px solid hsla(0, 0%, 100%, 0.06)',
                    color: 'hsl(0, 0%, 65%)',
                    fontWeight: 400,
                  }}
                >
                  {method.label}
                  <span style={{ color: 'hsl(210, 80%, 60%)' }}>{method.count}</span>
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

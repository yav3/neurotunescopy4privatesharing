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
  { label: 'Generating', detail: '120 BPM · C major · 4/4' },
  { label: 'Extracting', detail: 'Tempo · Key · Spectral centroid' },
  { label: 'Mapping', detail: 'Focus & Concentration → 89%' },
  { label: 'Delivering', detail: 'Adaptive session · 25 min' },
];

/* ── Waveform mini-visualization ── */
const MiniWaveform: React.FC<{ active: boolean }> = ({ active }) => (
  <div className="flex items-end gap-[2px] h-6">
    {Array.from({ length: 16 }).map((_, i) => (
      <motion.div
        key={i}
        className="w-[2px] rounded-full"
        style={{ background: 'hsl(210, 60%, 65%)' }}
        animate={{
          height: active ? [4, 8 + Math.sin(i * 0.8) * 12, 4] : 3,
          opacity: active ? [0.4, 0.9, 0.4] : 0.2,
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
      id="technology"
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
          style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.15em', color: 'hsl(210, 60%, 65%)' }}
        >
          COMPOSITION ENGINE
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-2"
          style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Algorithmic music pipeline
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-14"
          style={{ fontSize: '14px', fontWeight: 300, color: 'hsl(215, 25%, 50%)' }}
        >
          From patented composition to adaptive therapeutic delivery
        </motion.p>

        {/* Pipeline step cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                whileHover={{ y: -3 }}
                onHoverStart={() => setActiveStep(i)}
                className="relative rounded-2xl p-5 cursor-pointer overflow-hidden group"
                style={{
                  background: isActive
                    ? 'hsla(0, 0%, 100%, 0.06)'
                    : 'hsla(0, 0%, 100%, 0.03)',
                  border: isActive
                    ? '1px solid hsla(210, 70%, 60%, 0.35)'
                    : '1px solid hsla(0, 0%, 100%, 0.07)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  transition: 'all 0.4s ease',
                }}
              >
                {/* Active glow behind card */}
                {isActive && (
                  <motion.div
                    className="absolute -inset-[1px] rounded-2xl pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, hsla(210, 80%, 55%, 0.12), transparent 60%)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                )}

                {/* Top-left glass sheen */}
                <div
                  className="absolute top-0 left-0 w-full h-1/2 rounded-t-2xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, hsla(0, 0%, 100%, 0.04) 0%, transparent 100%)',
                  }}
                />

                {/* Step number */}
                <div className="relative flex items-center justify-between mb-4">
                  <motion.div
                    animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={isActive ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
                  >
                    <Icon
                      className="w-5 h-5"
                      strokeWidth={1.5}
                      style={{
                        color: isActive ? 'hsl(205, 85%, 55%)' : 'hsl(215, 40%, 55%)',
                        filter: isActive ? 'drop-shadow(0 0 8px hsla(210, 80%, 65%, 0.5))' : 'none',
                        transition: 'color 0.4s, filter 0.4s',
                      }}
                    />
                  </motion.div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 400,
                      color: isActive ? 'hsl(210, 60%, 50%)' : 'hsl(215, 25%, 55%)',
                      fontVariantNumeric: 'tabular-nums',
                      transition: 'color 0.4s',
                    }}
                  >
                    0{step.number}
                  </span>
                </div>

                <h3
                  className="relative"
                  style={{
                    fontSize: '16px',
                    fontWeight: 400,
                    marginBottom: '4px',
                    transition: 'color 0.4s',
                    ...(isActive
                      ? { background: 'linear-gradient(135deg, #06b6d4, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                      : { color: 'hsl(215, 30%, 40%)' }),
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="relative"
                  style={{
                    fontSize: '12px',
                    fontWeight: 300,
                    color: isActive ? 'hsl(215, 25%, 45%)' : 'hsl(215, 15%, 55%)',
                    transition: 'color 0.4s',
                  }}
                >
                  {step.description}
                </p>

                {/* Bottom accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{
                    background: 'linear-gradient(90deg, hsl(210, 80%, 55%), hsl(200, 85%, 60%))',
                    transformOrigin: 'left',
                  }}
                  animate={{
                    scaleX: isActive ? 1 : isPast ? 0.6 : 0,
                    opacity: isActive ? 1 : isPast ? 0.3 : 0,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* ── Connecting progress line ── */}
        <div className="hidden lg:flex items-center justify-center gap-1 mb-6">
          {steps.map((_, i) => (
            <React.Fragment key={i}>
              <motion.div
                className="w-2 h-2 rounded-full"
                animate={{
                  background: i <= activeStep ? 'hsl(210, 70%, 60%)' : 'hsl(0, 0%, 20%)',
                  boxShadow: i === activeStep ? '0 0 10px hsla(210, 80%, 60%, 0.5)' : '0 0 0 transparent',
                  scale: i === activeStep ? 1.3 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
              {i < steps.length - 1 && (
                <motion.div
                  className="h-[1px] flex-1 max-w-[60px]"
                  animate={{
                    background: i < activeStep
                      ? 'hsl(210, 60%, 50%)'
                      : 'hsl(0, 0%, 15%)',
                  }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Live Pipeline Demo ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-5 md:p-6 mb-6"
          style={{
            background: 'hsla(0, 0%, 100%, 0.03)',
            border: '1px solid hsla(0, 0%, 100%, 0.06)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {/* Progress track */}
          <div className="relative h-[3px] rounded-full mb-6 overflow-hidden" style={{ background: 'hsla(0, 0%, 100%, 0.06)' }}>
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: 'linear-gradient(90deg, hsl(210, 70%, 50%), hsl(200, 70%, 55%))' }}
              animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* Stage output content */}
          <div className="flex items-center gap-6 min-h-[48px]">
            <div className="hidden sm:block">
              <MiniWaveform active={activeStep === 0} />
            </div>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: 'hsl(210, 70%, 55%)' }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                    <span style={{ fontSize: '10px', letterSpacing: '0.12em', fontWeight: 500, color: 'hsl(205, 65%, 50%)' }}>
                      {stageOutputs[activeStep].label.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 300, color: 'hsl(215, 25%, 40%)' }}>
                    {stageOutputs[activeStep].detail}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="text-right">
              <span style={{ fontSize: '24px', fontWeight: 300, fontVariantNumeric: 'tabular-nums', background: 'linear-gradient(135deg, #06b6d4, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                0{activeStep + 1}
              </span>
              <span style={{ fontSize: '13px', color: 'hsl(215, 20%, 55%)' }}> / 04</span>
            </div>
          </div>
        </motion.div>

        {/* Two compact info rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl p-5 cursor-default"
            style={{
              background: 'hsla(0, 0%, 100%, 0.03)',
              border: '1px solid hsla(0, 0%, 100%, 0.06)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: 400, color: 'hsl(215, 30%, 35%)', marginBottom: '12px' }}>
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
                  className="px-3 py-1.5 rounded-full"
                  style={{
                    fontSize: '12px',
                    background: 'hsla(0, 0%, 100%, 0.05)',
                    border: '1px solid hsla(0, 0%, 100%, 0.08)',
                    color: 'hsl(215, 25%, 45%)',
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
            className="rounded-2xl p-5 cursor-default"
            style={{
              background: 'hsla(0, 0%, 100%, 0.03)',
              border: '1px solid hsla(0, 0%, 100%, 0.06)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <h3 style={{ fontSize: '14px', fontWeight: 400, color: 'hsl(215, 30%, 35%)' }}>
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
                  className="px-3 py-1.5 rounded-full flex items-center gap-1.5"
                  style={{
                    fontSize: '12px',
                    background: 'hsla(0, 0%, 100%, 0.05)',
                    border: '1px solid hsla(0, 0%, 100%, 0.08)',
                    color: 'hsl(215, 25%, 45%)',
                    fontWeight: 400,
                  }}
                >
                  {method.label}
                  <span style={{ color: 'hsl(210, 60%, 65%)' }}>{method.count}</span>
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

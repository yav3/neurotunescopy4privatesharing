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

const MiniWaveform: React.FC<{ active: boolean }> = ({ active }) => (
  <div className="flex items-end gap-[3px] h-10">
    {Array.from({ length: 24 }).map((_, i) => (
      <motion.div
        key={i}
        className="w-[3px] rounded-full"
        style={{ background: 'linear-gradient(to top, #06b6d4, #2563eb)' }}
        animate={{
          height: active
            ? [4, 12 + Math.sin(i * 0.7) * 22, 4]
            : [3, 6 + Math.sin(i * 0.5) * 8, 3],
          opacity: active ? [0.6, 1, 0.6] : [0.25, 0.5, 0.25],
        }}
        transition={{
          duration: active ? 0.8 + (i % 4) * 0.15 : 1.6 + (i % 3) * 0.3,
          repeat: Infinity,
          delay: i * 0.04,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

/* Liquid glass tokens — translucent white with cyan/blue tints */
const GLASS = {
  background: 'hsla(200, 60%, 97%, 0.65)',
  border: '1px solid hsla(200, 70%, 85%, 0.5)',
  backdropFilter: 'blur(24px) saturate(1.6)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
  boxShadow: '0 2px 16px hsla(200, 80%, 55%, 0.06), inset 0 1px 0 hsla(0, 0%, 100%, 0.7), inset 0 -1px 0 hsla(200, 60%, 80%, 0.15)',
} as const;

const GLASS_ACTIVE = {
  background: 'hsla(200, 70%, 97%, 0.8)',
  border: '1px solid hsla(195, 80%, 75%, 0.6)',
  backdropFilter: 'blur(32px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
  boxShadow: '0 8px 32px hsla(195, 90%, 50%, 0.1), 0 1px 3px hsla(195, 80%, 50%, 0.06), inset 0 1px 0 hsla(0, 0%, 100%, 0.85), inset 0 -1px 0 hsla(200, 60%, 80%, 0.2)',
} as const;

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
      className="relative py-20 md:py-28 overflow-hidden"
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
          style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', color: 'hsl(205, 50%, 30%)' }}
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
            fontSize: 'clamp(24px, 4vw, 38px)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: 'hsl(205, 45%, 18%)',
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
          style={{ fontSize: '14px', fontWeight: 300, color: 'hsl(200, 35%, 35%)' }}
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
                whileHover={{ y: -4, scale: 1.02 }}
                onHoverStart={() => setActiveStep(i)}
                className="relative rounded-2xl p-5 cursor-pointer overflow-hidden"
                style={{
                  ...(isActive ? GLASS_ACTIVE : GLASS),
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Top highlight */}
                <div
                  className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
                  style={{
                    background: isActive
                      ? 'linear-gradient(90deg, transparent, hsla(195, 80%, 85%, 0.6), transparent)'
                      : 'linear-gradient(90deg, transparent, hsla(200, 60%, 90%, 0.4), transparent)',
                  }}
                />

                {/* Interior glass sheen */}
                <div
                  className="absolute top-0 left-0 w-full h-1/2 rounded-t-2xl pointer-events-none"
                  style={{
                    background: isActive
                      ? 'linear-gradient(180deg, hsla(195, 80%, 98%, 0.5) 0%, transparent 100%)'
                      : 'linear-gradient(180deg, hsla(200, 60%, 97%, 0.3) 0%, transparent 100%)',
                  }}
                />

                {/* Sweep shimmer on active */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg, transparent 35%, hsla(195, 90%, 90%, 0.35) 50%, transparent 65%)',
                    }}
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 1.8, ease: 'easeInOut' }}
                  />
                )}

                {/* Step header */}
                <div className="relative flex items-center justify-between mb-4">
                  <motion.div
                    animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={isActive ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : {}}
                  >
                    <Icon
                      className="w-5 h-5"
                      strokeWidth={1.5}
                      style={{
                        color: isActive ? 'hsl(192, 85%, 35%)' : 'hsl(200, 30%, 45%)',
                        filter: isActive ? 'drop-shadow(0 0 6px hsla(192, 80%, 50%, 0.4))' : 'none',
                        transition: 'all 0.4s',
                      }}
                    />
                  </motion.div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 400,
                      color: isActive ? 'hsl(192, 70%, 30%)' : 'hsl(200, 25%, 50%)',
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
                    transition: 'all 0.4s',
                    ...(isActive
                      ? { background: 'linear-gradient(135deg, #06b6d4, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                      : { color: 'hsl(205, 35%, 22%)' }),
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="relative"
                  style={{
                    fontSize: '12px',
                    fontWeight: 300,
                    color: isActive ? 'hsl(200, 35%, 28%)' : 'hsl(200, 20%, 42%)',
                    transition: 'color 0.4s',
                  }}
                >
                  {step.description}
                </p>

                {/* Bottom accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl"
                  style={{
                    background: 'linear-gradient(90deg, #06b6d4, #2563eb)',
                    transformOrigin: 'left',
                  }}
                  animate={{
                    scaleX: isActive ? 1 : isPast ? 0.5 : 0,
                    opacity: isActive ? 1 : isPast ? 0.35 : 0,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Progress dots */}
        <div className="hidden lg:flex items-center justify-center gap-1 mb-6">
          {steps.map((_, i) => (
            <React.Fragment key={i}>
              <motion.div
                className="rounded-full"
                animate={{
                  width: i === activeStep ? 10 : 6,
                  height: i === activeStep ? 10 : 6,
                  background: i <= activeStep
                    ? 'linear-gradient(135deg, #06b6d4, #2563eb)'
                    : 'hsla(200, 50%, 82%, 0.4)',
                  boxShadow: i === activeStep ? '0 0 12px hsla(192, 80%, 50%, 0.5)' : '0 0 0 transparent',
                }}
                transition={{ duration: 0.4 }}
              />
              {i < steps.length - 1 && (
                <motion.div
                  className="h-[2px] flex-1 max-w-[60px] rounded-full"
                  animate={{
                    background: i < activeStep
                      ? 'linear-gradient(90deg, #06b6d4, #2563eb)'
                      : 'hsla(200, 50%, 82%, 0.3)',
                  }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Live Pipeline Demo — glass panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="relative rounded-2xl p-5 md:p-6 mb-6 overflow-hidden"
          style={{
            ...GLASS,
            background: 'hsla(200, 70%, 97%, 0.7)',
          }}
        >
          {/* Top refraction */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 10%, hsla(195, 80%, 88%, 0.5) 50%, transparent 90%)' }}
          />

          {/* Progress track */}
          <div className="relative h-[3px] rounded-full mb-6 overflow-hidden" style={{ background: 'hsla(200, 60%, 85%, 0.4)' }}>
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #06b6d4, #2563eb)',
                boxShadow: '0 0 8px hsla(192, 80%, 50%, 0.4)',
              }}
              animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* Stage output */}
          <div className="relative flex items-center gap-6 min-h-[56px]">
            <div>
              <MiniWaveform active={true} />
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
                      style={{ background: 'hsl(160, 70%, 42%)' }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                    <span style={{ fontSize: '10px', letterSpacing: '0.12em', fontWeight: 600, color: 'hsl(160, 55%, 32%)' }}>
                      {stageOutputs[activeStep].label.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 300, color: 'hsl(205, 40%, 20%)' }}>
                    {stageOutputs[activeStep].detail}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="text-right">
              <span style={{
                fontSize: '28px',
                fontWeight: 300,
                fontVariantNumeric: 'tabular-nums',
                background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                0{activeStep + 1}
              </span>
              <span style={{ fontSize: '13px', color: 'hsl(200, 25%, 45%)' }}> / 04</span>
            </div>
          </div>
        </motion.div>

        {/* Two info panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative rounded-2xl p-5 cursor-default overflow-hidden"
            style={GLASS}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent 10%, hsla(195, 70%, 88%, 0.4) 50%, transparent 90%)' }}
            />
            <h3 style={{ fontSize: '14px', fontWeight: 400, color: 'hsl(205, 40%, 20%)', marginBottom: '12px' }}>
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
                    background: 'hsla(210, 40%, 94%, 0.6)',
                    border: '1px solid hsla(210, 50%, 85%, 0.6)',
                    color: 'hsl(200, 40%, 25%)',
                    fontWeight: 400,
                    boxShadow: '0 1px 4px hsla(200, 40%, 50%, 0.08)',
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
            className="relative rounded-2xl p-5 cursor-default overflow-hidden"
            style={GLASS}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent 10%, hsla(210, 50%, 88%, 0.5) 50%, transparent 90%)' }}
            />
            <div className="flex items-center gap-2 mb-3">
              <h3 style={{ fontSize: '14px', fontWeight: 400, color: 'hsl(205, 40%, 20%)' }}>
                Feature annotation
              </h3>
              <motion.span
                className="px-2.5 py-0.5 rounded-full text-[9px] font-medium tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, hsl(160, 70%, 42%), hsl(170, 65%, 38%))',
                  color: 'hsl(0, 0%, 100%)',
                  boxShadow: '0 0 8px hsla(160, 70%, 42%, 0.3)',
                }}
                animate={{ opacity: [1, 0.7, 1] }}
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
                    background: 'hsla(210, 40%, 94%, 0.6)',
                    border: '1px solid hsla(210, 50%, 85%, 0.6)',
                    color: 'hsl(200, 40%, 25%)',
                    fontWeight: 400,
                    boxShadow: '0 1px 4px hsla(200, 40%, 50%, 0.08)',
                  }}
                >
                  {method.label}
                  <span style={{
                    background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 500,
                  }}>{method.count}</span>
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
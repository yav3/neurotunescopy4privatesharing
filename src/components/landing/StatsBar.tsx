import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '8,000+', label: 'purpose-composed tracks' },
  { value: '52', label: 'genres covered' },
  { value: '8', label: 'languages supported' },
  { value: '15,000+', label: 'studies informing our music' },
  { value: '2', label: 'granted patents' },
];

export const StatsBar: React.FC = () => {
  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background: 'transparent',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Glass container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl p-8 md:p-10 overflow-hidden"
          style={{
            background: 'hsla(0, 0%, 100%, 0.1)',
            border: '1px solid hsla(0, 0%, 100%, 0.2)',
            backdropFilter: 'blur(24px) saturate(1.4)',
            boxShadow: '0 4px 24px hsla(200, 60%, 30%, 0.1), inset 0 1px 0 hsla(0, 0%, 100%, 0.15)',
          }}
        >
          {/* Top refraction */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 5%, hsla(0, 0%, 100%, 0.4) 50%, transparent 95%)' }}
          />

          <div className="flex flex-wrap justify-between gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 min-w-[120px]"
                style={{
                  borderLeft: i > 0 ? '1px solid hsla(0, 0%, 100%, 0.15)' : 'none',
                  paddingLeft: i > 0 ? '24px' : '0',
                }}
              >
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 + 0.2, duration: 0.5, type: 'spring' }}
                  style={{
                    fontSize: 'clamp(28px, 4vw, 44px)',
                    fontWeight: 300,
                    color: 'hsl(0, 0%, 100%)',
                  }}
                >
                  {stat.value}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 + 0.35 }}
                  style={{ fontSize: '13px', fontWeight: 300, color: 'hsla(0, 0%, 100%, 0.75)', marginTop: '4px' }}
                >
                  {stat.label}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
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
      className="relative py-16 md:py-28 overflow-hidden"
      style={{
        background: 'hsl(var(--landing-bg))',
        fontFamily: 'var(--font-sf)',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        {/* Glass container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl p-6 sm:p-8 md:p-10 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsla(192, 90%, 45%, 0.15) 0%, hsla(210, 85%, 50%, 0.12) 50%, hsla(220, 80%, 48%, 0.1) 100%)',
            border: '1px solid hsla(200, 80%, 45%, 0.15)',
            backdropFilter: 'blur(24px) saturate(1.4)',
            boxShadow: '0 8px 28px hsla(200, 75%, 10%, 0.4), inset 0 1px 0 hsla(0, 0%, 100%, 0.06)',
          }}
        >
          {/* Top refraction */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 5%, hsla(0, 0%, 100%, 0.1) 50%, transparent 95%)' }}
          />

          {/* Mobile: 2-column grid. Desktop: flex row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap md:justify-between gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="md:flex-1 md:min-w-[100px]"
              >
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 + 0.2, duration: 0.5, type: 'spring' }}
                  style={{
                    fontSize: 'clamp(24px, 4vw, 44px)',
                    fontWeight: 300,
                    background: 'linear-gradient(135deg, hsl(var(--landing-electric-1)), hsl(var(--landing-electric-2)))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {stat.value}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 + 0.35 }}
                  style={{ fontSize: '12px', fontWeight: 300, color: 'hsla(0, 0%, 100%, 0.5)', marginTop: '4px' }}
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

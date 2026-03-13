import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LissajousLogo } from '@/components/brand/LissajousLogo';
import welconyLogo from '@/assets/welcony-full-colour.png';

export const AnnouncementOverlay: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer"
          onClick={() => setVisible(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'hsla(0, 0%, 100%, 0.92)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            fontFamily: 'var(--font-sf)',
          }}
        >
          <motion.div
            className="flex flex-col items-center text-center px-8 max-w-lg"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <LissajousLogo size={28} color="hsl(var(--landing-electric-1))" animated />

            <h2
              className="mt-6"
              style={{
                fontSize: 'clamp(22px, 4vw, 34px)',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: 'hsl(var(--landing-ink))',
                lineHeight: 1.25,
              }}
            >
              Now distributed by
            </h2>

            <img
              src={welconyLogo}
              alt="Welcony"
              className="mt-4 h-8 md:h-10 object-contain"
            />

            <p
              className="mt-5"
              style={{
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.55,
                color: 'hsl(var(--landing-ink-soft))',
                maxWidth: '380px',
              }}
            >
              A world leader in neurotechnology.
            </p>

            <div
              className="mt-6 h-px w-12"
              style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--landing-electric-1) / 0.3), transparent)' }}
            />

            <p
              className="mt-5"
              style={{
                fontSize: '13px',
                fontWeight: 400,
                lineHeight: 1.5,
                color: 'hsl(var(--landing-ink-muted))',
              }}
            >
              Find us on LOT Airlines long-haul flights
              <br />
              <span style={{ fontWeight: 500, color: 'hsl(var(--landing-ink))' }}>
                beginning April 2026.
              </span>
            </p>

            {/* Auto-dismiss progress */}
            <motion.div
              className="mt-8 rounded-full overflow-hidden"
              style={{
                width: 60,
                height: 2,
                background: 'hsl(var(--landing-ink-muted) / 0.1)',
              }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, hsl(var(--landing-electric-1)), hsl(var(--landing-electric-2)))' }}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

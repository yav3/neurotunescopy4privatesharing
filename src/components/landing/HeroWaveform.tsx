import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated sine + gamma waveform — clean, clinical, side-view.
 * Replaces the heavy 3D WaveletSphere in the hero.
 */
export const HeroWaveform: React.FC<{ className?: string }> = ({ className = '' }) => {
  const w = 400;
  const h = 200;
  const mid = h / 2;

  // Build smooth sine path
  const sinePath = (() => {
    const points: string[] = [];
    for (let x = 0; x <= w * 2; x += 2) {
      const y = mid + Math.sin((x / w) * Math.PI * 4) * 36;
      points.push(`${x},${y}`);
    }
    return `M${points.join(' L')}`;
  })();

  // Build tighter gamma-like path (higher freq, lower amplitude)
  const gammaPath = (() => {
    const points: string[] = [];
    for (let x = 0; x <= w * 2; x += 2) {
      const y = mid + Math.sin((x / w) * Math.PI * 12) * 14 + Math.sin((x / w) * Math.PI * 3) * 10;
      points.push(`${x},${y}`);
    }
    return `M${points.join(' L')}`;
  })();

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="heroWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--landing-electric-1))" stopOpacity="0.9" />
            <stop offset="50%" stopColor="hsl(var(--landing-electric-2))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--landing-electric-1))" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="heroWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--landing-electric-2))" stopOpacity="0.35" />
            <stop offset="50%" stopColor="hsl(var(--landing-electric-1))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--landing-electric-2))" stopOpacity="0.35" />
          </linearGradient>
          {/* Fade edges */}
          <linearGradient id="heroWaveMask" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="15%" stopColor="white" stopOpacity="1" />
            <stop offset="85%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="heroEdgeFade">
            <rect x="0" y="0" width={w} height={h} fill="url(#heroWaveMask)" />
          </mask>
        </defs>

        <g mask="url(#heroEdgeFade)">
          {/* Primary sine wave */}
          <motion.path
            d={sinePath}
            fill="none"
            stroke="url(#heroWaveGrad1)"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{ x: [0, -w] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
          {/* Gamma overlay wave */}
          <motion.path
            d={gammaPath}
            fill="none"
            stroke="url(#heroWaveGrad2)"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{ x: [0, -w] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />
        </g>

        {/* Subtle center glow */}
        <circle cx={w / 2} cy={mid} r="60" fill="hsl(var(--landing-electric-1))" opacity="0.04" />
      </svg>

      {/* State label */}
      <div
        className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none"
        style={{ fontFamily: 'var(--font-sf)' }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="px-4 py-1.5 rounded-full"
          style={{
            background: 'hsla(210, 50%, 96%, 0.85)',
            border: '1px solid hsla(210, 50%, 85%, 0.6)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <span style={{
            fontSize: '9px',
            letterSpacing: '0.14em',
            fontWeight: 500,
            color: 'hsl(var(--landing-electric-1))',
          }}>
            EEG WAVEFORM · THERAPEUTIC
          </span>
        </motion.div>
      </div>
    </div>
  );
};

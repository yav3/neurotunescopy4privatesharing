import React, { useMemo } from 'react';

interface LissajousVariantProps {
  size?: number;
  color?: string;
  animated?: boolean;
  className?: string;
}

/**
 * Lissajous variants for pipeline steps — each uses different Lissajous parameters
 * to create visually distinct but on-brand marks.
 */

const buildLissajous = (
  steps: number,
  vw: number,
  vh: number,
  freqX: number,
  freqY: number,
  phaseX: number,
  phaseY: number,
  ampX: number,
  ampY: number,
) => {
  const pts: string[] = [];
  const cx = vw / 2;
  const cy = vh / 2;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 2 * Math.PI;
    const x = cx + Math.cos(freqX * t + phaseX) * ampX;
    const y = cy + Math.sin(freqY * t + phaseY) * ampY;
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `M ${pts[0]} ` + pts.slice(1).map(p => `L ${p}`).join(' ') + ' Z';
};

/** Compose — open, flowing double-loop (1:2 ratio, classic figure-8) */
export const LissajousCompose: React.FC<LissajousVariantProps> = ({
  size = 20, color = 'currentColor', animated = false, className = ''
}) => {
  const vw = 40, vh = 40, steps = 120;
  const path = buildLissajous(steps, vw, vh, 1, 2, 0, 0, 14, 14);

  return (
    <svg className={className} width={size} height={size} viewBox={`0 0 ${vw} ${vh}`} fill="none">
      <path d={path} stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.85}>
        {animated && (
          <animateTransform attributeName="transform" type="rotate" values="0 20 20;360 20 20" dur="8s" repeatCount="indefinite" />
        )}
      </path>
    </svg>
  );
};

/** Annotate — tighter, analytical pattern (2:3 ratio, more crossings) */
export const LissajousAnnotate: React.FC<LissajousVariantProps> = ({
  size = 20, color = 'currentColor', animated = false, className = ''
}) => {
  const vw = 40, vh = 40, steps = 180;
  const path = buildLissajous(steps, vw, vh, 2, 3, 0, Math.PI / 4, 14, 14);

  return (
    <svg className={className} width={size} height={size} viewBox={`0 0 ${vw} ${vh}`} fill="none">
      <path d={path} stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.85}>
        {animated && (
          <animateTransform attributeName="transform" type="rotate" values="0 20 20;-360 20 20" dur="10s" repeatCount="indefinite" />
        )}
      </path>
    </svg>
  );
};

/** Classify — precise, symmetric pattern (3:4 ratio, complex but ordered) */
export const LissajousClassify: React.FC<LissajousVariantProps> = ({
  size = 20, color = 'currentColor', animated = false, className = ''
}) => {
  const vw = 40, vh = 40, steps = 240;
  const path = buildLissajous(steps, vw, vh, 3, 4, 0, Math.PI / 6, 14, 14);

  return (
    <svg className={className} width={size} height={size} viewBox={`0 0 ${vw} ${vh}`} fill="none">
      <path d={path} stroke={color} strokeWidth={1.5} strokeLinecap="round" fill="none" opacity={0.85}>
        {animated && (
          <animateTransform attributeName="transform" type="rotate" values="0 20 20;360 20 20" dur="12s" repeatCount="indefinite" />
        )}
      </path>
    </svg>
  );
};

/** Deliver — dynamic, energetic pattern (3:2 ratio, wide) */
export const LissajousDeliver: React.FC<LissajousVariantProps> = ({
  size = 20, color = 'currentColor', animated = false, className = ''
}) => {
  const vw = 40, vh = 40, steps = 180;
  const path = buildLissajous(steps, vw, vh, 3, 2, Math.PI / 3, 0, 14, 14);

  return (
    <svg className={className} width={size} height={size} viewBox={`0 0 ${vw} ${vh}`} fill="none">
      <path d={path} stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.85}>
        {animated && (
          <animateTransform attributeName="transform" type="rotate" values="0 20 20;-360 20 20" dur="9s" repeatCount="indefinite" />
        )}
      </path>
    </svg>
  );
};

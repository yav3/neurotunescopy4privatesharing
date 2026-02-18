import React from 'react';

interface LissajousLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Double-infinity Lissajous mark — two ∞ shapes stacked vertically and intersecting.
 * Each loop is a standard figure-eight (x = cos(t), y = sin(2t)/2), offset vertically
 * so the two infinities share a central crossing point.
 */
export const LissajousLogo: React.FC<LissajousLogoProps> = ({
  className = '',
  size = 28,
  color = 'currentColor',
}) => {
  const steps = 120;
  // Use a wider-than-tall viewBox so the ∞ shapes read clearly
  const vw = 100;
  const vh = 80;
  const padX = 8;
  const padY = 6;
  const cx = vw / 2;
  const halfW = (vw - 2 * padX) / 2;

  // Vertical offset — each ∞ is shifted up/down from centre so they overlap at the middle
  const offsetY = 12;

  const buildPath = (yCenter: number) => {
    const pts: string[] = [];
    const halfH = 14; // half-height of each ∞ loop
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * 2 * Math.PI;
      const x = cx + Math.cos(t) * halfW;
      const y = yCenter + Math.sin(2 * t) * halfH;
      pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return `M ${pts[0]} ` + pts.slice(1).map(p => `L ${p}`).join(' ') + ' Z';
  };

  const topPath = buildPath(vh / 2 - offsetY);
  const bottomPath = buildPath(vh / 2 + offsetY);

  return (
    <svg
      className={className}
      width={size}
      height={size * (vh / vw)}
      viewBox={`0 0 ${vw} ${vh}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={topPath}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.85}
      />
      <path
        d={bottomPath}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.85}
      />
    </svg>
  );
};

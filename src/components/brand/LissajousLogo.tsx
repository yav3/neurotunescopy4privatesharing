import React from 'react';

interface LissajousLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Double-infinity Lissajous mark — two ∞ shapes stacked vertically and intersecting.
 * Parametric Lissajous curve: x = sin(t), y = sin(2t) produces a figure-8 / double-loop.
 */
export const LissajousLogo: React.FC<LissajousLogoProps> = ({
  className = '',
  size = 28,
  color = 'currentColor',
}) => {
  // Lissajous curve: x = sin(a*t + δ), y = sin(b*t)
  // a=1, b=2, δ=π/2 produces a figure-eight / double infinity
  const points: string[] = [];
  const steps = 120;
  const w = size;
  const h = size;
  const padX = w * 0.1;
  const padY = h * 0.1;

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 2 * Math.PI;
    const x = Math.sin(t + Math.PI / 2); // [-1, 1]
    const y = Math.sin(2 * t);           // [-1, 1]
    const px = padX + ((x + 1) / 2) * (w - 2 * padX);
    const py = padY + ((y + 1) / 2) * (h - 2 * padY);
    points.push(`${px.toFixed(2)},${py.toFixed(2)}`);
  }

  const pathData = `M ${points[0]} ` + points.slice(1).map(p => `L ${p}`).join(' ') + ' Z';

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={pathData}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.85}
      />
    </svg>
  );
};

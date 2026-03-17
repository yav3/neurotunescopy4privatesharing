import React, { useMemo } from 'react';

interface LissajousLogoProps {
  className?: string;
  size?: number;
  color?: string;
  animated?: boolean;
}

/**
 * Double-infinity Lissajous mark — two ∞ shapes stacked vertically and intersecting.
 * When animated, the curves oscillate with phase shifts, amplitude breathing, and
 * counter-rotating motion for a rich, living feel.
 */
export const LissajousLogo: React.FC<LissajousLogoProps> = ({
  className = '',
  size = 28,
  color = 'currentColor',
  animated = false,
}) => {
  const steps = 120;
  const vw = 100;
  const vh = 80;
  const padX = 8;
  const cx = vw / 2;
  const halfW = (vw - 2 * padX) / 2;
  const offsetY = 12;

  const buildPath = (yCenter: number, phaseShift = 0, ampScale = 1, widthScale = 1) => {
    const pts: string[] = [];
    const halfH = 14 * ampScale;
    const w = halfW * widthScale;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * 2 * Math.PI + phaseShift;
      const x = cx + Math.cos(t) * w;
      const y = yCenter + Math.sin(2 * t) * halfH;
      pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return `M ${pts[0]} ` + pts.slice(1).map(p => `L ${p}`).join(' ') + ' Z';
  };

  const animFrames = useMemo(() => {
    if (!animated) return null;
    const frameCount = 8;
    const topFrames: string[] = [];
    const bottomFrames: string[] = [];
    for (let f = 0; f <= frameCount; f++) {
      const norm = (f / frameCount) * 2 * Math.PI;
      // Phase oscillation
      const topPhase = Math.sin(norm) * 0.25;
      const bottomPhase = Math.sin(norm + Math.PI) * 0.25;
      // Amplitude breathing
      const topAmp = 1 + Math.sin(norm * 1.5) * 0.12;
      const bottomAmp = 1 + Math.cos(norm * 1.5) * 0.12;
      // Width breathing (counter to amplitude)
      const topWidth = 1 + Math.cos(norm * 0.7) * 0.06;
      const bottomWidth = 1 - Math.cos(norm * 0.7) * 0.06;

      topFrames.push(buildPath(vh / 2 - offsetY, topPhase, topAmp, topWidth));
      bottomFrames.push(buildPath(vh / 2 + offsetY, bottomPhase, bottomAmp, bottomWidth));
    }
    return { top: topFrames.join(';'), bottom: bottomFrames.join(';') };
  }, [animated]);

  const topPath = buildPath(vh / 2 - offsetY);
  const bottomPath = buildPath(vh / 2 + offsetY);

  const splines = Array(8).fill('0.4 0 0.6 1').join(';');

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
      >
        {animated && animFrames && (
          <animate
            attributeName="d"
            values={animFrames.top}
            dur="6s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines={splines}
          />
        )}
      </path>
      <path
        d={bottomPath}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.85}
      >
        {animated && animFrames && (
          <animate
            attributeName="d"
            values={animFrames.bottom}
            dur="6s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines={splines}
          />
        )}
      </path>
    </svg>
  );
};

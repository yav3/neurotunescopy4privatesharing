import React, { useMemo } from 'react';

interface LissajousLogoProps {
  className?: string;
  size?: number;
  color?: string;
  animated?: boolean;
}

/**
 * Double-infinity Lissajous mark — two ∞ shapes stacked vertically and intersecting.
 * When animated, the curves gently oscillate with phase shifts for an organic, living feel.
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

  const buildPath = (yCenter: number, phaseShift = 0) => {
    const pts: string[] = [];
    const halfH = 14;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * 2 * Math.PI + phaseShift;
      const x = cx + Math.cos(t) * halfW;
      const y = yCenter + Math.sin(2 * t) * halfH;
      pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return `M ${pts[0]} ` + pts.slice(1).map(p => `L ${p}`).join(' ') + ' Z';
  };

  // Generate keyframe paths for animation (subtle phase oscillation)
  const animFrames = useMemo(() => {
    if (!animated) return null;
    const frameCount = 5;
    const maxPhase = 0.15; // subtle shift
    const topFrames: string[] = [];
    const bottomFrames: string[] = [];
    for (let f = 0; f <= frameCount; f++) {
      const phase = Math.sin((f / frameCount) * 2 * Math.PI) * maxPhase;
      topFrames.push(buildPath(vh / 2 - offsetY, phase));
      bottomFrames.push(buildPath(vh / 2 + offsetY, -phase));
    }
    return { top: topFrames.join(';'), bottom: bottomFrames.join(';') };
  }, [animated]);

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
      >
        {animated && animFrames && (
          <animate
            attributeName="d"
            values={animFrames.top}
            dur="4s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
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
            dur="4s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
          />
        )}
      </path>
    </svg>
  );
};

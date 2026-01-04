import React from 'react';
import { motion } from 'framer-motion';

export const NeuralSignalGraphic: React.FC = () => {
  // Create a smooth, clinical waveform path
  const generateWaveformPath = () => {
    const points: string[] = [];
    const height = 200;
    const width = 400;
    const centerY = height / 2;
    const amplitude = 40;
    
    for (let x = 0; x <= width; x += 2) {
      // Composite wave for neural signal feel
      const wave1 = Math.sin((x / width) * Math.PI * 4) * amplitude * 0.6;
      const wave2 = Math.sin((x / width) * Math.PI * 8) * amplitude * 0.3;
      const wave3 = Math.sin((x / width) * Math.PI * 2) * amplitude * 0.4;
      const y = centerY + wave1 + wave2 + wave3;
      
      if (x === 0) {
        points.push(`M ${x} ${y}`);
      } else {
        points.push(`L ${x} ${y}`);
      }
    }
    
    return points.join(' ');
  };

  const waveformPath = generateWaveformPath();

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Container with subtle depth */}
      <div className="relative">
        {/* Ambient glow behind */}
        <motion.div
          className="absolute inset-0 blur-3xl"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 70%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        />
        
        {/* Main SVG waveform */}
        <motion.svg
          width="400"
          height="200"
          viewBox="0 0 400 200"
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          {/* Grid lines - subtle measurement feel */}
          <g stroke="rgba(255,255,255,0.03)" strokeWidth="0.5">
            {[40, 80, 120, 160].map((y) => (
              <line key={y} x1="0" y1={y} x2="400" y2={y} />
            ))}
            {[100, 200, 300].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="200" />
            ))}
          </g>
          
          {/* The waveform - animated draw */}
          <motion.path
            d={waveformPath}
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ 
              pathLength: { duration: 2.5, ease: "easeInOut", delay: 0.8 },
              opacity: { duration: 0.5, delay: 0.8 }
            }}
          />
          
          {/* Subtle glow version of the line */}
          <motion.path
            d={waveformPath}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="blur(4px)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ 
              pathLength: { duration: 2.5, ease: "easeInOut", delay: 0.8 },
              opacity: { duration: 0.5, delay: 0.8 }
            }}
          />
        </motion.svg>

        {/* Status indicator - clinical readout feel */}
        <motion.div
          className="absolute -bottom-12 left-0 right-0 flex items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span 
              className="text-white/30 text-xs tracking-widest uppercase"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif' }}
            >
              Regulated
            </span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <span 
            className="text-white/20 text-xs tracking-wider"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Mono", "SF Mono", monospace' }}
          >
            40Hz
          </span>
        </motion.div>
      </div>
    </div>
  );
};

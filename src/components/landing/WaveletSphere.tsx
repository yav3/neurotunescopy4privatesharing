import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

/* ── Keyword labels with semantic roles ── */
const KEYWORDS = [
  { word: 'crossover classical', type: 'upregulate' as const },
  { word: 'focus', type: 'upregulate' as const },
  { word: 'Therapeutic Sonatas', type: 'downregulate' as const },
  { word: 'calm', type: 'neutral' as const },
  { word: 'harmony', type: 'neutral' as const },
  { word: 'clarity', type: 'neutral' as const },
  { word: 'serenity', type: 'neutral' as const },
  { word: 'rhythm', type: 'neutral' as const },
  { word: 'flow', type: 'neutral' as const },
  { word: 'balance', type: 'neutral' as const },
  { word: 'breath', type: 'neutral' as const },
  { word: 'ease', type: 'neutral' as const },
];

/* ── Frosted Crystal Sphere ── */
const CrystalSphere: React.FC<{ colorShift: number }> = ({ colorShift }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.06;
      meshRef.current.rotation.x = Math.sin(t * 0.04) * 0.03;
      
      const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
      // Shift from pearl (#d0dfe8) toward pale ice-blue (#c0e8ff) on upregulate
      // or warm matte (#d8d0c8) on downregulate
      const r = 0.82 + colorShift * 0.05;
      const g = 0.87 + colorShift * 0.06;
      const b = 0.91 + colorShift * 0.08;
      mat.color.setRGB(r, g, b);
      mat.opacity = 0.38 + Math.abs(colorShift) * 0.08;
    }
    if (glowRef.current) {
      const s = 1.15 + Math.sin(t * 0.4) * 0.02 + Math.abs(colorShift) * 0.05;
      glowRef.current.scale.set(s, s, s);
      const glowMat = glowRef.current.material as THREE.MeshBasicMaterial;
      glowMat.opacity = 0.08 + Math.abs(colorShift) * 0.06;
    }
    if (innerGlowRef.current) {
      const iS = 0.88 + Math.sin(t * 0.7) * 0.01;
      innerGlowRef.current.scale.set(iS, iS, iS);
      const iMat = innerGlowRef.current.material as THREE.MeshBasicMaterial;
      iMat.opacity = 0.04 + colorShift * 0.04;
    }
  });

  return (
    <group>
      {/* Outer glow shell */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color="#a8d4f0" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
      {/* Inner warm glow */}
      <mesh ref={innerGlowRef}>
        <sphereGeometry args={[0.88, 32, 32]} />
        <meshBasicMaterial color="#d0e8ff" transparent opacity={0.04} />
      </mesh>
      {/* Main crystal body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.95, 64, 64]} />
        <meshPhysicalMaterial
          color="#d0dfe8"
          roughness={0.78}
          metalness={0.03}
          clearcoat={0.5}
          clearcoatRoughness={0.5}
          transparent
          opacity={0.38}
          envMapIntensity={0.5}
          sheen={0.3}
          sheenColor={new THREE.Color('#c0e0ff')}
        />
      </mesh>
    </group>
  );
};

/* ── Orbiting Keyword ── */
const OrbitingKeyword: React.FC<{
  word: string;
  type: 'upregulate' | 'downregulate' | 'neutral';
  index: number;
  total: number;
  phase: string;
  phaseTime: number;
}> = ({ word, type, index, total, phase, phaseTime }) => {
  const ref = useRef<THREE.Group>(null);
  const textRef = useRef<any>(null);

  const { theta, phi, speed, orbitRadius } = useMemo(() => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    const y = 1 - (index / (total - 1)) * 2;
    return {
      theta: golden * index,
      phi: Math.acos(Math.max(-1, Math.min(1, y))),
      speed: 0.08 + (index % 4) * 0.02,
      orbitRadius: 1.2 + (index % 3) * 0.06,
    };
  }, [index, total]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const currentTheta = theta + t * speed;

    let r = orbitRadius;
    let opacity = 0.65 + (index % 3) * 0.1;

    if (phase === 'perturb') {
      // Words react to music line
      const perturbFactor = Math.sin(index * 2.7 + t * 3) * 0.12;
      r += perturbFactor;
      
      // Upregulating words glow brighter during perturbation
      if (type === 'upregulate') {
        opacity = Math.min(1, opacity + phaseTime * 0.3);
      }
    }

    if (phase === 'dissolve' || phase === 'pressplay') {
      // Scatter outward and fade
      const dissolveFactor = Math.min(1, phaseTime * 0.6);
      r += dissolveFactor * 2;
      opacity = Math.max(0, opacity * (1 - dissolveFactor));
    }

    const x = r * Math.sin(phi) * Math.cos(currentTheta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(currentTheta);

    ref.current.position.set(x, y, z);
    ref.current.lookAt(0, 0, 0);
    ref.current.rotateY(Math.PI);

    if (textRef.current) {
      textRef.current.fillOpacity = opacity;
    }
  });

  const color = type === 'upregulate' ? '#90d4ff' : type === 'downregulate' ? '#8ab0c8' : '#7a9bb5';
  const fontSize = type === 'neutral' ? 0.065 : 0.08;

  if (phase === 'pressplay') return null;

  return (
    <group ref={ref}>
      <Text
        ref={textRef}
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
        fillOpacity={0.7}
      >
        {word}
      </Text>
    </group>
  );
};

/* ── Dashed-Dotted Waveform Line ── */
const WaveformLine: React.FC<{ active: boolean; phaseTime: number }> = ({ active, phaseTime }) => {
  const groupRef = useRef<THREE.Group>(null);
  const dotsCount = 80;
  const dotRefs = useRef<THREE.Mesh[]>([]);
  const dots = useMemo(() => Array.from({ length: dotsCount }), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const activeFactor = active ? Math.min(1, phaseTime * 0.5) : 0;

    dotRefs.current.forEach((dot, i) => {
      if (!dot) return;
      const progress = i / dotsCount;
      
      // Waveform path: spiral around the sphere
      const angle = progress * Math.PI * 3 + t * 1.5;
      const waveY = (progress - 0.5) * 2.8;
      const waveR = 1.3 + Math.sin(progress * Math.PI * 6 + t * 4) * 0.15;
      
      dot.position.set(
        Math.cos(angle) * waveR * activeFactor,
        waveY * activeFactor,
        Math.sin(angle) * waveR * activeFactor
      );

      // Dash-dot pattern: every 3rd dot is larger (dash), others are small (dots)
      const isDash = i % 4 === 0;
      const baseScale = isDash ? 0.018 : 0.008;
      const pulse = Math.sin(t * 5 + i * 0.5) * 0.003;
      const scale = (baseScale + pulse) * activeFactor;
      dot.scale.set(scale, scale, scale);

      const mat = dot.material as THREE.MeshBasicMaterial;
      mat.opacity = activeFactor * (isDash ? 0.7 : 0.4);
    });
  });

  return (
    <group ref={groupRef}>
      {dots.map((_, i) => (
        <mesh key={i} ref={(el) => { if (el) dotRefs.current[i] = el; }}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial color="#70c0f0" transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
};

/* ── Play Button Triangle ── */
const PlayButton: React.FC<{ visible: boolean; phaseTime: number }> = ({ visible, phaseTime }) => {
  const groupRef = useRef<THREE.Group>(null);
  const outlineRef = useRef<THREE.LineLoop>(null);

  const triangleShape = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.12, 0.18, 0),
      new THREE.Vector3(-0.12, -0.18, 0),
      new THREE.Vector3(0.2, 0, 0),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const opacity = visible ? Math.min(1, phaseTime * 0.4) : 0;
    
    if (outlineRef.current) {
      const mat = outlineRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = opacity * 0.8;
    }

    // Gentle float
    const t = clock.getElapsedTime();
    groupRef.current.position.y = 0.1 + Math.sin(t * 0.8) * 0.02;
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      <lineLoop ref={outlineRef} geometry={triangleShape}>
        <lineBasicMaterial color="#c0c0c0" transparent opacity={0} linewidth={1} />
      </lineLoop>
    </group>
  );
};

/* ── "Experience Now" Text ── */
const ExperienceText: React.FC<{ visible: boolean; phaseTime: number }> = ({ visible, phaseTime }) => {
  const ref = useRef<any>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.fillOpacity = visible ? Math.min(0.6, phaseTime * 0.2) : 0;
    }
  });

  if (!visible) return null;

  return (
    <Text
      ref={ref}
      position={[0, -0.18, 0]}
      fontSize={0.065}
      color="#c0c0c0"
      anchorX="center"
      anchorY="middle"
      letterSpacing={0.2}
      fillOpacity={0}
    >
      Experience now
    </Text>
  );
};

/* ── Scene Controller ── */
const Scene: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const [phase, setPhase] = useState<'orbit' | 'perturb' | 'dissolve' | 'pressplay'>('orbit');
  const [phaseTime, setPhaseTime] = useState(0);
  const [colorShift, setColorShift] = useState(0);
  const phaseStartRef = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Loop every 18 seconds
    const cycleT = t % 18;
    const elapsed = cycleT - phaseStartRef.current;
    setPhaseTime(Math.max(0, elapsed));

    // Phase transitions within each cycle
    if (cycleT < 3) {
      if (phase !== 'orbit') { setPhase('orbit'); phaseStartRef.current = cycleT; }
    } else if (cycleT < 8) {
      if (phase !== 'perturb') { setPhase('perturb'); phaseStartRef.current = cycleT; }
    } else if (cycleT < 12) {
      if (phase !== 'dissolve') { setPhase('dissolve'); phaseStartRef.current = cycleT; }
    } else if (cycleT < 16) {
      if (phase !== 'pressplay') { setPhase('pressplay'); phaseStartRef.current = cycleT; }
    } else {
      // Reset for next cycle
      if (phase !== 'orbit') { setPhase('orbit'); phaseStartRef.current = cycleT; }
    }

    // Color shift
    if (phase === 'perturb') {
      const pElapsed = cycleT - 3;
      if (pElapsed < 2.5) {
        setColorShift(Math.sin(pElapsed * 1.2) * 1);
      } else {
        setColorShift(-0.3 - Math.sin((pElapsed - 2.5) * 0.8) * 0.3);
      }
    } else if (phase === 'dissolve' || phase === 'pressplay') {
      setColorShift(colorShift * 0.95);
    } else {
      setColorShift(colorShift * 0.9);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#d0e0f0" />
      <directionalLight position={[3, 4, 5]} intensity={0.7} color="#e0eaf5" />
      <directionalLight position={[-2, 1, -4]} intensity={0.25} color="#c0d5e8" />
      <pointLight position={[0, 0, 0]} intensity={0.12 + Math.abs(colorShift) * 0.1} color="#90c8e8" distance={3} />

      {phase !== 'pressplay' && <CrystalSphere colorShift={colorShift} />}

      {KEYWORDS.map((kw, i) => (
        <OrbitingKeyword
          key={kw.word}
          word={kw.word}
          type={kw.type}
          index={i}
          total={KEYWORDS.length}
          phase={phase}
          phaseTime={phaseTime}
        />
      ))}

      <WaveformLine active={phase === 'perturb'} phaseTime={phaseTime} />
      <PlayButton visible={phase === 'pressplay'} phaseTime={phaseTime} />
      <ExperienceText visible={phase === 'pressplay'} phaseTime={phaseTime} />

      {/* Manual environment lighting - no HDR dependency */}
    </>
  );
};

/* ── Export ── */
interface WaveletSphereProps {
  className?: string;
  dark?: boolean;
}

export const WaveletSphere: React.FC<WaveletSphereProps> = ({ className = '', dark = false }) => {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene dark={dark} />
      </Canvas>
    </div>
  );
};

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Environment } from '@react-three/drei';
import * as THREE from 'three';

const WORDS = [
  'calm', 'focus', 'joy', 'serenity', 'rhythm',
  'harmony', 'peace', 'clarity', 'warmth', 'drift',
  'soothe', 'uplift', 'flow', 'ease', 'wonder',
  'bliss', 'balance', 'breath', 'heal', 'rest',
];

/* ── Frosted Crystal Sphere ── */
const CrystalSphere: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.08;
      meshRef.current.rotation.x = Math.sin(t * 0.06) * 0.05;
    }
    if (glowRef.current) {
      const s = 1.12 + Math.sin(t * 0.5) * 0.02;
      glowRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial
          color="#b8d4e8"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Crystal body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.95, 64, 64]} />
        <meshPhysicalMaterial
          color="#c8dce8"
          roughness={0.85}
          metalness={0.02}
          clearcoat={0.3}
          clearcoatRoughness={0.6}
          transparent
          opacity={0.35}
          envMapIntensity={0.4}
        />
      </mesh>
    </group>
  );
};

/* ── Orbiting Word ── */
const OrbitingWord: React.FC<{
  word: string;
  index: number;
  total: number;
  perturbAmount: number;
  dissolved: boolean;
}> = ({ word, index, total, perturbAmount, dissolved }) => {
  const ref = useRef<THREE.Group>(null);

  // Distribute on sphere using golden spiral
  const { theta, phi, speed, orbitRadius } = useMemo(() => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    const y = 1 - (index / (total - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    return {
      theta: golden * index,
      phi: Math.acos(y),
      speed: 0.12 + (index % 5) * 0.03,
      orbitRadius: 1.15 + (index % 3) * 0.08,
    };
  }, [index, total]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    const currentTheta = theta + t;

    // Perturbation from the "music" dotted line
    const perturb = perturbAmount * Math.sin(index * 2.7 + clock.getElapsedTime() * 3) * 0.15;
    const r = orbitRadius + perturb;

    const x = r * Math.sin(phi) * Math.cos(currentTheta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(currentTheta);

    ref.current.position.set(x, y, z);
    ref.current.lookAt(0, 0, 0);
    ref.current.rotateY(Math.PI);

    // Dissolve: scatter outward and fade
    if (dissolved) {
      const scatter = 1 + (clock.getElapsedTime() % 10) * 0.3;
      ref.current.position.multiplyScalar(scatter);
    }
  });

  return (
    <group ref={ref}>
      <Text
        fontSize={0.07}
        color={dissolved ? 'transparent' : '#7a9bb5'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-latin-400-normal.woff2"
        fillOpacity={dissolved ? 0 : 0.7 + (index % 3) * 0.1}
      >
        {word}
      </Text>
    </group>
  );
};

/* ── Dotted Music Line ── */
const MusicDottedLine: React.FC<{ active: boolean }> = ({ active }) => {
  const groupRef = useRef<THREE.Group>(null);
  const dotsCount = 60;

  const dotRefs = useRef<THREE.Mesh[]>([]);

  const dots = useMemo(() => Array.from({ length: dotsCount }), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    dotRefs.current.forEach((dot, i) => {
      if (!dot) return;
      const progress = i / dotsCount;
      const angle = progress * Math.PI * 2 + t * 2;
      const r = 1.4 + Math.sin(progress * Math.PI * 8 + t * 4) * 0.1;
      const y = (progress - 0.5) * 2.2;

      dot.position.set(
        Math.cos(angle) * r * (active ? 1 : 0),
        y,
        Math.sin(angle) * r * (active ? 1 : 0)
      );

      const scale = active ? 0.012 + Math.sin(t * 6 + i) * 0.004 : 0;
      dot.scale.set(scale, scale, scale);
    });
  });

  return (
    <group ref={groupRef}>
      {dots.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) dotRefs.current[i] = el; }}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#6a9fc0" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
};

/* ── "Press Play" Text ── */
const PressPlayText: React.FC<{ visible: boolean }> = ({ visible }) => {
  const ref = useRef<any>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.fillOpacity = visible ? Math.min(1, (clock.getElapsedTime() % 100) * 0.5) : 0;
    }
  });

  if (!visible) return null;

  return (
    <Text
      ref={ref}
      fontSize={0.18}
      color="#4a7a95"
      anchorX="center"
      anchorY="middle"
      letterSpacing={0.15}
      fillOpacity={0}
    >
      press play
    </Text>
  );
};

/* ── Scene Controller ── */
const Scene: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const [phase, setPhase] = useState<'orbit' | 'perturb' | 'dissolve' | 'pressplay'>('orbit');
  const [perturbAmount, setPerturbAmount] = useState(0);
  const clockRef = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    clockRef.current = t;

    // Phase transitions
    if (t > 2 && t < 5 && phase === 'orbit') {
      setPhase('perturb');
    }
    if (t > 5 && phase === 'perturb') {
      setPhase('dissolve');
    }
    if (t > 7 && phase === 'dissolve') {
      setPhase('pressplay');
    }

    // Smooth perturbation ramp
    if (phase === 'perturb') {
      setPerturbAmount(Math.min(1, (t - 2) / 2));
    } else if (phase === 'dissolve' || phase === 'pressplay') {
      setPerturbAmount(Math.max(0, perturbAmount - 0.02));
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} color="#d0e0f0" />
      <directionalLight position={[3, 4, 5]} intensity={0.8} color="#e0eaf5" />
      <directionalLight position={[-2, 1, -4]} intensity={0.3} color="#c0d5e8" />
      <pointLight position={[0, 0, 0]} intensity={0.15} color="#90b8d4" distance={3} />

      {phase !== 'pressplay' && <CrystalSphere />}

      {phase !== 'pressplay' && WORDS.map((word, i) => (
        <OrbitingWord
          key={word}
          word={word}
          index={i}
          total={WORDS.length}
          perturbAmount={perturbAmount}
          dissolved={phase === 'dissolve'}
        />
      ))}

      <MusicDottedLine active={phase === 'perturb'} />
      <PressPlayText visible={phase === 'pressplay'} />

      <Environment preset="studio" />
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

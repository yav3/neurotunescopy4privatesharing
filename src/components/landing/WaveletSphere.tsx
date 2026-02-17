import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Mood States — music sets the tone ── */
const MOODS = [
  { name: 'Calm', hue: 210, speed: 0.35, intensity: 0.35, pulseRate: 0.8 },
  { name: 'Focus', hue: 190, speed: 0.55, intensity: 0.55, pulseRate: 1.2 },
  { name: 'Energy', hue: 30, speed: 1.0, intensity: 0.85, pulseRate: 2.5 },
  { name: 'Relief', hue: 150, speed: 0.4, intensity: 0.4, pulseRate: 0.6 },
];

const CYCLE = 5000; // ms per mood

/* ── Glowing Core Sphere ── */
const GlowSphere: React.FC<{ moodRef: React.MutableRefObject<number> }> = ({ moodRef }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const aura1Ref = useRef<THREE.Mesh>(null);
  const aura2Ref = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  // Smoothly interpolated values
  const current = useRef({ hue: 210, speed: 0.35, intensity: 0.35, pulseRate: 0.8 });

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mood = MOODS[moodRef.current];

    // Lerp mood parameters
    const c = current.current;
    c.hue += (mood.hue - c.hue) * 0.02;
    c.speed += (mood.speed - c.speed) * 0.03;
    c.intensity += (mood.intensity - c.intensity) * 0.03;
    c.pulseRate += (mood.pulseRate - c.pulseRate) * 0.03;

    const col = new THREE.Color().setHSL(c.hue / 360, 0.5, 0.5);
    const colBright = new THREE.Color().setHSL(c.hue / 360, 0.6, 0.65);
    const colDim = new THREE.Color().setHSL(c.hue / 360, 0.35, 0.35);

    // Tempo-driven pulse
    const pulse = Math.sin(t * c.pulseRate * Math.PI * 2) * 0.5 + 0.5; // 0-1
    const breathe = Math.sin(t * c.speed * 0.5) * 0.5 + 0.5;

    // Core sphere — pulsates with tempo
    if (coreRef.current) {
      const coreScale = 0.82 + pulse * 0.06 * c.intensity + breathe * 0.02;
      coreRef.current.scale.setScalar(coreScale);
      coreRef.current.rotation.y = t * 0.06;
      coreRef.current.rotation.x = Math.sin(t * 0.04) * 0.05;

      const mat = coreRef.current.material as THREE.MeshPhysicalMaterial;
      mat.color.lerp(col, 0.03);
      mat.emissive.lerp(colDim, 0.03);
      mat.emissiveIntensity = 0.2 + pulse * 0.6 * c.intensity;
      mat.opacity = 0.5 + pulse * 0.15 * c.intensity;
    }

    // Inner glow — bright at beat peaks
    if (innerRef.current) {
      const iScale = 0.6 + pulse * 0.12 * c.intensity;
      innerRef.current.scale.setScalar(iScale);
      const iMat = innerRef.current.material as THREE.MeshBasicMaterial;
      iMat.color.lerp(colBright, 0.04);
      iMat.opacity = 0.06 + pulse * 0.15 * c.intensity;
    }

    // Outer aura 1 — expands on beat
    if (aura1Ref.current) {
      const a1Scale = 1.05 + pulse * 0.1 * c.intensity + breathe * 0.03;
      aura1Ref.current.scale.setScalar(a1Scale);
      const a1Mat = aura1Ref.current.material as THREE.MeshBasicMaterial;
      a1Mat.color.lerp(col, 0.03);
      a1Mat.opacity = 0.04 + pulse * 0.06 * c.intensity;
    }

    // Outer aura 2 — larger, softer
    if (aura2Ref.current) {
      const a2Scale = 1.2 + breathe * 0.08 + pulse * 0.05 * c.intensity;
      aura2Ref.current.scale.setScalar(a2Scale);
      const a2Mat = aura2Ref.current.material as THREE.MeshBasicMaterial;
      a2Mat.color.lerp(colDim, 0.03);
      a2Mat.opacity = 0.025 + pulse * 0.03 * c.intensity;
    }
  });

  return (
    <group>
      {/* Outer aura 2 */}
      <mesh ref={aura2Ref}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#5588aa" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
      {/* Outer aura 1 */}
      <mesh ref={aura1Ref}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#5588aa" transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>
      {/* Inner glow */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#88bbdd" transparent opacity={0.08} />
      </mesh>
      {/* Main sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.82, 64, 64]} />
        <meshPhysicalMaterial
          color="#5588aa"
          roughness={0.55}
          metalness={0.05}
          clearcoat={0.7}
          clearcoatRoughness={0.3}
          transparent
          opacity={0.55}
          emissive="#223344"
          emissiveIntensity={0.3}
          sheen={0.4}
          sheenColor={new THREE.Color('#aaddff')}
        />
      </mesh>
    </group>
  );
};

/* ── Particle Halo — reacts to intensity ── */
const ParticleHalo: React.FC<{ moodRef: React.MutableRefObject<number> }> = ({ moodRef }) => {
  const count = 120;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return {
        baseDir: new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.sin(phi) * Math.sin(theta),
          Math.cos(phi),
        ),
        phase: Math.random() * Math.PI * 2,
        baseSize: 0.006 + Math.random() * 0.008,
      };
    }),
  []);

  const currentIntensity = useRef(0.35);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const mood = MOODS[moodRef.current];

    currentIntensity.current += (mood.intensity - currentIntensity.current) * 0.03;
    const ci = currentIntensity.current;
    const pulseRate = mood.pulseRate;

    particles.forEach((p, i) => {
      const musicPulse = Math.sin(t * pulseRate * Math.PI * 2 + p.phase) * 0.5 + 0.5;
      const radius = 1.0 + musicPulse * 0.25 * ci + Math.sin(t * 0.3 + p.phase) * 0.05;

      dummy.position.copy(p.baseDir).multiplyScalar(radius);
      const s = p.baseSize * (0.6 + musicPulse * ci * 1.5);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;

    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    const hue = mood.hue;
    mat.color.lerp(new THREE.Color().setHSL(hue / 360, 0.5, 0.7), 0.03);
    mat.opacity = 0.3 + ci * 0.4;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#88bbdd" transparent opacity={0.4} />
    </instancedMesh>
  );
};

/* ── Wave Ring — audio waveform ── */
const WaveRing: React.FC<{ moodRef: React.MutableRefObject<number>; tilt: number; radius: number }> = ({ moodRef, tilt, radius }) => {
  const segments = 48;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current || !groupRef.current) return;
    const t = clock.getElapsedTime();
    const mood = MOODS[moodRef.current];

    groupRef.current.rotation.x = tilt;
    groupRef.current.rotation.z = t * mood.speed * 0.15;

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const wave = Math.sin(angle * 6 + t * mood.pulseRate * 4) * 0.04 * mood.intensity;
      const r = radius + wave;

      dummy.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
      const s = 0.006 + Math.abs(wave) * 0.2;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.color.lerp(new THREE.Color().setHSL(mood.hue / 360, 0.45, 0.6), 0.04);
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, segments]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color="#88bbdd" transparent opacity={0.35} />
      </instancedMesh>
    </group>
  );
};

/* ── Scene ── */
const Scene: React.FC<{ moodRef: React.MutableRefObject<number> }> = ({ moodRef }) => {
  return (
    <>
      <ambientLight intensity={0.35} color="#c0d8ee" />
      <directionalLight position={[3, 4, 5]} intensity={0.5} color="#d8e8f5" />
      <directionalLight position={[-2, 1, -3]} intensity={0.2} color="#b0c8dd" />

      <GlowSphere moodRef={moodRef} />
      <ParticleHalo moodRef={moodRef} />
      <WaveRing moodRef={moodRef} tilt={0.5} radius={1.1} />
      <WaveRing moodRef={moodRef} tilt={-0.7} radius={1.2} />
    </>
  );
};

/* ── Export ── */
interface WaveletSphereProps {
  className?: string;
  dark?: boolean;
}

export const WaveletSphere: React.FC<WaveletSphereProps> = ({ className = '' }) => {
  const moodRef = useRef(0);
  const [moodName, setMoodName] = useState(MOODS[0].name);
  const [moodHue, setMoodHue] = useState(MOODS[0].hue);

  useEffect(() => {
    const interval = setInterval(() => {
      moodRef.current = (moodRef.current + 1) % MOODS.length;
      setMoodName(MOODS[moodRef.current].name);
      setMoodHue(MOODS[moodRef.current].hue);
    }, CYCLE);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 44 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene moodRef={moodRef} />
      </Canvas>

      {/* Mood label */}
      <div
        className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
      >
        <div
          className="px-3 py-1 rounded-full"
          style={{
            background: 'hsla(220, 20%, 8%, 0.7)',
            border: '1px solid hsla(0, 0%, 100%, 0.08)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <span style={{
            fontSize: '9px',
            letterSpacing: '0.14em',
            fontWeight: 400,
            color: `hsl(${moodHue}, 55%, 70%)`,
            transition: 'color 1s ease',
          }}>
            {moodName.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

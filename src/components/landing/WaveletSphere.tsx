import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Mood States ── */
const MOODS = [
  { name: 'Alpha', hue: 210, speed: 0.3, intensity: 0.2, pulseRate: 0.6, spread: 0.3, harmonicShift: 1.0 },
  { name: 'Theta', hue: 260, speed: 0.2, intensity: 0.35, pulseRate: 0.4, spread: 0.2, harmonicShift: 0.6 },
  { name: 'Beta', hue: 190, speed: 0.55, intensity: 0.55, pulseRate: 1.2, spread: 0.55, harmonicShift: 1.8 },
  { name: 'Gamma', hue: 30, speed: 1.0, intensity: 1.0, pulseRate: 2.4, spread: 1.0, harmonicShift: 3.2 },
];

const CYCLE = 5000;

/* ── Particle Cloud ── */
const ParticleCloud: React.FC<{ moodRef: React.MutableRefObject<number> }> = ({ moodRef }) => {
  const count = 600;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() =>
    Array.from({ length: count }, () => {
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
      ).normalize();
      return {
        dir,
        restRadius: 0.15 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
        baseSize: 0.004 + Math.random() * 0.006,
      };
    }),
  []);

  const cur = useRef({ hue: 210, speed: 0.3, intensity: 0.2, pulseRate: 0.6, spread: 0.3 });

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const mood = MOODS[moodRef.current];
    const c = cur.current;

    // Smooth lerp
    c.hue += (mood.hue - c.hue) * 0.015;
    c.speed += (mood.speed - c.speed) * 0.025;
    c.intensity += (mood.intensity - c.intensity) * 0.025;
    c.pulseRate += (mood.pulseRate - c.pulseRate) * 0.025;
    c.spread += (mood.spread - c.spread) * 0.02;

    const globalPulse = Math.sin(t * c.pulseRate * Math.PI * 2) * 0.5 + 0.5;
    const breathe = Math.sin(t * c.speed * 0.4) * 0.5 + 0.5;

    // Coalesce (low spread) vs disperse (high spread)
    const dispersal = 0.6 + c.spread * 1.4; // 0.6 tight → 2.0 wide

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      const particlePulse = Math.sin(t * c.pulseRate * Math.PI * 2 + p.phase) * 0.5 + 0.5;

      // Radius oscillates with music energy
      const r = p.restRadius * dispersal
        + particlePulse * 0.3 * c.intensity
        + breathe * 0.05
        + Math.sin(t * p.speed + p.phase) * 0.08 * c.intensity;

      // Orbital drift
      const drift = t * p.speed * c.speed * 0.15;
      const dx = p.dir.x * Math.cos(drift) - p.dir.z * Math.sin(drift);
      const dz = p.dir.x * Math.sin(drift) + p.dir.z * Math.cos(drift);

      dummy.position.set(dx * r, p.dir.y * r, dz * r);

      // Particles grow on beat peaks
      const s = p.baseSize * (0.5 + particlePulse * c.intensity * 2.0 + globalPulse * 0.3);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    // Color shift
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.color.lerp(new THREE.Color().setHSL(c.hue / 360, 0.5, 0.65), 0.025);
    mat.opacity = 0.35 + globalPulse * 0.25 * c.intensity;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#88bbdd" transparent opacity={0.4} depthWrite={false} />
    </instancedMesh>
  );
};

/* ── Inner Glow Core ── */
const GlowCore: React.FC<{ moodRef: React.MutableRefObject<number> }> = ({ moodRef }) => {
  const ref = useRef<THREE.Mesh>(null);
  const cur = useRef({ hue: 210, intensity: 0.2, pulseRate: 0.6 });

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const mood = MOODS[moodRef.current];
    const c = cur.current;
    c.hue += (mood.hue - c.hue) * 0.015;
    c.intensity += (mood.intensity - c.intensity) * 0.025;
    c.pulseRate += (mood.pulseRate - c.pulseRate) * 0.025;

    const pulse = Math.sin(t * c.pulseRate * Math.PI * 2) * 0.5 + 0.5;
    const scale = 0.18 + pulse * 0.12 * c.intensity;
    ref.current.scale.setScalar(scale);

    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.color.lerp(new THREE.Color().setHSL(c.hue / 360, 0.55, 0.7), 0.03);
    mat.opacity = 0.08 + pulse * 0.2 * c.intensity;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial color="#88bbdd" transparent opacity={0.1} depthWrite={false} />
    </mesh>
  );
};

/* ── Waveform Ring — wraps the cloud surface ── */
const WaveformRing: React.FC<{
  moodRef: React.MutableRefObject<number>;
  tilt: number;
  radius: number;
  harmonics: number;
  phaseOffset: number;
}> = ({ moodRef, tilt, radius, harmonics, phaseOffset }) => {
  const segments = 64;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const cur = useRef({ hue: 210, speed: 0.3, intensity: 0.2, pulseRate: 0.6, spread: 0.3, harmonicShift: 1.0 });

  useFrame(({ clock }) => {
    if (!meshRef.current || !groupRef.current) return;
    const t = clock.getElapsedTime();
    const mood = MOODS[moodRef.current];
    const c = cur.current;
    c.hue += (mood.hue - c.hue) * 0.015;
    c.speed += (mood.speed - c.speed) * 0.025;
    c.intensity += (mood.intensity - c.intensity) * 0.025;
    c.pulseRate += (mood.pulseRate - c.pulseRate) * 0.025;
    c.spread += (mood.spread - c.spread) * 0.02;
    c.harmonicShift += (mood.harmonicShift - c.harmonicShift) * 0.02;

    groupRef.current.rotation.x = tilt;
    groupRef.current.rotation.z = t * c.speed * 0.12;
    groupRef.current.rotation.y = t * c.speed * 0.06;

    const dispersal = 0.6 + c.spread * 1.4;
    const baseR = radius * dispersal;

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      // Distinct signal pattern per brainwave state via harmonicShift
      const h = c.harmonicShift;
      const wave1 = Math.sin(angle * harmonics * h + t * c.pulseRate * 4 + phaseOffset) * 0.06;
      const wave2 = Math.sin(angle * (harmonics * h * 2.3) + t * c.pulseRate * 6.5 + phaseOffset * 1.7) * 0.025;
      const wave3 = Math.sin(angle * (harmonics * h * 0.5) + t * c.pulseRate * 2 + phaseOffset * 0.4) * 0.035;
      const wave = (wave1 + wave2 + wave3) * c.intensity;
      const r = baseR + wave;

      dummy.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
      // Particle size spikes at waveform peaks
      const s = 0.005 + Math.abs(wave) * 1.8 + 0.002 * c.intensity;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.color.lerp(new THREE.Color().setHSL(c.hue / 360, 0.45, 0.6), 0.03);
    mat.opacity = 0.25 + c.intensity * 0.35;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, segments]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color="#88bbdd" transparent opacity={0.3} depthWrite={false} />
      </instancedMesh>
    </group>
  );
};

/* ── Scene ── */
const Scene: React.FC<{ moodRef: React.MutableRefObject<number> }> = ({ moodRef }) => (
  <>
    <ambientLight intensity={0.2} color="#c0d8ee" />
    <GlowCore moodRef={moodRef} />
    <ParticleCloud moodRef={moodRef} />
    <WaveformRing moodRef={moodRef} tilt={0.4} radius={0.55} harmonics={5} phaseOffset={0} />
    <WaveformRing moodRef={moodRef} tilt={-0.6} radius={0.65} harmonics={7} phaseOffset={2.1} />
    <WaveformRing moodRef={moodRef} tilt={1.2} radius={0.48} harmonics={4} phaseOffset={4.3} />
  </>
);

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

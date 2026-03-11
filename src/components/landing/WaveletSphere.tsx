import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Three Brainwave States ──
   Each state maps to a real brainwave frequency band with meaningful visual behavior:
   - Theta (4-8 Hz): Deep calm, pain distraction → slow drift, wide spread, large gentle waves
   - Alpha (8-12 Hz): Relaxation → moderate movement, warm color, medium amplitude
   - Low Beta (12-20 Hz): Focus → tight formation, fast precise pulses, concentrated energy
*/
const STATES = [
  {
    name: 'Theta',
    label: 'Calm',
    subtitle: 'Pain Distraction',
    hue: 174,        // Teal #2DD4BF — calming, therapeutic
    saturation: 0.7,
    lightness: 0.55,
    speed: 0.25,      // Very slow drift — meditative
    amplitude: 0.22,  // Large, deep undulations
    pulseRate: 0.006,  // Slow breathing rhythm
    spread: 0.32,     // Wide, expansive cloud
    harmonicShift: 0.25,
    brightness: 0.45,
    particleSpeed: 0.06, // Barely moving particles
    rotationSpeed: 0.015,
  },
  {
    name: 'Alpha',
    label: 'Relax',
    subtitle: 'Restoration',
    hue: 38,          // Warm amber — soothing
    saturation: 0.92,
    lightness: 0.58,
    speed: 0.55,      // Moderate flow
    amplitude: 0.14,  // Medium wave height
    pulseRate: 0.014,  // Steady, rhythmic
    spread: 0.24,     // Medium radius
    harmonicShift: 0.5,
    brightness: 0.65,
    particleSpeed: 0.12,
    rotationSpeed: 0.03,
  },
  {
    name: 'Low Beta',
    label: 'Focus',
    subtitle: 'Concentration',
    hue: 217,         // Electric blue — alert, precise
    saturation: 0.95,
    lightness: 0.62,
    speed: 1.2,       // Fast, energized movement
    amplitude: 0.07,  // Tight, precise oscillations
    pulseRate: 0.028,  // Rapid pulsing
    spread: 0.12,     // Compact, concentrated
    harmonicShift: 0.8,
    brightness: 0.8,
    particleSpeed: 0.28, // Brisk particle motion
    rotationSpeed: 0.06,
  },
];

const CYCLE = 12000; // 12s per state
const INTRO_DURATION = 3.0; // seconds for chaotic → smooth

/* ── Particle Cloud ── */
const ParticleCloud: React.FC<{
  stateRef: React.MutableRefObject<number>;
  introProgress: React.MutableRefObject<number>;
}> = ({ stateRef, introProgress }) => {
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
        speed: 0.1 + Math.random() * 0.25,
        baseSize: 0.012 + Math.random() * 0.014,
        // Chaotic intro: random jitter seeds
        chaosFreq: 2 + Math.random() * 6,
        chaosAmp: 0.08 + Math.random() * 0.15,
      };
    }),
  []);

  const cur = useRef({
    hue: 217, saturation: 0.8, lightness: 0.6,
    speed: 0.25, amplitude: 0.08, pulseRate: 0.006,
    spread: 0.32, brightness: 0.7,
    particleSpeed: 0.06, rotationSpeed: 0.015,
  });

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const st = STATES[stateRef.current];
    const c = cur.current;
    const intro = introProgress.current;

    // Lerp all properties toward current state
    c.hue += (st.hue - c.hue) * 0.04;
    c.saturation += (st.saturation - c.saturation) * 0.05;
    c.lightness += (st.lightness - c.lightness) * 0.05;
    c.speed += (st.speed - c.speed) * 0.06;
    c.amplitude += (st.amplitude - c.amplitude) * 0.06;
    c.pulseRate += (st.pulseRate - c.pulseRate) * 0.06;
    c.spread += (st.spread - c.spread) * 0.05;
    c.brightness += (st.brightness - c.brightness) * 0.04;
    c.particleSpeed += (st.particleSpeed - c.particleSpeed) * 0.05;
    c.rotationSpeed += (st.rotationSpeed - c.rotationSpeed) * 0.05;

    const introHue = intro < 1 ? THREE.MathUtils.lerp(200, c.hue, intro) : c.hue;
    const introSat = intro < 1 ? THREE.MathUtils.lerp(0.6, c.saturation, intro) : c.saturation;
    const introLight = intro < 1 ? THREE.MathUtils.lerp(0.55, c.lightness, intro) : c.lightness;

    const globalPulse = Math.sin(t * c.pulseRate * Math.PI) * 0.5 + 0.5;
    const breathe = Math.sin(t * c.speed * 0.15) * 0.5 + 0.5;
    const dispersal = 0.6 + c.spread * 1.4;

    const chaosWeight = Math.max(0, 1 - intro);

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      const particlePulse = Math.sin(t * c.pulseRate * Math.PI + p.phase) * 0.5 + 0.5;

      // Radius driven by state amplitude — Theta = wide waves, Beta = tight pulses
      let r = p.restRadius * dispersal
        + particlePulse * 0.15 * c.amplitude
        + breathe * 0.04
        + Math.sin(t * c.particleSpeed * 2 + p.phase) * 0.05 * c.amplitude;

      r += chaosWeight * Math.sin(t * p.chaosFreq + p.phase) * p.chaosAmp;

      // Particle orbital speed driven by state — Beta orbits fast, Theta barely moves
      const drift = t * p.speed * c.particleSpeed;
      const chaosDrift = chaosWeight * Math.sin(t * p.chaosFreq * 0.7 + p.phase * 2) * 0.06;

      const dx = p.dir.x * Math.cos(drift) - p.dir.z * Math.sin(drift);
      const dz = p.dir.x * Math.sin(drift) + p.dir.z * Math.cos(drift);

      dummy.position.set(
        dx * r + chaosDrift,
        p.dir.y * r + chaosWeight * Math.sin(t * p.chaosFreq * 1.3 + p.phase) * 0.04,
        dz * r,
      );

      const s = p.baseSize * (0.7 + particlePulse * c.amplitude * 1.2 + globalPulse * 0.15);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    const lightness = 0.5 + introLight * 0.3 + globalPulse * 0.06 * c.amplitude;
    mat.color.lerp(new THREE.Color().setHSL(introHue / 360, introSat, lightness), 0.07);
    mat.opacity = 0.85 + c.brightness * 0.15 + globalPulse * 0.1 * c.amplitude;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#3B82F6" transparent opacity={0.85} depthWrite={false} />
    </instancedMesh>
  );
};

/* ── Inner Glow Core ── */
const GlowCore: React.FC<{
  stateRef: React.MutableRefObject<number>;
  introProgress: React.MutableRefObject<number>;
}> = ({ stateRef, introProgress }) => {
  const ref = useRef<THREE.Mesh>(null);
  const cur = useRef({ hue: 217, saturation: 0.8, amplitude: 0.08, pulseRate: 0.015, brightness: 0.7 });

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const st = STATES[stateRef.current];
    const c = cur.current;
    const intro = introProgress.current;

    c.hue += (st.hue - c.hue) * 0.04;
    c.saturation += (st.saturation - c.saturation) * 0.05;
    c.amplitude += (st.amplitude - c.amplitude) * 0.06;
    c.pulseRate += (st.pulseRate - c.pulseRate) * 0.06;
    c.brightness += (st.brightness - c.brightness) * 0.04;

    const pulse = Math.sin(t * c.pulseRate * Math.PI) * 0.5 + 0.5;
    const scale = 0.18 + pulse * 0.06 * c.amplitude + c.brightness * 0.08;
    ref.current.scale.setScalar(scale);

    const mat = ref.current.material as THREE.MeshBasicMaterial;
    const introHue = intro < 1 ? THREE.MathUtils.lerp(200, c.hue, intro) : c.hue;
    const introSat = intro < 1 ? THREE.MathUtils.lerp(0.6, c.saturation, intro) : c.saturation;
    const coreLightness = 0.5 + c.brightness * 0.35 + pulse * 0.12 * c.amplitude;
    mat.color.lerp(new THREE.Color().setHSL(introHue / 360, introSat, coreLightness), 0.07);
    mat.opacity = 0.3 + c.brightness * 0.4 + pulse * 0.3 * c.amplitude;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} depthWrite={false} />
    </mesh>
  );
};

/* ── Waveform Ring ── */
const WaveformRing: React.FC<{
  stateRef: React.MutableRefObject<number>;
  introProgress: React.MutableRefObject<number>;
  tilt: number;
  radius: number;
  harmonics: number;
  phaseOffset: number;
}> = ({ stateRef, introProgress, tilt, radius, harmonics, phaseOffset }) => {
  const segments = 64;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const cur = useRef({
    hue: 220, saturation: 0.1, speed: 0.25, amplitude: 0.08,
    pulseRate: 0.006, spread: 0.32, harmonicShift: 0.25, rotationSpeed: 0.015,
  });

  // Random chaos seeds per segment
  const chaoSeeds = useMemo(() =>
    Array.from({ length: segments }, () => ({
      freq: 3 + Math.random() * 8,
      amp: 0.03 + Math.random() * 0.08,
      phase: Math.random() * Math.PI * 2,
    })),
  []);

  useFrame(({ clock }) => {
    if (!meshRef.current || !groupRef.current) return;
    const t = clock.getElapsedTime();
    const st = STATES[stateRef.current];
    const c = cur.current;
    const intro = introProgress.current;
    const chaosWeight = Math.max(0, 1 - intro);

    c.hue += (st.hue - c.hue) * 0.04;
    c.saturation += (st.saturation - c.saturation) * 0.05;
    c.speed += (st.speed - c.speed) * 0.06;
    c.amplitude += (st.amplitude - c.amplitude) * 0.06;
    c.pulseRate += (st.pulseRate - c.pulseRate) * 0.06;
    c.spread += (st.spread - c.spread) * 0.05;
    c.harmonicShift += (st.harmonicShift - c.harmonicShift) * 0.05;
    c.rotationSpeed += (st.rotationSpeed - c.rotationSpeed) * 0.05;

    groupRef.current.rotation.x = tilt;
    groupRef.current.rotation.z = t * c.rotationSpeed;
    groupRef.current.rotation.y = t * c.rotationSpeed * 0.5;

    const dispersal = 0.6 + c.spread * 1.4;
    const baseR = radius * dispersal;

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const h = c.harmonicShift;
      const wave1 = Math.sin(angle * harmonics * h + t * c.pulseRate * 4 + phaseOffset) * 0.06;
      const wave2 = Math.sin(angle * (harmonics * h * 2.3) + t * c.pulseRate * 6.5 + phaseOffset * 1.7) * 0.025;
      const wave3 = Math.sin(angle * (harmonics * h * 0.5) + t * c.pulseRate * 2 + phaseOffset * 0.4) * 0.035;
      let wave = (wave1 + wave2 + wave3) * c.amplitude;

      // Chaotic overlay: jagged spikes
      const cs = chaoSeeds[i];
      wave += chaosWeight * Math.sin(t * cs.freq + cs.phase) * cs.amp;

      const r = baseR + wave;

      dummy.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
      const s = 0.008 + Math.abs(wave) * 2.5 + 0.004 * c.amplitude;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    const introHue = intro < 1 ? THREE.MathUtils.lerp(200, c.hue, intro) : c.hue;
    const introSat = intro < 1 ? THREE.MathUtils.lerp(0.6, c.saturation, intro) : c.saturation;
    mat.color.lerp(new THREE.Color().setHSL(introHue / 360, introSat, 0.7), 0.07);
    mat.opacity = 0.65 + c.amplitude * 0.35;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, segments]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color="#2563eb" transparent opacity={0.65} depthWrite={false} />
      </instancedMesh>
    </group>
  );
};

/* ── Scene ── */
const Scene: React.FC<{
  stateRef: React.MutableRefObject<number>;
  introProgress: React.MutableRefObject<number>;
}> = ({ stateRef, introProgress }) => {
  // Drive intro progress inside the render loop
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    introProgress.current = Math.min(1, t / INTRO_DURATION);
  });

  return (
    <>
      <ambientLight intensity={0.3} color="#60a5fa" />
      <GlowCore stateRef={stateRef} introProgress={introProgress} />
      <ParticleCloud stateRef={stateRef} introProgress={introProgress} />
      <WaveformRing stateRef={stateRef} introProgress={introProgress} tilt={0.4} radius={0.55} harmonics={5} phaseOffset={0} />
      <WaveformRing stateRef={stateRef} introProgress={introProgress} tilt={-0.6} radius={0.65} harmonics={7} phaseOffset={2.1} />
      <WaveformRing stateRef={stateRef} introProgress={introProgress} tilt={1.2} radius={0.48} harmonics={4} phaseOffset={4.3} />
    </>
  );
};

/* ── Export ── */
interface WaveletSphereProps {
  className?: string;
  dark?: boolean;
}

export const WaveletSphere: React.FC<WaveletSphereProps> = ({ className = '' }) => {
  const stateRef = useRef(0);
  const introProgress = useRef(0);
  const [label, setLabel] = useState(`${STATES[0].name} · ${STATES[0].label}`);
  const [subtitle, setSubtitle] = useState(STATES[0].subtitle);
  const [stateColor, setStateColor] = useState(STATES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      stateRef.current = (stateRef.current + 1) % STATES.length;
      const s = STATES[stateRef.current];
      setLabel(`${s.name} · ${s.label}`);
      setSubtitle(s.subtitle);
      setStateColor(s);
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
        <Scene stateRef={stateRef} introProgress={introProgress} />
      </Canvas>

      {/* State label */}
      <div
        className="absolute bottom-3 left-0 right-0 flex flex-col items-center pointer-events-none gap-0.5"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
      >
        <div
          className="px-4 py-1.5 rounded-full flex flex-col items-center"
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
            color: `hsl(${stateColor.hue}, ${Math.round(stateColor.saturation * 100)}%, ${Math.round(stateColor.lightness * 100)}%)`,
            transition: 'color 1.5s ease',
          }}>
            {label.toUpperCase()}
          </span>
          <span style={{
            fontSize: '7px',
            letterSpacing: '0.08em',
            fontWeight: 400,
            color: 'hsla(0, 0%, 100%, 0.35)',
            transition: 'opacity 1.5s ease',
            marginTop: '1px',
          }}>
            {subtitle.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

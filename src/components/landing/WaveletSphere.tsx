import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Three Brainwave States ── */
const STATES = [
  {
    name: 'Theta',
    label: 'Pain Relief',
    hue: 174,        // Teal #2DD4BF
    saturation: 0.64,
    lightness: 0.57,
    speed: 1.5,       // 1.5s per cycle → freq multiplier
    amplitude: 0.12,  // large, deep waves
    pulseRate: 0.012,
    spread: 0.18,
    harmonicShift: 0.35,
    brightness: 0.5,
  },
  {
    name: 'Alpha',
    label: 'Relax',
    hue: 43,          // Gold #F59E0B
    saturation: 0.92,
    lightness: 0.50,
    speed: 0.8,
    amplitude: 0.09,
    pulseRate: 0.018,
    spread: 0.2,
    harmonicShift: 0.5,
    brightness: 0.55,
  },
  {
    name: 'Low Beta',
    label: 'Focus',
    hue: 217,         // Blue #3B82F6
    saturation: 0.91,
    lightness: 0.60,
    speed: 0.4,        // crisp, faster pulses
    amplitude: 0.06,   // tight, controlled
    pulseRate: 0.025,
    spread: 0.15,
    harmonicShift: 0.7,
    brightness: 0.6,
  },
];

const CYCLE = 10000; // 10s per state
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
    hue: 0, saturation: 0.3, lightness: 0.5,
    speed: 1.0, amplitude: 0.08, pulseRate: 0.015,
    spread: 0.2, brightness: 0.45,
  });

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const st = STATES[stateRef.current];
    const c = cur.current;
    const intro = introProgress.current; // 0 = chaotic, 1 = smooth

    // Smooth lerp toward current state
    c.hue += (st.hue - c.hue) * 0.015;
    c.saturation += (st.saturation - c.saturation) * 0.02;
    c.lightness += (st.lightness - c.lightness) * 0.02;
    c.speed += (st.speed - c.speed) * 0.025;
    c.amplitude += (st.amplitude - c.amplitude) * 0.025;
    c.pulseRate += (st.pulseRate - c.pulseRate) * 0.025;
    c.spread += (st.spread - c.spread) * 0.02;
    c.brightness += (st.brightness - c.brightness) * 0.015;

    // During intro: lerp from gray toward state color
    const introHue = intro < 1 ? THREE.MathUtils.lerp(220, c.hue, intro) : c.hue;
    const introSat = intro < 1 ? THREE.MathUtils.lerp(0.05, c.saturation, intro) : c.saturation;
    const introLight = intro < 1 ? THREE.MathUtils.lerp(0.35, c.lightness, intro) : c.lightness;

    const globalPulse = Math.sin(t * c.pulseRate * Math.PI) * 0.5 + 0.5;
    const breathe = Math.sin(t * c.speed * 0.15) * 0.5 + 0.5;
    const dispersal = 0.6 + c.spread * 1.4;

    // Chaotic multiplier: jittery movement fades to 0 as intro → 1
    const chaosWeight = Math.max(0, 1 - intro);

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      const particlePulse = Math.sin(t * c.pulseRate * Math.PI + p.phase) * 0.5 + 0.5;

      // Smooth radius
      let r = p.restRadius * dispersal
        + particlePulse * 0.12 * c.amplitude
        + breathe * 0.03
        + Math.sin(t * p.speed * 0.1 + p.phase) * 0.04 * c.amplitude;

      // Chaotic jitter overlay
      r += chaosWeight * Math.sin(t * p.chaosFreq + p.phase) * p.chaosAmp;

      const drift = t * p.speed * c.speed * 0.01;
      const chaosDrift = chaosWeight * Math.sin(t * p.chaosFreq * 0.7 + p.phase * 2) * 0.06;

      const dx = p.dir.x * Math.cos(drift) - p.dir.z * Math.sin(drift);
      const dz = p.dir.x * Math.sin(drift) + p.dir.z * Math.cos(drift);

      dummy.position.set(
        dx * r + chaosDrift,
        p.dir.y * r + chaosWeight * Math.sin(t * p.chaosFreq * 1.3 + p.phase) * 0.04,
        dz * r,
      );

      const s = p.baseSize * (0.7 + particlePulse * c.amplitude * 1.0 + globalPulse * 0.15);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    const lightness = 0.45 + introLight * 0.35 + globalPulse * 0.06 * c.amplitude;
    mat.color.lerp(new THREE.Color().setHSL(introHue / 360, introSat, lightness), 0.025);
    mat.opacity = 0.6 + c.brightness * 0.25 + globalPulse * 0.1 * c.amplitude;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#888" transparent opacity={0.7} depthWrite={false} />
    </instancedMesh>
  );
};

/* ── Inner Glow Core ── */
const GlowCore: React.FC<{
  stateRef: React.MutableRefObject<number>;
  introProgress: React.MutableRefObject<number>;
}> = ({ stateRef, introProgress }) => {
  const ref = useRef<THREE.Mesh>(null);
  const cur = useRef({ hue: 220, saturation: 0.1, amplitude: 0.08, pulseRate: 0.015, brightness: 0.35 });

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const st = STATES[stateRef.current];
    const c = cur.current;
    const intro = introProgress.current;

    c.hue += (st.hue - c.hue) * 0.015;
    c.saturation += (st.saturation - c.saturation) * 0.02;
    c.amplitude += (st.amplitude - c.amplitude) * 0.025;
    c.pulseRate += (st.pulseRate - c.pulseRate) * 0.025;
    c.brightness += (st.brightness - c.brightness) * 0.015;

    const pulse = Math.sin(t * c.pulseRate * Math.PI) * 0.5 + 0.5;
    const scale = 0.18 + pulse * 0.06 * c.amplitude + c.brightness * 0.08;
    ref.current.scale.setScalar(scale);

    const mat = ref.current.material as THREE.MeshBasicMaterial;
    const introHue = intro < 1 ? THREE.MathUtils.lerp(220, c.hue, intro) : c.hue;
    const introSat = intro < 1 ? THREE.MathUtils.lerp(0.05, c.saturation, intro) : c.saturation;
    const coreLightness = 0.4 + c.brightness * 0.4 + pulse * 0.12 * c.amplitude;
    mat.color.lerp(new THREE.Color().setHSL(introHue / 360, introSat, coreLightness), 0.03);
    mat.opacity = 0.1 + c.brightness * 0.3 + pulse * 0.3 * c.amplitude;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial color="#888" transparent opacity={0.15} depthWrite={false} />
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
    hue: 220, saturation: 0.1, speed: 1.0, amplitude: 0.08,
    pulseRate: 0.015, spread: 0.2, harmonicShift: 0.5,
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

    c.hue += (st.hue - c.hue) * 0.015;
    c.saturation += (st.saturation - c.saturation) * 0.02;
    c.speed += (st.speed - c.speed) * 0.025;
    c.amplitude += (st.amplitude - c.amplitude) * 0.025;
    c.pulseRate += (st.pulseRate - c.pulseRate) * 0.025;
    c.spread += (st.spread - c.spread) * 0.02;
    c.harmonicShift += (st.harmonicShift - c.harmonicShift) * 0.02;

    groupRef.current.rotation.x = tilt;
    groupRef.current.rotation.z = t * c.speed * 0.04;
    groupRef.current.rotation.y = t * c.speed * 0.02;

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
    const introHue = intro < 1 ? THREE.MathUtils.lerp(220, c.hue, intro) : c.hue;
    const introSat = intro < 1 ? THREE.MathUtils.lerp(0.1, c.saturation, intro) : c.saturation;
    mat.color.lerp(new THREE.Color().setHSL(introHue / 360, introSat, 0.7), 0.03);
    mat.opacity = 0.4 + c.amplitude * 0.4;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, segments]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color="#888" transparent opacity={0.5} depthWrite={false} />
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
      <ambientLight intensity={0.2} color="#c0d8ee" />
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
  const [stateColor, setStateColor] = useState(STATES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      stateRef.current = (stateRef.current + 1) % STATES.length;
      const s = STATES[stateRef.current];
      setLabel(`${s.name} · ${s.label}`);
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
            color: `hsl(${stateColor.hue}, ${Math.round(stateColor.saturation * 100)}%, ${Math.round(stateColor.lightness * 100)}%)`,
            transition: 'color 1.5s ease',
          }}>
            {label.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

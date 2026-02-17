import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Mood States ── */
const MOODS = [
  { name: 'Calm', color: [0.35, 0.55, 0.85], speed: 0.3, intensity: 0.4, scale: 1.0, particleSpread: 1.2 },
  { name: 'Focus', color: [0.3, 0.75, 0.8], speed: 0.6, intensity: 0.6, scale: 0.95, particleSpread: 0.9 },
  { name: 'Energy', color: [0.85, 0.55, 0.3], speed: 1.2, intensity: 0.9, scale: 1.1, particleSpread: 1.6 },
  { name: 'Relief', color: [0.5, 0.7, 0.55], speed: 0.4, intensity: 0.5, scale: 1.05, particleSpread: 1.1 },
] as const;

const CYCLE_DURATION = 5; // seconds per mood

/* ── Reactive Sphere Core ── */
const ReactiveCore: React.FC<{ mood: typeof MOODS[number]; moodProgress: number; transitionFactor: number }> = ({ mood, moodProgress, transitionFactor }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const geoRef = useRef<THREE.SphereGeometry>(null);

  // Store original positions for vertex displacement
  const originalPositions = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.85, 64, 64);
    return Float32Array.from(geo.attributes.position.array);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (meshRef.current && geoRef.current) {
      // Morphing scale based on mood
      const targetScale = mood.scale + Math.sin(t * mood.speed * 2) * 0.03 * mood.intensity;
      const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.05);
      meshRef.current.scale.set(s, s, s);
      meshRef.current.rotation.y = t * 0.08;

      // Waveform vertex displacement — music ripples across the surface
      const positions = geoRef.current.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const ox = originalPositions[i];
        const oy = originalPositions[i + 1];
        const oz = originalPositions[i + 2];
        const dist = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const theta = Math.atan2(oz, ox);
        const phi = Math.acos(oy / dist);

        // Multiple wave frequencies to simulate music
        const wave1 = Math.sin(theta * 4 + t * mood.speed * 5) * 0.02 * mood.intensity;
        const wave2 = Math.sin(phi * 6 - t * mood.speed * 3) * 0.015 * mood.intensity;
        const wave3 = Math.sin((theta + phi) * 3 + t * mood.speed * 7) * 0.01 * mood.intensity;
        const displacement = 1 + (wave1 + wave2 + wave3) * transitionFactor;

        positions[i] = ox * displacement;
        positions[i + 1] = oy * displacement;
        positions[i + 2] = oz * displacement;
      }
      geoRef.current.attributes.position.needsUpdate = true;
      geoRef.current.computeVertexNormals();

      // Color transition
      const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
      const [r, g, b] = mood.color;
      mat.color.lerp(new THREE.Color(r, g, b), 0.03);
      mat.emissive.lerp(new THREE.Color(r * 0.15, g * 0.15, b * 0.15), 0.03);
      mat.emissiveIntensity = 0.3 + mood.intensity * 0.4 * Math.sin(t * mood.speed * 2) * 0.5 + 0.5;
    }

    // Aura glow
    if (glowRef.current) {
      const glowScale = mood.scale * 1.2 + Math.sin(t * mood.speed * 1.5) * 0.04 * mood.intensity;
      glowRef.current.scale.set(glowScale, glowScale, glowScale);
      const gMat = glowRef.current.material as THREE.MeshBasicMaterial;
      const [r, g, b] = mood.color;
      gMat.color.lerp(new THREE.Color(r, g, b), 0.03);
      gMat.opacity = 0.06 + mood.intensity * 0.08;
    }
  });

  return (
    <group>
      {/* Mood-reactive aura */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial color={new THREE.Color(...mood.color)} transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
      {/* Core sphere with waveform displacement */}
      <mesh ref={meshRef}>
        <sphereGeometry ref={geoRef} args={[0.85, 64, 64]} />
        <meshPhysicalMaterial
          color={new THREE.Color(...mood.color)}
          roughness={0.6}
          metalness={0.05}
          clearcoat={0.6}
          clearcoatRoughness={0.4}
          transparent
          opacity={0.45}
          emissive={new THREE.Color(mood.color[0] * 0.1, mood.color[1] * 0.1, mood.color[2] * 0.1)}
          emissiveIntensity={0.3}
          envMapIntensity={0.5}
          sheen={0.4}
          sheenColor={new THREE.Color(mood.color[0] * 0.5 + 0.5, mood.color[1] * 0.5 + 0.5, mood.color[2] * 0.5 + 0.5)}
        />
      </mesh>
    </group>
  );
};

/* ── Reactive Particle Field ── */
const ParticleField: React.FC<{ mood: typeof MOODS[number]; transitionFactor: number }> = ({ mood, transitionFactor }) => {
  const count = 200;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particleData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      basePos: new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
      ).normalize().multiplyScalar(0.9 + Math.random() * 0.8),
      speed: 0.2 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      size: 0.005 + Math.random() * 0.012,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    particleData.forEach((p, i) => {
      const spread = mood.particleSpread;
      const musicPulse = Math.sin(t * mood.speed * 3 + p.phase) * 0.15 * mood.intensity;
      const breathe = Math.sin(t * mood.speed * 0.8 + p.phase * 0.5) * 0.1;

      const r = (1 + musicPulse + breathe) * spread;
      dummy.position.set(
        p.basePos.x * r,
        p.basePos.y * r,
        p.basePos.z * r,
      );

      const s = p.size * (1 + Math.sin(t * mood.speed * 4 + p.phase) * 0.5 * mood.intensity) * transitionFactor;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;

    // Color transition
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    const [r, g, b] = mood.color;
    mat.color.lerp(new THREE.Color(r * 0.7 + 0.3, g * 0.7 + 0.3, b * 0.7 + 0.3), 0.03);
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="white" transparent opacity={0.5} />
    </instancedMesh>
  );
};

/* ── Orbiting Rings — show waveform energy ── */
const WaveRing: React.FC<{ mood: typeof MOODS[number]; radius: number; tilt: number }> = ({ mood, radius, tilt }) => {
  const ref = useRef<THREE.Group>(null);
  const segments = 60;
  const dotsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!ref.current || !dotsRef.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = tilt;
    ref.current.rotation.y = t * mood.speed * 0.3;

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const wave = Math.sin(angle * 8 + t * mood.speed * 5) * 0.05 * mood.intensity;
      const r = radius + wave;

      dummy.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
      const s = 0.008 + Math.abs(wave) * 0.15;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      dotsRef.current!.setMatrixAt(i, dummy.matrix);
    }
    dotsRef.current.instanceMatrix.needsUpdate = true;

    const mat = dotsRef.current.material as THREE.MeshBasicMaterial;
    const [r, g, b] = mood.color;
    mat.color.lerp(new THREE.Color(r * 0.6 + 0.4, g * 0.6 + 0.4, b * 0.6 + 0.4), 0.05);
  });

  return (
    <group ref={ref}>
      <instancedMesh ref={dotsRef} args={[undefined, undefined, segments]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color="white" transparent opacity={0.4} />
      </instancedMesh>
    </group>
  );
};

/* ── Mood Label ── */
const MoodLabel: React.FC<{ mood: typeof MOODS[number]; progress: number }> = ({ mood, progress }) => {
  const ref = useRef<HTMLDivElement>(null);
  return null; // Label rendered in HTML overlay
};

/* ── Scene Controller ── */
const Scene: React.FC = () => {
  const [moodIndex, setMoodIndex] = useState(0);
  const [transitionFactor, setTransitionFactor] = useState(1);
  const phaseRef = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const cyclePos = (t % (CYCLE_DURATION * MOODS.length)) / CYCLE_DURATION;
    const newIndex = Math.floor(cyclePos) % MOODS.length;

    if (newIndex !== moodIndex) {
      setMoodIndex(newIndex);
      setTransitionFactor(0);
    }

    // Smooth transition ramp-up
    setTransitionFactor((prev) => Math.min(1, prev + 0.012));
    phaseRef.current = cyclePos % 1;
  });

  const mood = MOODS[moodIndex];

  return (
    <>
      <ambientLight intensity={0.4} color="#d0e0f0" />
      <directionalLight position={[3, 4, 5]} intensity={0.6} color="#e0eaf5" />
      <directionalLight position={[-2, 1, -4]} intensity={0.2} color="#c0d5e8" />
      <pointLight
        position={[0, 0, 0]}
        intensity={0.2 + mood.intensity * 0.3}
        color={new THREE.Color(...mood.color)}
        distance={4}
      />

      <ReactiveCore mood={mood} moodProgress={phaseRef.current} transitionFactor={transitionFactor} />
      <ParticleField mood={mood} transitionFactor={transitionFactor} />
      <WaveRing mood={mood} radius={1.15} tilt={0.4} />
      <WaveRing mood={mood} radius={1.25} tilt={-0.6} />
    </>
  );
};

/* ── Export with HTML overlay ── */
interface WaveletSphereProps {
  className?: string;
  dark?: boolean;
}

export const WaveletSphere: React.FC<WaveletSphereProps> = ({ className = '' }) => {
  const [moodIndex, setMoodIndex] = useState(0);

  // Sync label with 3D scene
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMoodIndex((prev) => (prev + 1) % MOODS.length);
    }, CYCLE_DURATION * 1000);
    return () => clearInterval(interval);
  }, []);

  const mood = MOODS[moodIndex];

  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>

      {/* Mood label overlay */}
      <div
        className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
      >
        <div
          className="px-3 py-1.5 rounded-full"
          style={{
            background: 'hsla(220, 20%, 8%, 0.6)',
            border: '1px solid hsla(0, 0%, 100%, 0.08)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <span style={{
            fontSize: '9px',
            letterSpacing: '0.12em',
            fontWeight: 400,
            color: `rgb(${Math.round(mood.color[0] * 200 + 55)}, ${Math.round(mood.color[1] * 200 + 55)}, ${Math.round(mood.color[2] * 200 + 55)})`,
            transition: 'color 0.8s',
          }}>
            {mood.name.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

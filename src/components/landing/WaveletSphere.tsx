import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

const WaveletRing: React.FC<{ radius: number; speed: number; phase: number; color: string; yOffset: number }> = ({
  radius, speed, phase, color, yOffset
}) => {
  const ref = useRef<THREE.Line>(null);
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      pts.push(new THREE.Vector3(x, yOffset, z));
    }
    return pts;
  }, [radius, yOffset]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const positions = ref.current.geometry.attributes.position;
    const time = clock.getElapsedTime() * speed + phase;
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const wave = Math.sin(angle * 6 + time) * 0.04 + Math.sin(angle * 10 + time * 1.5) * 0.02;
      const r = radius + wave;
      positions.setXYZ(
        i,
        Math.cos(angle) * r,
        yOffset + Math.sin(angle * 8 + time * 0.7) * 0.03,
        Math.sin(angle) * r
      );
    }
    positions.needsUpdate = true;
  });

  return (
    <line ref={ref as any}>
      <bufferGeometry attach="geometry" {...geometry} />
      <lineBasicMaterial attach="material" color={color} transparent opacity={0.4} linewidth={1} />
    </line>
  );
};

const SignalTrace: React.FC<{ rotationY: number; speed: number; color: string }> = ({ rotationY, speed, color }) => {
  const ref = useRef<THREE.Line>(null);
  const segments = 100;

  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI;
      pts.push(new THREE.Vector3(
        Math.sin(t) * 1.15,
        Math.cos(t) * 1.15,
        0
      ));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const positions = ref.current.geometry.attributes.position;
    const time = clock.getElapsedTime() * speed;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI;
      const baseR = 1.15;
      const wave = Math.sin(t * 12 + time) * 0.03 + Math.sin(t * 20 + time * 2) * 0.015;
      const r = baseR + wave;
      positions.setXYZ(i, Math.sin(t) * r, Math.cos(t) * r, 0);
    }
    positions.needsUpdate = true;
  });

  return (
    <group rotation={[0, rotationY, 0]}>
      <line ref={ref as any}>
        <bufferGeometry attach="geometry" {...geometry} />
        <lineBasicMaterial attach="material" color={color} transparent opacity={0.3} />
      </line>
    </group>
  );
};

const GlassSphere: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.4}
          chromaticAberration={0.15}
          anisotropy={0.2}
          distortion={0.1}
          distortionScale={0.2}
          temporalDistortion={0.1}
          ior={1.25}
          color="hsl(200, 30%, 90%)"
          roughness={0.05}
          transmission={0.98}
        />
      </mesh>

      {/* Wavelet rings around the sphere */}
      <WaveletRing radius={1.08} speed={1.2} phase={0} color="#88bbee" yOffset={0} />
      <WaveletRing radius={1.06} speed={0.9} phase={1.5} color="#99ccff" yOffset={0.25} />
      <WaveletRing radius={1.07} speed={1.5} phase={3} color="#77aadd" yOffset={-0.25} />
      <WaveletRing radius={1.05} speed={0.7} phase={4.5} color="#aaddff" yOffset={0.5} />
      <WaveletRing radius={1.04} speed={1.1} phase={2} color="#88ccee" yOffset={-0.5} />

      {/* Meridian signal traces */}
      <SignalTrace rotationY={0} speed={1.3} color="#99bbdd" />
      <SignalTrace rotationY={Math.PI / 3} speed={1.0} color="#88aacc" />
      <SignalTrace rotationY={(Math.PI * 2) / 3} speed={1.6} color="#aaccee" />
    </group>
  );
};

interface WaveletSphereProps {
  className?: string;
  dark?: boolean;
}

export const WaveletSphere: React.FC<WaveletSphereProps> = ({ className = '', dark = false }) => {
  return (
    <div className={`${className}`} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 2, -5]} intensity={0.3} color="hsl(200, 50%, 80%)" />
        <GlassSphere />
        <Environment preset={dark ? 'night' : 'city'} />
      </Canvas>
    </div>
  );
};

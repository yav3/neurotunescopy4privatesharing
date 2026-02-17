import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';

const WaveletRing: React.FC<{ radius: number; speed: number; phase: number; color: string; yOffset: number }> = ({
  radius, speed, phase, color, yOffset
}) => {
  const segments = 128;
  const positions = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push([Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius]);
    }
    return pts;
  }, [radius, yOffset]);

  const ref = useRef<[number, number, number][]>(positions);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * speed + phase;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const wave = Math.sin(angle * 6 + time) * 0.04 + Math.sin(angle * 10 + time * 1.5) * 0.02;
      const r = radius + wave;
      ref.current[i] = [
        Math.cos(angle) * r,
        yOffset + Math.sin(angle * 8 + time * 0.7) * 0.03,
        Math.sin(angle) * r
      ];
    }
  });

  return (
    <Line points={positions} color={color} transparent opacity={0.4} lineWidth={1} />
  );
};

const SignalTrace: React.FC<{ rotationY: number; speed: number; color: string }> = ({ rotationY, speed, color }) => {
  const segments = 100;

  const positions = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI;
      pts.push([Math.sin(t) * 1.15, Math.cos(t) * 1.15, 0]);
    }
    return pts;
  }, []);

  return (
    <group rotation={[0, rotationY, 0]}>
      <Line points={positions} color={color} transparent opacity={0.3} lineWidth={1} />
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
          thickness={0.2}
          chromaticAberration={0.08}
          anisotropy={0.1}
          distortion={0.05}
          distortionScale={0.1}
          temporalDistortion={0.05}
          ior={1.15}
          color="hsl(210, 25%, 92%)"
          roughness={0.15}
          transmission={0.95}
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
        <ambientLight intensity={0.8} color="hsl(210, 30%, 95%)" />
        <directionalLight position={[5, 5, 5]} intensity={1.0} color="hsl(210, 20%, 98%)" />
        <directionalLight position={[-3, 2, -5]} intensity={0.5} color="hsl(210, 40%, 90%)" />
        <GlassSphere />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
};

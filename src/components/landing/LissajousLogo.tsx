import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LissajousLogoProps {
  opacity?: number;
  scale?: number;
  onDrawComplete?: () => void;
}

export const LissajousLogo: React.FC<LissajousLogoProps> = ({ 
  opacity = 1, 
  scale = 1,
  onDrawComplete 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const tube1Ref = useRef<THREE.Mesh>(null);
  const tube2Ref = useRef<THREE.Mesh>(null);
  const [drawProgress, setDrawProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Create the intertwined infinity curve (Lissajous-style figure-8 knot)
  const { geometry1, geometry2, indexCount1, indexCount2 } = useMemo(() => {
    const points1: THREE.Vector3[] = [];
    const points2: THREE.Vector3[] = [];
    const segments = 200;
    
    // First infinity loop (horizontal figure-8)
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      
      // Lemniscate of Bernoulli (infinity shape) scaled and positioned
      const a = 1.8;
      const denom = 1 + Math.sin(t) * Math.sin(t);
      const x = (a * Math.cos(t)) / denom;
      const y = (a * Math.sin(t) * Math.cos(t)) / denom;
      const z = Math.sin(t * 2) * 0.3;
      
      points1.push(new THREE.Vector3(x, y * 0.6 + 0.3, z));
    }
    
    // Second infinity loop (rotated and offset to interlock)
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      
      const a = 1.8;
      const denom = 1 + Math.sin(t) * Math.sin(t);
      const x = (a * Math.cos(t)) / denom;
      const y = (a * Math.sin(t) * Math.cos(t)) / denom;
      const z = Math.sin(t * 2 + Math.PI) * 0.3;
      
      points2.push(new THREE.Vector3(x, y * 0.6 - 0.3, z + 0.15));
    }
    
    // Create smooth curves
    const curve1 = new THREE.CatmullRomCurve3(points1, true);
    const curve2 = new THREE.CatmullRomCurve3(points2, true);
    
    // Create tube geometries
    const tubeRadius = 0.08;
    const radialSegments = 16;
    const tubularSegments = 200;
    
    const geo1 = new THREE.TubeGeometry(curve1, tubularSegments, tubeRadius, radialSegments, true);
    const geo2 = new THREE.TubeGeometry(curve2, tubularSegments, tubeRadius, radialSegments, true);
    
    // Get index counts for draw range (index buffer, not vertices)
    const idxCount1 = geo1.index ? geo1.index.count : geo1.attributes.position.count;
    const idxCount2 = geo2.index ? geo2.index.count : geo2.attributes.position.count;
    
    return { 
      geometry1: geo1, 
      geometry2: geo2,
      indexCount1: idxCount1,
      indexCount2: idxCount2
    };
  }, []);
  
  // Animate the draw progress
  useEffect(() => {
    const duration = 3000; // 3 seconds to draw
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth draw
      const eased = 1 - Math.pow(1 - progress, 3);
      setDrawProgress(eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (!isComplete) {
        setIsComplete(true);
        onDrawComplete?.();
      }
    };
    
    requestAnimationFrame(animate);
  }, [onDrawComplete, isComplete]);
  
  // Update draw range each frame
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation once complete
      if (isComplete) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
      }
    }
    
    // Update draw ranges for progressive reveal
    if (tube1Ref.current && tube1Ref.current.geometry) {
      const geo = tube1Ref.current.geometry as THREE.BufferGeometry;
      const drawCount = Math.floor(indexCount1 * drawProgress);
      geo.setDrawRange(0, drawCount);
    }
    
    if (tube2Ref.current && tube2Ref.current.geometry) {
      const geo = tube2Ref.current.geometry as THREE.BufferGeometry;
      // Second loop starts drawing slightly after the first
      const delayedProgress = Math.max(0, (drawProgress - 0.15) / 0.85);
      const drawCount = Math.floor(indexCount2 * delayedProgress);
      geo.setDrawRange(0, drawCount);
    }
  });
  
  // Chrome/platinum material
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.85, 0.85, 0.9),
    metalness: 0.95,
    roughness: 0.08,
    transparent: true,
    opacity: opacity,
    envMapIntensity: 1.5,
  }), [opacity]);
  
  return (
    <group ref={groupRef} scale={scale}>
      {/* First infinity loop */}
      <mesh ref={tube1Ref} geometry={geometry1} material={material} />
      
      {/* Second infinity loop */}
      <mesh ref={tube2Ref} geometry={geometry2} material={material} />
      
      {/* Subtle glow effect */}
      <pointLight 
        position={[0, 0, 1]} 
        intensity={0.5 * opacity} 
        color="#ffffff" 
        distance={3}
      />
    </group>
  );
};

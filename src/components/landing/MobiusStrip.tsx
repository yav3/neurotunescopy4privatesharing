import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MobiusStripProps {
  opacity?: number;
  scale?: number;
}

export const MobiusStrip: React.FC<MobiusStripProps> = ({ opacity = 1, scale = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create Möbius strip geometry using parametric equations
  const geometry = useMemo(() => {
    const segments = 128;
    const radialSegments = 32;
    const positions: number[] = [];
    const indices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    
    // Parametric Möbius strip:
    // x(u,v) = (1 + v/2 * cos(u/2)) * cos(u)
    // y(u,v) = (1 + v/2 * cos(u/2)) * sin(u)
    // z(u,v) = v/2 * sin(u/2)
    // where 0 ≤ u < 2π and -1 ≤ v ≤ 1
    
    for (let i = 0; i <= segments; i++) {
      const u = (i / segments) * Math.PI * 2;
      
      for (let j = 0; j <= radialSegments; j++) {
        const v = (j / radialSegments) * 2 - 1; // -1 to 1
        
        const halfU = u / 2;
        const cosHalfU = Math.cos(halfU);
        const sinHalfU = Math.sin(halfU);
        const cosU = Math.cos(u);
        const sinU = Math.sin(u);
        
        const radius = 1 + (v / 2) * cosHalfU;
        
        const x = radius * cosU;
        const y = radius * sinU;
        const z = (v / 2) * sinHalfU;
        
        positions.push(x, y, z);
        
        // Calculate normal (approximate)
        const nx = cosU * cosHalfU;
        const ny = sinU * cosHalfU;
        const nz = sinHalfU;
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
        normals.push(nx / len, ny / len, nz / len);
        
        uvs.push(i / segments, j / radialSegments);
      }
    }
    
    // Create indices for triangles
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = i * (radialSegments + 1) + j;
        const b = a + radialSegments + 1;
        const c = a + 1;
        const d = b + 1;
        
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    
    return geo;
  }, []);
  
  // Animate rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });
  
  return (
    <mesh ref={meshRef} geometry={geometry} scale={scale}>
      <meshStandardMaterial
        color="#ffffff"
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        emissive="#404040"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

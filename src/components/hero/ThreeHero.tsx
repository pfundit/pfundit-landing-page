'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

function ArchitecturalObject() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.1;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Precision Core */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshPhysicalMaterial 
          color="#0f1b3d"
          metalness={1}
          roughness={0.1}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Glass Envelope */}
      <mesh>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshPhysicalMaterial 
          transparent
          opacity={0.15}
          transmission={0.95}
          thickness={0.5}
          roughness={0}
          metalness={0}
          color="#ffffff"
        />
      </mesh>

      {/* Structural Framework */}
      <group>
        {[...Array(4)].map((_, i) => (
          <mesh key={i} rotation={[0, (i * Math.PI) / 2, 0]} position={[0, 0, 0.9]}>
            <boxGeometry args={[1.9, 0.02, 0.02]} />
            <meshStandardMaterial color="#D4A437" metalness={1} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Orbiting Precision Elements */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
        <mesh position={[2, 1, 0]}>
          <octahedronGeometry args={[0.2]} />
          <meshStandardMaterial color="#D4A437" metalness={1} roughness={0.1} />
        </mesh>
      </Float>
    </group>
  );
}

export function ThreeHero() {
  return (
    <div className="absolute top-0 right-0 w-full h-full lg:w-1/2 z-0 pointer-events-none opacity-60">
      <Canvas shadows dpr={[1, 2]} gl={{ alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={35} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#D4A437" />
        
        <PresentationControls
          global
          rotation={[0, 0.3, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
        >
          <ArchitecturalObject />
        </PresentationControls>
        
        <Environment preset="studio" />
        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={0.3} 
          scale={10} 
          blur={2.5} 
          far={4.5} 
        />
      </Canvas>
    </div>
  );
}

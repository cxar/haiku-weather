// app/components/Cloud.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, Material } from 'three';
import { useSpring } from '@react-spring/three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

interface CloudProps {
  position: [number, number, number];
  isContentLoaded: boolean;
}

export default function Cloud({ position, isContentLoaded }: CloudProps) {
  const cloudRef = useRef<Group>(null);
  const initialPos = useRef({
    x: position[0] - 1,
    y: position[1] - 1,
    z: position[2],
  });
  const time = useRef(Math.random() * 1000);
  const [model, setModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load('/models/clouds.glb', (gltf) => {
      setModel(gltf.scene);
    });
  }, []);

  const { opacity } = useSpring({
    opacity: isContentLoaded ? 0 : 1,
    config: { mass: 2, tension: 50, friction: 15 },
  });

  useFrame(() => {
    if (cloudRef.current && model) {
      time.current += 0.015;
      const x = initialPos.current.x + Math.sin(time.current * 0.5) * 0.05;
      const y = initialPos.current.y + Math.sin(time.current * 0.5) * 0.05;
      const z = initialPos.current.z + Math.cos(time.current * 0.5) * 0.05;
      cloudRef.current.position.set(x, y, z);

      model.traverse((child) => {
        if (child instanceof Mesh && child.material instanceof Material) {
          child.material.transparent = true;
          child.material.opacity = opacity.get();
        }
      });
    }
  });

  if (!model) return null;

  return (
    <group ref={cloudRef} scale={[8, 8, 8]}>
      <primitive object={model} />
    </group>
  );
}
// SkyScene.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Group, Mesh, Material } from 'three';
import { Sky } from '@react-three/drei';
import { useSpring } from '@react-spring/three';
import PoemDisplay from './PoemDisplay';
import { getLocation } from '@/lib/location';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

function HotAirBalloon({
  position,
  isContentLoaded,
}: {
  position: [number, number, number];
  isContentLoaded: boolean;
}) {
  const group = useRef<Group>(null);
  const initialPos = useRef({
    x: position[0] - 1,
    y: position[1] - 1,
    z: position[2] + 2,
  });
  const time = useRef(Math.random() * 1000);

  // State to hold the loaded model
  const [model, setModel] = useState<THREE.Group | null>(null);

  // Load the model using GLTFLoader
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load('/models/hot_air_balloon.glb', (gltf) => {
      setModel(gltf.scene);
    });
  }, []);

  // Opacity animation
  const { opacity } = useSpring({
    opacity: isContentLoaded ? 0 : 1,
    config: {
      mass: 5,
      tension: 25,
      friction: 22,
    },
  });

  useFrame(() => {
    if (group.current && model) {
      time.current += 0.01;

      const x = initialPos.current.x + Math.sin(time.current * 0.5) * 0.05;
      const y = initialPos.current.y + Math.sin(time.current * 0.5) * 0.05;
      const z = initialPos.current.z + Math.cos(time.current * 0.5) * 0.05;

      group.current.position.set(x, y, z);
      group.current.rotation.y += 0.0002;

      // Update the opacity of the model's materials
      model.traverse((child) => {
        if (child instanceof Mesh && child.material instanceof Material) {
          child.material.transparent = true;
          child.material.opacity = opacity.get();
        }
      });
    }
  });

  // Return null if the model hasn't loaded yet
  if (!model) return null;

  return (
    <group ref={group} scale={[0.025, 0.025, 0.025]}>
      <primitive object={model} />
    </group>
  );
}

function Cloud({
  position,
  isContentLoaded,
}: {
  position: [number, number, number];
  isContentLoaded: boolean;
}) {
  const cloudRef = useRef<Group>(null);
  const initialPos = useRef({
    x: position[0] - 1,
    y: position[1] - 1,
    z: position[2],
  });
  const time = useRef(Math.random() * 1000);

  // State to hold the loaded model
  const [model, setModel] = useState<THREE.Group | null>(null);

  // Load the model using GLTFLoader
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load('/models/clouds.glb', (gltf) => {
      setModel(gltf.scene);
    });
  }, []);

  // Opacity animation
  const { opacity } = useSpring({
    opacity: isContentLoaded ? 0 : 1,
    config: {
      mass: 5,
      tension: 25,
      friction: 22,
    },
  });

  useFrame(() => {
    if (cloudRef.current && model) {
      time.current += 0.01;

      const x = initialPos.current.x + Math.sin(time.current * 0.5) * 0.05;
      const y = initialPos.current.y + Math.sin(time.current * 0.5) * 0.05;
      const z = initialPos.current.z + Math.cos(time.current * 0.5) * 0.05;

      cloudRef.current.position.set(x, y, z);

      // Update the opacity of the model's materials
      model.traverse((child) => {
        if (child instanceof Mesh && child.material instanceof Material) {
          child.material.transparent = true;
          child.material.opacity = opacity.get();
        }
      });
    }
  });

  // Return null if the model hasn't loaded yet
  if (!model) return null;

  return (
    <group ref={cloudRef} scale={[8, 8, 8]}>
      <primitive object={model} />
    </group>
  );
}

export default function SkyScene() {
  const [poem, setPoem] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isContentLoaded, setIsContentLoaded] = useState<boolean>(false);
  const [fov, setFov] = useState<number>(60);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setFov(75);
      } else {
        setFov(60);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchPoem();
  }, []);

  async function fetchPoem() {
    try {
      const location = await getLocation();
      const weatherRes = await fetch('/api/weather', {
        method: 'POST',
        body: JSON.stringify({ location }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { weather } = await weatherRes.json();

      const structuredWeather = {
        temp: weather.temp,
        condition: weather.condition,
        description: weather.description,
      };

      const poemRes = await fetch('/api/poem', {
        method: 'POST',
        body: JSON.stringify({ weather: structuredWeather }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { poem } = await poemRes.json();
      setPoem(poem);
    } catch {
      setError('Failed to fetch location, weather, or poem');
    } finally {
      setTimeout(() => {
        setIsContentLoaded(true);
      }, 4000);
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="fixed inset-0 z-10">
        <Canvas camera={{ position: [0, 1, 10], fov }}>
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1} />

          <HotAirBalloon position={[-1, 1, 0]} isContentLoaded={isContentLoaded} />
          <Cloud position={[1, 0.5, 0]} isContentLoaded={isContentLoaded} />
        </Canvas>
      </div>

      {isContentLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{ pointerEvents: 'none' }}
        >
          {error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <PoemDisplay poem={poem || ''} />
          )}
        </div>
      )}

      <footer className="absolute bottom-0 left-0 right-0 text-xs text-center z-30 text-gray-500/70 p-2">
        <span className="opacity-80">
          Hot air balloon by Poly by Google [CC-BY] via Poly Pizza • Clouds by Jarlan Perez [CC-BY] via Poly Pizza
        </span>
      </footer>
    </div>
  );
}

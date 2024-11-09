// SkyScene.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { Sky, useGLTF } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import PoemDisplay from './PoemDisplay';
import { getLocation } from '@/lib/location';

function HotAirBalloon({
  position,
  isContentLoaded,
}: {
  position: [number, number, number];
  isContentLoaded: boolean;
}) {
  const group = useRef<Group>(null);
  const initialPos = useRef({ x: position[0] - 1, y: position[1] - 1, z: position[2] + 2 });
  const time = useRef(Math.random() * 1000);

  // Load the GLB model of the hot air balloon
  const { scene } = useGLTF('/models/hot_air_balloon.glb') as any;

  // Animation for Z position offset and opacity
  const { zOffset, xOffset, yOffset, opacity } = useSpring({
    zOffset: isContentLoaded ? -5 : 0,
    xOffset: isContentLoaded ? -2 : 0,
    yOffset: isContentLoaded ? 0 : 0,
    opacity: isContentLoaded ? 0 : 1,
    config: {
      mass: 5,
      tension: 18,
      friction: 22,
    },
  });

  useFrame(() => {
    if (group.current) {
      time.current += 0.01;

      // Compute the new positions
      const x = initialPos.current.x + Math.sin(time.current * 0.5) * 0.05 + xOffset.get();
      const y = initialPos.current.y + Math.sin(time.current * 0.5) * 0.05 + yOffset.get();
      const z = initialPos.current.z + Math.cos(time.current * 0.5) * 0.05 + zOffset.get();

      // Update the balloon's position and rotation
      group.current.position.set(x, y, z);
      group.current.rotation.y += 0.0002;

      // Update opacity
      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.material.transparent = true;
          child.material.opacity = opacity.get();
        }
      });
    }
  });

  return (
    <group ref={group} scale={[0.025, 0.025, 0.025]}>
      <primitive object={scene} />
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
  const initialPos = useRef({ x: position[0] - 1, y: position[1] - 1, z: position[2]});
  const time = useRef(Math.random() * 1000);

  // Load the GLB model of the cloud
  const { scene } = useGLTF('/models/clouds.glb') as any;

  // Animation for Z position offset and opacity
  const { zOffset, xOffset, yOffset, opacity } = useSpring({
    zOffset: isContentLoaded ? -5 : 0,
    xOffset: isContentLoaded ? 2 : 0,
    yOffset: isContentLoaded ? 0 : 0,
    opacity: isContentLoaded ? 0 : 1,
    config: {
      mass: 5,
      tension: 18,
      friction: 22,
    },
  });

  useFrame(() => {
    if (cloudRef.current) {
      time.current += 0.01;

      // Compute the new positions
      const x = initialPos.current.x + Math.sin(time.current * 0.5) * 0.05 + xOffset.get();
      const y = initialPos.current.y + Math.sin(time.current * 0.5) * 0.05 + yOffset.get();
      const z = initialPos.current.z + Math.cos(time.current * 0.5) * 0.05 + zOffset.get();

      // Update the cloud's position
      cloudRef.current.position.set(x, y, z);

      // Update opacity
      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.material.transparent = true;
          child.material.opacity = opacity.get();
        }
      });
    }
  });

  return (
    <group ref={cloudRef} scale={[8, 8, 8]}>
      <primitive object={scene} />
    </group>
  );
}

export default function SkyScene() {
  const [poem, setPoem] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isContentLoaded, setIsContentLoaded] = useState<boolean>(false);

  // Responsive FOV based on screen width
  const [fov, setFov] = useState<number>(60);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setFov(75); // Increase FOV on mobile devices
      } else {
        setFov(60); // Default FOV on larger screens
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount
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
    } catch (err) {
      setError('Failed to fetch location, weather, or poem');
    } finally {
      // Start the content reveal animation after a delay to show the loading animation first
      setTimeout(() => {
        setIsContentLoaded(true);
      }, 4000);
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="fixed inset-0 z-10">
        <Canvas camera={{ position: [0, 1, 10], fov }}>
          {/* Sky background */}
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1} />

          {/* Hot Air Balloon closer to center */}
          <HotAirBalloon position={[-1, 1, 0]} isContentLoaded={isContentLoaded} />

          {/* Cloud closer to center */}
          <Cloud position={[1, 0.5, 0]} isContentLoaded={isContentLoaded} />
        </Canvas>
      </div>

      {/* Poem Display */}
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

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 text-xs text-center z-30 text-gray-500/70 p-2">
        <span className="opacity-80">
          Hot air balloon by Poly by Google [CC-BY] via Poly Pizza • Clouds by Jarlan Perez [CC-BY] via Poly Pizza
        </span>
      </footer>
    </div>
  );
}

// Preload the GLB models
useGLTF.preload('/models/hot_air_balloon.glb');
useGLTF.preload('/models/clouds.glb');
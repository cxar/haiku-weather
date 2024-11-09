// app/components/SkyScene.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import HotAirBalloon from './HotAirBalloon';
import Cloud from './Cloud';
import PoemDisplay from './PoemDisplay';
import Title from './Title';
import { getLocation } from '@/lib/location';

export default function SkyScene() {
  const [poem, setPoem] = useState<string>('');
  const [isContentLoaded, setIsContentLoaded] = useState<boolean>(false);
  const [fov, setFov] = useState<number>(60);

  useEffect(() => {
    const handleResize = () => {
      setFov(window.innerWidth < 600 ? 75 : 60);
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
        headers: { 'Content-Type': 'application/json' },
      });
      const { weather } = await weatherRes.json();

      const structuredWeather = {
        temp: weather.temp,
        condition: weather.condition,
        description: weather.description,
        locationName: weather.locationName,
        country: weather.country,
      };

      const poemRes = await fetch('/api/poem', {
        method: 'POST',
        body: JSON.stringify({ weather: structuredWeather}),
        headers: { 'Content-Type': 'application/json' },
      });
      const { poem } = await poemRes.json();
      setPoem(poem);
    } catch {
      // Error handling is done silently since we don't display errors to the user
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
          <Sky sunPosition={[100, 30, 100]} />
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          
          <Title isContentLoaded={isContentLoaded} />
          <HotAirBalloon position={[-1, 1, 0]} isContentLoaded={isContentLoaded} />
          <Cloud position={[1, 0.5, 0]} isContentLoaded={isContentLoaded} />
        </Canvas>
      </div>

      {isContentLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <PoemDisplay poem={poem} />
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
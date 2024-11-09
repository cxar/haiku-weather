// app/components/SkyScene.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
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
      console.log('Window resized, updating FOV', { width: window.innerWidth });
      setFov(window.innerWidth < 600 ? 75 : 60);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log('Initial mount, fetching poem');
    fetchPoem();
  }, []);

  async function fetchPoem() {
    try {
      console.log('Getting user location');
      const location = await getLocation();
      console.log('Location retrieved:', location);

      console.log('Fetching weather data');
      const weatherRes = await fetch('/api/weather', {
        method: 'POST',
        body: JSON.stringify({ location }),
        headers: { 'Content-Type': 'application/json' },
      });
      const { weather } = await weatherRes.json();
      console.log('Weather data received:', weather);

      const structuredWeather = {
        temp: weather.temp,
        condition: weather.condition,
        description: weather.description,
        locationName: weather.locationName,
        country: weather.country,
        rain: weather.rain,
        visibility: weather.visibility,
        wind: weather.wind,
        humidity: weather.humidity,
        temp_max: weather.temp_max,
        temp_min: weather.temp_min,
        feels_like: weather.feels_like,
        clouds: weather.clouds,
      };
      console.log('Structured weather data:', structuredWeather);

      console.log('Fetching poem');
      const poemRes = await fetch('/api/poem', {
        method: 'POST',
        body: JSON.stringify({ weather: structuredWeather}),
        headers: { 'Content-Type': 'application/json' },
      });
      const { poem } = await poemRes.json();
      console.log('Poem received:', poem);
      setPoem(poem);
    } catch (error) {
      console.error('Error in fetchPoem:', error);
    } finally {
      console.log('Setting content loaded after delay');
      setTimeout(() => {
        setIsContentLoaded(true);
        console.log('Content loaded set to true');
      }, 4000);
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="fixed inset-0 z-10">
        <Canvas camera={{ position: [0, 1, 10], fov }}>
          <color attach="background" args={["#cfebff"]} />
          <ambientLight intensity={3} />
          <directionalLight position={[5, 5, 5]} intensity={5} />
          
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
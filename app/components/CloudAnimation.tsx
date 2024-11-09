'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PoemDisplay from './PoemDisplay';
import { getLocation } from '@/lib/location'; // Assuming getLocation is implemented in this path

export default function CloudAnimation() {
  const [poem, setPoem] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPoem();
  }, []);

  async function fetchPoem() {
    try {
      const location = await getLocation();
      const weatherRes = await fetch('/api/weather', {
        method: 'POST',
        body: JSON.stringify({ location }),
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
      });
      const { poem } = await poemRes.json();
      setPoem(poem);
    } catch (err) {
      setError('Failed to fetch location, weather, or poem');
    } finally {
      setTimeout(() => setIsLoading(false), 4000);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 grid grid-cols-6 gap-2 p-2"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.5,
              transition: { duration: 2, ease: "easeOut" }
            }}
          >
            {Array.from({ length: 72 }).map((_, i) => (
              <motion.div
                key={i}
                className="clouds-animation relative"
                style={{
                  top: `${(i % 3) * 10}px`,
                  left: `${(i % 4) * 5}px`,
                }}
                initial={{ y: (i % 3) * 15 }}
                animate={{ 
                  y: [(i % 3) * 15, ((i % 3) * 15) + 8, (i % 3) * 15],
                  opacity: [0.85, 1, 0.85]
                }}
                transition={{ 
                  duration: 2 + (i % 4),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i % 5 * 0.1
                }}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 60"
                  xmlns="http://www.w3.org/2000/svg"
                  className="cloud-svg fill-gray-200/90 dark:fill-gray-700/90"
                >
                  <circle cx="30" cy="30" r="20" />
                  <circle cx="50" cy="30" r="25" />
                  <circle cx="70" cy="30" r="20" />
                  <circle cx="85" cy="30" r="15" />
                  <circle cx="15" cy="30" r="15" />
                </svg>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isLoading && (
          <motion.div
            className="w-full px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            {error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <PoemDisplay poem={poem || ''} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

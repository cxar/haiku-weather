"use client";

import React, { useState, useEffect } from "react";
import PoemDisplay from "./PoemDisplay";
import { getLocation } from "@/lib/location";
import TitleFade from "./TitleFade";
import LavaLamp from "./LavaLamp";

export default function SkyScene() {
  const [poem, setPoem] = useState<string>("");
  const [isContentLoaded, setIsContentLoaded] = useState<boolean>(false);

  useEffect(() => {
    fetchPoem();
  }, []);

  async function fetchPoem() {
    try {
      const location = await getLocation();
      const weatherRes = await fetch("/api/weather", {
        method: "POST",
        body: JSON.stringify({ location }),
        headers: { "Content-Type": "application/json" },
      });
      const { weather } = await weatherRes.json();

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
      const poemRes = await fetch("/api/poem", {
        method: "POST",
        body: JSON.stringify({ weather: structuredWeather }),
        headers: { "Content-Type": "application/json" },
      });
      const { poem } = await poemRes.json();
      setPoem(poem);
    } catch {
      // Silently fail; poem will remain empty
    } finally {
      setIsContentLoaded(true);
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden grain vignette">
      <div className="absolute inset-0" aria-hidden="true" />
      <LavaLamp />
      <TitleFade isContentLoaded={isContentLoaded} />
      {isContentLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <PoemDisplay poem={poem} />
          {poem === "" && (
            <button onClick={fetchPoem} className="wax mt-5 px-5 py-2 text-sm tracking-wide">
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

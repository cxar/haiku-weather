"use client";

import React, { useState, useEffect } from "react";
import PoemDisplay from "./PoemDisplay";
import PastelCanvas from "./PastelCanvas";
import GlassOverlay from "./GlassOverlay";
import { getLocation } from "@/lib/location";
import TitleFade from "./TitleFade";

export default function SkyScene() {
  const [poem, setPoem] = useState<string>("");
  const [isContentLoaded, setIsContentLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Re-render poem on first mount only
  }, []);

  useEffect(() => {
    console.log("Initial mount, fetching poem");
    fetchPoem();
  }, []);

  async function fetchPoem() {
    try {
      console.log("Getting user location");
      const location = await getLocation();
      console.log("Location retrieved:", location);

      console.log("Fetching weather data");
      const weatherRes = await fetch("/api/weather", {
        method: "POST",
        body: JSON.stringify({ location }),
        headers: { "Content-Type": "application/json" },
      });
      const { weather } = await weatherRes.json();
      console.log("Weather data received:", weather);

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
      console.log("Structured weather data:", structuredWeather);

      console.log("Fetching poem");
      const poemRes = await fetch("/api/poem", {
        method: "POST",
        body: JSON.stringify({ weather: structuredWeather }),
        headers: { "Content-Type": "application/json" },
      });
      const { poem } = await poemRes.json();
      console.log("Poem received:", poem);
      setPoem(poem);
    } catch (error) {
      console.error("Error in fetchPoem:", error);
    } finally {
      console.log("Setting content loaded");
      setIsContentLoaded(true);
      console.log("Content loaded set to true");
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <PastelCanvas />
      <GlassOverlay />

      <TitleFade isContentLoaded={isContentLoaded} />

      {isContentLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <PoemDisplay poem={poem} />
        </div>
      )}
    </div>
  );
}

type LocationInput = string | { latitude: number; longitude: number };

export async function getWeatherData(location: LocationInput) {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    let url: string;
    if (typeof location === 'string') {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location.trim())}&units=imperial&appid=${apiKey}`;
    } else if (typeof location === 'object' && 'latitude' in location && 'longitude' in location) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=imperial&appid=${apiKey}`;
    } else {
        throw new Error('Invalid location format. Must be a string or an object with latitude and longitude');
    }

    const res = await fetch(url);
    
    if (res.status === 404) {
        throw new Error('Location not found');
    }
    
    if (!res.ok) {
        throw new Error(`Weather API error: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    
    if (!data.main || !data.weather?.[0]) {
        throw new Error('Invalid weather data received from API');
    }
    
    return {
        temp: data.main.temp,
        temp_max: data.main.temp_max,
        temp_min: data.main.temp_min,
        feels_like: data.main.feels_like,
        wind: {
            speed: data.wind.speed,
            deg: data.wind.deg,
            gust: data.wind.gust
        },
        rain: data.rain?.["1h"] || 0,
        humidity: data.main.humidity,
        visibility: data.visibility,
        clouds: data.clouds.all,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        locationName: data.name,
        country: data.sys.country
    };
}
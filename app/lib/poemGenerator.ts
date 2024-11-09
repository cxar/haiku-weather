import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { groq } from '@ai-sdk/groq';

export async function generatePoem(weather: {
  temp: number;
  temp_max: number;
  temp_min: number;
  feels_like: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  rain: number;
  humidity: number;
  visibility: number;
  condition: string;
  description: string;
  locationName: string;
  country: string;
  clouds: number;
}) {
  console.log('Generating poem for weather:', weather);

  const {
    temp,
    temp_max,
    temp_min,
    feels_like,
    wind,
    rain,
    humidity,
    visibility,
    condition,
    description,
    locationName,
    country,
    clouds
  } = weather;

  const prompt = `Generate a haiku based on the following weather conditions:
  Location: ${locationName}, ${country}
  Temperature: ${temp}°F (feels like ${feels_like}°F)
  High/Low: ${temp_max}°F/${temp_min}°F
  Wind: ${wind.speed}mph ${wind.gust ? `with gusts up to ${wind.gust}mph` : ''}
  Rain: ${rain ? `${rain}mm / hour` : 'none'}
  Clouds: ${clouds}%
  Humidity: ${humidity}%
  Visibility: ${visibility} meters (max 10km)
  Condition: ${condition}
  Description: ${description}
  Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
  
  Don't feel obligated to use all the information provided. 
  Sometimes the location name will not be descriptive enough, so you can use the temperature and condition and omit location info.
  Only rely on the location name if it's a notable location.
  Don't use time of day in your haiku.

  Respond with a haiku, no other text.`;

  console.log('Generated prompt:', prompt);

  const systemMessage = 'You are a creative poet who crafts beautiful haikus based on weather conditions.';

  try {
    console.log('Attempting to generate poem with OpenAI');
    const openaiResponse = await generateText({
      model: openai('gpt-4o'),
      system: systemMessage,
      prompt
    });

    console.log('Successfully generated poem with OpenAI');
    console.log('OpenAI response:', openaiResponse.text);
    return openaiResponse.text;
  } catch (openaiError) {
    console.error("Error with OpenAI, trying Anthropic:", openaiError);

    try {
      console.log('Attempting to generate poem with Anthropic');
      const anthropicResponse = await generateText({
        model: anthropic('claude-3-5-sonnet-20240620'),
        system: systemMessage,
        prompt
      });

      console.log('Successfully generated poem with Anthropic');
      console.log('Anthropic response:', anthropicResponse.text);
      return anthropicResponse.text;
    } catch (anthropicError) {
      console.error("Error with Anthropic, trying Groq:", anthropicError);

      try {
        console.log('Attempting to generate poem with Groq');
        const groqResponse = await generateText({
          model: groq('llama-3.1-70b-versatile'),
          system: systemMessage,
          prompt
        });

        console.log('Successfully generated poem with Groq');
        console.log('Groq response:', groqResponse.text);
        return groqResponse.text;
      } catch (groqError) {
        console.error("Error with Groq:", groqError);
        throw new Error("Failed to generate poem with available providers");
      }
    }
  }
}
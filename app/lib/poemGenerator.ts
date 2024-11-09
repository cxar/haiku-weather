import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { groq } from '@ai-sdk/groq';

export async function generatePoem(weather: { temp: number; condition: string; description: string, locationName: string, country: string }) {
  const { temp, condition, description, locationName, country } = weather;

  const prompt = `Generate a haiku based on the following weather conditions:
  Location: ${locationName}, ${country}
  Temperature: ${temp}°F
  Condition: ${condition}
  Description: ${description}
  Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
  
  Don't feel obligated to use all the information provided. 
  Sometimes the location name will not be descriptive enough, so you can use the temperature and condition to describe the location.
  Only rely on the location name if it's a sizeable city.

  Respond with a haiku, no other text.`;

  const systemMessage = 'You are a creative poet who crafts beautiful haikus based on weather conditions.';

  try {
    // Attempt to generate a poem using OpenAI
    const openaiResponse = await generateText({
      model: openai('gpt-4o-mini'),
      system: systemMessage,
      prompt
    });

    return openaiResponse.text;
  } catch (openaiError) {
    console.error("Error with OpenAI, trying Anthropic:", openaiError);

    try {
      // Fallback to Anthropic if OpenAI fails
      const anthropicResponse = await generateText({
        model: anthropic('claude-3-5-sonnet-20240620'),
        system: systemMessage,
        prompt
      });

      return anthropicResponse.text;
    } catch (anthropicError) {
      console.error("Error with Anthropic, trying Groq:", anthropicError);

      try {
        // Fallback to Groq if Anthropic fails
        const groqResponse = await generateText({
          model: groq('llama-3.1-70b-versatile'),
          system: systemMessage,
          prompt
        });

        return groqResponse.text;
      } catch (groqError) {
        console.error("Error with Groq:", groqError);
        throw new Error("Failed to generate poem with available providers");
      }
    }
  }
}
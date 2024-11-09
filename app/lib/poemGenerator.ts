import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePoem(weather: { temp: number; condition: string; description: string }) {
  const { temp, condition, description } = weather;

  const prompt = `Generate a haiku based on the following weather conditions:
  Temperature: ${temp}°C
  Condition: ${condition}
  Description: ${description}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 100,
    });

    const poem = response.choices[0].message.content?.trim() || "Could not generate poem";
    return poem;
  } catch (error) {
    console.error("Error generating poem:", error);
    throw new Error("Failed to generate poem");
  }
}
import { GoogleGenAI, Type } from "@google/genai";
import type { DrinkData } from '../types.ts';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recommendationSchema = {
  type: Type.OBJECT,
  properties: {
    drinkName: {
      type: Type.STRING,
      description: "A creative and appealing name for the beverage.",
    },
    quote: {
      type: Type.STRING,
      description: "An uplifting or fitting quote that matches the mood.",
    },
  },
  required: ["drinkName", "quote"],
};

export const getDrinkRecommendation = async (mood: string): Promise<DrinkData> => {
  const prompt = `Based on the following mood/vibe: "${mood}", suggest a unique, non-alcoholic drink. Provide a creative name for the drink and a short, uplifting quote related to the mood.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recommendationSchema,
      },
    });

    const text = response.text.trim();
    // Sometimes the response can be wrapped in ```json ... ```, so we need to clean it.
    const cleanedText = text.replace(/^```json\s*|```$/g, '');
    const data = JSON.parse(cleanedText);

    if (data.drinkName && data.quote) {
      return data as DrinkData;
    } else {
      throw new Error("Invalid data structure from API.");
    }
  } catch (error) {
    console.error("Error fetching drink recommendation:", error);
    throw new Error("Failed to get a drink recommendation from the AI.");
  }
};

export const generateDrinkImage = async (drinkName: string): Promise<string> => {
  const prompt = `A beautifully styled, vibrant, professional photograph of a "${drinkName}". The drink is in a stylish glass on a clean, minimalist background. The lighting is soft and inviting, highlighting the drink's colors and textures. High resolution, aesthetic, photorealistic, cinematic.`;

  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating drink image:", error);
    throw new Error("Failed to generate an image for the drink.");
  }
};
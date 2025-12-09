import { GoogleGenAI } from "@google/genai";

// Always use process.env.API_KEY directly when initializing the client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  try {
    const prompt = `Write a fun, exciting, and short sales description (max 2 sentences) for a party rental item named "${productName}" in the category "${category}". The tone should be energetic and suitable for an event company called Bullseye Entertainment ZM.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini generation error:", error);
    return "Could not generate description at this time.";
  }
};
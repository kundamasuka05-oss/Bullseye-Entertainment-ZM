import { GoogleGenAI } from "@google/genai";

// NOTE: In a real production app, never expose API keys on the client. 
// This should be proxied through a backend. 
// For this demo, we assume the user might input it or it's in env.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  if (!apiKey) {
    console.warn("No API Key available for Gemini.");
    return "AI generation unavailable without API Key.";
  }

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

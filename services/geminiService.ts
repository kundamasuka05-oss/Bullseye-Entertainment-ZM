
export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  try {
    const response = await fetch('/api/generate-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName, category })
    });

    const data = await response.json();
    return data.description || "Could not generate description at this time.";
  } catch (error) {
    console.error("Gemini generation error:", error);
    return "Could not generate description at this time.";
  }
};
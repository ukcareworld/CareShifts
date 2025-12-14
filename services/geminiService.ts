import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateShiftDescription = async (
  title: string,
  requirements: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are an expert HR assistant for a Care Home.
      Write a professional, concise, and inviting job description (max 100 words) for a shift based on the following details.
      Title: ${title}
      Key Requirements: ${requirements}
      
      Focus on responsibilities and tone. Do not include placeholders like [Date] or [Time], just the role description.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Experienced care worker needed for this shift. Please ensure all certifications are up to date.";
  }
};

export const analyzeWorkerSuitability = async (
  workerBio: string,
  shiftDetails: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Analyze if this worker is a good match for the shift. Give a 1 sentence summary.
      Worker Bio: ${workerBio}
      Shift: ${shiftDetails}
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt
    });
    return response.text || "Analysis unavailable.";
  } catch (e) {
      return "Suitability analysis unavailable.";
  }
}
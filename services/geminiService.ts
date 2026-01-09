
import { GoogleGenAI, Type } from "@google/genai";
import { IFSCInfo } from "../types";

// Always initialize with process.env.API_KEY directly as per guidelines
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const fetchGSTDetails = async (gstNumber: string) => {
  const ai = getAIClient();
  const prompt = `Identify and provide the official Legal Company Name and trade details for the Indian GST number: ${gstNumber}. 
  Return the data in a structured JSON format. Use Google Search grounding to ensure real-time accuracy.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            legalName: { type: Type.STRING, description: "Official company name as per registry" },
            tradeName: { type: Type.STRING, description: "Branding or trade name if applicable" },
            constitutionOfBusiness: { type: Type.STRING },
            registrationDate: { type: Type.STRING },
            taxpayerType: { type: Type.STRING },
            gstStatus: { type: Type.STRING },
            centerJurisdiction: { type: Type.STRING },
            stateJurisdiction: { type: Type.STRING },
            address: { type: Type.STRING },
          },
          required: ["legalName", "gstStatus"]
        }
      },
    });

    return {
      data: JSON.parse(response.text || '{}'),
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title,
        uri: chunk.web?.uri
      })) || []
    };
  } catch (error) {
    console.error("GST API Error:", error);
    throw error;
  }
};

export const fetchIFSCDetails = async (ifsc: string) => {
  try {
    const response = await fetch(`https://ifsc.razorpay.com/${ifsc.toUpperCase()}`);
    if (!response.ok) {
      if (response.status === 404) throw new Error("Invalid IFSC node signature.");
      throw new Error("IFSC network unavailable.");
    }
    const data = await response.json();
    const mappedData: IFSCInfo = {
      ifsc: data.IFSC,
      bankName: data.BANK,
      branch: data.BRANCH,
      address: data.ADDRESS,
      city: data.CITY,
      state: data.STATE,
      contact: data.CONTACT || 'N/A',
      micr: data.MICR || 'N/A'
    };
    return { data: mappedData, sources: [{ title: 'Razorpay Records', uri: 'https://razorpay.com' }] };
  } catch (error: any) {
    throw error;
  }
};

export const fetchInstagramDetails = async (username: string) => {
  const ai = getAIClient();
  const cleanUsername = username.replace('@', '');
  const prompt = `Verify the public social profile for: @${cleanUsername}. Find official name, bio, and follower statistics. Use Google Search grounding.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            bio: { type: Type.STRING },
            followers: { type: Type.STRING },
            following: { type: Type.STRING },
            posts: { type: Type.STRING },
            isPrivate: { type: Type.BOOLEAN },
            isVerified: { type: Type.BOOLEAN },
          },
          required: ["fullName", "followers"]
        }
      },
    });
    return {
      data: JSON.parse(response.text || '{}'),
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title,
        uri: chunk.web?.uri
      })) || []
    };
  } catch (error) { throw error; }
};

export const fetchNewsDetails = async (topic: string) => {
  const ai = getAIClient();
  const prompt = `Advanced Pulse News for: "${topic}". 
  Provide exactly 5 trending stories.
  LANGUAGE: High-energy Hinglish (social media style).
  COMPONENTS per item:
  - title: Bold headline.
  - summary: What happened? (Hinglish).
  - creatorTip: Content strategy hook.
  - url: Source.
  - viralScore: Integer 1-100.
  - hook: A one-liner 'hook' for a social video.
  Use Google Search grounding.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            newsItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  creatorTip: { type: Type.STRING },
                  url: { type: Type.STRING },
                  viralScore: { type: Type.INTEGER },
                  hook: { type: Type.STRING }
                },
                required: ["title", "summary", "creatorTip", "url", "viralScore", "hook"]
              }
            }
          }
        }
      },
    });
    return {
      data: JSON.parse(response.text || '{ "newsItems": [] }'),
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title,
        uri: chunk.web?.uri
      })) || []
    };
  } catch (error) { throw error; }
};

export const processVisualAI = async (base64Data: string, mode: 'ocr' | 'bg-remove') => {
  const ai = getAIClient();
  const mimeType = base64Data.split(';')[0].split(':')[1];
  const data = base64Data.split(',')[1];

  if (mode === 'ocr') {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data, mimeType } },
          { text: "Extract all textual data from this document/image. Maintain structure if possible." }
        ]
      }
    });
    return { data: { extractedText: response.text }, sources: [] };
  } else {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data, mimeType } },
          { text: "Mask and remove the background. Subject only." }
        ]
      }
    });
    
    let processedImage = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          processedImage = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }
    return { data: { processedImage }, sources: [] };
  }
};

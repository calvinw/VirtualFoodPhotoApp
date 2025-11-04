
import { GoogleGenAI, Modality } from "@google/genai";
import { PhotoStyle } from '../types';
import { parseDataUrl } from '../utils/fileUtils';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getGenerationPrompt = (dishName: string, style: PhotoStyle): string => {
  switch (style) {
    case 'Rustic/Dark':
      return `High-end, professional food photography of ${dishName}. The style is rustic and dark, with moody, dramatic lighting, deep shadows, and rich textures. Served on a dark plate or wooden board. Photorealistic, appetizing, gourmet quality.`;
    case 'Bright/Modern':
      return `High-end, professional food photography of ${dishName}. The style is bright, modern, and clean. Minimalist composition with plenty of soft, natural light on a white or light-colored background. Photorealistic, fresh, vibrant, and appetizing.`;
    case 'Social Media':
      return `High-end, professional food photography of ${dishName}, shot from a top-down 'flat lay' perspective, perfect for social media. The style is colorful and engaging, with artfully arranged props and garnishes on a clean background. Photorealistic, trendy, delicious.`;
    default:
      return `High-end, professional food photography of ${dishName}. Photorealistic, delicious, and appetizing.`;
  }
};

export const generateFoodImage = async (dishName: string, style: PhotoStyle): Promise<string> => {
  const prompt = getGenerationPrompt(dishName, style);
  
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '4:3',
        outputMimeType: 'image/jpeg',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating food image:", error);
    throw error;
  }
};

export const editFoodImage = async (imageUrl: string, prompt: string): Promise<string> => {
  const parsedImage = parseDataUrl(imageUrl);
  if (!parsedImage) {
    throw new Error("Could not parse image data URL.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: parsedImage.data,
              mimeType: parsedImage.mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }

    throw new Error("No edited image was returned.");
  } catch (error) {
    console.error("Error editing food image:", error);
    throw error;
  }
};

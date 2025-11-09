import { GoogleGenAI, Modality } from "@google/genai";
import { ModelType } from '../types';

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType
    },
  };
};

const getApiKey = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY_NOT_FOUND");
  }
  return apiKey;
}

export const generateModelImage = async (clothingImageBase64: string, mimeType: string, modelType: ModelType, pose: string): Promise<{ base64: string, mimeType: string }> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  const imagePart = fileToGenerativePart(clothingImageBase64, mimeType);
  const textPart = {
    text: `Mostre um modelo ${modelType} realista em corpo inteiro vestindo esta peça de roupa, fazendo a seguinte pose: "${pose}". O fundo deve ser um estúdio de fotografia neutro e bem iluminado, com foco total na roupa e no modelo.`
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && firstPart.inlineData && firstPart.inlineData.data && firstPart.inlineData.mimeType) {
      return { base64: firstPart.inlineData.data, mimeType: firstPart.inlineData.mimeType };
    }
    
    throw new Error("Não foi possível gerar a imagem. A resposta da API estava em um formato inesperado.");
  } catch (e: any) {
    if (e.toString().includes('RESOURCE_EXHAUSTED') || e.toString().includes('exceeded your current quota')) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw e;
  }
};

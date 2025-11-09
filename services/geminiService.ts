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

export const generateModelImage = async (clothingImageBase64: string, mimeType: string, modelType: ModelType): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API key not found. Please set the API_KEY environment variable.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imagePart = fileToGenerativePart(clothingImageBase64, mimeType);
  const textPart = {
    text: `Mostre um modelo ${modelType} realista em corpo inteiro vestindo esta peça de roupa. O fundo deve ser um estúdio de fotografia neutro e bem iluminado, com foco total na roupa e no modelo.`
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
    if (firstPart && firstPart.inlineData) {
      return firstPart.inlineData.data;
    }
    
    throw new Error("Não foi possível gerar a imagem. A resposta da API estava em um formato inesperado.");
  } catch (e: any) {
    if (e.toString().includes('RESOURCE_EXHAUSTED') || e.toString().includes('exceeded your current quota')) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw e;
  }
};

export const generateModelVideo = async (modelImageBase64: string): Promise<string> => {
  try {
    // FIX: Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: 'Um vídeo curto do modelo posando sutilmente, como em uma sessão de fotos de moda. Movimento lento e elegante.',
      image: {
        imageBytes: modelImageBase64,
        mimeType: 'image/png',
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error("Falha ao obter o link de download do vídeo.");
    }

    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
      throw new Error(`Falha ao baixar o vídeo: ${videoResponse.statusText}`);
    }

    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
  } catch (e: any) {
      if (e.toString().includes('RESOURCE_EXHAUSTED') || e.toString().includes('exceeded your current quota')) {
        throw new Error("QUOTA_EXCEEDED");
      }
      if (e.message?.includes("Requested entity was not found")) {
          throw new Error("API_KEY_INVALID");
      }
      throw e;
  }
};
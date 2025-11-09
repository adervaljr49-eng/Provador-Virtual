import React, { useState, useCallback, useEffect } from 'react';
import { ModelType } from './types';
import { generateModelImage, generateModelVideo } from './services/geminiService';
import Loader from './components/Loader';

// Base64 for the MEULOOKmamãe logo
const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAIABJREFUeJzs3Xl8VFX9x/Hvu90lu0kCCYSQWUjZJQu4LhYFpeKiYFfBuvUqFtfWVVu1Wr+rqGvBqoiK4qqACooLghAEJIQsJBBCdjfJJrvdff8/p3NIZGaSySQncvL9Xq/nkZCQycx3zsk55/c5v3tFRUREvN+I9R4gIiIi3vQEFBERERcQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQEREREVdQ-';

const Header: React.FC = () => (
  <header className="bg-white shadow-md">
    <div className="container mx-auto px-4 py-4 flex items-center space-x-6">
      <img src={logoBase64} alt="MEULOOK mamãe Logo" className="h-20 w-auto" />
      <div>
        <h1 className="text-3xl font-extrabold text-gray-800">Provador Virtual MEULOOKmamãe</h1>
        <p className="text-gray-600 mt-1">Envie a foto de uma roupa e veja a mágica acontecer!</p>
      </div>
    </div>
  </header>
);

const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(';')[0].split(':')[1];
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType });
    };
    reader.onerror = error => reject(error);
  });
};

const App: React.FC = () => {
  const [clothingImage, setClothingImage] = useState<{ file: File, preview: string, base64: string, mimeType: string } | null>(null);
  const [modelType, setModelType] = useState<ModelType>(ModelType.ADULT);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoGenerationMessage, setVideoGenerationMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [apiKeySelected, setApiKeySelected] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if(window.aistudio && await window.aistudio.hasSelectedApiKey()){
        setApiKeySelected(true);
      }
    };
    checkApiKey();
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { base64, mimeType } = await fileToBase64(file);
        setClothingImage({
          file,
          preview: URL.createObjectURL(file),
          base64,
          mimeType
        });
        setGeneratedImage(null);
        setGeneratedVideoUrl(null);
        setError(null);
      } catch (err) {
        setError("Não foi possível processar a imagem.");
      }
    }
  };

  const handleGenerateImage = useCallback(async () => {
    if (!clothingImage) {
      setError("Por favor, envie uma imagem primeiro.");
      return;
    }
    setError(null);
    setIsGeneratingImage(true);
    setGeneratedImage(null);
    setGeneratedVideoUrl(null);
    try {
      const imageB64 = await generateModelImage(clothingImage.base64, clothingImage.mimeType, modelType);
      setGeneratedImage(`data:image/png;base64,${imageB64}`);
    } catch (err: any) {
      console.error(err);
      if (err.message === "QUOTA_EXCEEDED") {
        setError("QUOTA_EXCEEDED");
      } else {
        setError("Ocorreu um erro ao gerar a imagem. Tente novamente.");
      }
    } finally {
      setIsGeneratingImage(false);
    }
  }, [clothingImage, modelType]);

  const handleSelectApiKey = async () => {
    await window.aistudio.openSelectKey();
    setApiKeySelected(true); // Assume success to avoid race condition
  };
  
  const handleGenerateVideo = useCallback(async () => {
    if (!generatedImage) {
      setError("Gere uma imagem primeiro para criar um vídeo.");
      return;
    }
    setError(null);
    setIsGeneratingVideo(true);
    setVideoGenerationMessage("Iniciando a criação do vídeo...");

    const checkApiKeyAndGenerate = async () => {
        try {
            const hasKey = window.aistudio && await window.aistudio.hasSelectedApiKey();
            if (!hasKey) {
                setApiKeySelected(false);
                setError("Por favor, selecione uma chave de API para gerar vídeos.");
                setIsGeneratingVideo(false);
                return;
            }
            setApiKeySelected(true);

            setVideoGenerationMessage("Criando seu vídeo... Isso pode levar alguns minutos.");
            const modelImageBase64 = generatedImage.split(',')[1];
            const videoUrl = await generateModelVideo(modelImageBase64);
            setGeneratedVideoUrl(videoUrl);
        } catch (err: any) {
            console.error(err);
            if (err.message === "API_KEY_INVALID") {
                setError("A chave de API selecionada é inválida ou não foi encontrada. Por favor, selecione outra.");
                setApiKeySelected(false);
            } else if (err.message === "QUOTA_EXCEEDED") {
                setError("QUOTA_EXCEEDED");
            } else {
                setError("Ocorreu um erro ao gerar o vídeo. Tente novamente.");
            }
        } finally {
            setIsGeneratingVideo(false);
            setVideoGenerationMessage('');
        }
    }
    
    checkApiKeyAndGenerate();

  }, [generatedImage]);

  const handleDownloadImage = useCallback(() => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'modelo-virtual-meulookmamae.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Erro: </strong>
            {error === 'QUOTA_EXCEEDED' ? (
              <span className="block sm:inline">
                Você excedeu sua cota de uso da API. Por favor, verifique seu plano e detalhes de faturamento. {' '}
                <a href="https://ai.google.dev/gemini-api/docs/rate-limits" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-red-800">
                  Saiba mais sobre os limites
                </a>.
              </span>
            ) : (
              <span className="block sm:inline">{error}</span>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Column */}
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">1. Envie a Roupa</h2>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {clothingImage ? (
                    <img src={clothingImage.preview} alt="Pré-visualização da roupa" className="mx-auto h-48 w-auto rounded-md object-contain"/>
                  ) : (
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Carregar um arquivo</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">2. Escolha o Modelo</h2>
              <div className="flex space-x-4">
                {(Object.values(ModelType) as Array<ModelType>).map((type) => (
                  <button
                    key={type}
                    onClick={() => setModelType(type)}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold capitalize transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      modelType === type
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
               <h2 className="text-xl font-semibold text-gray-700 mb-3">3. Gere sua Mídia</h2>
                <button
                onClick={handleGenerateImage}
                disabled={!clothingImage || isGeneratingImage}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                {isGeneratingImage && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                Gerar Imagem
                </button>
            </div>
          </div>

          {/* Result Column */}
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-center items-center min-h-[400px]">
            {!generatedImage && !isGeneratingImage && (
              <div className="text-center text-gray-500">
                <p className="text-lg">Sua imagem e vídeo aparecerão aqui.</p>
                <p className="text-sm">Siga os passos ao lado para começar.</p>
              </div>
            )}
            {isGeneratingImage && <Loader message="Criando sua imagem com o modelo..." />}
            
            {generatedImage && !isGeneratingImage && (
              <div className="w-full space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 text-center">Resultado da Imagem</h3>
                <div className="relative aspect-[9/16] w-full max-w-sm mx-auto bg-gray-200 rounded-lg overflow-hidden">
                    <img src={generatedImage} alt="Modelo vestindo a roupa" className="w-full h-full object-cover"/>
                </div>
                
                <button
                  onClick={handleDownloadImage}
                  className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Baixar Imagem
                </button>

                {!isGeneratingVideo && !generatedVideoUrl && (
                    <>
                    {!apiKeySelected && (
                        <div className="text-center p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                            <p className="text-sm text-yellow-800 mb-2">Para gerar vídeos, você precisa selecionar uma chave de API do Google AI Studio.</p>
                            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mb-3 block">Saiba mais sobre cobranças.</a>
                            <button onClick={handleSelectApiKey} className="bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                                Selecionar Chave de API
                            </button>
                        </div>
                    )}
                    {apiKeySelected && (
                        <button
                            onClick={handleGenerateVideo}
                            disabled={isGeneratingVideo}
                            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-green-300"
                        >
                            Gerar Vídeo
                        </button>
                    )}
                    </>
                )}

                {isGeneratingVideo && <Loader message={videoGenerationMessage} />}
                
                {generatedVideoUrl && !isGeneratingVideo && (
                  <div className="space-y-3 text-center">
                    <h3 className="text-lg font-semibold text-gray-700">Vídeo Gerado</h3>
                    <video src={generatedVideoUrl} controls className="w-full rounded-lg"></video>
                    <a
                      href={generatedVideoUrl}
                      download={`video-provador-virtual.mp4`}
                      className="inline-block w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-center"
                    >
                      Salvar Vídeo
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
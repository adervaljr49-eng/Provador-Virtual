import React, { useState, useCallback } from 'react';
import { ModelType } from './types';
import { generateModelImage } from './services/geminiService';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [clothingImage, setClothingImage] = useState<{ url: string; file: File } | null>(null);
  const [modelType, setModelType] = useState<ModelType>(ModelType.ADULT);
  const [pose, setPose] = useState<string>('Pose Frontal');
  const [generatedImage, setGeneratedImage] = useState<{ url: string; base64: string, mimeType: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const poses: { [key: string]: string } = {
    'Pose Frontal': 'de pé, braços ao lado do corpo, olhando para a câmera',
    'De Lado': 'de pé, de perfil, olhando por cima do ombro',
    'Mãos na Cintura': 'de pé, com uma mão no quadril, olhando para a câmera com um leve sorriso',
    'Caminhando': 'andando em direção à câmera',
    'Pose Dinâmica': 'em uma pose de moda dinâmica e energética',
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError("O arquivo de imagem é muito grande. Por favor, escolha um arquivo com menos de 10MB.");
        return;
      }
      setClothingImage({
        url: URL.createObjectURL(file),
        file: file,
      });
      setGeneratedImage(null);
      setError(null);
    }
  };

  const handleError = (err: any) => {
      let errorMessage = "Ocorreu um erro inesperado. Tente novamente.";
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      if (errorMessage === "API_KEY_NOT_FOUND" || errorMessage === "API_KEY_INVALID") {
          errorMessage = "O serviço está temporariamente indisponível devido a um problema de configuração. Por favor, tente novamente mais tarde.";
      } else if (errorMessage.includes("QUOTA_EXCEEDED")) {
        errorMessage = "Cota de API excedida. Por favor, verifique seu faturamento ou tente novamente mais tarde.";
      }
      
      setError(errorMessage);
      console.error(err);
  }

  const handleGenerateImage = useCallback(async () => {
    if (!clothingImage) {
      setError('Por favor, carregue uma imagem da roupa primeiro.');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Gerando imagem com o modelo...');
    setError(null);
    setGeneratedImage(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(clothingImage.file);
      reader.onloadend = async () => {
        const base64data = (reader.result as string).split(',')[1];
        try {
          const result = await generateModelImage(base64data, clothingImage.file.type, modelType, poses[pose]);
          setGeneratedImage({
            url: `data:${result.mimeType};base64,${result.base64}`,
            base64: result.base64,
            mimeType: result.mimeType
          });
        } catch (err: any) {
           handleError(err);
        } finally {
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        handleError(new Error("Não foi possível ler o arquivo de imagem."));
        setIsLoading(false);
      }
    } catch (err: any) {
      handleError(err);
      setIsLoading(false);
    }
  }, [clothingImage, modelType, pose, poses]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <header className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
              <img src="https://iili.io/Kb795as.png" alt="Logo" className="h-16 w-auto" />
              <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Provador Virtual</h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">Envie a foto de uma roupa e veja a mágica acontecer!</p>
              </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">1. Envie a Roupa</h3>
                <div className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Carregar um arquivo</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/gif" onChange={handleImageUpload} />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">2. Escolha o Modelo</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setModelType(ModelType.ADULT)}
                    className={`w-full py-2 px-4 rounded-md text-center font-semibold transition-colors ${modelType === ModelType.ADULT ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Adulto
                  </button>
                  <button
                    onClick={() => setModelType(ModelType.CHILD)}
                    className={`w-full py-2 px-4 rounded-md text-center font-semibold transition-colors ${modelType === ModelType.CHILD ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Infantil
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">3. Escolha a Pose</h3>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Object.keys(poses).map((poseKey) => (
                     <button
                        key={poseKey}
                        onClick={() => setPose(poseKey)}
                        className={`w-full py-2 px-4 rounded-md text-center font-semibold transition-colors text-sm ${pose === poseKey ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >
                       {poseKey}
                     </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">4. Gere sua Imagem</h3>
                <div className="mt-4 flex flex-col space-y-3">
                  <button
                    onClick={handleGenerateImage}
                    disabled={!clothingImage || isLoading}
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Gerando...' : 'Gerar Imagem'}
                  </button>
                </div>
              </div>
               {error && <p className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-md border border-red-200">{error}</p>}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col items-center justify-center min-h-[500px]">
             <div className="w-full h-full flex-grow flex items-center justify-center relative">
                {isLoading ? (
                  <Loader message={loadingMessage} />
                ) : (
                  <>
                  {generatedImage ? (
                      <div className="text-center w-full">
                        <img src={generatedImage.url} alt="Modelo gerado" className="max-w-full mx-auto rounded-lg mb-4" style={{maxHeight: '65vh'}} />
                        <a 
                          href={generatedImage.url}
                          download={`modelo-${modelType}.png`}
                          className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Baixar Imagem
                        </a>
                      </div>
                  ) : clothingImage ? (
                    <img src={clothingImage.url} alt="Roupa carregada" className="max-w-full mx-auto rounded-lg" style={{maxHeight: '65vh'}}/>
                  ) : (
                    <div className="text-center text-gray-500">
                      <p className="font-semibold text-lg">Sua imagem aparecerá aqui.</p>
                      <p className="text-sm">Siga os passos ao lado para começar.</p>
                    </div>
                  )}
                  </>
                )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

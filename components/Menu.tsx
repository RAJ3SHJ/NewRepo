
import React, { useState } from 'react';
import { Difficulty, ThemeType } from '../types';
import { DEFAULT_IMAGES, THEME_CONFIG } from '../constants';
import { Settings2, Palette, Sparkles, Loader2, X, Search, Check, ArrowLeft } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface MenuProps {
  userName: string;
  difficulty: Difficulty;
  currentTheme: ThemeType;
  onDifficultyChange: (diff: Difficulty) => void;
  onThemeChange: (theme: ThemeType) => void;
  onStart: (image: string) => void;
}

const Menu: React.FC<MenuProps> = ({ 
  userName, 
  difficulty, 
  currentTheme, 
  onDifficultyChange, 
  onThemeChange, 
  onStart
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(DEFAULT_IMAGES[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiPreviewImage, setAiPreviewImage] = useState<string | null>(null);

  const themeColors = THEME_CONFIG[currentTheme];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setSelectedImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setAiError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A high-quality, professional photography of ${aiPrompt}. Square aspect ratio, centered subject, highly detailed, vivid lighting.` }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      let generatedBase64 = '';
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedBase64 = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (generatedBase64) {
        setAiPreviewImage(generatedBase64);
      } else {
        setAiError('Failed to generate image. Please try a more descriptive prompt.');
      }
    } catch (err) {
      console.error('AI Generation Error:', err);
      setAiError('Something went wrong. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const confirmAIImage = () => {
    if (aiPreviewImage) {
      setSelectedImage(aiPreviewImage);
      closeAIModal();
    }
  };

  const closeAIModal = () => {
    setShowAIModal(false);
    setAiPreviewImage(null);
    setAiError('');
  };

  const themeKeys: ThemeType[] = ['ice-blue', 'ice-green', 'ice-pink', 'ice-purple', 'classic'];

  return (
    <div className="space-y-8 max-w-2xl mx-auto py-4">
      <div className="flex justify-between items-center px-2">
        <div className="text-left">
          <h2 className="text-3xl font-black tracking-tight">GeoSlide</h2>
          <p className="opacity-60 text-sm font-medium">Player: {userName} • {difficulty} Mode</p>
        </div>
        <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-2xl transition-all shadow-sm ${showSettings ? themeColors.button + ' text-white' : 'bg-white text-gray-400'}`}
        >
            <Settings2 size={24} />
        </button>
      </div>

      {showSettings && (
        <section className={`p-6 rounded-3xl border-2 transition-colors animate-in slide-in-from-top-4 duration-300 space-y-6 bg-white shadow-xl ${currentTheme === 'classic' ? 'border-gray-100' : 'border-current opacity-90'}`}
                 style={{ borderColor: currentTheme !== 'classic' ? 'rgba(0,0,0,0.05)' : undefined }}>
            <div className="space-y-3">
                <h3 className="text-lg font-black flex items-center gap-2">
                    <Settings2 size={18} className="opacity-40" />
                    Difficulty Level
                </h3>
                <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl">
                {Object.values(Difficulty).map(d => (
                    <button
                        key={d}
                        onClick={() => onDifficultyChange(d)}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-bold transition-all text-sm ${
                            difficulty === d ? themeColors.button + ' text-white shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {d}
                    </button>
                ))}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-black flex items-center gap-2">
                    <Palette size={18} className="opacity-40" />
                    Color Theme
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {themeKeys.map(tk => (
                    <button
                        key={tk}
                        onClick={() => onThemeChange(tk)}
                        className={`py-2 px-1 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                            currentTheme === tk ? themeColors.button.replace('bg-', 'border-') : 'border-transparent bg-gray-50'
                        }`}
                    >
                        <div className={`w-6 h-6 rounded-full shadow-inner ${THEME_CONFIG[tk].accent}`} />
                        <span className="text-[10px] font-bold truncate w-full text-center capitalize">{tk.replace('ice-', '')}</span>
                    </button>
                ))}
                </div>
            </div>
        </section>
      )}

      <section className="space-y-6">
        <h3 className="text-xl font-black px-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full ${themeColors.accent} ${themeColors.text} flex items-center justify-center text-sm font-black`}>1</span>
                Image Selection
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowAIModal(true)}
                className={`text-xs font-bold ${themeColors.text} bg-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all border border-gray-100`}
              >
                <Sparkles size={12} />
                AI Generate
              </button>
              <label className={`text-xs font-bold ${themeColors.text} cursor-pointer hover:underline ${themeColors.accent} px-3 py-1.5 rounded-full`}>
                  Upload
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {DEFAULT_IMAGES.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(img)}
              className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all ${
                selectedImage === img ? themeColors.button.replace('bg-', 'border-') + ' scale-105 shadow-xl' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="Gallery item" className="w-full h-full object-cover" />
            </button>
          ))}
          {!DEFAULT_IMAGES.includes(selectedImage) && (
            <div className={`aspect-square rounded-2xl overflow-hidden border-4 ${themeColors.button.replace('bg-', 'border-')} scale-105 relative shadow-xl`}>
                <img src={selectedImage} alt="Custom upload" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </section>

      <button
        onClick={() => onStart(selectedImage)}
        className={`w-full py-6 ${themeColors.button} text-white rounded-3xl font-black text-xl shadow-2xl transition-all active:scale-[0.98] mt-4`}
      >
        Start
      </button>

      {/* AI Search Modal */}
      {showAIModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl space-y-8 animate-in zoom-in slide-in-from-bottom-8 duration-500 overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-2xl font-black flex items-center gap-2">
                  <Sparkles className="text-amber-400" />
                  AI Image Finder
                </h3>
                <p className="text-xs font-medium opacity-40">Describe what you want to puzzle.</p>
              </div>
              <button 
                onClick={closeAIModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {!aiPreviewImage ? (
              <form onSubmit={handleAISubmit} className="space-y-6">
                <div className="relative group">
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. A futuristic city underwater with glowing jellyfish..."
                    className="w-full px-6 py-6 rounded-3xl bg-gray-50 text-lg font-bold outline-none ring-2 ring-transparent focus:ring-current transition-all resize-none h-32 placeholder:opacity-20"
                    disabled={isGenerating}
                    autoFocus
                  />
                  <div className="absolute bottom-4 right-4 text-[10px] font-black opacity-20 group-focus-within:opacity-40 transition-opacity">
                    Powered by Gemini
                  </div>
                </div>

                {aiError && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold text-center">
                    {aiError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isGenerating || !aiPrompt.trim()}
                  className={`w-full py-5 ${themeColors.button} text-white rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      Find Image
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="aspect-square w-full rounded-3xl overflow-hidden border-4 border-gray-100 shadow-lg bg-gray-100 flex items-center justify-center">
                  <img src={aiPreviewImage} alt="AI Generated" className="w-full h-full object-cover" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setAiPreviewImage(null)}
                    className="flex flex-col items-center justify-center gap-1 py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all text-gray-400 group"
                  >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase">Edit Prompt</span>
                  </button>
                  <button
                    onClick={confirmAIImage}
                    className={`flex flex-col items-center justify-center gap-1 py-4 ${themeColors.button} text-white rounded-2xl shadow-lg transition-all hover:brightness-110 active:scale-95`}
                  >
                    <Check size={20} />
                    <span className="text-[10px] font-black uppercase">Use Image</span>
                  </button>
                </div>
              </div>
            )}

            {!aiPreviewImage && (
              <p className="text-[10px] text-center opacity-40 font-medium px-4">
                Tip: Use descriptive words for better results. The AI works best with clear subjects.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;

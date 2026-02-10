
import React, { useState } from 'react';
import { Difficulty, ThemeType } from '../types';
import { THEME_CONFIG } from '../constants';

interface OnboardingProps {
  onComplete: (name: string, diff: Difficulty) => void;
  initialName: string;
  theme: ThemeType;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialName, theme }) => {
  const [name, setName] = useState(initialName || '');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);

  const themeColors = THEME_CONFIG[theme];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim(), difficulty);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 animate-in fade-in zoom-in duration-700">
      <div className="space-y-4">
        <div className={`w-24 h-24 ${themeColors.button} rounded-2xl mx-auto flex items-center justify-center shadow-2xl rotate-6 ring-8 ring-white/50`}>
            <span className="text-4xl">🧩</span>
        </div>
        <h2 className="text-5xl font-black tracking-tight">GeoSlide</h2>
        <p className="opacity-60 max-w-xs mx-auto font-medium">
          The ultimate square sliding puzzle experience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-10">
        <div className="space-y-4">
            <label className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Identify Yourself</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name..."
              autoFocus
              className="w-full px-8 py-5 rounded-3xl bg-white shadow-xl text-lg font-bold outline-none ring-2 ring-transparent focus:ring-current transition-all text-center placeholder:opacity-20"
            />
        </div>

        <div className="space-y-4">
            <label className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Choose Challenge</label>
            <div className="grid grid-cols-3 gap-2 bg-white/50 p-2 rounded-3xl shadow-inner">
              {Object.values(Difficulty).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-3 rounded-2xl font-black text-xs transition-all ${
                    difficulty === d ? themeColors.button + ' text-white shadow-lg scale-105' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
        </div>

        <button 
          type="submit"
          disabled={!name.trim()}
          className={`w-full py-5 ${themeColors.button} hover:brightness-110 disabled:opacity-30 text-white rounded-3xl font-black text-lg shadow-2xl transition-all active:scale-95`}
        >
          Enter
        </button>
      </form>
    </div>
  );
};

export default Onboarding;

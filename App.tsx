
import React, { useState, useEffect } from 'react';
import { View, AppSettings, Difficulty, Shape, GameState, ThemeType } from './types';
import { STORAGE_KEYS, GRID_CONFIG, THEME_CONFIG } from './constants';
import { generateSolvableShuffle, createPieces } from './services/puzzleLogic';
import Onboarding from './components/Onboarding';
import Menu from './components/Menu';
import GameView from './components/GameView';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.ONBOARDING);
  const [settings, setSettings] = useState<AppSettings>({
    userName: '',
    theme: 'ice-blue',
    defaultDifficulty: Difficulty.EASY,
    bestTimes: {},
  });
  const [activeGame, setActiveGame] = useState<GameState | null>(null);

  useEffect(() => {
    // Load settings
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      
      // If user has a name, check for existing game session
      if (parsed.userName) {
        const savedGame = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
        if (savedGame) {
          setActiveGame(JSON.parse(savedGame));
          setView(View.GAME);
        } else {
          setView(View.MENU);
        }
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const handleOnboard = (name: string, diff: Difficulty) => {
    setSettings(prev => ({ ...prev, userName: name, defaultDifficulty: diff }));
    setView(View.MENU);
  };

  const startGame = (image: string) => {
    const diff = settings.defaultDifficulty;
    const size = GRID_CONFIG[diff];
    const shuffled = generateSolvableShuffle(size);
    
    const newGame: GameState = {
      pieces: createPieces(shuffled, size),
      gridSize: size,
      moves: 0,
      startTime: Date.now(),
      endTime: null,
      isSolved: false,
      imageUri: image,
      difficulty: diff,
      shape: Shape.SQUARE,
      history: [],
    };

    setActiveGame(newGame);
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(newGame));
    setView(View.GAME);
  };

  const updateDifficulty = (diff: Difficulty) => {
    setSettings(prev => ({ ...prev, defaultDifficulty: diff }));
  };

  const updateTheme = (theme: ThemeType) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const currentTheme = THEME_CONFIG[settings.theme];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${currentTheme.bg} ${currentTheme.text}`}>
      <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-50 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className={`w-8 h-8 ${currentTheme.button} rounded-full flex items-center justify-center text-white shadow-lg`}>
            <span className="text-sm font-bold">GS</span>
          </div>
          <h1 className="text-xl font-black tracking-tight select-none">GeoSlide</h1>
        </div>
      </header>

      <main className="pt-16 px-4 pb-8 max-w-4xl mx-auto">
        {view === View.ONBOARDING && (
          <Onboarding 
            onComplete={handleOnboard} 
            initialName={settings.userName} 
            theme={settings.theme}
          />
        )}
        {view === View.MENU && (
            <Menu 
                userName={settings.userName} 
                difficulty={settings.defaultDifficulty}
                currentTheme={settings.theme}
                onDifficultyChange={updateDifficulty}
                onThemeChange={updateTheme}
                onStart={startGame} 
            />
        )}
        {view === View.GAME && activeGame && (
            <GameView 
                userName={settings.userName} 
                initialState={activeGame} 
                theme={settings.theme}
                onSave={(state) => {
                    setActiveGame(state);
                    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
                }}
                onFinish={(time) => {
                    setActiveGame(null);
                    localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
                }}
                onBack={() => {
                  setView(View.MENU);
                }}
            />
        )}
      </main>
    </div>
  );
};

export default App;
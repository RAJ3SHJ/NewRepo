
import { Difficulty, Shape, ThemeType } from './types';

export const GRID_CONFIG = {
  [Difficulty.EASY]: 3,
  [Difficulty.MEDIUM]: 4,
  [Difficulty.HARD]: 5,
};

export const SHAPE_CLIPS: Record<Shape, string> = {
  [Shape.SQUARE]: 'none',
};

export const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800', // Taj Mahal
  'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=800', // China Wall
  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800', // Rome (Colosseum)
  'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&q=80&w=800', // Statue of Liberty
  'https://images.unsplash.com/photo-1518235506717-31ed33bc18dc?auto=format&fit=crop&q=80&w=800', // Manhattan Building
  'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?auto=format&fit=crop&q=80&w=800', // Hollywood Symbol
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=800', // India Gate
];

export const THEME_CONFIG: Record<ThemeType, { bg: string, accent: string, text: string, button: string }> = {
  'ice-blue': {
    bg: 'bg-sky-50',
    accent: 'bg-sky-200',
    text: 'text-sky-900',
    button: 'bg-sky-600'
  },
  'ice-green': {
    bg: 'bg-emerald-50',
    accent: 'bg-emerald-200',
    text: 'text-emerald-900',
    button: 'bg-emerald-600'
  },
  'ice-pink': {
    bg: 'bg-rose-50',
    accent: 'bg-rose-200',
    text: 'text-rose-900',
    button: 'bg-rose-600'
  },
  'ice-purple': {
    bg: 'bg-violet-50',
    accent: 'bg-violet-200',
    text: 'text-violet-900',
    button: 'bg-violet-600'
  },
  'classic': {
    bg: 'bg-gray-50',
    accent: 'bg-gray-200',
    text: 'text-gray-900',
    button: 'bg-indigo-600'
  }
};

export const STORAGE_KEYS = {
  SETTINGS: 'geoslide_settings',
  GAME_STATE: 'geoslide_game_state',
};

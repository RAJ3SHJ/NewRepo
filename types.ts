
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum Shape {
  SQUARE = 'SQUARE'
}

export interface PuzzlePiece {
  id: number; // The correct/goal position (0 to n-1)
  currentIndex: number;
  imageOffset: { x: number; y: number };
  isBlank: boolean;
}

export interface GameState {
  pieces: PuzzlePiece[];
  gridSize: number;
  moves: number;
  startTime: number | null;
  endTime: number | null;
  isSolved: boolean;
  imageUri: string;
  difficulty: Difficulty;
  shape: Shape;
  history: PuzzlePiece[][];
}

export enum View {
  ONBOARDING = 'ONBOARDING',
  MENU = 'MENU',
  GAME = 'GAME'
}

export type ThemeType = 'ice-blue' | 'ice-green' | 'ice-pink' | 'ice-purple' | 'classic';

export interface AppSettings {
  userName: string;
  theme: ThemeType;
  defaultDifficulty: Difficulty;
  bestTimes: Record<string, number>;
}

export type Tile = '#' | 'd' | '.' | 'O' | '*' | 'E' | 'P';

export type GameMode = 'EASY' | 'MEDIUM' | 'HARD';

export interface LevelInfo {
  id: GameMode;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  badgeBg: string;
  diamonds: number;
  rocks: number;
  difficultyRating: number; // 1 to 5
  hazardLevel: 'LOW' | 'MEDIUM' | 'EXTREME';
}

export interface LevelConfig {
  levelNumber: number;
  name: string;
  subtitle: string;
  description: string;
  diamonds: number;
  rocks: number;
  layout: string[];
}

export interface GameState {
  grid: Tile[][];
  player: [number, number];
  collected: number;
  total: number;
  moves: number;
  deaths: number;
  wins: number;
  mode: GameMode;
  levelNumber: number;
  startTime: number;
  elapsedSeconds: number;
  isUnlocked: boolean;
  isComplete: boolean;
  isDead: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export type ScreenState = 'MENU' | 'MODE_SELECT' | 'START_SCREEN' | 'PLAYING';

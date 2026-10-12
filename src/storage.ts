import { GameMode } from './types';

export interface ModeProgress {
  maxUnlockedLevel: number;
  currentLevel: number;
  completedLevels: number[];
}

export type AllProgress = Record<GameMode, ModeProgress>;

const STORAGE_KEY = 'diamond_rush_game_progress_v2';

const DEFAULT_PROGRESS: AllProgress = {
  EASY: { maxUnlockedLevel: 1, currentLevel: 1, completedLevels: [] },
  MEDIUM: { maxUnlockedLevel: 1, currentLevel: 1, completedLevels: [] },
  HARD: { maxUnlockedLevel: 1, currentLevel: 1, completedLevels: [] },
};

export function loadProgress(): AllProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      EASY: {
        maxUnlockedLevel: Math.max(1, Math.min(5, Number(parsed?.EASY?.maxUnlockedLevel) || 1)),
        currentLevel: Math.max(1, Math.min(5, Number(parsed?.EASY?.currentLevel) || 1)),
        completedLevels: Array.isArray(parsed?.EASY?.completedLevels) ? parsed.EASY.completedLevels : [],
      },
      MEDIUM: {
        maxUnlockedLevel: Math.max(1, Math.min(5, Number(parsed?.MEDIUM?.maxUnlockedLevel) || 1)),
        currentLevel: Math.max(1, Math.min(5, Number(parsed?.MEDIUM?.currentLevel) || 1)),
        completedLevels: Array.isArray(parsed?.MEDIUM?.completedLevels) ? parsed.MEDIUM.completedLevels : [],
      },
      HARD: {
        maxUnlockedLevel: Math.max(1, Math.min(5, Number(parsed?.HARD?.maxUnlockedLevel) || 1)),
        currentLevel: Math.max(1, Math.min(5, Number(parsed?.HARD?.currentLevel) || 1)),
        completedLevels: Array.isArray(parsed?.HARD?.completedLevels) ? parsed.HARD.completedLevels : [],
      },
    };
  } catch (e) {
    console.error('Failed to load progress from localStorage', e);
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: AllProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function saveLevelCompleted(mode: GameMode, completedLevel: number): AllProgress {
  const progress = loadProgress();
  const modeData = progress[mode];

  if (!modeData.completedLevels.includes(completedLevel)) {
    modeData.completedLevels.push(completedLevel);
  }

  // Next level unlocked (up to level 5)
  const nextLevel = Math.min(5, completedLevel + 1);
  if (nextLevel > modeData.maxUnlockedLevel) {
    modeData.maxUnlockedLevel = nextLevel;
  }
  modeData.currentLevel = nextLevel;

  saveProgress(progress);
  return progress;
}

export function setSavedCurrentLevel(mode: GameMode, levelNumber: number): AllProgress {
  const progress = loadProgress();
  // Ensure player cannot select a level higher than maxUnlockedLevel
  const safeLevel = Math.min(progress[mode].maxUnlockedLevel, Math.max(1, levelNumber));
  progress[mode].currentLevel = safeLevel;
  saveProgress(progress);
  return progress;
}

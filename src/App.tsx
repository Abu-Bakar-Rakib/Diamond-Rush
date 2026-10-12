import { useState } from 'react';
import { GameMode, ScreenState, GameState } from './types';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { ModeSelect } from './components/ModeSelect';
import { StartScreen } from './components/StartScreen';
import { GameCanvas } from './components/GameCanvas';
import { HowToPlayModal } from './components/HowToPlayModal';
import { VictoryModal } from './components/VictoryModal';
import { sounds } from './audio';
import { loadProgress, saveLevelCompleted, setSavedCurrentLevel, AllProgress } from './storage';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('MENU');
  const [progress, setProgress] = useState<AllProgress>(() => loadProgress());
  const [mode, setMode] = useState<GameMode>('EASY');
  const [levelNumber, setLevelNumber] = useState<number>(() => {
    const initial = loadProgress();
    return initial.EASY.currentLevel;
  });
  const [isMuted, setIsMuted] = useState<boolean>(sounds.muted);

  // Modals state
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [victoryState, setVictoryState] = useState<GameState | null>(null);

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const handleSelectMode = (newMode: GameMode) => {
    setMode(newMode);
    // Automatically resume from saved level for this mode
    const modeSavedLvl = progress[newMode]?.currentLevel || 1;
    setLevelNumber(modeSavedLvl);
  };

  const handleSelectLevel = (lvl: number) => {
    const updated = setSavedCurrentLevel(mode, lvl);
    setProgress(updated);
    setLevelNumber(lvl);
  };

  const handleVictory = (finalState: GameState) => {
    const updated = saveLevelCompleted(finalState.mode, finalState.levelNumber);
    setProgress(updated);
    setVictoryState(finalState);
  };

  const handleNextStage = () => {
    if (!victoryState) return;
    const nextLvl = Math.min(5, victoryState.levelNumber + 1);
    setLevelNumber(nextLvl);
    setVictoryState(null);
    setScreen('PLAYING');
  };

  const handleNextMode = (nextMode: GameMode) => {
    setVictoryState(null);
    setMode(nextMode);
    const nextModeLvl = progress[nextMode]?.currentLevel || 1;
    setLevelNumber(nextModeLvl);
    setScreen('START_SCREEN');
  };

  const currentModeProgress = progress[mode] || { maxUnlockedLevel: 1, currentLevel: 1, completedLevels: [] };

  return (
    <div className="min-h-screen bg-[#0c0f13] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-zinc-950 overflow-x-hidden">
      {/* Universal Top Header */}
      <Header
        screen={screen}
        mode={mode}
        levelNumber={levelNumber}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenHowToPlay={() => setShowHowToPlay(true)}
        onGoHome={() => {
          setVictoryState(null);
          setScreen('MENU');
        }}
      />

      {/* Main Screen Router */}
      <main className="flex-1 flex flex-col relative">
        {screen === 'MENU' && (
          <MainMenu
            onStartGame={() => setScreen('MODE_SELECT')}
            onOpenHowToPlay={() => setShowHowToPlay(true)}
          />
        )}

        {screen === 'MODE_SELECT' && (
          <ModeSelect
            selectedMode={mode}
            progress={progress}
            onSelectMode={handleSelectMode}
            onConfirm={() => setScreen('START_SCREEN')}
            onBack={() => setScreen('MENU')}
          />
        )}

        {screen === 'START_SCREEN' && (
          <StartScreen
            mode={mode}
            levelNumber={levelNumber}
            maxUnlockedLevel={currentModeProgress.maxUnlockedLevel}
            completedLevels={currentModeProgress.completedLevels}
            onChangeMode={handleSelectMode}
            onSelectLevel={handleSelectLevel}
            onLaunchGame={() => setScreen('PLAYING')}
            onBack={() => setScreen('MODE_SELECT')}
          />
        )}

        {screen === 'PLAYING' && (
          <GameCanvas
            key={`${mode}-${levelNumber}`} // Re-render canvas cleanly on mode/level changes
            mode={mode}
            levelNumber={levelNumber}
            onVictory={handleVictory}
            onGoHome={() => setScreen('MENU')}
            onChangeMode={() => setScreen('START_SCREEN')}
          />
        )}
      </main>

      {/* Modals & Overlays */}
      {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
      {victoryState && (
        <VictoryModal
          state={victoryState}
          onReplay={() => {
            setVictoryState(null);
            setScreen('PLAYING');
          }}
          onNextStage={handleNextStage}
          onNextMode={handleNextMode}
          onStageSelect={() => {
            setVictoryState(null);
            setScreen('START_SCREEN');
          }}
          onGoHome={() => {
            setVictoryState(null);
            setScreen('MENU');
          }}
        />
      )}
    </div>
  );
}

import React, { useEffect } from 'react';
import { GameMode } from '../types';
import { LEVEL_METADATA } from '../levels';
import { AllProgress } from '../storage';
import { sounds } from '../audio';
import { Gem, Flame, ShieldCheck, ArrowRight, ArrowLeft, Skull, Info, Lock, CheckCircle2 } from 'lucide-react';

interface ModeSelectProps {
  selectedMode: GameMode;
  progress: AllProgress;
  onSelectMode: (mode: GameMode) => void;
  onConfirm: () => void;
  onBack: () => void;
}

const MODES: GameMode[] = ['EASY', 'MEDIUM', 'HARD'];

export const ModeSelect: React.FC<ModeSelectProps> = ({
  selectedMode,
  progress,
  onSelectMode,
  onConfirm,
  onBack,
}) => {
  // Keyboard navigation for difficulty selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = MODES.indexOf(selectedMode);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const nextIdx = (currentIndex - 1 + MODES.length) % MODES.length;
        onSelectMode(MODES[nextIdx]);
        sounds.playClick();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const nextIdx = (currentIndex + 1) % MODES.length;
        onSelectMode(MODES[nextIdx]);
        sounds.playClick();
      } else if (e.key === 'Enter') {
        sounds.playClick();
        onConfirm();
      } else if (e.key === 'Escape') {
        sounds.playClick();
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMode, onSelectMode, onConfirm, onBack]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-5xl mx-auto w-full my-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono font-medium mb-3">
          <span>STEP 1 OF 2 — CAVERN SELECTION</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          GAME <span className="text-cyan-400">MODE</span>
        </h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto mt-2">
          Choose your sector danger level. Each mode contains 5 sequential stages with saved progress.
        </p>
      </div>

      {/* Difficulty Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8">
        {MODES.map((mode) => {
          const info = LEVEL_METADATA[mode];
          const isSelected = selectedMode === mode;
          const modeProgress = progress[mode];
          const maxUnlocked = modeProgress.maxUnlockedLevel;
          const currentLvl = modeProgress.currentLevel;
          const isAllCompleted = modeProgress.completedLevels.length >= 5;

          return (
            <div
              key={mode}
              onClick={() => {
                sounds.playClick();
                onSelectMode(mode);
              }}
              className={`relative rounded-2xl p-5 sm:p-6 cursor-pointer border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-400 bg-zinc-900/90 shadow-2xl shadow-cyan-500/20 ring-2 ring-cyan-400/40 scale-[1.02]'
                  : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-zinc-700 opacity-80 hover:opacity-100'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-400 text-zinc-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                  SELECTED
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-md border"
                    style={{
                      borderColor: `${info.color}40`,
                      backgroundColor: `${info.color}15`,
                      color: info.color,
                    }}
                  >
                    {info.id}
                  </span>

                  <div className="flex items-center gap-1">
                    {mode === 'EASY' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                    {mode === 'MEDIUM' && <Flame className="w-4 h-4 text-amber-400" />}
                    {mode === 'HARD' && <Skull className="w-4 h-4 text-rose-400" />}
                    <span className="text-[11px] font-mono font-bold text-zinc-400">
                      {info.hazardLevel} HAZARD
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-white mb-1">{info.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">{info.description}</p>

                {/* Level Progress Indicator */}
                <div className="mb-4 p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-zinc-400 font-mono text-[11px]">RESUME STAGE</span>
                    <span className="font-bold font-mono text-cyan-300">
                      {isAllCompleted ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> ALL 5 CLEARED
                        </span>
                      ) : (
                        `Stage ${currentLvl} / 5`
                      )}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1">
                    {[1, 2, 3, 4, 5].map((lvl) => {
                      const isUnlocked = lvl <= maxUnlocked;
                      const isCompleted = modeProgress.completedLevels.includes(lvl);
                      const isCur = lvl === currentLvl;

                      return (
                        <div
                          key={lvl}
                          className={`h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : isCur
                              ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 ring-1 ring-cyan-400/50'
                              : isUnlocked
                              ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                              : 'bg-zinc-900/60 text-zinc-600 border border-zinc-800/80'
                          }`}
                          title={`Stage ${lvl}: ${isCompleted ? 'Completed' : isUnlocked ? 'Unlocked' : 'Locked'}`}
                        >
                          {isUnlocked ? (
                            lvl
                          ) : (
                            <Lock className="w-2.5 h-2.5 text-zinc-600" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <Gem className="w-3.5 h-3.5 text-cyan-400" /> Total Stages
                  </span>
                  <span className="font-bold text-cyan-300">5 Caverns</span>
                </div>

                <div className="flex items-center justify-between text-zinc-300">
                  <span className="text-zinc-400">Danger Rating</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-2 h-2 rounded-full ${
                          star <= info.difficultyRating ? 'bg-cyan-400' : 'bg-zinc-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between w-full max-w-md gap-4">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onConfirm();
          }}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/20 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>CONTINUE TO STAGE {progress[selectedMode].currentLevel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-6 flex items-center gap-2 text-zinc-500 text-xs">
        <Info className="w-3.5 h-3.5" />
        <span>Use [Arrow Keys] to choose mode, [Enter] to confirm</span>
      </div>
    </div>
  );
};

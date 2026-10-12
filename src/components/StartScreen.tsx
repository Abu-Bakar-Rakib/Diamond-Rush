import React, { useEffect } from 'react';
import { GameMode } from '../types';
import { LEVEL_METADATA, getLevelConfig } from '../levels';
import { sounds } from '../audio';
import { Play, ArrowLeft, Gem, DoorOpen, Skull, Keyboard, Sparkles, Lock, CheckCircle2 } from 'lucide-react';

interface StartScreenProps {
  mode: GameMode;
  levelNumber: number;
  maxUnlockedLevel: number;
  completedLevels: number[];
  onChangeMode: (mode: GameMode) => void;
  onSelectLevel: (levelNumber: number) => void;
  onLaunchGame: () => void;
  onBack: () => void;
}

const MODES: GameMode[] = ['EASY', 'MEDIUM', 'HARD'];

export const StartScreen: React.FC<StartScreenProps> = ({
  mode,
  levelNumber,
  maxUnlockedLevel,
  completedLevels,
  onChangeMode,
  onSelectLevel,
  onLaunchGame,
  onBack,
}) => {
  const modeInfo = LEVEL_METADATA[mode];
  const levelConfig = getLevelConfig(mode, levelNumber);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        sounds.playClick();
        onLaunchGame();
      } else if (e.key === 'Escape') {
        sounds.playClick();
        onBack();
      } else if (e.key >= '1' && e.key <= '5') {
        const lvl = parseInt(e.key, 10);
        if (lvl <= maxUnlockedLevel) {
          sounds.playClick();
          onSelectLevel(lvl);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onLaunchGame, onBack, onSelectLevel, maxUnlockedLevel]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto w-full my-auto animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>STEP 2 OF 2 — MISSION BRIEFING</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          EXPEDITION <span className="text-cyan-400">READY</span>
        </h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto mt-1">
          Select an unlocked stage or proceed with your active cavern mission.
        </p>
      </div>

      {/* Difficulty Quick Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 mb-5">
        {MODES.map((m) => {
          const isCurrent = mode === m;
          return (
            <button
              key={m}
              onClick={() => {
                sounds.playClick();
                onChangeMode(m);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                isCurrent
                  ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {m}
            </button>
          );
        })}
      </div>

      {/* Sequential Level Selector (Stages 1 through 5) */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2 px-1">
          <span className="font-bold uppercase tracking-wider text-zinc-300">
            {mode} STAGES (SEQUENTIAL PROGRESSION)
          </span>
          <span className="text-[11px] text-cyan-400">
            {maxUnlockedLevel >= 5 ? 'All Stages Unlocked' : `Unlocked: Up to Stage ${maxUnlockedLevel}`}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5].map((lvl) => {
            const isUnlocked = lvl <= maxUnlockedLevel;
            const isSelected = lvl === levelNumber;
            const isCompleted = completedLevels.includes(lvl);

            return (
              <button
                key={lvl}
                disabled={!isUnlocked}
                onClick={() => {
                  if (isUnlocked) {
                    sounds.playClick();
                    onSelectLevel(lvl);
                  }
                }}
                className={`relative py-3 px-2 sm:px-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  !isUnlocked
                    ? 'border-zinc-800/80 bg-zinc-950/40 text-zinc-600 opacity-50 cursor-not-allowed'
                    : isSelected
                    ? 'border-cyan-400 bg-cyan-950/50 text-white shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400/40 transform -translate-y-0.5'
                    : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                }`}
                title={
                  !isUnlocked
                    ? `Stage ${lvl} is locked. Complete Stage ${lvl - 1} first.`
                    : `Play Stage ${lvl}`
                }
              >
                {/* Active Indicator */}
                {isSelected && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded bg-cyan-400 text-zinc-950 font-black text-[9px] uppercase tracking-wider font-mono">
                    ACTIVE
                  </span>
                )}

                <div className="flex items-center gap-1 font-mono font-bold text-xs sm:text-sm">
                  {isUnlocked ? (
                    <>
                      <span>STAGE {lvl}</span>
                      {isCompleted && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                      <span className="text-zinc-600">STAGE {lvl}</span>
                    </>
                  )}
                </div>

                <span className="text-[10px] font-mono opacity-60 truncate max-w-full">
                  {isUnlocked ? (isCompleted ? 'Cleared' : 'Ready') : 'Locked'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mission Briefing Card */}
      <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md p-6 sm:p-8 mb-6 shadow-2xl relative overflow-hidden">
        <div
          className="absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: modeInfo.color }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800/80 gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded border inline-block"
                style={{
                  borderColor: `${modeInfo.color}40`,
                  backgroundColor: `${modeInfo.color}15`,
                  color: modeInfo.color,
                }}
              >
                {modeInfo.id} MODE
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-cyan-300 border border-zinc-700">
                STAGE {levelNumber} OF 5
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">{levelConfig.name}</h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">{levelConfig.subtitle}</p>
            <p className="text-xs text-zinc-300 mt-2 max-w-md">{levelConfig.description}</p>
          </div>

          <div className="flex items-center gap-4 sm:border-l sm:border-zinc-800 sm:pl-6">
            <div className="text-right sm:text-left">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">GEM QUOTA</span>
              <span className="text-2xl font-black text-cyan-300 font-mono">{levelConfig.diamonds}</span>
            </div>
            <div className="text-right sm:text-left">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">BOULDERS</span>
              <span className="text-2xl font-black text-rose-300 font-mono">{levelConfig.rocks}</span>
            </div>
          </div>
        </div>

        {/* Objective Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase mb-1">
              <Gem className="w-4 h-4" />
              <span>1. Mine Diamonds</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Dig directly into dirt and collect all {levelConfig.diamonds} glowing gems in this cavern.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase mb-1">
              <Skull className="w-4 h-4" />
              <span>2. Gravity Safety</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Boulders drop into cleared cavities. Avoid standing directly under unsupported rocks.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-1">
              <DoorOpen className="w-4 h-4" />
              <span>3. Escape Extraction</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Step into the green extraction door to clear Stage {levelNumber} and unlock the next stage.
            </p>
          </div>
        </div>

        {/* Controls Quick Reminder */}
        <div className="flex flex-wrap items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/60 text-xs text-zinc-400 gap-2">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-zinc-300">Controls:</span>
            <span className="flex items-center gap-1 font-mono text-zinc-200">
              <kbd className="px-1.5 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-[11px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-[11px]">↓</kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-[11px]">←</kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-[11px]">→</kbd>
              <span className="text-zinc-500 ml-1">Move / Dig / Push</span>
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span><kbd className="px-1 rounded bg-zinc-800 border border-zinc-700">R</kbd> Restart</span>
            <span><kbd className="px-1 rounded bg-zinc-800 border border-zinc-700">ESC</kbd> Menu</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between w-full max-w-md gap-4">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>CHANGE MODE</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onLaunchGame();
          }}
          className="flex-1 group flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-zinc-950 font-black text-base tracking-wider transition-all shadow-xl shadow-cyan-500/25 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>START STAGE {levelNumber}</span>
        </button>
      </div>

      <div className="mt-4 text-xs text-zinc-500 font-mono">
        Press <kbd className="text-zinc-400">[ENTER]</kbd> or <kbd className="text-zinc-400">[SPACE]</kbd> to launch immediately
      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameMode, GameState } from '../types';
import { LEVEL_METADATA, getLevelConfig } from '../levels';
import { sounds } from '../audio';
import { Trophy, Star, RefreshCw, ArrowRight, Home, Grid } from 'lucide-react';

interface VictoryModalProps {
  state: GameState;
  onReplay: () => void;
  onNextStage: () => void;
  onNextMode: (nextMode: GameMode) => void;
  onStageSelect: () => void;
  onGoHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  state,
  onReplay,
  onNextStage,
  onNextMode,
  onStageSelect,
  onGoHome,
}) => {
  const currentInfo = LEVEL_METADATA[state.mode];
  const levelConfig = getLevelConfig(state.mode, state.levelNumber);

  // Fire celebratory confetti burst
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#34d399', '#facc15', '#f43f5e', '#a855f7'],
    });
    const timer = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // Determine star rating based on moves & deaths
  let stars = 3;
  if (state.deaths > 0 || state.moves > 80) stars = 2;
  if (state.deaths > 2 || state.moves > 130) stars = 1;

  // Next mode calculation
  const nextModeMap: Record<GameMode, GameMode> = {
    EASY: 'MEDIUM',
    MEDIUM: 'HARD',
    HARD: 'HARD',
  };
  const nextMode = nextModeMap[state.mode];
  const isFinalStage = state.levelNumber >= 5;
  const isHardestFinal = state.mode === 'HARD' && isFinalStage;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4 animate-bounce">
          <Trophy className="w-8 h-8 text-zinc-950" />
        </div>

        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
          {currentInfo.id} • STAGE {state.levelNumber} OF 5 CLEARED!
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
          {levelConfig.name}
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          All {state.total} diamonds collected and extracted!
        </p>

        {/* Star Rating */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((star) => (
            <div
              key={star}
              className={`p-2 rounded-xl border transition-all ${
                star <= stars
                  ? 'border-amber-400/40 bg-amber-400/10 text-amber-400 scale-110 shadow-lg shadow-amber-500/10'
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-700'
              }`}
            >
              <Star className="w-6 h-6 fill-current" />
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl border border-zinc-800 bg-zinc-900/60 font-mono text-center mb-6">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block">TIME</span>
            <span className="text-base font-bold text-white">{formatTime(state.elapsedSeconds)}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block">MOVES</span>
            <span className="text-base font-bold text-cyan-300">{state.moves}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block">RESETS</span>
            <span className="text-base font-bold text-rose-300">{state.deaths}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {!isFinalStage ? (
            <button
              onClick={() => {
                sounds.playClick();
                onNextStage();
              }}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/25"
            >
              <span>ADVANCE TO STAGE {state.levelNumber + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : !isHardestFinal ? (
            <button
              onClick={() => {
                sounds.playClick();
                onNextMode(nextMode);
              }}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-zinc-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/25"
            >
              <span>CONQUERED ALL 5! PROCEED TO {nextMode}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playClick();
                onReplay();
              }}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-amber-500/25"
            >
              <RefreshCw className="w-4 h-4" />
              <span>REPLAY FINAL MASTER CAVERN</span>
            </button>
          )}

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                onReplay();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs transition-colors"
              title="Replay this level"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>REPLAY</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onStageSelect();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs transition-colors"
              title="Select another unlocked stage"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>STAGES</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onGoHome();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs transition-colors"
              title="Main Menu"
            >
              <Home className="w-3.5 h-3.5" />
              <span>MENU</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

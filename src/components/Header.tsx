import React from 'react';
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { sounds } from '../audio';
import { ScreenState, GameMode } from '../types';
import { LEVEL_METADATA } from '../levels';

interface HeaderProps {
  screen: ScreenState;
  mode: GameMode;
  levelNumber?: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  screen,
  mode,
  levelNumber,
  isMuted,
  onToggleMute,
  onGoHome,
}) => {
  const currentLevel = LEVEL_METADATA[mode];

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {screen !== 'MENU' ? (
          <button
            onClick={() => {
              sounds.playClick();
              onGoHome();
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition-all shadow-sm"
            title="Return to Main Menu"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">MENU</span>
          </button>
        ) : null}

        <div
          onClick={() => {
            sounds.playClick();
            onGoHome();
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white text-sm font-black rotate-45">◆</span>
          </div>
          <span className="font-extrabold tracking-tight text-white text-base sm:text-lg flex items-center gap-1.5">
            DIAMOND <span className="text-cyan-400">RUSH</span>
          </span>
          <span className="hidden md:inline-flex text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
            v2.0
          </span>
        </div>

        {screen === 'PLAYING' && (
          <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-zinc-800">
            <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${currentLevel.badgeBg}`}>
              {currentLevel.name} {levelNumber ? `• STAGE ${levelNumber}/5` : ''}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => {
            sounds.playClick();
            onToggleMute();
          }}
          className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          aria-label="Toggle Audio"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>
      </div>
    </header>
  );
};

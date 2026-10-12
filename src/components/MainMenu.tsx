import React from 'react';
import { Play, Gem, Compass, Sparkles, ChevronRight } from 'lucide-react';
import { sounds } from '../audio';

interface MainMenuProps {
  onStartGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-5xl mx-auto w-full my-auto animate-fade-in">
      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono font-medium tracking-wide mb-6 shadow-inner">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>AUTHENTIC 2006 RETRO CAVE PUZZLE</span>
      </div>

      {/* Main Title & Hero Gem */}
      <div className="relative mb-6 text-center">
        <div className="relative inline-block mb-3">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl transform scale-150 animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto flex items-center justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-cyan-600 via-cyan-400 to-sky-200 rotate-45 rounded-xl shadow-2xl shadow-cyan-400/50 flex items-center justify-center border-2 border-cyan-200 transform hover:rotate-[225deg] transition-transform duration-700 cursor-pointer">
              <div className="w-6 h-6 bg-cyan-950/40 rounded-sm rotate-45 border border-cyan-300/40" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-3">
          DIAMOND <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">RUSH</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Dig deep into dangerous caverns, push boulders into empty shafts, collect sparkling gems, and unlock the extraction portal before rocks crush you.
        </p>
      </div>

      {/* Primary Actions */}
      <div className="w-full max-w-md flex flex-col gap-3 mb-10">
        <button
          onClick={() => {
            sounds.playClick();
            onStartGame();
          }}
          className="group relative flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-zinc-950 font-black text-lg tracking-wider transition-all transform hover:-translate-y-0.5 shadow-xl shadow-cyan-500/25 active:translate-y-0"
        >
          <Play className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
          <span>START GAME</span>
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>


      </div>

      {/* Feature Highlights Grid */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <Gem className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-1">3 Difficulties</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Easy, Medium, & Hard caverns with custom diamond quotas and rock layouts.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-1">Gravity Physics</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Bottom-to-top rock & diamond falling engine with crushing danger.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-zinc-500 flex items-center justify-center gap-4">
        <span>Controls: Arrow Keys</span>
        <span>•</span>
        <span>Tile Size: 40×40</span>
        <span>•</span>
        <span>Grid: 20×15</span>
      </div>
    </div>
  );
};

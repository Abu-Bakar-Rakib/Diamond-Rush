import React, { useEffect } from 'react';
import { X, ArrowDown, ShieldAlert, Sparkles, MoveRight } from 'lucide-react';
import { sounds } from '../audio';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sounds.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
              ?
            </div>
            <h2 className="text-lg font-black text-white tracking-wide">HOW TO PLAY DIAMOND RUSH</h2>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-sm text-zinc-300">
          {/* Objective Banner */}
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm mb-1">Primary Objective</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Collect <span className="text-cyan-300 font-bold">ALL diamonds</span> scattered across the cavern. Once collected, the exit door unlocks from <span className="text-rose-400 font-bold">Red (Locked)</span> to <span className="text-emerald-400 font-bold">Green (Open)</span>. Reach the green exit door to complete the sector!
              </p>
            </div>
          </div>

          {/* Tile Dictionary */}
          <div>
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest mb-3">
              CAVERN TILES & ELEMENTS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Wall */}
              <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#454e51] border-2 border-[#252d32] shrink-0 shadow-inner flex items-center justify-center text-[10px] font-mono font-bold text-zinc-300">
                  WALL
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Dark Stone Wall</h4>
                  <p className="text-[11px] text-zinc-400">Solid boundary. Impassable to player and boulders.</p>
                </div>
              </div>

              {/* Dirt */}
              <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#805938] border-2 border-[#65452f] shrink-0 shadow-inner flex items-center justify-center text-[10px] font-mono font-bold text-amber-200">
                  DIRT
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Brown Dirt</h4>
                  <p className="text-[11px] text-zinc-400">Diggable. Turns into empty tunnel upon stepping.</p>
                </div>
              </div>

              {/* Rock */}
              <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#a43b4a] border-2 border-[#541f2b] shrink-0 shadow-md flex items-center justify-center text-[10px] font-mono font-bold text-rose-100">
                  ROCK
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Crimson Boulder</h4>
                  <p className="text-[11px] text-zinc-400">Pushable horizontally. Falls if space beneath is empty!</p>
                </div>
              </div>

              {/* Diamond */}
              <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <div className="w-7 h-7 bg-[#49dcef] border-2 border-[#176473] rotate-45 shadow-lg shadow-cyan-500/30 flex items-center justify-center text-[8px] font-black text-zinc-950">
                    GEM
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-cyan-300">Cyan Diamond</h4>
                  <p className="text-[11px] text-zinc-400">Collect for score. Affected by gravity just like rocks.</p>
                </div>
              </div>

              {/* Player */}
              <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ffd453] border-2 border-[#755324] shrink-0 shadow-md flex items-center justify-center text-[10px] font-black text-zinc-950">
                  YOU
                </div>
                <div>
                  <h4 className="font-bold text-xs text-yellow-300">Explorer (Player)</h4>
                  <p className="text-[11px] text-zinc-400">Controlled by Arrow Keys. Avoid being crushed!</p>
                </div>
              </div>

              {/* Exit Door */}
              <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#293239] border border-zinc-700 shrink-0 flex items-center justify-center gap-1">
                  <div className="w-3 h-5 bg-rose-500 rounded-sm" />
                  <div className="w-3 h-5 bg-emerald-400 rounded-sm" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Extraction Portal</h4>
                  <p className="text-[11px] text-zinc-400">Red = Locked. Green = Unlocked when all gems mined.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Mechanics */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
              CORE MECHANICS
            </h3>

            <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/30 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-300">
                <MoveRight className="w-3.5 h-3.5" />
                <span>1. Sokoban Boulder Pushing</span>
              </div>
              <p className="text-xs text-zinc-400 pl-5">
                If you walk into a boulder and the tile behind it is <span className="text-zinc-200 font-bold">EMPTY</span>, you push the boulder into that empty space. If blocked, you cannot move.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/30 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs text-cyan-300">
                <ArrowDown className="w-3.5 h-3.5" />
                <span>2. Gravity & Settling Engine</span>
              </div>
              <p className="text-xs text-zinc-400 pl-5">
                After every player move, the grid is scanned bottom-to-top. Any boulder or diamond above an empty tile falls down until all items settle.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-950/20 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs text-rose-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>3. Crushing Hazard (Instant Death)</span>
              </div>
              <p className="text-xs text-rose-200/80 pl-5">
                If a boulder or diamond falls directly into your tile, you are instantly crushed! The level will automatically reset. Plan your digs carefully!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-500">Keyboard: Arrow Keys / R to Reset</span>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition-colors"
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
};

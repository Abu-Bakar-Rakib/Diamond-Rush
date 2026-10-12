import React, { useEffect, useState } from 'react';
import { X, Copy, Check, Download, Terminal } from 'lucide-react';
import { sounds } from '../audio';

interface SourceCodeModalProps {
  onClose: () => void;
}

export const SourceCodeModal: React.FC<SourceCodeModalProps> = ({ onClose }) => {
  const [source, setSource] = useState<string>('Loading Python source code...');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    fetch('/diamond_rush.py')
      .then((res) => res.text())
      .then((text) => setSource(text))
      .catch(() => setSource('Failed to load source code. Please download the file directly.'));
  }, []);

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

  const handleCopy = () => {
    sounds.playClick();
    navigator.clipboard.writeText(source);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
              PY
            </div>
            <div>
              <h2 className="text-base font-black text-white">diamond_rush.py</h2>
              <span className="text-[11px] font-mono text-zinc-400">Single-file standalone Python + Pygame clone</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED!' : 'COPY CODE'}</span>
            </button>

            <a
              href="/diamond_rush.py"
              download="diamond_rush.py"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD .PY</span>
            </a>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-1"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Instructions */}
        <div className="p-3.5 bg-zinc-900/40 border-b border-zinc-800 flex items-center gap-3 text-xs font-mono text-zinc-300">
          <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Quick Run:</span>
          <code className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-cyan-300">
            pip install pygame && python diamond_rush.py
          </code>
        </div>

        {/* Code Content */}
        <div className="overflow-auto p-4 sm:p-6 bg-zinc-950 font-mono text-xs leading-relaxed text-zinc-300 flex-1 select-text">
          <pre className="whitespace-pre">
            <code>{source}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>Window 800×600 • Tile 40×40 • Pure Pygame Drawing Functions (Zero External Assets)</span>
          <span className="hidden sm:inline">ESC to close</span>
        </div>
      </div>
    </div>
  );
};

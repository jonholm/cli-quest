'use client';

interface HintButtonProps {
  onUseHint: () => void;
  hintsUsed: number;
  totalHints: number;
}

export default function HintButton({ onUseHint, hintsUsed, totalHints }: HintButtonProps) {
  const hasMoreHints = hintsUsed < totalHints;

  return (
    <button
      onClick={onUseHint}
      disabled={!hasMoreHints}
      className={`px-4 py-2 border ${
        hasMoreHints
          ? 'border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-terminal-bg'
          : 'border-gray-600 text-gray-600 cursor-not-allowed'
      } transition-colors`}
    >
      Hint ({hintsUsed}/{totalHints})
    </button>
  );
}

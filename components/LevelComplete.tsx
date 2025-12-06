'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LevelCompleteProps {
  message: string;
  nextLevelId: string | null;
  commandCount: number;
  hintsUsed: number;
}

export default function LevelComplete({
  message,
  nextLevelId,
  commandCount,
  hintsUsed,
}: LevelCompleteProps) {
  const router = useRouter();
  const [selectedButton, setSelectedButton] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedButton(0);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedButton(1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedButton === 0) {
          router.push(nextLevelId ? `/play/${nextLevelId}` : '/');
        } else {
          router.push('/');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedButton, nextLevelId, router]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-terminal-bg border-2 border-terminal-green p-8 max-w-md">
        <h2 className="text-2xl font-bold text-terminal-green mb-4">LEVEL COMPLETE!</h2>
        <p className="text-terminal-white mb-4">{message}</p>

        <div className="mb-6 text-terminal-white">
          <div>Commands used: {commandCount}</div>
          <div>Hints used: {hintsUsed}</div>
        </div>

        <div className="mb-4 text-xs text-terminal-green opacity-60 text-center">
          Use Arrow Keys to navigate • Press Enter to select
        </div>

        <div className="flex gap-4">
          {nextLevelId ? (
            <Link
              href={`/play/${nextLevelId}`}
              className={`px-6 py-2 font-bold transition-all ${
                selectedButton === 0
                  ? 'bg-terminal-green text-terminal-bg scale-105'
                  : 'bg-terminal-green bg-opacity-70 text-terminal-bg opacity-80'
              }`}
              onMouseEnter={() => setSelectedButton(0)}
            >
              Next Level
            </Link>
          ) : (
            <Link
              href="/"
              className={`px-6 py-2 font-bold transition-all ${
                selectedButton === 0
                  ? 'bg-terminal-green text-terminal-bg scale-105'
                  : 'bg-terminal-green bg-opacity-70 text-terminal-bg opacity-80'
              }`}
              onMouseEnter={() => setSelectedButton(0)}
            >
              Back to Menu
            </Link>
          )}
          <Link
            href="/"
            className={`px-6 py-2 border border-terminal-green text-terminal-green transition-all ${
              selectedButton === 1
                ? 'bg-terminal-green text-terminal-bg scale-105'
                : 'hover:bg-terminal-green hover:text-terminal-bg'
            }`}
            onMouseEnter={() => setSelectedButton(1)}
          >
            Level Select
          </Link>
        </div>
      </div>
    </div>
  );
}

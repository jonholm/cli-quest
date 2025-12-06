'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { allLevels } from '@/data/allLevels';
import { useStore } from '@/lib/store';
import Terminal from '@/components/Terminal';
import LevelObjective from '@/components/LevelObjective';
import HintButton from '@/components/HintButton';
import LevelComplete from '@/components/LevelComplete';

export default function PlayLevel() {
  const params = useParams();
  const router = useRouter();
  const levelId = params.level as string;

  const {
    currentLevel,
    loadLevel,
    resetLevel,
    useHint,
    hintsUsed,
    commandCount,
    completedLevels,
    history,
  } = useStore();

  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [showComplete, setShowComplete] = useState(false);

  const level = allLevels.find((l) => l.id === levelId);

  useEffect(() => {
    if (level && currentLevel !== levelId) {
      loadLevel(levelId);
    }
  }, [levelId, level, currentLevel, loadLevel]);

  useEffect(() => {
    if (level && completedLevels.includes(levelId)) {
      const lastCommand = history[history.length - 1];
      if (lastCommand && level.validator(useStore.getState())) {
        setShowComplete(true);
      }
    }
  }, [completedLevels, levelId, level, history]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showComplete) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        router.push('/hub');
      } else if (e.key === 'h' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleUseHint();
      } else if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        resetLevel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showComplete, router]);

  if (!level) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
        <div className="text-terminal-red text-xl">Level not found</div>
      </div>
    );
  }

  const handleUseHint = () => {
    const hint = useHint();
    if (hint) {
      setHintMessage(hint);
      setTimeout(() => setHintMessage(null), 5000);
    }
  };

  // Find next level in the same zone
  const currentLevelIndex = allLevels.findIndex((l) => l.id === levelId);
  const nextLevel = currentLevelIndex >= 0 && currentLevelIndex < allLevels.length - 1
    ? allLevels[currentLevelIndex + 1]
    : null;

  return (
    <div className="min-h-screen bg-terminal-bg flex flex-col">
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
        <div className="p-4 border-b border-terminal-green flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push('/hub')}
              className="text-terminal-green hover:underline mr-6"
            >
              ← Back to Hub
            </button>
            <span className="text-terminal-white">
              Level {levelId}: {level.title}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-terminal-green opacity-60 mr-4">
              ESC: Exit • Ctrl/⌘+H: Hint • Ctrl/⌘+R: Reset
            </div>
            <HintButton
              onUseHint={handleUseHint}
              hintsUsed={hintsUsed}
              totalHints={level.hints.length}
            />
            <button
              onClick={resetLevel}
              className="px-4 py-2 border border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-terminal-bg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {hintMessage && (
          <div className="bg-yellow-900 bg-opacity-50 border-l-4 border-yellow-500 p-4 m-4">
            <div className="text-yellow-200 font-bold mb-1">HINT:</div>
            <div className="text-yellow-100">{hintMessage}</div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <LevelObjective objective={level.objective} />
          <div className="flex-1 overflow-hidden">
            <Terminal />
          </div>
        </div>
      </div>

      {showComplete && (
        <LevelComplete
          message={level.successMessage}
          nextLevelId={nextLevel?.id || null}
          commandCount={commandCount}
          hintsUsed={hintsUsed}
        />
      )}
    </div>
  );
}

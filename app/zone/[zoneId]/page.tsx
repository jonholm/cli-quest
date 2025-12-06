'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { levelsByZone, zoneInfo } from '@/data/allLevels';
import { useStore } from '@/lib/store';
import type { ZoneType } from '@/lib/types';

export default function ZonePage() {
  const params = useParams();
  const router = useRouter();
  const zoneId = params.zoneId as ZoneType;
  const [selectedLevel, setSelectedLevel] = useState(0);
  const completedLevels = useStore((state) => state.completedLevels);

  const zone = zoneInfo[zoneId];
  const levels = levelsByZone[zoneId] || [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        router.push('/hub');
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedLevel((prev) => (prev + 1) % levels.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedLevel((prev) => (prev - 1 + levels.length) % levels.length);
      } else if (e.key === 'Enter' && levels.length > 0) {
        e.preventDefault();
        router.push(`/play/${levels[selectedLevel].id}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLevel, levels, router]);

  if (zoneId === 'sandbox') {
    router.push('/sandbox');
    return null;
  }

  if (!zone) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
        <div className="text-terminal-red text-xl">Zone not found</div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-400';
      case 'intermediate':
        return 'text-yellow-400';
      case 'advanced':
        return 'text-orange-400';
      case 'expert':
        return 'text-red-400';
      default:
        return 'text-terminal-white';
    }
  };

  return (
    <div className="min-h-screen bg-terminal-bg p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push('/hub')}
            className="text-terminal-green hover:underline mb-4"
          >
            ← Back to Hub
          </button>
          <div className="text-center">
            <div className="text-3xl font-mono font-bold mb-4 text-terminal-green">
              {zone.icon}
            </div>
            <h1 className="text-5xl font-bold text-terminal-green mb-4">
              {zone.title}
            </h1>
            <p className="text-xl text-terminal-white">{zone.description}</p>
            <p className="text-sm text-terminal-green opacity-70 mt-4">
              Arrow Keys: Navigate • Enter: Select • ESC: Back
            </p>
          </div>
        </div>

        {levels.length === 0 ? (
          <div className="text-center text-terminal-white p-12 border-2 border-terminal-green">
            <p className="text-2xl mb-4">Coming Soon!</p>
            <p>More levels are being prepared for this zone.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((level, index) => {
              const isCompleted = completedLevels.includes(level.id);
              const isSelected = index === selectedLevel;
              const isLocked = level.unlockRequirements?.some(
                req => !completedLevels.includes(req)
              );

              return (
                <div
                  key={level.id}
                  onClick={() => {
                    if (!isLocked) {
                      setSelectedLevel(index);
                      router.push(`/play/${level.id}`);
                    }
                  }}
                  onMouseEnter={() => !isLocked && setSelectedLevel(index)}
                  className={`border-2 p-6 transition-all cursor-pointer outline-none ${
                    isLocked
                      ? 'border-gray-600 opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'border-terminal-green bg-terminal-green bg-opacity-20 scale-105'
                      : 'border-terminal-green hover:bg-terminal-green hover:bg-opacity-10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-2xl font-bold text-terminal-green">
                      {level.id}
                    </div>
                    <div className="flex gap-2">
                      {isCompleted && (
                        <div className="text-terminal-green text-xl font-bold">[✓]</div>
                      )}
                      {isLocked && (
                        <div className="text-gray-500 text-xl font-bold">[LOCKED]</div>
                      )}
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-terminal-white mb-2">
                    {level.title}
                  </h2>

                  <p className="text-terminal-white opacity-80 mb-4 text-sm">
                    {level.objective}
                  </p>

                  {level.storyText && (
                    <p className="text-terminal-green opacity-70 text-xs italic mb-3">
                      {level.storyText}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className={`text-xs uppercase ${getDifficultyColor(level.difficulty)}`}>
                      {level.difficulty}
                    </div>
                    {level.xpReward && (
                      <div className="text-xs text-terminal-green">
                        +{level.xpReward} XP
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

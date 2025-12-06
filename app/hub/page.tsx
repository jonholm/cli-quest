'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { zoneInfo } from '@/data/allLevels';
import { useStore } from '@/lib/store';

type ZoneKey = keyof typeof zoneInfo;

export default function Hub() {
  const router = useRouter();
  const [selectedZone, setSelectedZone] = useState<number>(0);
  const completedLevels = useStore((state) => state.completedLevels);

  const zones = Object.entries(zoneInfo) as [ZoneKey, typeof zoneInfo[ZoneKey]][];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          setSelectedZone((prev) => (prev + 1) % zones.length);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          setSelectedZone((prev) => (prev - 1 + zones.length) % zones.length);
          break;
        case 'Enter':
          e.preventDefault();
          const [zoneKey] = zones[selectedZone];
          router.push(`/zone/${zoneKey}`);
          break;
        case 'h':
        case 'H':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            router.push('/tutorial');
          }
          break;
        case 'a':
        case 'A':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            router.push('/achievements');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedZone, zones, router]);

  const getZoneColor = (color: string) => {
    const colors: Record<string, string> = {
      green: 'border-green-500 bg-green-500',
      blue: 'border-blue-500 bg-blue-500',
      yellow: 'border-yellow-500 bg-yellow-500',
      red: 'border-red-500 bg-red-500',
      purple: 'border-purple-500 bg-purple-500',
    };
    return colors[color] || 'border-terminal-green bg-terminal-green';
  };

  return (
    <div className="min-h-screen bg-terminal-bg p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-terminal-green mb-4 tracking-wider">
            CLI QUEST
          </h1>
          <p className="text-2xl text-terminal-white mb-2">
            Master the Command Line Through Adventure
          </p>
          <p className="text-sm text-terminal-green opacity-70 mt-6">
            Arrow Keys: Navigate • Enter: Select • H: Tutorial • A: Achievements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {zones.map(([zoneKey, zone], index) => {
            const isSelected = index === selectedZone;
            const colorClass = getZoneColor(zone.color);

            return (
              <div
                key={zoneKey}
                onClick={() => {
                  setSelectedZone(index);
                  router.push(`/zone/${zoneKey}`);
                }}
                onMouseEnter={() => setSelectedZone(index)}
                className={`border-4 p-8 cursor-pointer transition-all outline-none ${
                  isSelected
                    ? `${colorClass} bg-opacity-20 scale-105 shadow-lg`
                    : 'border-terminal-green bg-terminal-green bg-opacity-0 hover:bg-opacity-10'
                }`}
              >
                <div className="text-2xl font-mono font-bold mb-4 text-center text-terminal-green">
                  {zone.icon}
                </div>
                <h2 className="text-2xl font-bold text-terminal-white mb-3 text-center">
                  {zone.title}
                </h2>
                <p className="text-terminal-white opacity-80 text-center">
                  {zone.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="border-2 border-terminal-green p-6 bg-terminal-green bg-opacity-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-terminal-green mb-2">
                Your Progress
              </h3>
              <p className="text-terminal-white">
                Levels Completed: {completedLevels.length}
              </p>
            </div>
            <button
              onClick={() => router.push('/achievements')}
              className="px-6 py-3 border-2 border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-terminal-bg transition-colors"
            >
              View Achievements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

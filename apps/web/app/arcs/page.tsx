'use client';

import Link from 'next/link';
import { useGameStore } from '@/lib/store';
import { arcs } from '@/data/levels';

const colorMap: Record<string, { border: string; text: string; bg: string }> = {
  green: { border: 'border-cyber-green', text: 'text-cyber-green', bg: 'bg-cyber-green' },
  purple: { border: 'border-purple-500', text: 'text-purple-400', bg: 'bg-purple-500' },
  teal: { border: 'border-cyber-teal', text: 'text-cyber-teal', bg: 'bg-cyber-teal' },
  red: { border: 'border-cyber-red', text: 'text-cyber-red', bg: 'bg-cyber-red' },
  yellow: { border: 'border-cyber-yellow', text: 'text-cyber-yellow', bg: 'bg-cyber-yellow' },
};

export default function ArcsPage() {
  const { completedLevels } = useGameStore();

  return (
    <div className="flex-1 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-cyber-green mb-2">Choose Your Path</h1>
        <p className="text-cyber-muted mb-8">Select a story arc or start with the tutorial</p>

        <div className="space-y-6">
          {arcs.map((arc) => {
            const completed = arc.levels.filter(l => completedLevels.includes(l.id)).length;
            const total = arc.levels.length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            const colors = colorMap[arc.color] || colorMap.green;

            return (
              <Link
                key={arc.id}
                href={`/arcs/${arc.id}`}
                className={`block border ${colors.border} rounded-xl p-6 bg-cyber-surface hover:bg-cyber-purple/20 transition-colors`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className={`text-sm font-medium ${colors.text} mb-1`}>
                      {arc.id === 'tutorial' ? 'TUTORIAL' : 'STORY ARC'}
                    </div>
                    <h2 className="text-2xl font-bold text-cyber-white">{arc.title}</h2>
                    <p className="text-cyber-muted text-sm mt-1">{arc.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-cyber-white font-bold">{completed}/{total}</div>
                    <div className="text-cyber-muted text-xs">levels</div>
                  </div>
                </div>
                <p className="text-cyber-muted text-sm mb-4">{arc.description}</p>
                <div className="flex items-center gap-3">
                  <div className="bg-cyber-bg rounded-full h-2 flex-1">
                    <div
                      className={`${colors.bg} rounded-full h-2 transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-cyber-muted text-xs">{pct}%</span>
                </div>
                {arc.chapters.length > 1 && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {arc.chapters.map((ch) => {
                      const chCompleted = ch.levels.filter(l => completedLevels.includes(l.id)).length;
                      const chDone = chCompleted === ch.levels.length && ch.levels.length > 0;
                      return (
                        <span
                          key={ch.number}
                          className={`text-xs px-2 py-1 rounded ${
                            chDone
                              ? 'bg-cyber-green/20 text-cyber-green'
                              : chCompleted > 0
                                ? 'bg-cyber-yellow/20 text-cyber-yellow'
                                : 'bg-cyber-surface text-cyber-muted'
                          }`}
                        >
                          Ch.{ch.number}: {ch.title}
                          {chDone ? ' ✓' : chCompleted > 0 ? ` (${chCompleted}/${ch.levels.length})` : ''}
                        </span>
                      );
                    })}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

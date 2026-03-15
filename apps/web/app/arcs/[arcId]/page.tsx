'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGameStore } from '@/lib/store';
import { arcs } from '@/data/levels';

export default function ArcDetail() {
  const params = useParams();
  const router = useRouter();
  const arcId = params.arcId as string;
  const { completedLevels } = useGameStore();

  const arc = arcs.find(a => a.id === arcId);

  if (!arc) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-cyber-red text-xl">Arc not found</div>
      </div>
    );
  }

  const totalCompleted = arc.levels.filter(l => completedLevels.includes(l.id)).length;

  return (
    <div className="flex-1 p-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => router.push('/arcs')} className="text-cyber-green hover:underline mb-6 text-sm">
          ← All Arcs
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cyber-white mb-2">{arc.title}</h1>
          <p className="text-cyber-muted">{arc.description}</p>
          <div className="mt-3 text-cyber-green text-sm">
            {totalCompleted}/{arc.levels.length} levels completed
          </div>
        </div>

        <div className="space-y-8">
          {arc.chapters.map((chapter) => (
            <div key={chapter.number}>
              <h2 className="text-xl font-bold text-cyber-white mb-4 flex items-center gap-3">
                <span className="text-cyber-green">Chapter {chapter.number}</span>
                <span>{chapter.title}</span>
                {chapter.levels.every(l => completedLevels.includes(l.id)) && chapter.levels.length > 0 && (
                  <span className="text-cyber-green text-sm">✓ Complete</span>
                )}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chapter.levels.map((level) => {
                  const isComplete = completedLevels.includes(level.id);

                  return (
                    <Link
                      key={level.id}
                      href={`/play/${level.id}`}
                      className={`border rounded-lg p-4 transition-all hover:scale-[1.02] ${
                        isComplete
                          ? 'border-cyber-green/50 bg-cyber-green/5'
                          : 'border-cyber-purple hover:border-cyber-green/50 bg-cyber-surface'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-cyber-muted text-xs">
                          {level.position}
                        </div>
                        {isComplete && (
                          <span className="text-cyber-green text-sm font-bold">✓</span>
                        )}
                      </div>
                      <h3 className="text-cyber-white font-bold mb-1">{level.title}</h3>
                      <p className="text-cyber-muted text-xs mb-3">{level.objective}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-cyber-yellow text-xs">+{level.xpReward} XP</div>
                        {level.commandsIntroduced && level.commandsIntroduced.length > 0 && (
                          <div className="flex gap-1">
                            {level.commandsIntroduced.map(cmd => (
                              <code key={cmd} className="text-cyber-teal text-xs bg-cyber-bg px-1.5 py-0.5 rounded">
                                {cmd}
                              </code>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { allLevels } from '@/data/allLevels';

export default function Achievements() {
  const router = useRouter();
  const completedLevels = useStore((state) => state.completedLevels);
  const totalXP = useStore((state) => state.totalXP || 0);
  const commandsExecuted = useStore((state) => state.commandsExecuted || 0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        router.push('/hub');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const totalLevels = allLevels.length;
  const completionRate = Math.round((completedLevels.length / totalLevels) * 100);

  const achievements = [
    {
      id: 'first_steps',
      title: 'First Steps',
      description: 'Complete your first level',
      icon: '[*]',
      unlocked: completedLevels.length >= 1,
    },
    {
      id: 'apprentice',
      title: 'Apprentice',
      description: 'Complete 5 levels',
      icon: '[**]',
      unlocked: completedLevels.length >= 5,
    },
    {
      id: 'journeyman',
      title: 'Journeyman',
      description: 'Complete 10 levels',
      icon: '[***]',
      unlocked: completedLevels.length >= 10,
    },
    {
      id: 'master',
      title: 'Master',
      description: 'Complete all levels',
      icon: '[MASTER]',
      unlocked: completedLevels.length === totalLevels,
    },
    {
      id: 'explorer',
      title: 'Explorer',
      description: 'Execute 100 commands',
      icon: '[EXP]',
      unlocked: commandsExecuted >= 100,
    },
    {
      id: 'power_user',
      title: 'Power User',
      description: 'Execute 500 commands',
      icon: '[PWR]',
      unlocked: commandsExecuted >= 500,
    },
    {
      id: 'xp_hunter',
      title: 'XP Hunter',
      description: 'Earn 1000 XP',
      icon: '[XP+]',
      unlocked: totalXP >= 1000,
    },
    {
      id: 'xp_legend',
      title: 'XP Legend',
      description: 'Earn 5000 XP',
      icon: '[XP++]',
      unlocked: totalXP >= 5000,
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-terminal-bg p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push('/hub')}
          className="text-terminal-green hover:underline mb-6"
        >
          ← Back to Hub
        </button>

        <h1 className="text-5xl font-bold text-terminal-green mb-8">
          [ACHIEVEMENTS]
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border-2 border-terminal-green p-6 bg-terminal-green bg-opacity-10">
            <div className="text-4xl font-bold text-terminal-green mb-2">
              {completedLevels.length}/{totalLevels}
            </div>
            <div className="text-terminal-white">Levels Completed</div>
            <div className="mt-2 text-sm text-terminal-green">{completionRate}% Complete</div>
          </div>

          <div className="border-2 border-terminal-green p-6 bg-terminal-green bg-opacity-10">
            <div className="text-4xl font-bold text-terminal-green mb-2">
              {totalXP}
            </div>
            <div className="text-terminal-white">Total XP Earned</div>
          </div>

          <div className="border-2 border-terminal-green p-6 bg-terminal-green bg-opacity-10">
            <div className="text-4xl font-bold text-terminal-green mb-2">
              {commandsExecuted}
            </div>
            <div className="text-terminal-white">Commands Executed</div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-terminal-white mb-6">
          Unlocked: {unlockedCount}/{achievements.length}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`border-2 p-6 transition-all ${
                achievement.unlocked
                  ? 'border-terminal-green bg-terminal-green bg-opacity-10'
                  : 'border-gray-600 bg-gray-900 bg-opacity-20 opacity-50'
              }`}
            >
              <div className="text-2xl font-mono font-bold mb-4 text-center">{achievement.icon}</div>
              <h3 className="text-xl font-bold text-center mb-2">
                <span className={achievement.unlocked ? 'text-terminal-green' : 'text-gray-500'}>
                  {achievement.title}
                </span>
              </h3>
              <p className="text-center text-sm">
                <span className={achievement.unlocked ? 'text-terminal-white' : 'text-gray-600'}>
                  {achievement.description}
                </span>
              </p>
              {achievement.unlocked && (
                <div className="text-center mt-4 text-terminal-green text-xl font-bold">[UNLOCKED]</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useGameStore } from '@/lib/store';

export default function Home() {
  const { completedLevels, totalXP, commandsExecuted } = useGameStore();

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-cyber-green mb-4 tracking-wider glow-green">
            CLI QUEST
          </h1>
          <p className="text-xl text-cyber-white mb-2">
            Master the Command Line Through Adventure
          </p>
          <p className="text-cyber-muted">
            Learn real CLI skills through narrative-driven challenges
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Story Arc Card */}
          <Link
            href="/play/ghost-1-1"
            className="bg-cyber-gradient border border-cyber-purple rounded-xl p-6 hover:border-cyber-green transition-colors group"
          >
            <div className="text-cyber-green text-sm font-medium mb-2">STORY ARC</div>
            <h2 className="text-2xl font-bold text-cyber-white mb-2 group-hover:text-cyber-green transition-colors">
              Ghost in the Machine
            </h2>
            <p className="text-cyber-muted text-sm mb-4">
              A cybersecurity thriller. Investigate anomalous server activity at NovaCorp.
            </p>
            <div className="flex items-center gap-4">
              <div className="bg-cyber-surface rounded-full h-2 flex-1">
                <div
                  className="bg-cyber-green rounded-full h-2 transition-all"
                  style={{ width: `${Math.min(100, (completedLevels.filter(l => l.startsWith('ghost')).length / 18) * 100)}%` } as React.CSSProperties}
                />
              </div>
              <span className="text-cyber-muted text-xs">
                {completedLevels.filter(l => l.startsWith('ghost')).length}/18
              </span>
            </div>
          </Link>

          {/* Daily Challenge Card */}
          <Link
            href="/daily"
            className="bg-cyber-gradient border border-cyber-red/40 rounded-xl p-6 hover:border-cyber-red transition-colors group"
          >
            <div className="text-cyber-red text-sm font-medium mb-2">TODAY&apos;S CHALLENGE</div>
            <h2 className="text-2xl font-bold text-cyber-white mb-2 group-hover:text-cyber-red transition-colors">
              Daily Challenge
            </h2>
            <p className="text-cyber-muted text-sm mb-4">
              Test your skills against a new challenge every day. Compete on the leaderboard.
            </p>
            <div className="flex items-center gap-2">
              <span className="bg-cyber-surface text-cyber-green px-2 py-1 rounded text-xs">Quick</span>
              <span className="bg-cyber-surface text-cyber-yellow px-2 py-1 rounded text-xs">Standard</span>
              <span className="bg-cyber-surface text-cyber-red px-2 py-1 rounded text-xs">Hard</span>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-cyber-surface border border-cyber-purple rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-cyber-green mb-1">{totalXP}</div>
            <div className="text-cyber-muted text-sm">Total XP</div>
          </div>
          <div className="bg-cyber-surface border border-cyber-purple rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-cyber-yellow mb-1">{completedLevels.length}</div>
            <div className="text-cyber-muted text-sm">Levels Complete</div>
          </div>
          <div className="bg-cyber-surface border border-cyber-purple rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-cyber-teal mb-1">{commandsExecuted}</div>
            <div className="text-cyber-muted text-sm">Commands Run</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/sandbox"
            className="bg-cyber-surface border border-cyber-purple rounded-xl p-4 hover:border-cyber-teal transition-colors text-center"
          >
            <div className="text-2xl mb-2">⌨️</div>
            <div className="text-cyber-white font-medium">Sandbox</div>
            <div className="text-cyber-muted text-xs mt-1">Free exploration</div>
          </Link>
          <Link
            href="/skills"
            className="bg-cyber-surface border border-cyber-purple rounded-xl p-4 hover:border-cyber-yellow transition-colors text-center"
          >
            <div className="text-2xl mb-2">🌳</div>
            <div className="text-cyber-white font-medium">Skill Tree</div>
            <div className="text-cyber-muted text-xs mt-1">Track mastery</div>
          </Link>
          <Link
            href="/rankings"
            className="bg-cyber-surface border border-cyber-purple rounded-xl p-4 hover:border-cyber-red transition-colors text-center"
          >
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-cyber-white font-medium">Rankings</div>
            <div className="text-cyber-muted text-xs mt-1">Leaderboards</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

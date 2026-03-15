'use client';

import Link from 'next/link';
import { useGameStore } from '@/lib/store';

export default function Profile() {
  const { totalXP, completedLevels, commandsExecuted } = useGameStore();

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-cyber-green mb-8">Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-cyber-surface border border-cyber-purple rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-cyber-green mb-2">{totalXP}</div>
            <div className="text-cyber-muted">Total XP</div>
          </div>
          <div className="bg-cyber-surface border border-cyber-purple rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-cyber-yellow mb-2">{completedLevels.length}</div>
            <div className="text-cyber-muted">Levels Completed</div>
          </div>
          <div className="bg-cyber-surface border border-cyber-purple rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-cyber-teal mb-2">{commandsExecuted}</div>
            <div className="text-cyber-muted">Commands Executed</div>
          </div>
        </div>
        <div className="text-center">
          <Link href="/" className="text-cyber-green hover:underline">← Back to Hub</Link>
        </div>
      </div>
    </div>
  );
}

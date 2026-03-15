'use client';

import Link from 'next/link';

const commandGroups = [
  { name: 'Navigation', commands: ['pwd', 'ls', 'cd'], color: 'text-cyber-green' },
  { name: 'File Operations', commands: ['cat', 'touch', 'mkdir', 'rm', 'cp', 'mv', 'chmod'], color: 'text-cyber-teal' },
  { name: 'Search', commands: ['grep', 'find'], color: 'text-cyber-yellow' },
  { name: 'Text Processing', commands: ['head', 'tail', 'wc', 'echo', 'sort', 'uniq'], color: 'text-cyber-red' },
  { name: 'Environment', commands: ['export', 'env'], color: 'text-purple-400' },
  { name: 'System', commands: ['clear', 'history', 'man'], color: 'text-cyber-muted' },
];

export default function SkillTree() {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-cyber-yellow mb-2">Skill Tree</h1>
        <p className="text-cyber-muted mb-8">Track your command mastery. Full constellation view coming soon.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commandGroups.map((group) => (
            <div key={group.name} className="bg-cyber-surface border border-cyber-purple rounded-xl p-4">
              <h3 className={`font-bold mb-3 ${group.color}`}>{group.name}</h3>
              <div className="space-y-2">
                {group.commands.map((cmd) => (
                  <div key={cmd} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyber-purple" />
                    <code className="text-cyber-white text-sm font-mono">{cmd}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/" className="text-cyber-green hover:underline">← Back to Hub</Link>
        </div>
      </div>
    </div>
  );
}

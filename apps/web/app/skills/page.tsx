'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

type MasteryData = Record<string, { tier: string; timesUsed: number }>;

const skillTree = [
  {
    group: 'Navigation',
    color: '#00ff88',
    commands: [
      { name: 'pwd', x: 150, y: 60, deps: [] },
      { name: 'ls', x: 300, y: 60, deps: ['pwd'] },
      { name: 'cd', x: 450, y: 60, deps: ['ls'] },
      { name: 'find', x: 600, y: 60, deps: ['cd'] },
    ],
  },
  {
    group: 'File Operations',
    color: '#4ecdc4',
    commands: [
      { name: 'cat', x: 150, y: 170, deps: [] },
      { name: 'touch', x: 300, y: 170, deps: ['cat'] },
      { name: 'mkdir', x: 450, y: 170, deps: ['touch'] },
      { name: 'rm', x: 300, y: 250, deps: ['touch'] },
      { name: 'cp', x: 450, y: 250, deps: ['mkdir'] },
      { name: 'mv', x: 600, y: 250, deps: ['cp'] },
      { name: 'chmod', x: 600, y: 170, deps: ['mkdir'] },
    ],
  },
  {
    group: 'Text Processing',
    color: '#ff6b6b',
    commands: [
      { name: 'echo', x: 150, y: 360, deps: [] },
      { name: 'head', x: 300, y: 360, deps: ['cat'] },
      { name: 'tail', x: 450, y: 360, deps: ['head'] },
      { name: 'wc', x: 300, y: 440, deps: ['cat'] },
      { name: 'sort', x: 450, y: 440, deps: ['wc'] },
      { name: 'uniq', x: 600, y: 440, deps: ['sort'] },
    ],
  },
  {
    group: 'Search',
    color: '#ffe66d',
    commands: [
      { name: 'grep', x: 150, y: 530, deps: ['cat'] },
    ],
  },
  {
    group: 'Environment',
    color: '#a78bfa',
    commands: [
      { name: 'export', x: 300, y: 530, deps: [] },
      { name: 'env', x: 450, y: 530, deps: ['export'] },
    ],
  },
  {
    group: 'System',
    color: '#888899',
    commands: [
      { name: 'clear', x: 600, y: 360, deps: [] },
      { name: 'history', x: 600, y: 530, deps: [] },
      { name: 'man', x: 150, y: 440, deps: [] },
    ],
  },
];

const allCommands = skillTree.flatMap((g) =>
  g.commands.map((c) => ({ ...c, color: g.color, group: g.group }))
);

export default function SkillTree() {
  const { completedLevels } = useGameStore();
  const { user } = useAuth();
  const [mastery, setMastery] = useState<MasteryData>({});

  useEffect(() => {
    if (!supabase || !user) return;
    supabase
      .from('command_mastery')
      .select('command_name, mastery_tier, times_used')
      .eq('user_id', user.id)
      .then(({ data }) => {
        const m: MasteryData = {};
        for (const row of data || []) {
          m[row.command_name] = { tier: row.mastery_tier, timesUsed: row.times_used };
        }
        setMastery(m);
      });
  }, [user]);

  const getTierColor = (cmd: string, baseColor: string) => {
    const m = mastery[cmd];
    if (!m) return '#1a1a3e'; // unlearned
    if (m.tier === 'mastered') return baseColor;
    if (m.tier === 'practiced') return baseColor + '99';
    return baseColor + '44';
  };

  const getTierLabel = (cmd: string) => {
    const m = mastery[cmd];
    if (!m) return 'Not started';
    if (m.tier === 'mastered') return `Mastered (${m.timesUsed}x)`;
    if (m.tier === 'practiced') return `Practiced (${m.timesUsed}x)`;
    return `Learned (${m.timesUsed}x)`;
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-cyber-yellow">Skill Tree</h1>
            <p className="text-cyber-muted mt-1">{completedLevels.length} levels completed — {Object.keys(mastery).length}/23 commands used</p>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-cyber-green" />
              <span className="text-cyber-muted">Mastered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-cyber-green/60" />
              <span className="text-cyber-muted">Practiced</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-cyber-green/25" />
              <span className="text-cyber-muted">Learned</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-cyber-surface border border-cyber-purple" />
              <span className="text-cyber-muted">Locked</span>
            </div>
          </div>
        </div>

        <div className="bg-cyber-bg border border-cyber-purple rounded-xl p-6 overflow-x-auto">
          <svg width="750" height="600" className="mx-auto">
            {/* Connection lines */}
            {allCommands.map((cmd) =>
              cmd.deps.map((dep) => {
                const parent = allCommands.find((c) => c.name === dep);
                if (!parent) return null;
                return (
                  <line
                    key={`${dep}-${cmd.name}`}
                    x1={parent.x}
                    y1={parent.y}
                    x2={cmd.x}
                    y2={cmd.y}
                    stroke={mastery[cmd.name] ? cmd.color + '44' : '#2d1b69'}
                    strokeWidth="2"
                    strokeDasharray={mastery[cmd.name] ? 'none' : '4 4'}
                  />
                );
              })
            )}

            {/* Command nodes */}
            {allCommands.map((cmd) => {
              const isActive = !!mastery[cmd.name];
              const fill = getTierColor(cmd.name, cmd.color);
              const glowSize = mastery[cmd.name]?.tier === 'mastered' ? 20 : mastery[cmd.name]?.tier === 'practiced' ? 12 : 0;

              return (
                <g key={cmd.name} className="cursor-pointer">
                  <title>{`${cmd.name}: ${getTierLabel(cmd.name)}`}</title>
                  {glowSize > 0 && (
                    <circle
                      cx={cmd.x}
                      cy={cmd.y}
                      r={28 + glowSize}
                      fill={cmd.color}
                      opacity={0.1}
                    />
                  )}
                  <circle
                    cx={cmd.x}
                    cy={cmd.y}
                    r={28}
                    fill={fill}
                    stroke={isActive ? cmd.color : '#2d1b69'}
                    strokeWidth={isActive ? 2 : 1}
                  />
                  <text
                    x={cmd.x}
                    y={cmd.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isActive ? '#fff' : '#666'}
                    fontSize="12"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="bold"
                  >
                    {cmd.name}
                  </text>
                </g>
              );
            })}

            {/* Group labels */}
            {skillTree.map((group) => {
              const minY = Math.min(...group.commands.map((c) => c.y));
              return (
                <text
                  key={group.group}
                  x={30}
                  y={minY + 5}
                  fill={group.color}
                  fontSize="10"
                  fontWeight="bold"
                  opacity={0.6}
                >
                  {group.group.toUpperCase()}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

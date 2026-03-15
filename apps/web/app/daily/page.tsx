'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import Terminal from '@/components/Terminal';
import { validate } from '@cli-quest/engine';
import type { FSNode, ValidatorConfig } from '@cli-quest/shared';

type ChallengeTemplate = {
  tier: 'quick' | 'standard' | 'hard';
  title: string;
  objective: string;
  fs: FSNode;
  validator: ValidatorConfig;
  xpReward: number;
};

// Date-seeded selection
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const templates: ChallengeTemplate[] = [
  // Quick
  {
    tier: 'quick', title: 'Find the File', objective: 'Use find to locate all .log files',
    xpReward: 25,
    fs: { type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
      { type: 'directory', name: 'logs', children: [
        { type: 'file', name: 'app.log', content: 'app log' },
        { type: 'file', name: 'error.log', content: 'error log' },
        { type: 'file', name: 'config.yml', content: 'port: 3000' },
      ]},
    ]}]}]},
    validator: { type: 'all', conditions: [{ type: 'commandUsed', command: 'find' }, { type: 'outputContains', substring: 'app.log' }] },
  },
  {
    tier: 'quick', title: 'Count Lines', objective: 'Count the number of lines in data.txt',
    xpReward: 25,
    fs: { type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
      { type: 'file', name: 'data.txt', content: 'alpha\nbeta\ngamma\ndelta\nepsilon' },
    ]}]}]},
    validator: { type: 'all', conditions: [{ type: 'commandUsed', command: 'wc' }, { type: 'outputContains', substring: '5' }] },
  },
  {
    tier: 'quick', title: 'Create and Navigate', objective: 'Create a directory called "work" and navigate into it',
    xpReward: 25,
    fs: { type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: []}]}]},
    validator: { type: 'all', conditions: [{ type: 'fileExists', path: '/home/user/work' }, { type: 'currentPath', path: '/home/user/work' }] },
  },
  // Standard
  {
    tier: 'standard', title: 'Log Analysis', objective: 'Find all ERROR lines in server.log and count them',
    xpReward: 50,
    fs: { type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
      { type: 'file', name: 'server.log', content: 'INFO: started\nERROR: connection refused\nINFO: retrying\nERROR: timeout\nINFO: connected\nERROR: disk full\nINFO: cleanup done' },
    ]}]}]},
    validator: { type: 'all', conditions: [{ type: 'commandUsed', command: 'grep' }, { type: 'commandUsed', command: 'wc' }, { type: 'outputContains', substring: '3' }] },
  },
  {
    tier: 'standard', title: 'File Organizer', objective: 'Move report.txt to the archive directory and copy config.yml to backup',
    xpReward: 50,
    fs: { type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
      { type: 'file', name: 'report.txt', content: 'quarterly report' },
      { type: 'file', name: 'config.yml', content: 'env: production' },
      { type: 'directory', name: 'archive', children: [] },
      { type: 'directory', name: 'backup', children: [] },
    ]}]}]},
    validator: { type: 'all', conditions: [
      { type: 'fileExists', path: '/home/user/archive/report.txt' },
      { type: 'fileNotExists', path: '/home/user/report.txt' },
      { type: 'fileExists', path: '/home/user/backup/config.yml' },
      { type: 'fileExists', path: '/home/user/config.yml' },
    ]},
  },
  {
    tier: 'standard', title: 'Data Pipeline', objective: 'Sort the names file and save unique entries to output.txt',
    xpReward: 50,
    fs: { type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
      { type: 'file', name: 'names.txt', content: 'Charlie\nAlice\nBob\nAlice\nDave\nBob\nEve' },
    ]}]}]},
    validator: { type: 'all', conditions: [
      { type: 'fileExists', path: '/home/user/output.txt' },
      { type: 'fileContains', path: '/home/user/output.txt', substring: 'Alice' },
      { type: 'commandUsed', command: 'sort' },
    ]},
  },
  // Hard
  {
    tier: 'hard', title: 'Incident Response', objective: 'Find all 403 responses in access.log, count unique IPs, and save results to report.txt',
    xpReward: 100,
    fs: { type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
      { type: 'file', name: 'access.log', content: '10.0.0.1 GET /api 200\n10.0.0.5 GET /admin 403\n10.0.0.1 GET /api 200\n10.0.0.5 GET /admin/config 403\n10.0.0.3 POST /login 401\n10.0.0.5 GET /admin/users 403\n10.0.0.7 GET /secret 403\n10.0.0.1 GET /api 200' },
    ]}]}]},
    validator: { type: 'all', conditions: [
      { type: 'fileExists', path: '/home/user/report.txt' },
      { type: 'commandUsed', command: 'grep' },
    ]},
  },
  {
    tier: 'hard', title: 'Environment Setup', objective: 'Set APP_ENV to "production", create a deploy directory, and write the env var to deploy/config.txt',
    xpReward: 100,
    fs: { type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: []}]}]},
    validator: { type: 'all', conditions: [
      { type: 'envVar', name: 'APP_ENV', value: 'production' },
      { type: 'fileExists', path: '/home/user/deploy/config.txt' },
      { type: 'fileContains', path: '/home/user/deploy/config.txt', substring: 'production' },
    ]},
  },
];

function getDailyChallenge(tier: 'quick' | 'standard' | 'hard'): ChallengeTemplate {
  const tierTemplates = templates.filter(t => t.tier === tier);
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const tierOffset = tier === 'quick' ? 0 : tier === 'standard' ? 1 : 2;
  const idx = Math.floor(seededRandom(seed + tierOffset) * tierTemplates.length);
  return tierTemplates[idx];
}

export default function DailyChallenge() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<'quick' | 'standard' | 'hard' | null>(null);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const { initShell, shell, history, commandsUsed } = useGameStore();

  const challenge = selectedTier ? getDailyChallenge(selectedTier) : null;

  const handleStart = (tier: 'quick' | 'standard' | 'hard') => {
    const ch = getDailyChallenge(tier);
    setSelectedTier(tier);
    setCompleted(false);
    initShell(structuredClone(ch.fs));
  };

  // Check completion
  if (challenge && shell && !completed && history.length > 0) {
    const state = shell.getState();
    const validationState = {
      fs: state.fs,
      cwd: state.cwd,
      env: state.env,
      lastOutput: history[history.length - 1]?.stdout || '',
      commandsUsed,
    };
    if (validate(challenge.validator, validationState)) {
      setCompleted(true);
    }
  }

  if (!selectedTier) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-cyber-red mb-2">Daily Challenge</h1>
          <p className="text-cyber-muted mb-8">A new challenge every day. Pick your difficulty.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['quick', 'standard', 'hard'] as const).map((tier) => {
              const ch = getDailyChallenge(tier);
              const colors = { quick: 'border-cyber-green text-cyber-green', standard: 'border-cyber-yellow text-cyber-yellow', hard: 'border-cyber-red text-cyber-red' };
              const times = { quick: '~2 min', standard: '~5 min', hard: '~10 min' };
              return (
                <button
                  key={tier}
                  onClick={() => handleStart(tier)}
                  className={`border-2 ${colors[tier]} rounded-xl p-6 text-left hover:bg-cyber-purple/20 transition-colors`}
                >
                  <div className="font-bold text-xl mb-1 capitalize">{tier}</div>
                  <div className="text-cyber-muted text-sm mb-3">{times[tier]}</div>
                  <div className="text-cyber-white font-medium mb-1">{ch.title}</div>
                  <div className="text-cyber-muted text-xs">{ch.objective}</div>
                  <div className="text-cyber-yellow text-xs mt-3">+{ch.xpReward} XP</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const elapsed = Math.floor((Date.now() - startTime) / 1000);

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-10 bg-cyber-surface border-b border-cyber-purple flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedTier(null)} className="text-cyber-muted text-sm hover:text-cyber-white">← Back</button>
          <span className="text-cyber-red font-medium text-sm">Daily: {challenge?.title}</span>
        </div>
        <div className="text-cyber-muted text-sm">{challenge?.objective}</div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Terminal />
      </div>

      {completed && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-cyber-bg border-2 border-cyber-green rounded-xl p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-cyber-green mb-4 glow-green">CHALLENGE COMPLETE!</h2>
            <div className="text-cyber-yellow text-xl mb-2">+{challenge?.xpReward} XP</div>
            <div className="text-cyber-muted mb-6">Time: {elapsed}s</div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setSelectedTier(null)}
                className="px-6 py-2 bg-cyber-green text-cyber-bg font-bold rounded-lg"
              >
                Try Another
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 border border-cyber-green text-cyber-green rounded-lg"
              >
                Back to Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

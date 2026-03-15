'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import Terminal from '@/components/Terminal';
import type { FSNode } from '@cli-quest/shared';

const sandboxFS: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'home',
      children: [
        {
          type: 'directory',
          name: 'user',
          children: [
            {
              type: 'file',
              name: 'welcome.txt',
              content:
                'Welcome to CLI Quest Sandbox!\n\nAll 23 commands are available.\nPipes, redirection, env vars, wildcards — everything works.\n\nTry:\n  echo "hello" > greeting.txt\n  cat greeting.txt | wc -w\n  ls *.txt\n  export NAME=world && echo $NAME\n\nType `man` to see all available commands.\nType `man <command>` for help on a specific command.',
            },
            {
              type: 'directory',
              name: 'projects',
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

export default function Sandbox() {
  const { initShell } = useGameStore();

  useEffect(() => {
    initShell(structuredClone(sandboxFS));
  }, [initShell]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-cyber-surface border-b border-cyber-teal/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-cyber-teal font-bold">SANDBOX</span>
          <span className="text-cyber-muted text-sm">Free exploration — all commands unlocked</span>
        </div>
        <div className="text-cyber-muted text-xs">
          Type <code className="text-cyber-teal">man</code> for help
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Terminal />
      </div>
    </div>
  );
}

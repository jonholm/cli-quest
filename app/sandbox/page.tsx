'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import Terminal from '@/components/Terminal';
import { FSNode } from '@/lib/types';

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
              content: 'Welcome to Sandbox Lab!\n\nThis is a free exploration environment.\nAll commands are unlocked.\nCreate files, explore, experiment!\n\nTry:\n- mkdir projects\n- touch test.txt\n- echo "Hello World"\n\nHave fun!',
            },
          ],
        },
      ],
    },
  ],
};

export default function Sandbox() {
  const router = useRouter();
  const { loadLevel } = useStore();

  useEffect(() => {
    loadLevel('sandbox');
    useStore.setState({
      currentPath: '/home/user',
      fileSystem: sandboxFS,
      history: [],
      hintsUsed: 0,
      commandCount: 0,
      lastOutput: '',
    });
  }, []);

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

  return (
    <div className="min-h-screen bg-terminal-bg flex flex-col">
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
        <div className="p-4 border-b border-purple-500 flex items-center justify-between bg-purple-900 bg-opacity-20">
          <div>
            <button
              onClick={() => router.push('/hub')}
              className="text-purple-400 hover:underline mr-6"
            >
              ← Back to Hub
            </button>
            <span className="text-terminal-white">
              <span className="font-bold">[SANDBOX] Lab</span> - Free Exploration
            </span>
          </div>
          <div className="text-xs text-purple-400 opacity-80">
            ESC: Exit • All Commands Unlocked
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="sticky top-0 bg-terminal-bg border-b border-purple-500 p-4 bg-purple-900 bg-opacity-10">
            <div className="text-purple-400 font-bold mb-1">SANDBOX MODE</div>
            <div className="text-terminal-white text-sm">
              Experiment freely with all CLI commands. Create files, directories, and practice your skills!
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <Terminal />
          </div>
        </div>
      </div>
    </div>
  );
}

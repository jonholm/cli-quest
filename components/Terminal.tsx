'use client';

import { useStore } from '@/lib/store';
import CommandInput from './CommandInput';
import OutputDisplay from './OutputDisplay';

export default function Terminal() {
  const { currentPath, history, executeCommand } = useStore();

  const getPrompt = () => {
    const pathPart = currentPath === '/home/user' ? '~' : currentPath;
    return `user@cli-quest:${pathPart}$`;
  };

  return (
    <div className="flex flex-col h-full bg-terminal-bg text-terminal-white p-4 font-mono overflow-hidden">
      <OutputDisplay history={history} prompt={getPrompt()} />
      <CommandInput prompt={getPrompt()} onSubmit={executeCommand} />
    </div>
  );
}

'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useGameStore } from '@/lib/store';

export default function Terminal() {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { history, cwd, shell, executeCommand } = useGameStore();

  const prompt = cwd === '/home/user' ? 'user@cli-quest:~$' : `user@cli-quest:${cwd}$`;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
    const handleClick = () => inputRef.current?.focus();
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = shell?.historyUp();
      if (prev) setInput(prev);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = shell?.historyDown();
      setInput(next || '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (shell) {
        const completions = shell.complete(input, input.length);
        if (completions.length === 1) {
          const parts = input.split(/\s+/);
          parts[parts.length - 1] = completions[0];
          setInput(parts.join(' '));
        }
      }
    }
  };

  return (
    <div
      role="region"
      aria-label="Terminal"
      className="flex flex-col h-full bg-terminal-bg font-mono text-sm p-4 overflow-hidden"
    >
      <div
        role="log"
        aria-live="polite"
        className="flex-1 overflow-y-auto terminal-scrollbar"
      >
        {history.map((entry) => (
          <div key={entry.id} className="mb-2">
            <div>
              <span className="text-terminal-prompt">{prompt} </span>
              <span className="text-cyber-white">{entry.input}</span>
            </div>
            {entry.stdout && (
              <div className="text-cyber-white whitespace-pre-wrap">{entry.stdout}</div>
            )}
            {entry.stderr && (
              <div className="text-cyber-red whitespace-pre-wrap">{entry.stderr}</div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-terminal-prompt">{prompt}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Terminal command input"
          className="flex-1 bg-transparent outline-none text-cyber-green terminal-input"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}

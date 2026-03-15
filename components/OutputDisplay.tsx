'use client';

import { CommandOutput } from '@/lib/types';
import { useEffect, useRef } from 'react';

interface OutputDisplayProps {
  history: CommandOutput[];
  prompt: string;
}

export default function OutputDisplay({ history, prompt }: OutputDisplayProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div role="log" aria-live="polite" className="flex-1 overflow-y-auto mb-4">
      {history.map((item) => (
        <div key={item.id} className="mb-2">
          <div className="text-terminal-green">
            {prompt} <span className="text-terminal-white">{item.input}</span>
          </div>
          {item.output && (
            <div
              className={`whitespace-pre-wrap ${
                item.isError ? 'text-terminal-red' : 'text-terminal-white'
              }`}
            >
              {item.output}
            </div>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

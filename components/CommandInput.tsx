'use client';

import { useState, KeyboardEvent, useRef, useEffect } from 'react';

interface CommandInputProps {
  prompt: string;
  onSubmit: (command: string) => void;
}

export default function CommandInput({ prompt, onSubmit }: CommandInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleFocusTerminal = () => {
      inputRef.current?.focus();
    };

    window.addEventListener('click', handleFocusTerminal);
    return () => window.removeEventListener('click', handleFocusTerminal);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-terminal-green">{prompt}</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent outline-none text-terminal-white caret-terminal-green"
        autoFocus
        spellCheck={false}
      />
    </div>
  );
}

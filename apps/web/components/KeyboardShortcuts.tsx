'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const shortcuts = [
  { keys: ['Enter'], description: 'Execute command' },
  { keys: ['↑', '↓'], description: 'Command history' },
  { keys: ['Tab'], description: 'Autocomplete' },
  { keys: ['Esc'], description: 'Exit level' },
  { keys: ['⌘', 'H'], description: 'Show hint' },
  { keys: ['⌘', 'R'], description: 'Reset level' },
  { keys: ['?'], description: 'Toggle this help' },
];

export default function KeyboardShortcuts() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const active = document.activeElement;
        if (active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA') return;
        e.preventDefault();
        setShow((s) => !s);
      }
      if (e.key === 'Escape') setShow(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShow(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-cyber-surface border border-cyber-purple rounded-xl p-6 max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-cyber-green mb-4">Keyboard Shortcuts</h2>
            <div className="space-y-3">
              {shortcuts.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {s.keys.map((key) => (
                      <kbd
                        key={key}
                        className="px-2 py-1 bg-cyber-bg border border-cyber-purple rounded text-cyber-white text-xs font-mono min-w-[28px] text-center"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                  <span className="text-cyber-muted text-sm">{s.description}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-cyber-muted text-xs">
              Press <kbd className="px-1 bg-cyber-bg border border-cyber-purple rounded text-xs">?</kbd> or <kbd className="px-1 bg-cyber-bg border border-cyber-purple rounded text-xs">Esc</kbd> to close
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

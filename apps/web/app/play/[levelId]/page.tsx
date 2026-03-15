'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { validate } from '@cli-quest/engine';
import Terminal from '@/components/Terminal';
import { allLevels, getNextLevel } from '@/data/levels';
import { motion } from 'framer-motion';
import type { DialogueEntry } from '@cli-quest/shared';

export default function PlayLevel() {
  const params = useParams();
  const router = useRouter();
  const levelId = params.levelId as string;

  const {
    loadLevel,
    resetLevel,
    currentLevel,
    history,
    commandsUsed,
    commandCount,
    hintsUsed,
    completeLevel,
    shell,
  } = useGameStore();

  const [showComplete, setShowComplete] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [panelCollapsed, setPanelCollapsed] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const [visibleDialogue, setVisibleDialogue] = useState<DialogueEntry[]>([]);

  const level = allLevels.find((l) => l.id === levelId);

  useEffect(() => {
    if (level && currentLevel?.id !== levelId) {
      loadLevel(level);
      setShowComplete(false);
      setVisibleDialogue([]);
    }
  }, [levelId, level, currentLevel?.id, loadLevel]);

  // Show dialogue based on triggers
  useEffect(() => {
    if (!level?.dialogue) return;
    const newDialogue: DialogueEntry[] = [];
    for (const d of level.dialogue) {
      if (!d.trigger || d.trigger.type === 'levelStart') {
        newDialogue.push(d);
      } else if (d.trigger.type === 'commandExecuted' && d.trigger.command && commandsUsed.includes(d.trigger.command)) {
        newDialogue.push(d);
      }
    }
    setVisibleDialogue(newDialogue);
  }, [level, commandsUsed]);

  // Check level completion
  useEffect(() => {
    if (!level || showComplete || !shell) return;
    if (history.length === 0) return;

    const state = shell.getState();
    const validationState = {
      fs: state.fs,
      cwd: state.cwd,
      env: state.env,
      lastOutput: history[history.length - 1]?.stdout || '',
      commandsUsed,
    };

    if (validate(level.validator, validationState)) {
      completeLevel();
      setTimeout(() => setShowComplete(true), 500);
    }
  }, [history, commandsUsed, level, showComplete, shell, completeLevel]);

  const handleHint = useCallback(() => {
    if (!level) return;
    const hint = level.hints[hintsUsed];
    if (hint) {
      setHintMessage(hint.text);
      useGameStore.setState({ hintsUsed: hintsUsed + 1 });
      setTimeout(() => setHintMessage(null), 5000);
    }
  }, [level, hintsUsed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showComplete) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        router.push('/');
      } else if (e.key === 'h' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleHint();
      } else if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        resetLevel();
        setShowComplete(false);
        setVisibleDialogue([]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showComplete, router, handleHint, resetLevel]);

  if (!level) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-cyber-red text-xl">Level not found</div>
      </div>
    );
  }

  const nextLevel = getNextLevel(levelId);

  const characterColors: Record<string, string> = {
    Kai: 'text-cyber-green',
    ARIA: 'text-cyber-teal',
    Reeves: 'text-cyber-yellow',
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Minimal top bar */}
      <div className="h-10 bg-cyber-surface border-b border-cyber-purple flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-cyber-muted text-sm hover:text-cyber-white">
            ← Back
          </button>
          <span className="text-cyber-green font-medium text-sm hidden sm:inline">
            Ch.{level.chapter} Level {level.position}: {level.title}
          </span>
          <span className="text-cyber-green font-medium text-sm sm:hidden">
            {level.title}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-cyber-muted text-xs hidden sm:inline">ESC: Exit</span>
          <button onClick={handleHint} className="text-cyber-yellow text-xs hover:text-cyber-white">
            ⌘H Hint ({hintsUsed}/{level.hints.length})
          </button>
          <button onClick={() => { resetLevel(); setShowComplete(false); setVisibleDialogue([]); }} className="text-cyber-muted text-xs hover:text-cyber-white">
            ⌘R Reset
          </button>
          <button
            onClick={() => setPanelCollapsed(!panelCollapsed)}
            className="text-cyber-muted text-xs hover:text-cyber-white"
          >
            {panelCollapsed ? '◀ Panel' : '▶ Hide'}
          </button>
        </div>
      </div>

      {/* Hint message */}
      <div aria-live="assertive">
        {hintMessage && (
          <div className="bg-cyber-yellow/10 border-l-4 border-cyber-yellow px-4 py-2">
            <span className="text-cyber-yellow text-sm font-bold">HINT: </span>
            <span className="text-cyber-white text-sm">{hintMessage}</span>
          </div>
        )}
      </div>

      {/* Main area: side panel + terminal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Side panel */}
        {!panelCollapsed && (
          <div className="w-64 bg-surface-gradient border-r border-cyber-purple flex flex-col">
            {/* Objective */}
            <div className="p-3 border-b border-cyber-purple/40">
              <div className="text-cyber-yellow text-xs font-bold uppercase mb-1">Objective</div>
              <div className="text-cyber-white text-sm leading-relaxed">{level.objective}</div>
            </div>

            {/* Dialogue */}
            <div className="flex-1 overflow-y-auto terminal-scrollbar p-3 space-y-3">
              {visibleDialogue.map((d, i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-cyber-purple flex items-center justify-center text-xs font-bold text-cyber-green flex-shrink-0 mt-0.5">
                    {d.character[0]}
                  </div>
                  <div className="bg-terminal-bg rounded-lg p-2 border border-cyber-purple/30 flex-1">
                    <div className={`text-xs font-bold mb-1 ${characterColors[d.character] || 'text-cyber-white'}`}>
                      {d.character}
                    </div>
                    <div className="text-cyber-white text-xs leading-relaxed">{d.message}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="p-3 border-t border-cyber-purple/40 flex justify-between text-xs text-cyber-muted">
              <span>{commandCount} commands</span>
              <span>Hints: {hintsUsed}/{level.hints.length}</span>
            </div>
          </div>
        )}

        {/* Terminal */}
        <div className="flex-1 overflow-hidden">
          <Terminal />
        </div>
      </div>

      {/* Level Complete Modal */}
      {showComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.1 }}
            role="dialog"
            aria-modal="true"
            aria-label="Level complete"
            className="bg-cyber-bg border-2 border-cyber-green rounded-xl p-8 max-w-md"
          >
            <motion.h2
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-cyber-green mb-4 glow-green"
            >
              LEVEL COMPLETE!
            </motion.h2>
            <p className="text-cyber-white mb-4">{level.briefing}</p>
            <div className="mb-6 text-cyber-muted">
              <div>Commands used: {commandCount}</div>
              <div>Hints used: {hintsUsed}</div>
              <div className="text-cyber-yellow mt-2">+{level.xpReward} XP</div>
            </div>
            <div className="flex gap-4">
              {nextLevel ? (
                <button
                  onClick={() => router.push(`/play/${nextLevel.id}`)}
                  className="px-6 py-2 bg-cyber-green text-cyber-bg font-bold rounded-lg hover:opacity-90"
                >
                  Next Level
                </button>
              ) : (
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-2 bg-cyber-green text-cyber-bg font-bold rounded-lg hover:opacity-90"
                >
                  Back to Hub
                </button>
              )}
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 border border-cyber-green text-cyber-green rounded-lg hover:bg-cyber-green/10"
              >
                Level Select
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

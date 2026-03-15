'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createShell } from '@cli-quest/engine';
import type { Shell } from '@cli-quest/engine';
import type { FSNode, Env, Level } from '@cli-quest/shared';

export type HistoryEntry = {
  id: number;
  input: string;
  stdout: string;
  stderr: string;
  isError: boolean;
};

interface GameStore {
  // Shell state
  shell: Shell | null;
  history: HistoryEntry[];
  cwd: string;

  // Level state
  currentLevel: Level | null;
  commandsUsed: string[];
  commandCount: number;
  hintsUsed: number;
  levelStartTime: number | null;

  // Progress (persisted)
  completedLevels: string[];
  totalXP: number;
  commandsExecuted: number;

  // Actions
  initShell: (fs: FSNode, env?: Env, cwd?: string) => void;
  executeCommand: (input: string) => void;
  loadLevel: (level: Level) => void;
  resetLevel: () => void;
  completeLevel: () => void;
  clearHistory: () => void;
}

let nextId = 1;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      shell: null,
      history: [],
      cwd: '/home/user',
      currentLevel: null,
      commandsUsed: [],
      commandCount: 0,
      hintsUsed: 0,
      levelStartTime: null,
      completedLevels: [],
      totalXP: 0,
      commandsExecuted: 0,

      initShell: (fs, env, cwd) => {
        const shell = createShell({
          filesystem: fs,
          env: env || { HOME: '/home/user', USER: 'user', PWD: cwd || '/home/user', PATH: '/usr/bin' },
          cwd: cwd || '/home/user',
        });
        set({ shell, history: [], cwd: cwd || '/home/user', commandsUsed: [], commandCount: 0 });
      },

      executeCommand: (input) => {
        const { shell } = get();
        if (!shell) return;

        const result = shell.execute(input);

        if (result.stdout === '__CLEAR__') {
          set({ history: [], commandCount: get().commandCount + 1 });
          return;
        }

        const entry: HistoryEntry = {
          id: nextId++,
          input,
          stdout: result.stdout,
          stderr: result.stderr,
          isError: result.exitCode !== 0,
        };

        set({
          history: [...get().history, entry],
          cwd: result.cwd,
          commandsUsed: shell.getCommandsUsed(),
          commandCount: get().commandCount + 1,
          commandsExecuted: get().commandsExecuted + 1,
        });
      },

      loadLevel: (level) => {
        const shell = createShell({
          filesystem: structuredClone(level.initialFS),
          env: level.initialEnv || { HOME: '/home/user', USER: 'user', PWD: level.startingPath, PATH: '/usr/bin' },
          cwd: level.startingPath,
        });
        set({
          shell,
          currentLevel: level,
          history: [],
          cwd: level.startingPath,
          commandsUsed: [],
          commandCount: 0,
          hintsUsed: 0,
          levelStartTime: Date.now(),
        });
      },

      resetLevel: () => {
        const { currentLevel } = get();
        if (currentLevel) get().loadLevel(currentLevel);
      },

      completeLevel: () => {
        const { currentLevel, completedLevels, totalXP } = get();
        if (!currentLevel) return;
        if (!completedLevels.includes(currentLevel.id)) {
          set({
            completedLevels: [...completedLevels, currentLevel.id],
            totalXP: totalXP + (currentLevel.xpReward || 0),
          });
        }
      },

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'cli-quest-v2',
      partialize: (state) => ({
        completedLevels: state.completedLevels,
        totalXP: state.totalXP,
        commandsExecuted: state.commandsExecuted,
      }),
    }
  )
);

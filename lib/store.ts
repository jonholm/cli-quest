import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, FSNode, CommandOutput } from './types';
import { executeCommand } from './commandExecutor';
import { allLevels } from '@/data/allLevels';
import { cloneFS } from './fileSystem';
import { HOME_DIRECTORY } from './constants';

let nextOutputId = 1;

interface Store extends GameState {
  currentLevel: string | null;
  completedLevels: string[];
  totalXP: number;
  commandsExecuted: number;
  executeCommand: (input: string) => void;
  loadLevel: (levelId: string) => void;
  loadSandbox: (fs: FSNode) => void;
  useHint: () => string | null;
  resetLevel: () => void;
  completeLevel: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Game state
      currentLevel: null,
      currentPath: HOME_DIRECTORY,
      fileSystem: {
        type: 'directory',
        name: '',
        children: [],
      },
      history: [],
      hintsUsed: 0,
      commandCount: 0,
      lastOutput: '',
      completedLevels: [],
      totalXP: 0,
      commandsExecuted: 0,

      executeCommand: (input: string) => {
        const state = get();
        const result = executeCommand(input, state);

        // Handle clear command
        if (result.output === '__CLEAR__') {
          set({
            history: [],
            commandCount: state.commandCount + 1,
          });
          return;
        }

        const newEntry: CommandOutput = {
          id: nextOutputId++,
          input,
          output: result.output,
          isError: result.isError,
        };

        const newHistory = [...state.history, newEntry];

        set({
          history: newHistory,
          lastOutput: result.output,
          commandCount: state.commandCount + 1,
          commandsExecuted: state.commandsExecuted + 1,
          ...result.newState,
        });

        // Check if level is complete
        if (state.currentLevel) {
          const level = allLevels.find((l) => l.id === state.currentLevel);
          if (level) {
            const updatedState = {
              ...state,
              history: newHistory,
              lastOutput: result.output,
              commandCount: state.commandCount + 1,
              ...result.newState,
            };

            if (level.validator(updatedState)) {
              setTimeout(() => {
                get().completeLevel();
              }, 500);
            }
          }
        }
      },

      loadLevel: (levelId: string) => {
        const level = allLevels.find((l) => l.id === levelId);
        if (!level) return;

        set({
          currentLevel: levelId,
          currentPath: level.startingPath,
          fileSystem: cloneFS(level.initialFS),
          history: [],
          hintsUsed: 0,
          commandCount: 0,
          lastOutput: '',
        });
      },

      loadSandbox: (fs: FSNode) => {
        set({
          currentLevel: null,
          currentPath: HOME_DIRECTORY,
          fileSystem: cloneFS(fs),
          history: [],
          hintsUsed: 0,
          commandCount: 0,
          lastOutput: '',
        });
      },

      useHint: () => {
        const state = get();
        if (!state.currentLevel) return null;

        const level = allLevels.find((l) => l.id === state.currentLevel);
        if (!level) return null;

        const nextHint = level.hints[state.hintsUsed];
        if (!nextHint) return null;

        set({ hintsUsed: state.hintsUsed + 1 });
        return nextHint;
      },

      resetLevel: () => {
        const state = get();
        if (state.currentLevel) {
          get().loadLevel(state.currentLevel);
        }
      },

      completeLevel: () => {
        const state = get();
        if (!state.currentLevel) return;

        const level = allLevels.find((l) => l.id === state.currentLevel);
        const xpReward = level?.xpReward || 0;

        if (!state.completedLevels.includes(state.currentLevel)) {
          set({
            completedLevels: [...state.completedLevels, state.currentLevel],
            totalXP: state.totalXP + xpReward,
          });
        }
      },
    }),
    {
      name: 'cli-quest-storage',
      partialize: (state) => ({
        completedLevels: state.completedLevels,
        totalXP: state.totalXP,
        commandsExecuted: state.commandsExecuted,
      }),
    }
  )
);

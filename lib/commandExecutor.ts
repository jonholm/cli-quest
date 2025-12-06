/**
 * Command Executor
 *
 * Routes parsed commands to their implementations and manages state updates.
 * All commands operate on immutable state - they return new state rather than modifying in place.
 *
 * Supported commands:
 * - Navigation: pwd, ls, cd
 * - File operations: cat, touch, mkdir, rm, cp, mv
 * - Content search: grep, find
 * - Text processing: head, tail, wc, echo
 * - Utility: clear
 *
 * @module commandExecutor
 */

import { GameState } from './types';
import { parseCommand } from './commandParser';
import { pwd } from './commands/pwd';
import { ls } from './commands/ls';
import { cd } from './commands/cd';
import { cat } from './commands/cat';
import { mkdir } from './commands/mkdir';
import { touch } from './commands/touch';
import { rm } from './commands/rm';
import { clear } from './commands/clear';
import { grep } from './commands/grep';
import { find } from './commands/find';
import { echo } from './commands/echo';
import { mv } from './commands/mv';
import { cp } from './commands/cp';
import { head } from './commands/head';
import { tail } from './commands/tail';
import { wc } from './commands/wc';

/**
 * Result of executing a command
 */
export type ExecutionResult = {
  /** Terminal output to display to the user */
  output: string;
  /** Whether the command resulted in an error */
  isError: boolean;
  /** Partial state updates (e.g., new path, updated file system) */
  newState?: Partial<GameState>;
};

/**
 * Executes a command input string and returns the result.
 * Parses the input, routes to the appropriate command handler, and returns output + state changes.
 *
 * @param input - Raw command string from user (e.g., "ls -la /home")
 * @param state - Current game state (file system, current path, etc.)
 * @returns ExecutionResult with output and any state changes
 *
 * @example
 * const result = executeCommand('pwd', gameState);
 * console.log(result.output);  // "/home/user"
 *
 * @example
 * const result = executeCommand('cd ..', gameState);
 * const newPath = result.newState?.currentPath;  // "/home"
 */
export function executeCommand(input: string, state: GameState): ExecutionResult {
  const parsed = parseCommand(input);

  if (!parsed.cmd) {
    return { output: '', isError: false };
  }

  try {
    let output = '';
    let newState: Partial<GameState> = {};

    switch (parsed.cmd) {
      case 'pwd':
        output = pwd(state);
        break;

      case 'ls':
        output = ls(state, parsed);
        break;

      case 'cd': {
        const result = cd(state, parsed);
        output = result.output;
        newState.currentPath = result.newPath;
        break;
      }

      case 'cat':
        output = cat(state, parsed);
        break;

      case 'mkdir': {
        const result = mkdir(state, parsed);
        output = result.output;
        newState.fileSystem = result.newFS;
        break;
      }

      case 'touch': {
        const result = touch(state, parsed);
        output = result.output;
        newState.fileSystem = result.newFS;
        break;
      }

      case 'rm': {
        const result = rm(state, parsed);
        output = result.output;
        newState.fileSystem = result.newFS;
        break;
      }

      case 'clear':
        output = clear();
        break;

      case 'grep':
        output = grep(state, parsed);
        break;

      case 'find':
        output = find(state, parsed);
        break;

      case 'echo':
        output = echo(parsed);
        break;

      case 'mv': {
        const result = mv(state, parsed);
        output = result.output;
        newState.fileSystem = result.newFS;
        break;
      }

      case 'cp': {
        const result = cp(state, parsed);
        output = result.output;
        newState.fileSystem = result.newFS;
        break;
      }

      case 'head':
        output = head(state, parsed);
        break;

      case 'tail':
        output = tail(state, parsed);
        break;

      case 'wc':
        output = wc(state, parsed);
        break;

      default:
        throw new Error(`Command not found: ${parsed.cmd}`);
    }

    return { output, isError: false, newState };
  } catch (error) {
    return {
      output: (error as Error).message,
      isError: true,
    };
  }
}

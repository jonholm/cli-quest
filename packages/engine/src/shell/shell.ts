import type { FSNode, Env, ShellResult } from '@cli-quest/shared';
import { execute } from './executor';
import { complete as completeImpl } from './completion';
import { registerAllCommands } from '../commands';

export interface Shell {
  execute(input: string): ShellResult;
  complete(input: string, cursorPos: number): string[];
  historyUp(): string | null;
  historyDown(): string | null;
  getCommandsUsed(): string[];
  getState(): { fs: FSNode; env: Env; cwd: string };
}

export interface ShellOptions {
  filesystem: FSNode;
  env: Env;
  cwd: string;
  history?: string[];
}

let commandsRegistered = false;

export function createShell(options: ShellOptions): Shell {
  if (!commandsRegistered) {
    registerAllCommands();
    commandsRegistered = true;
  }

  let fs = options.filesystem;
  let env = { ...options.env };
  let cwd = options.cwd;
  const commandHistory: string[] = options.history ? [...options.history] : [];
  let historyIndex = commandHistory.length;
  let commandsUsed: string[] = [];

  return {
    execute(input: string): ShellResult {
      commandHistory.push(input);
      historyIndex = commandHistory.length;

      const result = execute(input, fs, env, cwd, commandsUsed, commandHistory);
      fs = result.fs;
      env = result.env;
      cwd = result.cwd;
      commandsUsed = result.commandsUsed;

      // Update PWD env var
      env.PWD = cwd;

      return {
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
        fs,
        env: { ...env },
        cwd,
      };
    },

    complete(input: string, cursorPos: number): string[] {
      return completeImpl(input, cursorPos, fs, cwd, env);
    },

    historyUp(): string | null {
      if (historyIndex <= 0) return null;
      historyIndex--;
      return commandHistory[historyIndex];
    },

    historyDown(): string | null {
      if (historyIndex >= commandHistory.length - 1) {
        historyIndex = commandHistory.length;
        return null;
      }
      historyIndex++;
      return commandHistory[historyIndex];
    },

    getCommandsUsed(): string[] {
      return [...commandsUsed];
    },

    getState() {
      return { fs, env: { ...env }, cwd };
    },
  };
}

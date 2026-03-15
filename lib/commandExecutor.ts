import { GameState } from './types';
import { parseCommand } from './commandParser';
import { registerCommand, getCommand } from './commandRegistry';
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

export type ExecutionResult = {
  output: string;
  isError: boolean;
  newState?: Partial<GameState>;
};

// Register all commands
registerCommand('pwd', (state) => ({ output: pwd(state) }));
registerCommand('ls', (state, parsed) => ({ output: ls(state, parsed) }));
registerCommand('cd', (state, parsed) => {
  const result = cd(state, parsed);
  return { output: result.output, newState: { currentPath: result.newPath } };
});
registerCommand('cat', (state, parsed) => ({ output: cat(state, parsed) }));
registerCommand('mkdir', (state, parsed) => {
  const result = mkdir(state, parsed);
  return { output: result.output, newState: { fileSystem: result.newFS } };
});
registerCommand('touch', (state, parsed) => {
  const result = touch(state, parsed);
  return { output: result.output, newState: { fileSystem: result.newFS } };
});
registerCommand('rm', (state, parsed) => {
  const result = rm(state, parsed);
  return { output: result.output, newState: { fileSystem: result.newFS } };
});
registerCommand('clear', () => ({ output: clear() }));
registerCommand('grep', (state, parsed) => ({ output: grep(state, parsed) }));
registerCommand('find', (state, parsed) => ({ output: find(state, parsed) }));
registerCommand('echo', (_state, parsed) => ({ output: echo(parsed) }));
registerCommand('mv', (state, parsed) => {
  const result = mv(state, parsed);
  return { output: result.output, newState: { fileSystem: result.newFS } };
});
registerCommand('cp', (state, parsed) => {
  const result = cp(state, parsed);
  return { output: result.output, newState: { fileSystem: result.newFS } };
});
registerCommand('head', (state, parsed) => ({ output: head(state, parsed) }));
registerCommand('tail', (state, parsed) => ({ output: tail(state, parsed) }));
registerCommand('wc', (state, parsed) => ({ output: wc(state, parsed) }));

export function executeCommand(input: string, state: GameState): ExecutionResult {
  const parsed = parseCommand(input);

  if (!parsed.cmd) {
    return { output: '', isError: false };
  }

  try {
    const handler = getCommand(parsed.cmd);
    if (!handler) {
      throw new Error(`Command not found: ${parsed.cmd}`);
    }

    const result = handler(state, parsed);
    return { output: result.output, isError: false, newState: result.newState };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      output: message,
      isError: true,
    };
  }
}

import { GameState, FSNode } from '../types';
import { createNode, resolvePath } from '../fileSystem';
import { ParsedCommand } from '../commandParser';

export function mkdir(state: GameState, parsed: ParsedCommand): { newFS: FSNode; output: string } {
  const { args } = parsed;

  if (args.length === 0) {
    throw new Error('mkdir: missing operand');
  }

  const targetPath = resolvePath(state.currentPath, args[0]);

  try {
    const newFS = createNode(state.fileSystem, targetPath, {
      type: 'directory',
      name: args[0],
      children: [],
    });

    return { newFS, output: '' };
  } catch (error) {
    throw new Error(`mkdir: cannot create directory '${args[0]}': ${(error as Error).message}`);
  }
}

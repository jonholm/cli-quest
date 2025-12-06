import { GameState, FSNode } from '../types';
import { createNode, resolvePath } from '../fileSystem';
import { ParsedCommand } from '../commandParser';

export function touch(state: GameState, parsed: ParsedCommand): { newFS: FSNode; output: string } {
  const { args } = parsed;

  if (args.length === 0) {
    throw new Error('touch: missing file operand');
  }

  const targetPath = resolvePath(state.currentPath, args[0]);

  try {
    const newFS = createNode(state.fileSystem, targetPath, {
      type: 'file',
      name: args[0],
      content: '',
    });

    return { newFS, output: '' };
  } catch (error) {
    throw new Error(`touch: cannot create file '${args[0]}': ${(error as Error).message}`);
  }
}

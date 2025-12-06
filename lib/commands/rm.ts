import { GameState, FSNode } from '../types';
import { deleteNode, getNode, resolvePath } from '../fileSystem';
import { ParsedCommand } from '../commandParser';

export function rm(state: GameState, parsed: ParsedCommand): { newFS: FSNode; output: string } {
  const { args, flags } = parsed;

  if (args.length === 0) {
    throw new Error('rm: missing operand');
  }

  const targetPath = resolvePath(state.currentPath, args[0]);
  const node = getNode(state.fileSystem, targetPath);

  if (!node) {
    throw new Error(`rm: cannot remove '${args[0]}': No such file or directory`);
  }

  if (node.type === 'directory' && !flags['r']) {
    throw new Error(`rm: cannot remove '${args[0]}': Is a directory (use -r to remove directories)`);
  }

  try {
    const newFS = deleteNode(state.fileSystem, targetPath);
    return { newFS, output: '' };
  } catch (error) {
    throw new Error(`rm: cannot remove '${args[0]}': ${(error as Error).message}`);
  }
}

import { GameState } from '../types';
import { getNode, resolvePath } from '../fileSystem';
import { ParsedCommand } from '../commandParser';

export function cd(state: GameState, parsed: ParsedCommand): { newPath: string; output: string } {
  const { args } = parsed;

  if (args.length === 0) {
    // Default to home directory
    return { newPath: '/home/user', output: '' };
  }

  const targetPath = resolvePath(state.currentPath, args[0]);
  const node = getNode(state.fileSystem, targetPath);

  if (!node) {
    throw new Error(`cd: ${args[0]}: No such file or directory`);
  }

  if (node.type !== 'directory') {
    throw new Error(`cd: ${args[0]}: Not a directory`);
  }

  return { newPath: targetPath, output: '' };
}

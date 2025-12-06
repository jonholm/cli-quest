import { GameState } from '../types';
import { getNode, resolvePath } from '../fileSystem';
import { ParsedCommand } from '../commandParser';

export function cat(state: GameState, parsed: ParsedCommand): string {
  const { args } = parsed;

  if (args.length === 0) {
    throw new Error('cat: missing file operand');
  }

  const targetPath = resolvePath(state.currentPath, args[0]);
  const node = getNode(state.fileSystem, targetPath);

  if (!node) {
    throw new Error(`cat: ${args[0]}: No such file or directory`);
  }

  if (node.type === 'directory') {
    throw new Error(`cat: ${args[0]}: Is a directory`);
  }

  return node.content || '';
}

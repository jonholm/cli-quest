import { GameState } from '../types';
import { getNode, resolvePath } from '../fileSystem';
import { ParsedCommand } from '../commandParser';

export function tail(state: GameState, parsed: ParsedCommand): string {
  const { args, flags } = parsed;

  if (args.length === 0) {
    throw new Error('tail: missing file operand');
  }

  const targetPath = resolvePath(state.currentPath, args[0]);
  const node = getNode(state.fileSystem, targetPath);

  if (!node) {
    throw new Error(`tail: ${args[0]}: No such file or directory`);
  }

  if (node.type === 'directory') {
    throw new Error(`tail: ${args[0]}: Is a directory`);
  }

  const content = node.content || '';
  const lines = content.split('\n');
  const numLines = flags['n'] ? parseInt(flags['n'] as string, 10) : 10;

  return lines.slice(-numLines).join('\n');
}

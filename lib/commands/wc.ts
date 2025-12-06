import { GameState } from '../types';
import { getNode, resolvePath } from '../fileSystem';
import { ParsedCommand } from '../commandParser';

export function wc(state: GameState, parsed: ParsedCommand): string {
  const { args, flags } = parsed;

  if (args.length === 0) {
    throw new Error('wc: missing file operand');
  }

  const targetPath = resolvePath(state.currentPath, args[0]);
  const node = getNode(state.fileSystem, targetPath);

  if (!node) {
    throw new Error(`wc: ${args[0]}: No such file or directory`);
  }

  if (node.type === 'directory') {
    throw new Error(`wc: ${args[0]}: Is a directory`);
  }

  const content = node.content || '';
  const lines = content.split('\n').length;
  const words = content.split(/\s+/).filter(w => w.length > 0).length;
  const chars = content.length;

  if (flags['l']) return `${lines} ${args[0]}`;
  if (flags['w']) return `${words} ${args[0]}`;
  if (flags['c']) return `${chars} ${args[0]}`;

  return `${lines} ${words} ${chars} ${args[0]}`;
}

import { GameState } from '../types';
import { getNode, listDirectory } from '../fileSystem';
import { ParsedCommand } from '../commandParser';

export function ls(state: GameState, parsed: ParsedCommand): string {
  const { args, flags } = parsed;
  const targetPath = args[0] || state.currentPath;

  const node = getNode(state.fileSystem, targetPath);

  if (!node) {
    throw new Error(`ls: cannot access '${targetPath}': No such file or directory`);
  }

  if (node.type !== 'directory') {
    return node.name;
  }

  const items = listDirectory(node);

  if (items.length === 0) {
    return '';
  }

  // For now, simple list. Can add -l and -a later
  if (flags['l']) {
    // Long format
    return items.map(name => {
      const child = node.children?.find(c => c.name === name);
      const type = child?.type === 'directory' ? 'd' : '-';
      const size = child?.content?.length || 0;
      return `${type}rw-r--r--  1 user  user  ${size.toString().padStart(8)} ${name}`;
    }).join('\n');
  }

  return items.join('  ');
}

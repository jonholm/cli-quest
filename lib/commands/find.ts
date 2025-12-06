import { GameState, FSNode } from '../types';
import { getNode } from '../fileSystem';
import { ParsedCommand } from '../commandParser';

export function find(state: GameState, parsed: ParsedCommand): string {
  const { args, flags } = parsed;

  const startPath = args[0] || '.';
  const namePattern = flags['name'] as string;
  const typeFilter = flags['type'] as string;

  const startNode = getNode(state.fileSystem,
    startPath === '.' ? state.currentPath : startPath);

  if (!startNode) {
    throw new Error(`find: '${startPath}': No such file or directory`);
  }

  const results: string[] = [];

  function searchNode(node: FSNode, currentPath: string) {
    let matches = true;

    if (namePattern) {
      const regex = new RegExp(namePattern.replace(/\*/g, '.*'));
      matches = matches && regex.test(node.name);
    }

    if (typeFilter) {
      if (typeFilter === 'f') matches = matches && node.type === 'file';
      if (typeFilter === 'd') matches = matches && node.type === 'directory';
    }

    if (matches) {
      results.push(currentPath + '/' + node.name);
    }

    if (node.type === 'directory' && node.children) {
      for (const child of node.children) {
        searchNode(child, currentPath + '/' + node.name);
      }
    }
  }

  if (startNode.type === 'directory' && startNode.children) {
    for (const child of startNode.children) {
      searchNode(child, startPath === '.' ? '.' : startPath);
    }
  }

  return results.join('\n');
}

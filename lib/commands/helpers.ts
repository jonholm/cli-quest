import { GameState } from '../types';
import { getNode, resolvePath } from '../fileSystem';

export function readFileLines(state: GameState, filePath: string): string[] {
  const targetPath = resolvePath(state.currentPath, filePath);
  const node = getNode(state.fileSystem, targetPath);

  if (!node) {
    throw new Error(`${filePath}: No such file or directory`);
  }

  if (node.type === 'directory') {
    throw new Error(`${filePath}: Is a directory`);
  }

  const content = node.content || '';
  return content.split('\n');
}

import { GameState, FSNode } from '../types';
import { getNode, resolvePath, createNode, cloneFS } from '../fileSystem';
import { ParsedCommand } from '../commandParser';

export function cp(state: GameState, parsed: ParsedCommand): { newFS: FSNode; output: string } {
  const { args } = parsed;

  if (args.length < 2) {
    throw new Error('cp: missing operand');
  }

  const sourcePath = resolvePath(state.currentPath, args[0]);
  const destPath = resolvePath(state.currentPath, args[1]);

  const sourceNode = getNode(state.fileSystem, sourcePath);
  if (!sourceNode) {
    throw new Error(`cp: cannot stat '${args[0]}': No such file or directory`);
  }

  const existingDest = getNode(state.fileSystem, destPath);
  if (existingDest) {
    throw new Error(`cp: cannot copy to '${args[1]}': File exists`);
  }

  const newFS = createNode(state.fileSystem, destPath, cloneFS(sourceNode));

  return { newFS, output: '' };
}

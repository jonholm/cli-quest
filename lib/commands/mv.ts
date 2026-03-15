import { GameState, FSNode } from '../types';
import { getNode, resolvePath, deleteNode, createNode } from '../fileSystem';
import { ParsedCommand } from '../commandParser';

export function mv(state: GameState, parsed: ParsedCommand): { newFS: FSNode; output: string } {
  const { args } = parsed;

  if (args.length < 2) {
    throw new Error('mv: missing operand');
  }

  const sourcePath = resolvePath(state.currentPath, args[0]);
  const destPath = resolvePath(state.currentPath, args[1]);

  const sourceNode = getNode(state.fileSystem, sourcePath);
  if (!sourceNode) {
    throw new Error(`mv: cannot stat '${args[0]}': No such file or directory`);
  }

  const existingDest = getNode(state.fileSystem, destPath);
  if (existingDest) {
    throw new Error(`mv: cannot move to '${args[1]}': File exists`);
  }

  let newFS = deleteNode(state.fileSystem, sourcePath);
  newFS = createNode(newFS, destPath, sourceNode);

  return { newFS, output: '' };
}

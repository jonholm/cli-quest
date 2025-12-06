import { GameState } from '../types';
import { getNode, listDirectory } from '../fileSystem';
import { ParsedCommand } from '../commandParser';

export function grep(state: GameState, parsed: ParsedCommand): string {
  const { args, flags } = parsed;

  if (args.length < 1) {
    throw new Error('grep: missing search pattern');
  }

  const pattern = args[0];
  const fileName = args[1];

  if (!fileName) {
    throw new Error('grep: missing file operand');
  }

  const node = getNode(state.fileSystem, state.currentPath + '/' + fileName);

  if (!node) {
    throw new Error(`grep: ${fileName}: No such file or directory`);
  }

  if (node.type === 'directory') {
    throw new Error(`grep: ${fileName}: Is a directory`);
  }

  const content = node.content || '';
  const lines = content.split('\n');
  const caseInsensitive = flags['i'] === true;

  const regex = new RegExp(pattern, caseInsensitive ? 'i' : '');
  const matchingLines = lines.filter(line => regex.test(line));

  if (matchingLines.length === 0) {
    return '';
  }

  return matchingLines.join('\n');
}

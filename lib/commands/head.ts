import { GameState } from '../types';
import { ParsedCommand } from '../commandParser';
import { readFileLines } from './helpers';
import { parseLineCount } from '../utils';
import { DEFAULT_LINE_COUNT } from '../constants';

export function head(state: GameState, parsed: ParsedCommand): string {
  const { args, flags } = parsed;

  if (args.length === 0) {
    throw new Error('head: missing file operand');
  }

  const lines = readFileLines(state, args[0]);
  const numLines = parseLineCount(flags['n'], DEFAULT_LINE_COUNT);

  return lines.slice(0, numLines).join('\n');
}

import { GameState } from '../types';
import { ParsedCommand } from '../commandParser';
import { readFileLines } from './helpers';
import { parseLineCount } from '../utils';
import { DEFAULT_LINE_COUNT } from '../constants';

export function tail(state: GameState, parsed: ParsedCommand): string {
  const { args, flags } = parsed;

  if (args.length === 0) {
    throw new Error('tail: missing file operand');
  }

  const lines = readFileLines(state, args[0]);
  const numLines = parseLineCount(flags['n'], DEFAULT_LINE_COUNT);

  return lines.slice(-numLines).join('\n');
}

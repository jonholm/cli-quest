import { describe, it, expect } from 'vitest';
import { echo } from '../../../lib/commands/echo';
import { ParsedCommand } from '../../../lib/commandParser';

const cmd = (args: string[]): ParsedCommand =>
  ({ cmd: 'echo', args, flags: {} });

describe('echo', () => {
  it('prints arguments', () => {
    expect(echo(cmd(['Hello', 'World']))).toBe('Hello World');
  });

  it('returns empty string for no args', () => {
    expect(echo(cmd([]))).toBe('');
  });

  it('handles single argument', () => {
    expect(echo(cmd(['test']))).toBe('test');
  });
});

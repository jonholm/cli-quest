import { describe, it, expect } from 'vitest';
import { tail } from '../../../lib/commands/tail';
import { makeState } from '../../fixtures';
import { ParsedCommand } from '../../../lib/commandParser';

const cmd = (args: string[], flags: Record<string, boolean | string> = {}): ParsedCommand =>
  ({ cmd: 'tail', args, flags });

describe('tail', () => {
  it('shows last 10 lines by default', () => {
    const output = tail(makeState(), cmd(['hello.txt']));
    expect(output).toBe('Hello World\nSecond line\nThird line');
  });

  it('shows specified number of lines', () => {
    const output = tail(makeState(), cmd(['hello.txt'], { n: '1' }));
    expect(output).toBe('Third line');
  });

  it('throws for missing operand', () => {
    expect(() => tail(makeState(), cmd([]))).toThrow('missing file operand');
  });

  it('throws for non-existent file', () => {
    expect(() => tail(makeState(), cmd(['nonexistent.txt']))).toThrow('No such file');
  });

  it('handles boolean -n flag gracefully (returns default)', () => {
    const output = tail(makeState(), cmd(['hello.txt'], { n: true }));
    expect(output).toBe('Hello World\nSecond line\nThird line');
  });

  it('throws for directory', () => {
    expect(() => tail(makeState(), cmd(['docs']))).toThrow('Is a directory');
  });
});

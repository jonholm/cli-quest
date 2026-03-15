import { describe, it, expect } from 'vitest';
import { head } from '../../../lib/commands/head';
import { makeState } from '../../fixtures';
import { ParsedCommand } from '../../../lib/commandParser';

const cmd = (args: string[], flags: Record<string, boolean | string> = {}): ParsedCommand =>
  ({ cmd: 'head', args, flags });

describe('head', () => {
  it('shows first 10 lines by default', () => {
    const output = head(makeState(), cmd(['hello.txt']));
    expect(output).toBe('Hello World\nSecond line\nThird line');
  });

  it('shows specified number of lines', () => {
    const output = head(makeState(), cmd(['hello.txt'], { n: '1' }));
    expect(output).toBe('Hello World');
  });

  it('throws for missing operand', () => {
    expect(() => head(makeState(), cmd([]))).toThrow('missing file operand');
  });

  it('throws for non-existent file', () => {
    expect(() => head(makeState(), cmd(['nonexistent.txt']))).toThrow('No such file');
  });

  it('handles boolean -n flag gracefully (returns default)', () => {
    // When -n is passed without value, flags['n'] is boolean true
    const output = head(makeState(), cmd(['hello.txt'], { n: true }));
    expect(output).toBe('Hello World\nSecond line\nThird line');
  });

  it('throws for directory', () => {
    expect(() => head(makeState(), cmd(['docs']))).toThrow('Is a directory');
  });
});

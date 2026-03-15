import { describe, it, expect } from 'vitest';
import { grep } from '../../../lib/commands/grep';
import { makeState } from '../../fixtures';
import { ParsedCommand } from '../../../lib/commandParser';

const cmd = (args: string[], flags: Record<string, boolean | string> = {}): ParsedCommand =>
  ({ cmd: 'grep', args, flags });

describe('grep', () => {
  it('finds matching lines', () => {
    const output = grep(makeState(), cmd(['Hello', 'hello.txt']));
    expect(output).toBe('Hello World');
  });

  it('returns empty for no matches', () => {
    const output = grep(makeState(), cmd(['zzz', 'hello.txt']));
    expect(output).toBe('');
  });

  it('supports case-insensitive flag', () => {
    const output = grep(makeState(), cmd(['hello', 'hello.txt'], { i: true }));
    expect(output).toBe('Hello World');
  });

  it('throws for missing pattern', () => {
    expect(() => grep(makeState(), cmd([]))).toThrow('missing search pattern');
  });

  it('throws for missing file', () => {
    expect(() => grep(makeState(), cmd(['pattern']))).toThrow('missing file operand');
  });

  it('throws for non-existent file', () => {
    expect(() => grep(makeState(), cmd(['pattern', 'nonexistent.txt']))).toThrow('No such file');
  });

  it('throws for directory', () => {
    expect(() => grep(makeState(), cmd(['pattern', 'docs']))).toThrow('Is a directory');
  });

  it('throws for invalid regex', () => {
    expect(() => grep(makeState(), cmd(['[', 'hello.txt']))).toThrow('Invalid pattern');
  });

  it('uses resolvePath for file lookup', () => {
    const state = makeState({ currentPath: '/home' });
    const output = grep(state, cmd(['Hello', 'user/hello.txt']));
    expect(output).toBe('Hello World');
  });
});

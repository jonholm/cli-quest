import { describe, it, expect } from 'vitest';
import { wc } from '../../../lib/commands/wc';
import { makeState } from '../../fixtures';
import { ParsedCommand } from '../../../lib/commandParser';

const cmd = (args: string[], flags: Record<string, boolean | string> = {}): ParsedCommand =>
  ({ cmd: 'wc', args, flags });

describe('wc', () => {
  it('shows line, word, and char count', () => {
    const output = wc(makeState(), cmd(['hello.txt']));
    // "Hello World\nSecond line\nThird line" = 3 lines, 6 words, 34 chars
    expect(output).toMatch(/3 6 34 hello.txt/);
  });

  it('shows only line count with -l', () => {
    const output = wc(makeState(), cmd(['hello.txt'], { l: true }));
    expect(output).toBe('3 hello.txt');
  });

  it('shows only word count with -w', () => {
    const output = wc(makeState(), cmd(['hello.txt'], { w: true }));
    expect(output).toBe('6 hello.txt');
  });

  it('shows only char count with -c', () => {
    const output = wc(makeState(), cmd(['hello.txt'], { c: true }));
    expect(output).toBe('34 hello.txt');
  });

  it('throws for missing operand', () => {
    expect(() => wc(makeState(), cmd([]))).toThrow('missing file operand');
  });

  it('throws for directory', () => {
    expect(() => wc(makeState(), cmd(['docs']))).toThrow('Is a directory');
  });
});

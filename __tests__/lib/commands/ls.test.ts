import { describe, it, expect } from 'vitest';
import { ls } from '../../../lib/commands/ls';
import { makeState } from '../../fixtures';
import { ParsedCommand } from '../../../lib/commandParser';

const cmd = (args: string[] = [], flags: Record<string, boolean | string> = {}): ParsedCommand =>
  ({ cmd: 'ls', args, flags });

describe('ls', () => {
  it('lists current directory', () => {
    const output = ls(makeState(), cmd());
    expect(output).toContain('hello.txt');
    expect(output).toContain('docs');
  });

  it('lists specified path', () => {
    const output = ls(makeState(), cmd(['/home/user/docs']));
    expect(output).toContain('readme.md');
  });

  it('returns empty string for empty directory', () => {
    const output = ls(makeState(), cmd(['/home/user/empty']));
    expect(output).toBe('');
  });

  it('returns file name for file path', () => {
    const output = ls(makeState(), cmd(['/home/user/hello.txt']));
    expect(output).toBe('hello.txt');
  });

  it('throws for non-existent path', () => {
    expect(() => ls(makeState(), cmd(['/nonexistent']))).toThrow('No such file or directory');
  });

  it('supports long format -l', () => {
    const output = ls(makeState(), cmd([], { l: true }));
    expect(output).toContain('rw-r--r--');
  });
});

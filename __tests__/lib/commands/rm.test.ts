import { describe, it, expect } from 'vitest';
import { rm } from '../../../lib/commands/rm';
import { makeState } from '../../fixtures';
import { getNode } from '../../../lib/fileSystem';
import { ParsedCommand } from '../../../lib/commandParser';

const cmd = (args: string[], flags: Record<string, boolean | string> = {}): ParsedCommand =>
  ({ cmd: 'rm', args, flags });

describe('rm', () => {
  it('removes a file', () => {
    const result = rm(makeState(), cmd(['hello.txt']));
    expect(getNode(result.newFS, '/home/user/hello.txt')).toBeNull();
  });

  it('removes a directory with -r flag', () => {
    const result = rm(makeState(), cmd(['empty'], { r: true }));
    expect(getNode(result.newFS, '/home/user/empty')).toBeNull();
  });

  it('throws without -r for directory', () => {
    expect(() => rm(makeState(), cmd(['docs']))).toThrow('Is a directory');
  });

  it('throws for missing operand', () => {
    expect(() => rm(makeState(), cmd([]))).toThrow('missing operand');
  });

  it('throws for non-existent file', () => {
    expect(() => rm(makeState(), cmd(['nonexistent']))).toThrow('No such file or directory');
  });
});

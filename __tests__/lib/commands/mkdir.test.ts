import { describe, it, expect } from 'vitest';
import { mkdir } from '../../../lib/commands/mkdir';
import { makeState } from '../../fixtures';
import { getNode } from '../../../lib/fileSystem';
import { ParsedCommand } from '../../../lib/commandParser';

const cmd = (args: string[]): ParsedCommand =>
  ({ cmd: 'mkdir', args, flags: {} });

describe('mkdir', () => {
  it('creates a new directory', () => {
    const result = mkdir(makeState(), cmd(['newdir']));
    const node = getNode(result.newFS, '/home/user/newdir');
    expect(node).not.toBeNull();
    expect(node!.type).toBe('directory');
  });

  it('returns empty output', () => {
    const result = mkdir(makeState(), cmd(['newdir']));
    expect(result.output).toBe('');
  });

  it('throws for missing operand', () => {
    expect(() => mkdir(makeState(), cmd([]))).toThrow('missing operand');
  });

  it('throws if directory already exists', () => {
    expect(() => mkdir(makeState(), cmd(['docs']))).toThrow();
  });
});

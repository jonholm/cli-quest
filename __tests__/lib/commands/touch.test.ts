import { describe, it, expect } from 'vitest';
import { touch } from '../../../lib/commands/touch';
import { makeState } from '../../fixtures';
import { getNode } from '../../../lib/fileSystem';
import { ParsedCommand } from '../../../lib/commandParser';

const cmd = (args: string[]): ParsedCommand =>
  ({ cmd: 'touch', args, flags: {} });

describe('touch', () => {
  it('creates a new file', () => {
    const result = touch(makeState(), cmd(['new.txt']));
    const node = getNode(result.newFS, '/home/user/new.txt');
    expect(node).not.toBeNull();
    expect(node!.type).toBe('file');
    expect(node!.content).toBe('');
  });

  it('throws for missing operand', () => {
    expect(() => touch(makeState(), cmd([]))).toThrow('missing file operand');
  });

  it('throws if file already exists', () => {
    expect(() => touch(makeState(), cmd(['hello.txt']))).toThrow();
  });
});

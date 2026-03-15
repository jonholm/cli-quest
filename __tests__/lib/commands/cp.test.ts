import { describe, it, expect } from 'vitest';
import { cp } from '../../../lib/commands/cp';
import { makeState } from '../../fixtures';
import { getNode } from '../../../lib/fileSystem';
import { ParsedCommand } from '../../../lib/commandParser';

const cmd = (args: string[]): ParsedCommand =>
  ({ cmd: 'cp', args, flags: {} });

describe('cp', () => {
  it('copies a file', () => {
    const result = cp(makeState(), cmd(['hello.txt', 'copy.txt']));
    expect(getNode(result.newFS, '/home/user/hello.txt')).not.toBeNull();
    expect(getNode(result.newFS, '/home/user/copy.txt')).not.toBeNull();
    expect(getNode(result.newFS, '/home/user/copy.txt')!.content).toBe('Hello World\nSecond line\nThird line');
  });

  it('throws for missing operand', () => {
    expect(() => cp(makeState(), cmd(['hello.txt']))).toThrow('missing operand');
  });

  it('throws for non-existent source', () => {
    expect(() => cp(makeState(), cmd(['nonexistent', 'dest']))).toThrow('No such file');
  });

  it('throws when destination exists', () => {
    expect(() => cp(makeState(), cmd(['hello.txt', 'data.csv']))).toThrow('File exists');
  });
});

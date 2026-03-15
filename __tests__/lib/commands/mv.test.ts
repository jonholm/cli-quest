import { describe, it, expect } from 'vitest';
import { mv } from '../../../lib/commands/mv';
import { makeState } from '../../fixtures';
import { getNode } from '../../../lib/fileSystem';
import { ParsedCommand } from '../../../lib/commandParser';

const cmd = (args: string[]): ParsedCommand =>
  ({ cmd: 'mv', args, flags: {} });

describe('mv', () => {
  it('moves a file', () => {
    const result = mv(makeState(), cmd(['hello.txt', 'renamed.txt']));
    expect(getNode(result.newFS, '/home/user/hello.txt')).toBeNull();
    expect(getNode(result.newFS, '/home/user/renamed.txt')).not.toBeNull();
  });

  it('throws for missing operand', () => {
    expect(() => mv(makeState(), cmd(['hello.txt']))).toThrow('missing operand');
  });

  it('throws for non-existent source', () => {
    expect(() => mv(makeState(), cmd(['nonexistent', 'dest']))).toThrow('No such file');
  });

  it('throws when destination exists', () => {
    expect(() => mv(makeState(), cmd(['hello.txt', 'data.csv']))).toThrow('File exists');
  });
});

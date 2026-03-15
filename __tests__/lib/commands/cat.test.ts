import { describe, it, expect } from 'vitest';
import { cat } from '../../../lib/commands/cat';
import { makeState } from '../../fixtures';
import { ParsedCommand } from '../../../lib/commandParser';

const cmd = (args: string[]): ParsedCommand =>
  ({ cmd: 'cat', args, flags: {} });

describe('cat', () => {
  it('displays file content', () => {
    const output = cat(makeState(), cmd(['hello.txt']));
    expect(output).toBe('Hello World\nSecond line\nThird line');
  });

  it('throws for missing operand', () => {
    expect(() => cat(makeState(), cmd([]))).toThrow('missing file operand');
  });

  it('throws for non-existent file', () => {
    expect(() => cat(makeState(), cmd(['nonexistent.txt']))).toThrow('No such file or directory');
  });

  it('throws for directory', () => {
    expect(() => cat(makeState(), cmd(['docs']))).toThrow('Is a directory');
  });

  it('returns empty string for file with no content', () => {
    const state = makeState();
    // Create a file with undefined content by modifying the FS
    const userDir = state.fileSystem.children![0].children![0];
    userDir.children!.push({ type: 'file', name: 'empty.txt' });
    const output = cat(state, cmd(['empty.txt']));
    expect(output).toBe('');
  });
});

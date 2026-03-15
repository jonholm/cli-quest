import { describe, it, expect } from 'vitest';
import { find } from '../../../lib/commands/find';
import { makeState } from '../../fixtures';
import { ParsedCommand } from '../../../lib/commandParser';

const cmd = (args: string[] = [], flags: Record<string, boolean | string> = {}): ParsedCommand =>
  ({ cmd: 'find', args, flags });

describe('find', () => {
  it('finds all files and directories', () => {
    const output = find(makeState(), cmd(['.']));
    expect(output).toContain('hello.txt');
    expect(output).toContain('docs');
  });

  it('filters by name pattern', () => {
    const output = find(makeState(), cmd(['.'], { name: '*.txt' }));
    expect(output).toContain('hello.txt');
    expect(output).not.toContain('readme.md');
  });

  it('filters by type file', () => {
    const output = find(makeState(), cmd(['.'], { type: 'f' }));
    expect(output).toContain('hello.txt');
    expect(output).not.toContain('./empty');
  });

  it('filters by type directory', () => {
    const output = find(makeState(), cmd(['.'], { type: 'd' }));
    expect(output).toContain('docs');
    expect(output).not.toContain('hello.txt');
  });

  it('throws for non-existent path', () => {
    expect(() => find(makeState(), cmd(['/nonexistent']))).toThrow('No such file');
  });

  it('handles boolean flag gracefully (no crash)', () => {
    // When -name is passed without a value, flags['name'] is boolean true
    const output = find(makeState(), cmd(['.'], { name: true }));
    // Should not crash — just return all results since namePattern is undefined
    expect(output).toContain('hello.txt');
  });

  it('throws for invalid pattern', () => {
    expect(() => find(makeState(), cmd(['.'], { name: '[' }))).toThrow('Invalid pattern');
  });
});

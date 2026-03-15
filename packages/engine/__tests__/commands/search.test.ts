import { describe, it, expect } from 'vitest';
import { grep, find } from '../../src/commands/search';
import { testFS, defaultEnv } from '../fixtures';
import type { CommandContext } from '../../src/types';

function ctx(overrides: Partial<CommandContext> = {}): CommandContext {
  return {
    args: [],
    stdin: '',
    fs: structuredClone(testFS),
    env: { ...defaultEnv },
    cwd: '/home/user',
    ...overrides,
  };
}

describe('grep', () => {
  it('finds matching lines in file', () => {
    const out = grep(ctx({ args: ['Hello', 'hello.txt'] }));
    expect(out.stdout).toBe('Hello World');
  });

  it('returns empty for no matches', () => {
    const out = grep(ctx({ args: ['zzz', 'hello.txt'] }));
    expect(out.stdout).toBe('');
  });

  it('supports case-insensitive flag', () => {
    const out = grep(ctx({ args: ['-i', 'hello', 'hello.txt'] }));
    expect(out.stdout).toBe('Hello World');
  });

  it('searches stdin when no file', () => {
    const out = grep(ctx({ args: ['Alice'], stdin: 'Alice,30\nBob,25' }));
    expect(out.stdout).toBe('Alice,30');
  });

  it('errors on missing pattern', () => {
    expect(grep(ctx()).exitCode).toBe(1);
  });

  it('errors on missing file operand (no stdin)', () => {
    expect(grep(ctx({ args: ['pattern'] })).exitCode).toBe(1);
  });

  it('errors on non-existent file', () => {
    expect(grep(ctx({ args: ['pat', 'nope.txt'] })).exitCode).toBe(1);
  });

  it('errors on invalid regex', () => {
    expect(grep(ctx({ args: ['[', 'hello.txt'] })).exitCode).toBe(1);
  });
});

describe('find', () => {
  it('finds files by name pattern', () => {
    const out = find(ctx({ args: ['.', '-name', '*.txt'] }));
    expect(out.stdout).toContain('hello.txt');
    expect(out.stdout).not.toContain('readme.md');
  });

  it('filters by type file', () => {
    const out = find(ctx({ args: ['.', '-type', 'f'] }));
    expect(out.stdout).toContain('hello.txt');
    expect(out.stdout).not.toContain('./empty');
  });

  it('filters by type directory', () => {
    const out = find(ctx({ args: ['.', '-type', 'd'] }));
    expect(out.stdout).toContain('docs');
    expect(out.stdout).not.toContain('hello.txt');
  });

  it('errors on non-existent path', () => {
    expect(find(ctx({ args: ['/nonexistent'] })).exitCode).toBe(1);
  });

  it('errors on invalid pattern', () => {
    expect(find(ctx({ args: ['.', '-name', '['] })).exitCode).toBe(1);
  });
});

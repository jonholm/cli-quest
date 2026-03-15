import { describe, it, expect } from 'vitest';
import { head, tail, wc, echo, sort, uniq } from '../../src/commands/text';
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

describe('head', () => {
  it('shows first 10 lines by default', () => {
    const out = head(ctx({ args: ['hello.txt'] }));
    expect(out.stdout).toBe('Hello World\nSecond line\nThird line');
  });

  it('shows specified number of lines', () => {
    const out = head(ctx({ args: ['-n', '1', 'hello.txt'] }));
    expect(out.stdout).toBe('Hello World');
  });

  it('reads from stdin', () => {
    const out = head(ctx({ stdin: 'a\nb\nc', args: ['-n', '2'] }));
    expect(out.stdout).toBe('a\nb');
  });

  it('errors on missing operand', () => {
    expect(head(ctx()).exitCode).toBe(1);
  });
});

describe('tail', () => {
  it('shows last 10 lines by default', () => {
    const out = tail(ctx({ args: ['hello.txt'] }));
    expect(out.stdout).toBe('Hello World\nSecond line\nThird line');
  });

  it('shows specified number of lines', () => {
    const out = tail(ctx({ args: ['-n', '1', 'hello.txt'] }));
    expect(out.stdout).toBe('Third line');
  });

  it('reads from stdin', () => {
    const out = tail(ctx({ stdin: 'a\nb\nc', args: ['-n', '2'] }));
    expect(out.stdout).toBe('b\nc');
  });
});

describe('wc', () => {
  it('shows line, word, char count', () => {
    const out = wc(ctx({ args: ['hello.txt'] }));
    expect(out.stdout).toMatch(/3 6 34 hello.txt/);
  });

  it('shows only lines with -l', () => {
    const out = wc(ctx({ args: ['-l', 'hello.txt'] }));
    expect(out.stdout).toBe('3 hello.txt');
  });

  it('reads from stdin', () => {
    const out = wc(ctx({ stdin: 'a b c', args: ['-w'] }));
    expect(out.stdout).toBe('3');
  });
});

describe('echo', () => {
  it('prints arguments', () => {
    expect(echo(ctx({ args: ['Hello', 'World'] })).stdout).toBe('Hello World');
  });

  it('returns empty for no args', () => {
    expect(echo(ctx()).stdout).toBe('');
  });
});

describe('sort', () => {
  it('sorts lines alphabetically', () => {
    const out = sort(ctx({ stdin: 'banana\napple\ncherry' }));
    expect(out.stdout).toBe('apple\nbanana\ncherry');
  });

  it('sorts in reverse with -r', () => {
    const out = sort(ctx({ args: ['-r'], stdin: 'banana\napple\ncherry' }));
    expect(out.stdout).toBe('cherry\nbanana\napple');
  });

  it('sorts from file', () => {
    const out = sort(ctx({ args: ['data.csv'] }));
    expect(out.stdout.split('\n')[0]).toBe('Alice,30');
  });
});

describe('uniq', () => {
  it('removes adjacent duplicates', () => {
    const out = uniq(ctx({ stdin: 'a\na\nb\nb\na' }));
    expect(out.stdout).toBe('a\nb\na');
  });

  it('counts with -c', () => {
    const out = uniq(ctx({ args: ['-c'], stdin: 'a\na\nb' }));
    expect(out.stdout).toContain('2 a');
    expect(out.stdout).toContain('1 b');
  });
});

import { describe, it, expect } from 'vitest';
import { pwd, ls, cd } from '../../src/commands/navigation';
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

describe('pwd', () => {
  it('returns current directory', () => {
    expect(pwd(ctx()).stdout).toBe('/home/user');
  });

  it('returns root', () => {
    expect(pwd(ctx({ cwd: '/' })).stdout).toBe('/');
  });
});

describe('ls', () => {
  it('lists current directory', () => {
    const out = ls(ctx());
    expect(out.stdout).toContain('hello.txt');
    expect(out.stdout).toContain('docs');
  });

  it('lists specified directory', () => {
    const out = ls(ctx({ args: ['/home/user/docs'] }));
    expect(out.stdout).toContain('readme.md');
  });

  it('returns empty for empty dir', () => {
    const out = ls(ctx({ args: ['/home/user/empty'] }));
    expect(out.stdout).toBe('');
  });

  it('returns file name for file path', () => {
    const out = ls(ctx({ args: ['/home/user/hello.txt'] }));
    expect(out.stdout).toBe('hello.txt');
  });

  it('errors on non-existent path', () => {
    const out = ls(ctx({ args: ['/nope'] }));
    expect(out.exitCode).toBe(1);
    expect(out.stderr).toContain('No such file');
  });

  it('supports -l flag', () => {
    const out = ls(ctx({ args: ['-l'] }));
    expect(out.stdout).toContain('rw-');
  });

  it('filters hidden files by default', () => {
    const fsWithHidden = structuredClone(testFS);
    fsWithHidden.children![0].children![0].children!.push({
      type: 'file',
      name: '.hidden',
      content: '',
      hidden: true,
    });
    const out = ls(ctx({ fs: fsWithHidden }));
    expect(out.stdout).not.toContain('.hidden');
  });

  it('shows hidden files with -a', () => {
    const fsWithHidden = structuredClone(testFS);
    fsWithHidden.children![0].children![0].children!.push({
      type: 'file',
      name: '.hidden',
      content: '',
      hidden: true,
    });
    const out = ls(ctx({ fs: fsWithHidden, args: ['-a'] }));
    expect(out.stdout).toContain('.hidden');
  });
});

describe('cd', () => {
  it('changes to absolute path', () => {
    const out = cd(ctx({ args: ['/home'] }));
    expect(out.cwd).toBe('/home');
  });

  it('changes to relative path', () => {
    const out = cd(ctx({ args: ['docs'] }));
    expect(out.cwd).toBe('/home/user/docs');
  });

  it('defaults to HOME', () => {
    const out = cd(ctx({ cwd: '/' }));
    expect(out.cwd).toBe('/home/user');
  });

  it('errors on non-existent path', () => {
    const out = cd(ctx({ args: ['nonexistent'] }));
    expect(out.exitCode).toBe(1);
  });

  it('errors on file path', () => {
    const out = cd(ctx({ args: ['hello.txt'] }));
    expect(out.exitCode).toBe(1);
    expect(out.stderr).toContain('Not a directory');
  });
});

import { describe, it, expect } from 'vitest';
import { cat, touch, mkdir, rm, cp, mv, chmod } from '../../src/commands/file-ops';
import { getNode } from '../../src/filesystem/operations';
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

describe('cat', () => {
  it('displays file content', () => {
    expect(cat(ctx({ args: ['hello.txt'] })).stdout).toContain('Hello World');
  });

  it('passes through stdin when no args', () => {
    expect(cat(ctx({ stdin: 'piped' })).stdout).toBe('piped');
  });

  it('errors on missing operand', () => {
    expect(cat(ctx()).exitCode).toBe(1);
  });

  it('errors on non-existent file', () => {
    expect(cat(ctx({ args: ['nope.txt'] })).exitCode).toBe(1);
  });

  it('errors on directory', () => {
    expect(cat(ctx({ args: ['docs'] })).exitCode).toBe(1);
  });
});

describe('touch', () => {
  it('creates a new file', () => {
    const out = touch(ctx({ args: ['new.txt'] }));
    expect(out.exitCode).toBe(0);
    expect(getNode(out.fs!, '/home/user/new.txt')?.type).toBe('file');
  });

  it('is a no-op for existing files', () => {
    const out = touch(ctx({ args: ['hello.txt'] }));
    expect(out.exitCode).toBe(0);
    expect(out.fs).toBeUndefined(); // no FS change
  });

  it('errors on missing operand', () => {
    expect(touch(ctx()).exitCode).toBe(1);
  });
});

describe('mkdir', () => {
  it('creates a directory', () => {
    const out = mkdir(ctx({ args: ['newdir'] }));
    expect(out.exitCode).toBe(0);
    expect(getNode(out.fs!, '/home/user/newdir')?.type).toBe('directory');
  });

  it('errors on missing operand', () => {
    expect(mkdir(ctx()).exitCode).toBe(1);
  });

  it('errors if directory exists', () => {
    expect(mkdir(ctx({ args: ['docs'] })).exitCode).toBe(1);
  });
});

describe('rm', () => {
  it('removes a file', () => {
    const out = rm(ctx({ args: ['hello.txt'] }));
    expect(out.exitCode).toBe(0);
    expect(getNode(out.fs!, '/home/user/hello.txt')).toBeNull();
  });

  it('removes directory with -r', () => {
    const out = rm(ctx({ args: ['-r', 'empty'] }));
    expect(out.exitCode).toBe(0);
    expect(getNode(out.fs!, '/home/user/empty')).toBeNull();
  });

  it('errors removing directory without -r', () => {
    const out = rm(ctx({ args: ['docs'] }));
    expect(out.exitCode).toBe(1);
    expect(out.stderr).toContain('Is a directory');
  });

  it('errors on missing operand', () => {
    expect(rm(ctx()).exitCode).toBe(1);
  });

  it('errors on non-existent file', () => {
    expect(rm(ctx({ args: ['nope'] })).exitCode).toBe(1);
  });
});

describe('cp', () => {
  it('copies a file', () => {
    const out = cp(ctx({ args: ['hello.txt', 'copy.txt'] }));
    expect(out.exitCode).toBe(0);
    expect(getNode(out.fs!, '/home/user/copy.txt')?.content).toContain('Hello World');
    expect(getNode(out.fs!, '/home/user/hello.txt')).not.toBeNull();
  });

  it('errors when dest exists', () => {
    const out = cp(ctx({ args: ['hello.txt', 'data.csv'] }));
    expect(out.exitCode).toBe(1);
    expect(out.stderr).toContain('File exists');
  });

  it('errors on missing operand', () => {
    expect(cp(ctx({ args: ['hello.txt'] })).exitCode).toBe(1);
  });

  it('errors on non-existent source', () => {
    expect(cp(ctx({ args: ['nope', 'dest'] })).exitCode).toBe(1);
  });
});

describe('mv', () => {
  it('moves a file', () => {
    const out = mv(ctx({ args: ['hello.txt', 'renamed.txt'] }));
    expect(out.exitCode).toBe(0);
    expect(getNode(out.fs!, '/home/user/hello.txt')).toBeNull();
    expect(getNode(out.fs!, '/home/user/renamed.txt')?.content).toContain('Hello World');
  });

  it('errors when dest exists', () => {
    const out = mv(ctx({ args: ['hello.txt', 'data.csv'] }));
    expect(out.exitCode).toBe(1);
    expect(out.stderr).toContain('File exists');
  });

  it('errors on missing operand', () => {
    expect(mv(ctx({ args: ['hello.txt'] })).exitCode).toBe(1);
  });
});

describe('chmod', () => {
  it('updates file permissions', () => {
    const out = chmod(ctx({ args: ['755', 'hello.txt'] }));
    expect(out.exitCode).toBe(0);
    expect(getNode(out.fs!, '/home/user/hello.txt')?.permissions).toBe('755');
  });

  it('errors on non-existent file', () => {
    const out = chmod(ctx({ args: ['755', 'nope'] }));
    expect(out.exitCode).toBe(1);
  });

  it('errors on missing operand', () => {
    expect(chmod(ctx({ args: ['755'] })).exitCode).toBe(1);
  });
});

import { describe, it, expect } from 'vitest';
import { exportCmd, envCmd } from '../../src/commands/env';
import { defaultEnv } from '../fixtures';
import type { CommandContext } from '../../src/types';
import type { FSNode } from '@cli-quest/shared';

const emptyFS: FSNode = { type: 'directory', name: '', children: [] };

function ctx(overrides: Partial<CommandContext> = {}): CommandContext {
  return {
    args: [],
    stdin: '',
    fs: emptyFS,
    env: { ...defaultEnv },
    cwd: '/home/user',
    ...overrides,
  };
}

describe('export', () => {
  it('sets an env var', () => {
    const out = exportCmd(ctx({ args: ['MYVAR=hello'] }));
    expect(out.exitCode).toBe(0);
    expect(out.env?.MYVAR).toBe('hello');
  });

  it('lists all env vars with no args', () => {
    const out = exportCmd(ctx());
    expect(out.stdout).toContain('HOME=/home/user');
    expect(out.stdout).toContain('USER=user');
  });

  it('errors on invalid assignment', () => {
    const out = exportCmd(ctx({ args: ['NOEQUALS'] }));
    expect(out.exitCode).toBe(1);
  });
});

describe('env', () => {
  it('lists all env vars', () => {
    const out = envCmd(ctx());
    expect(out.stdout).toContain('HOME=/home/user');
  });
});

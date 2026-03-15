import { describe, it, expect } from 'vitest';
import { clear, history, man } from '../../src/commands/system';
import { defaultEnv } from '../fixtures';
import type { CommandContext } from '../../src/types';
import type { FSNode } from '@cli-quest/shared';
import { registerAllCommands } from '../../src/commands';

registerAllCommands();

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

describe('clear', () => {
  it('returns __CLEAR__ signal', () => {
    expect(clear().stdout).toBe('__CLEAR__');
  });
});

describe('history', () => {
  it('returns numbered history', () => {
    const out = history(ctx({ history: ['ls', 'pwd', 'cat file.txt'] }));
    expect(out.stdout).toContain('1  ls');
    expect(out.stdout).toContain('2  pwd');
    expect(out.stdout).toContain('3  cat file.txt');
  });

  it('returns empty for no history', () => {
    expect(history(ctx()).stdout).toBe('');
  });
});

describe('man', () => {
  it('shows help for a command', () => {
    const out = man(ctx({ args: ['ls'] }));
    expect(out.stdout).toContain('list directory contents');
  });

  it('lists all commands with no args', () => {
    const out = man(ctx());
    expect(out.stdout).toContain('Available commands');
    expect(out.stdout).toContain('pwd');
  });

  it('errors on unknown command', () => {
    const out = man(ctx({ args: ['foobar'] }));
    expect(out.exitCode).toBe(1);
  });
});

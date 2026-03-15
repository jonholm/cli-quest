import { describe, it, expect } from 'vitest';
import { execute } from '../../src/shell/executor';
import { getNode } from '../../src/filesystem/operations';
import { testFS, defaultEnv } from '../fixtures';
import { registerAllCommands } from '../../src/commands';

registerAllCommands();

describe('execute', () => {
  it('executes a simple command', () => {
    const result = execute('pwd', structuredClone(testFS), defaultEnv, '/home/user', []);
    expect(result.stdout).toBe('/home/user');
    expect(result.exitCode).toBe(0);
  });

  it('executes a pipeline', () => {
    const result = execute(
      'cat hello.txt | wc -l',
      structuredClone(testFS),
      defaultEnv,
      '/home/user',
      []
    );
    expect(result.stdout.trim()).toBe('3');
  });

  it('executes multi-stage pipeline', () => {
    const result = execute(
      'cat data.csv | grep Alice | wc -l',
      structuredClone(testFS),
      defaultEnv,
      '/home/user',
      []
    );
    expect(result.stdout.trim()).toBe('1');
  });

  it('executes output redirect', () => {
    const result = execute(
      'echo hello > new.txt',
      structuredClone(testFS),
      defaultEnv,
      '/home/user',
      []
    );
    const file = getNode(result.fs, '/home/user/new.txt');
    expect(file?.content).toBe('hello');
  });

  it('executes append redirect', () => {
    const fs = structuredClone(testFS);
    const result1 = execute('echo line1 > out.txt', fs, defaultEnv, '/home/user', []);
    const result2 = execute(
      'echo line2 >> out.txt',
      result1.fs,
      defaultEnv,
      '/home/user',
      []
    );
    expect(getNode(result2.fs, '/home/user/out.txt')?.content).toBe('line1\nline2');
  });

  it('executes input redirect', () => {
    const result = execute(
      'wc -l < hello.txt',
      structuredClone(testFS),
      defaultEnv,
      '/home/user',
      []
    );
    expect(result.stdout.trim()).toContain('3');
  });

  it('executes && chaining (success)', () => {
    const result = execute(
      'mkdir newdir && cd newdir',
      structuredClone(testFS),
      defaultEnv,
      '/home/user',
      []
    );
    expect(result.cwd).toBe('/home/user/newdir');
  });

  it('executes && chaining (failure stops)', () => {
    const result = execute(
      'cd nonexistent && echo yes',
      structuredClone(testFS),
      defaultEnv,
      '/home/user',
      []
    );
    expect(result.stdout).toBe('');
    expect(result.exitCode).not.toBe(0);
  });

  it('executes || chaining (runs on failure)', () => {
    const result = execute(
      'cd nonexistent || echo fallback',
      structuredClone(testFS),
      defaultEnv,
      '/home/user',
      []
    );
    expect(result.stdout).toBe('fallback');
  });

  it('executes ; chaining (always runs)', () => {
    const result = execute(
      'echo first ; echo second',
      structuredClone(testFS),
      defaultEnv,
      '/home/user',
      []
    );
    expect(result.stdout).toBe('second');
  });

  it('expands environment variables', () => {
    const result = execute(
      'echo $HOME',
      structuredClone(testFS),
      defaultEnv,
      '/home/user',
      []
    );
    expect(result.stdout).toBe('/home/user');
  });

  it('expands wildcards', () => {
    const result = execute(
      'echo *.txt',
      structuredClone(testFS),
      defaultEnv,
      '/home/user',
      []
    );
    expect(result.stdout).toContain('hello.txt');
  });

  it('returns error for unknown command', () => {
    const result = execute(
      'foobar',
      structuredClone(testFS),
      defaultEnv,
      '/home/user',
      []
    );
    expect(result.exitCode).toBe(127);
    expect(result.stderr).toContain('command not found');
  });

  it('tracks commands used', () => {
    const result = execute(
      'ls && pwd',
      structuredClone(testFS),
      defaultEnv,
      '/home/user',
      []
    );
    expect(result.commandsUsed).toContain('ls');
    expect(result.commandsUsed).toContain('pwd');
  });
});

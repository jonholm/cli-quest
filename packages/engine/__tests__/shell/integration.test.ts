import { describe, it, expect } from 'vitest';
import { createShell } from '../../src/shell/shell';
import { testFS, defaultEnv } from '../fixtures';

describe('createShell (integration)', () => {
  function makeShell() {
    return createShell({
      filesystem: structuredClone(testFS),
      env: { ...defaultEnv },
      cwd: '/home/user',
    });
  }

  it('executes a simple command', () => {
    const shell = makeShell();
    const result = shell.execute('pwd');
    expect(result.stdout).toBe('/home/user');
  });

  it('maintains state across executions', () => {
    const shell = makeShell();
    shell.execute('cd docs');
    const r2 = shell.execute('pwd');
    expect(r2.stdout).toBe('/home/user/docs');
  });

  it('supports pipes', () => {
    const shell = makeShell();
    const result = shell.execute('cat data.csv | grep Alice');
    expect(result.stdout).toContain('Alice');
  });

  it('supports output redirect', () => {
    const shell = makeShell();
    shell.execute('echo "test content" > newfile.txt');
    const result = shell.execute('cat newfile.txt');
    expect(result.stdout).toBe('test content');
  });

  it('supports append redirect', () => {
    const shell = makeShell();
    shell.execute('echo line1 > out.txt');
    shell.execute('echo line2 >> out.txt');
    const result = shell.execute('cat out.txt');
    expect(result.stdout).toBe('line1\nline2');
  });

  it('supports input redirect', () => {
    const shell = makeShell();
    const result = shell.execute('wc -l < hello.txt');
    expect(result.stdout.trim()).toContain('3');
  });

  it('supports env vars', () => {
    const shell = makeShell();
    shell.execute('export MYVAR=hello');
    const result = shell.execute('echo $MYVAR');
    expect(result.stdout).toBe('hello');
  });

  it('supports && chaining', () => {
    const shell = makeShell();
    shell.execute('mkdir newdir && cd newdir');
    const result = shell.execute('pwd');
    expect(result.stdout).toBe('/home/user/newdir');
  });

  it('supports || chaining', () => {
    const shell = makeShell();
    const result = shell.execute('cd nonexistent || echo fallback');
    expect(result.stdout).toBe('fallback');
  });

  it('supports wildcards', () => {
    const shell = makeShell();
    const result = shell.execute('echo *.txt');
    expect(result.stdout).toContain('hello.txt');
  });

  it('tracks command history', () => {
    const shell = makeShell();
    shell.execute('pwd');
    shell.execute('ls');
    expect(shell.historyUp()).toBe('ls');
    expect(shell.historyUp()).toBe('pwd');
    expect(shell.historyDown()).toBe('ls');
    expect(shell.historyDown()).toBeNull();
  });

  it('provides tab completion for commands', () => {
    const shell = makeShell();
    const completions = shell.complete('pw', 2);
    expect(completions).toContain('pwd');
  });

  it('provides tab completion for files', () => {
    const shell = makeShell();
    const completions = shell.complete('cat he', 6);
    expect(completions).toContain('hello.txt');
  });

  it('tracks commands used for validation', () => {
    const shell = makeShell();
    shell.execute('ls');
    shell.execute('cat hello.txt');
    expect(shell.getCommandsUsed()).toContain('ls');
    expect(shell.getCommandsUsed()).toContain('cat');
  });

  it('getState returns current state', () => {
    const shell = makeShell();
    shell.execute('cd docs');
    const state = shell.getState();
    expect(state.cwd).toBe('/home/user/docs');
    expect(state.env.PWD).toBe('/home/user/docs');
  });

  it('handles complex pipeline: sort | uniq', () => {
    const shell = makeShell();
    shell.execute('echo "b\na\nb\nc\na" > test.txt');
    const result = shell.execute('cat test.txt | sort | uniq');
    const lines = result.stdout.split('\n');
    expect(lines).toEqual(['a', 'b', 'c']);
  });

  it('handles errors gracefully', () => {
    const shell = makeShell();
    const result = shell.execute('cat nonexistent.txt');
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain('No such file');
  });
});

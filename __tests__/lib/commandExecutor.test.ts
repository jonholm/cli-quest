import { describe, it, expect } from 'vitest';
import { executeCommand } from '../../lib/commandExecutor';
import { makeState } from '../fixtures';

describe('executeCommand', () => {
  it('returns empty output for empty input', () => {
    const result = executeCommand('', makeState());
    expect(result.output).toBe('');
    expect(result.isError).toBe(false);
  });

  it('routes to pwd', () => {
    const result = executeCommand('pwd', makeState());
    expect(result.output).toBe('/home/user');
    expect(result.isError).toBe(false);
  });

  it('routes to ls', () => {
    const result = executeCommand('ls', makeState());
    expect(result.output).toContain('hello.txt');
  });

  it('routes to cd and returns newState', () => {
    const result = executeCommand('cd docs', makeState());
    expect(result.newState?.currentPath).toBe('/home/user/docs');
  });

  it('routes to cat', () => {
    const result = executeCommand('cat hello.txt', makeState());
    expect(result.output).toContain('Hello World');
  });

  it('routes to mkdir and returns new fileSystem', () => {
    const result = executeCommand('mkdir newdir', makeState());
    expect(result.newState?.fileSystem).toBeDefined();
  });

  it('returns error for unknown command', () => {
    const result = executeCommand('foobar', makeState());
    expect(result.isError).toBe(true);
    expect(result.output).toContain('Command not found: foobar');
  });

  it('returns error for command errors', () => {
    const result = executeCommand('cat nonexistent.txt', makeState());
    expect(result.isError).toBe(true);
    expect(result.output).toContain('No such file');
  });

  it('handles clear command', () => {
    const result = executeCommand('clear', makeState());
    expect(result.output).toBe('__CLEAR__');
  });
});

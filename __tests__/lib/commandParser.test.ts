import { describe, it, expect } from 'vitest';
import { parseCommand } from '../../lib/commandParser';

describe('parseCommand', () => {
  it('returns empty cmd for empty input', () => {
    const result = parseCommand('');
    expect(result.cmd).toBe('');
    expect(result.args).toEqual([]);
    expect(result.flags).toEqual({});
  });

  it('returns empty cmd for whitespace-only input', () => {
    const result = parseCommand('   ');
    expect(result.cmd).toBe('');
  });

  it('parses simple command', () => {
    const result = parseCommand('pwd');
    expect(result.cmd).toBe('pwd');
    expect(result.args).toEqual([]);
  });

  it('parses command with args', () => {
    const result = parseCommand('cat file.txt');
    expect(result.cmd).toBe('cat');
    expect(result.args).toEqual(['file.txt']);
  });

  it('parses command with multiple args', () => {
    const result = parseCommand('cp src.txt dest.txt');
    expect(result.cmd).toBe('cp');
    expect(result.args).toEqual(['src.txt', 'dest.txt']);
  });

  it('parses boolean flag', () => {
    const result = parseCommand('ls -l');
    expect(result.flags).toEqual({ l: true });
  });

  it('parses flag with value', () => {
    const result = parseCommand('head -n 5');
    expect(result.flags).toEqual({ n: '5' });
  });

  it('parses mixed args and flags', () => {
    // Parser treats next non-flag token as value for -i
    const result = parseCommand('grep -i pattern file.txt');
    expect(result.cmd).toBe('grep');
    expect(result.flags).toEqual({ i: 'pattern' });
    expect(result.args).toEqual(['file.txt']);
  });

  it('parses boolean flag before another flag', () => {
    const result = parseCommand('find . -name test -type f');
    expect(result.flags).toEqual({ name: 'test', type: 'f' });
    expect(result.args).toEqual(['.']);
  });

  it('handles double-dash flags', () => {
    const result = parseCommand('find . --name test');
    expect(result.flags).toEqual({ name: 'test' });
  });
});

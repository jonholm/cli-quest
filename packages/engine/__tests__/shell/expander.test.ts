import { describe, it, expect } from 'vitest';
import { expandWord, expandArgs } from '../../src/shell/expander';
import { testFS, defaultEnv } from '../fixtures';

describe('expandWord', () => {
  it('expands $VAR', () => {
    expect(expandWord('$HOME', defaultEnv)).toBe('/home/user');
  });

  it('expands ${VAR}', () => {
    expect(expandWord('${USER}', defaultEnv)).toBe('user');
  });

  it('leaves undefined vars empty', () => {
    expect(expandWord('$NOPE', defaultEnv)).toBe('');
  });

  it('expands vars within strings', () => {
    expect(expandWord('hello $USER bye', defaultEnv)).toBe('hello user bye');
  });

  it('expands tilde', () => {
    expect(expandWord('~/docs', defaultEnv)).toBe('/home/user/docs');
  });

  it('expands multiple vars', () => {
    expect(expandWord('$USER@$HOME', defaultEnv)).toBe('user@/home/user');
  });
});

describe('expandArgs', () => {
  it('expands glob patterns', () => {
    const result = expandArgs(['*.txt'], testFS, '/home/user', defaultEnv);
    expect(result).toContain('hello.txt');
    expect(result).not.toContain('data.csv');
  });

  it('leaves non-glob args unchanged', () => {
    const result = expandArgs(['hello.txt'], testFS, '/home/user', defaultEnv);
    expect(result).toEqual(['hello.txt']);
  });

  it('expands env vars before glob', () => {
    const result = expandArgs(['$HOME'], testFS, '/', defaultEnv);
    expect(result).toEqual(['/home/user']);
  });
});

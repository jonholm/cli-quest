import { describe, it, expect } from 'vitest';
import { matchGlob, expandGlob } from '../../src/filesystem/glob';
import { testFS } from '../fixtures';

describe('matchGlob', () => {
  it('matches * wildcard', () => {
    expect(matchGlob('hello.txt', '*.txt')).toBe(true);
    expect(matchGlob('hello.md', '*.txt')).toBe(false);
  });

  it('matches ? wildcard', () => {
    expect(matchGlob('a.txt', '?.txt')).toBe(true);
    expect(matchGlob('ab.txt', '?.txt')).toBe(false);
  });

  it('matches exact strings', () => {
    expect(matchGlob('hello.txt', 'hello.txt')).toBe(true);
    expect(matchGlob('hello.txt', 'other.txt')).toBe(false);
  });

  it('matches complex patterns', () => {
    expect(matchGlob('test_file.log', 'test_*.log')).toBe(true);
    expect(matchGlob('test_file.txt', 'test_*.log')).toBe(false);
  });
});

describe('expandGlob', () => {
  it('expands *.txt in /home/user', () => {
    const results = expandGlob(testFS, '/home/user', '*.txt');
    expect(results).toContain('hello.txt');
    expect(results).not.toContain('docs');
  });

  it('expands *.csv in /home/user', () => {
    const results = expandGlob(testFS, '/home/user', '*.csv');
    expect(results).toEqual(['data.csv']);
  });

  it('returns pattern unchanged if no matches', () => {
    const results = expandGlob(testFS, '/home/user', '*.xyz');
    expect(results).toEqual(['*.xyz']);
  });

  it('returns non-glob patterns unchanged', () => {
    const results = expandGlob(testFS, '/home/user', 'hello.txt');
    expect(results).toEqual(['hello.txt']);
  });

  it('expands path-based globs', () => {
    const results = expandGlob(testFS, '/', 'home/user/*.txt');
    expect(results).toContain('home/user/hello.txt');
  });
});

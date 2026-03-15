import { describe, it, expect } from 'vitest';
import { tokenize } from '../../src/parser/tokenizer';

describe('tokenize', () => {
  it('tokenizes a simple command', () => {
    expect(tokenize('ls')).toEqual([{ type: 'word', value: 'ls' }]);
  });

  it('tokenizes command with args', () => {
    const tokens = tokenize('cat file.txt');
    expect(tokens).toEqual([
      { type: 'word', value: 'cat' },
      { type: 'word', value: 'file.txt' },
    ]);
  });

  it('tokenizes pipe', () => {
    const tokens = tokenize('grep err log | wc -l');
    expect(tokens).toEqual([
      { type: 'word', value: 'grep' },
      { type: 'word', value: 'err' },
      { type: 'word', value: 'log' },
      { type: 'pipe' },
      { type: 'word', value: 'wc' },
      { type: 'word', value: '-l' },
    ]);
  });

  it('tokenizes redirect operators', () => {
    expect(tokenize('echo hi > out.txt')).toContainEqual({ type: 'redirect_out' });
    expect(tokenize('echo hi >> out.txt')).toContainEqual({ type: 'redirect_append' });
    expect(tokenize('wc < in.txt')).toContainEqual({ type: 'redirect_in' });
  });

  it('tokenizes && and || and ;', () => {
    expect(tokenize('a && b')).toContainEqual({ type: 'and' });
    expect(tokenize('a || b')).toContainEqual({ type: 'or' });
    expect(tokenize('a ; b')).toContainEqual({ type: 'semicolon' });
  });

  it('handles double-quoted strings', () => {
    const tokens = tokenize('echo "hello world"');
    expect(tokens).toEqual([
      { type: 'word', value: 'echo' },
      { type: 'word', value: 'hello world' },
    ]);
  });

  it('handles single-quoted strings', () => {
    const tokens = tokenize("echo 'hello world'");
    expect(tokens).toEqual([
      { type: 'word', value: 'echo' },
      { type: 'word', value: 'hello world' },
    ]);
  });

  it('handles empty input', () => {
    expect(tokenize('')).toEqual([]);
    expect(tokenize('   ')).toEqual([]);
  });

  it('handles escaped characters', () => {
    const tokens = tokenize('echo hello\\ world');
    expect(tokens).toEqual([
      { type: 'word', value: 'echo' },
      { type: 'word', value: 'hello world' },
    ]);
  });

  it('handles multiple spaces between tokens', () => {
    const tokens = tokenize('ls   -la   /home');
    expect(tokens).toEqual([
      { type: 'word', value: 'ls' },
      { type: 'word', value: '-la' },
      { type: 'word', value: '/home' },
    ]);
  });
});

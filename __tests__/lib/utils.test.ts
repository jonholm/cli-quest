import { describe, it, expect } from 'vitest';
import { safeRegex, parseLineCount } from '../../lib/utils';

describe('safeRegex', () => {
  it('creates a valid regex', () => {
    const regex = safeRegex('hello');
    expect(regex.test('hello world')).toBe(true);
  });

  it('supports flags', () => {
    const regex = safeRegex('hello', 'i');
    expect(regex.test('HELLO')).toBe(true);
  });

  it('throws on invalid pattern', () => {
    expect(() => safeRegex('[')).toThrow('Invalid pattern');
  });

  it('throws on pattern exceeding max length', () => {
    const longPattern = 'a'.repeat(101);
    expect(() => safeRegex(longPattern)).toThrow('Pattern too long');
  });

  it('accepts pattern at max length', () => {
    const pattern = 'a'.repeat(100);
    expect(() => safeRegex(pattern)).not.toThrow();
  });
});

describe('parseLineCount', () => {
  it('returns default for undefined', () => {
    expect(parseLineCount(undefined, 10)).toBe(10);
  });

  it('returns default for boolean true', () => {
    expect(parseLineCount(true, 10)).toBe(10);
  });

  it('returns default for boolean false', () => {
    expect(parseLineCount(false, 10)).toBe(10);
  });

  it('parses valid string number', () => {
    expect(parseLineCount('5', 10)).toBe(5);
  });

  it('throws on non-numeric string', () => {
    expect(() => parseLineCount('abc', 10)).toThrow('Invalid line count');
  });

  it('throws on zero', () => {
    expect(() => parseLineCount('0', 10)).toThrow('Invalid line count');
  });

  it('throws on negative number', () => {
    expect(() => parseLineCount('-1', 10)).toThrow('Invalid line count');
  });
});

import { MAX_REGEX_LENGTH } from './constants';

export function safeRegex(pattern: string, flags?: string): RegExp {
  if (pattern.length > MAX_REGEX_LENGTH) {
    throw new Error(`Pattern too long (max ${MAX_REGEX_LENGTH} characters)`);
  }

  try {
    return new RegExp(pattern, flags);
  } catch {
    throw new Error(`Invalid pattern: ${pattern}`);
  }
}

export function parseLineCount(flag: string | boolean | undefined, defaultCount: number): number {
  if (flag === undefined || typeof flag === 'boolean') return defaultCount;
  const n = parseInt(flag, 10);
  if (isNaN(n) || n < 1) throw new Error('Invalid line count');
  return n;
}

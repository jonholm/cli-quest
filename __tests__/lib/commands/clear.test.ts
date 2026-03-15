import { describe, it, expect } from 'vitest';
import { clear } from '../../../lib/commands/clear';

describe('clear', () => {
  it('returns __CLEAR__ signal', () => {
    expect(clear()).toBe('__CLEAR__');
  });
});

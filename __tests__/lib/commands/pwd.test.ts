import { describe, it, expect } from 'vitest';
import { pwd } from '../../../lib/commands/pwd';
import { makeState } from '../../fixtures';

describe('pwd', () => {
  it('returns current path', () => {
    expect(pwd(makeState())).toBe('/home/user');
  });

  it('returns root path', () => {
    expect(pwd(makeState({ currentPath: '/' }))).toBe('/');
  });
});

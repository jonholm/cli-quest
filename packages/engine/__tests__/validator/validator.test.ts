import { describe, it, expect } from 'vitest';
import { validate } from '../../src/validator/validator';
import { testFS, defaultEnv } from '../fixtures';
import type { ValidatorConfig, ValidationState } from '@cli-quest/shared';

function state(overrides: Partial<ValidationState> = {}): ValidationState {
  return {
    fs: structuredClone(testFS),
    cwd: '/home/user',
    env: { ...defaultEnv },
    lastOutput: '',
    commandsUsed: [],
    ...overrides,
  };
}

describe('validate', () => {
  it('passes fileExists when file exists', () => {
    const config: ValidatorConfig = { type: 'fileExists', path: '/home/user/hello.txt' };
    expect(validate(config, state())).toBe(true);
  });

  it('fails fileExists when file missing', () => {
    const config: ValidatorConfig = { type: 'fileExists', path: '/nope' };
    expect(validate(config, state())).toBe(false);
  });

  it('passes fileNotExists when file missing', () => {
    const config: ValidatorConfig = { type: 'fileNotExists', path: '/nope' };
    expect(validate(config, state())).toBe(true);
  });

  it('fails fileNotExists when file exists', () => {
    const config: ValidatorConfig = {
      type: 'fileNotExists',
      path: '/home/user/hello.txt',
    };
    expect(validate(config, state())).toBe(false);
  });

  it('passes fileContains', () => {
    const config: ValidatorConfig = {
      type: 'fileContains',
      path: '/home/user/hello.txt',
      substring: 'Hello',
    };
    expect(validate(config, state())).toBe(true);
  });

  it('fails fileContains when substring missing', () => {
    const config: ValidatorConfig = {
      type: 'fileContains',
      path: '/home/user/hello.txt',
      substring: 'NOPE',
    };
    expect(validate(config, state())).toBe(false);
  });

  it('passes fileNotContains', () => {
    const config: ValidatorConfig = {
      type: 'fileNotContains',
      path: '/home/user/hello.txt',
      substring: 'NOPE',
    };
    expect(validate(config, state())).toBe(true);
  });

  it('passes directoryContains', () => {
    const config: ValidatorConfig = {
      type: 'directoryContains',
      path: '/home/user',
      childName: 'hello.txt',
    };
    expect(validate(config, state())).toBe(true);
  });

  it('passes currentPath', () => {
    const config: ValidatorConfig = { type: 'currentPath', path: '/home/user' };
    expect(validate(config, state())).toBe(true);
  });

  it('passes commandUsed', () => {
    const config: ValidatorConfig = { type: 'commandUsed', command: 'grep' };
    expect(validate(config, state({ commandsUsed: ['ls', 'grep'] }))).toBe(true);
  });

  it('fails commandUsed when not used', () => {
    const config: ValidatorConfig = { type: 'commandUsed', command: 'grep' };
    expect(validate(config, state({ commandsUsed: ['ls'] }))).toBe(false);
  });

  it('passes outputContains', () => {
    const config: ValidatorConfig = { type: 'outputContains', substring: 'found' };
    expect(validate(config, state({ lastOutput: 'file found here' }))).toBe(true);
  });

  it('passes envVar', () => {
    const config: ValidatorConfig = { type: 'envVar', name: 'USER', value: 'user' };
    expect(validate(config, state())).toBe(true);
  });

  it('passes all combinator', () => {
    const config: ValidatorConfig = {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/hello.txt' },
        { type: 'currentPath', path: '/home/user' },
      ],
    };
    expect(validate(config, state())).toBe(true);
  });

  it('fails all if any condition fails', () => {
    const config: ValidatorConfig = {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/hello.txt' },
        { type: 'fileExists', path: '/nope' },
      ],
    };
    expect(validate(config, state())).toBe(false);
  });

  it('passes any combinator', () => {
    const config: ValidatorConfig = {
      type: 'any',
      conditions: [
        { type: 'fileExists', path: '/nope' },
        { type: 'currentPath', path: '/home/user' },
      ],
    };
    expect(validate(config, state())).toBe(true);
  });

  it('handles nested combinators', () => {
    const config: ValidatorConfig = {
      type: 'all',
      conditions: [
        {
          type: 'any',
          conditions: [
            { type: 'commandUsed', command: 'grep' },
            { type: 'commandUsed', command: 'find' },
          ],
        },
        { type: 'fileExists', path: '/home/user/hello.txt' },
      ],
    };
    expect(validate(config, state({ commandsUsed: ['find'] }))).toBe(true);
    expect(validate(config, state({ commandsUsed: ['ls'] }))).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import { complete } from '../../src/shell/completion';
import { testFS, defaultEnv } from '../fixtures';
import { registerAllCommands } from '../../src/commands';

registerAllCommands();

describe('complete', () => {
  it('completes command names', () => {
    const results = complete('pw', 2, testFS, '/home/user', defaultEnv);
    expect(results).toContain('pwd');
  });

  it('completes file paths', () => {
    const results = complete('cat he', 6, testFS, '/home/user', defaultEnv);
    expect(results).toContain('hello.txt');
  });

  it('completes directory paths with trailing /', () => {
    const results = complete('cd do', 5, testFS, '/home/user', defaultEnv);
    expect(results).toContain('docs/');
  });

  it('returns empty for no matches', () => {
    const results = complete('cat zzz', 7, testFS, '/home/user', defaultEnv);
    expect(results).toEqual([]);
  });

  it('completes multiple commands starting with same prefix', () => {
    const results = complete('e', 1, testFS, '/home/user', defaultEnv);
    expect(results).toContain('echo');
    expect(results).toContain('env');
    expect(results).toContain('export');
  });
});

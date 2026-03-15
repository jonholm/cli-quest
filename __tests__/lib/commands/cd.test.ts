import { describe, it, expect } from 'vitest';
import { cd } from '../../../lib/commands/cd';
import { makeState } from '../../fixtures';
import { ParsedCommand } from '../../../lib/commandParser';

const cmd = (args: string[] = []): ParsedCommand =>
  ({ cmd: 'cd', args, flags: {} });

describe('cd', () => {
  it('defaults to /home/user with no args', () => {
    const result = cd(makeState({ currentPath: '/' }), cmd());
    expect(result.newPath).toBe('/home/user');
  });

  it('navigates to absolute path', () => {
    const result = cd(makeState(), cmd(['/home']));
    expect(result.newPath).toBe('/home');
  });

  it('navigates to relative path', () => {
    const result = cd(makeState(), cmd(['docs']));
    expect(result.newPath).toBe('/home/user/docs');
  });

  it('navigates up with ..', () => {
    const result = cd(makeState(), cmd(['..']));
    expect(result.newPath).toBe('/home');
  });

  it('throws for non-existent path', () => {
    expect(() => cd(makeState(), cmd(['nonexistent']))).toThrow('No such file or directory');
  });

  it('throws for file path', () => {
    expect(() => cd(makeState(), cmd(['hello.txt']))).toThrow('Not a directory');
  });
});

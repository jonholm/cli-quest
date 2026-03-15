import type { FSNode, Env } from '@cli-quest/shared';
import { expandGlob } from '../filesystem/glob';

export function expandWord(word: string, env: Env): string {
  // Expand tilde
  if (word.startsWith('~')) {
    word = (env.HOME || '/home/user') + word.slice(1);
  }

  // Expand ${VAR} and $VAR
  word = word.replace(/\$\{([^}]+)\}/g, (_, name) => env[name] || '');
  word = word.replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (_, name) => env[name] || '');

  return word;
}

export function expandArgs(
  args: string[],
  fs: FSNode,
  cwd: string,
  env: Env
): string[] {
  const result: string[] = [];
  for (const arg of args) {
    const expanded = expandWord(arg, env);
    if (expanded.includes('*') || expanded.includes('?')) {
      result.push(...expandGlob(fs, cwd, expanded));
    } else {
      result.push(expanded);
    }
  }
  return result;
}

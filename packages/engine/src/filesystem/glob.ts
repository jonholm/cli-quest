import type { FSNode } from '@cli-quest/shared';
import { getNode } from './operations';

export function matchGlob(name: string, pattern: string): boolean {
  const regex = globToRegex(pattern);
  return regex.test(name);
}

function globToRegex(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  return new RegExp(`^${escaped}$`);
}

export function expandGlob(fs: FSNode, cwd: string, pattern: string): string[] {
  const lastSlash = pattern.lastIndexOf('/');
  const dirPart = lastSlash >= 0 ? pattern.slice(0, lastSlash) : '';
  const filePart = lastSlash >= 0 ? pattern.slice(lastSlash + 1) : pattern;

  if (!filePart.includes('*') && !filePart.includes('?')) {
    return [pattern];
  }

  const searchDir = dirPart
    ? dirPart.startsWith('/')
      ? dirPart
      : cwd + '/' + dirPart
    : cwd;

  const dirNode = getNode(fs, searchDir);
  if (!dirNode || dirNode.type !== 'directory' || !dirNode.children) {
    return [pattern];
  }

  const matches = dirNode.children
    .filter((child) => matchGlob(child.name, filePart))
    .map((child) => (dirPart ? dirPart + '/' + child.name : child.name));

  return matches.length > 0 ? matches.sort() : [pattern];
}

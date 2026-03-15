import type { FSNode, Env } from '@cli-quest/shared';
import { getNode, resolvePath } from '../filesystem/operations';
import { getRegisteredCommands } from '../commands/registry';

export function complete(
  input: string,
  cursorPos: number,
  fs: FSNode,
  cwd: string,
  env: Env
): string[] {
  const textBeforeCursor = input.slice(0, cursorPos);
  const parts = textBeforeCursor.split(/\s+/);

  if (parts.length <= 1) {
    // Completing a command name
    const prefix = parts[0] || '';
    return getRegisteredCommands().filter((cmd) => cmd.startsWith(prefix));
  }

  // Completing an argument (file/directory path)
  const partial = parts[parts.length - 1];

  // Split into directory part and filename prefix
  const lastSlash = partial.lastIndexOf('/');
  let dirPath: string;
  let prefix: string;

  if (lastSlash >= 0) {
    const dirPart = partial.slice(0, lastSlash) || '/';
    dirPath = resolvePath(cwd, dirPart, env.HOME);
    prefix = partial.slice(lastSlash + 1);
  } else {
    dirPath = cwd;
    prefix = partial;
  }

  const dirNode = getNode(fs, dirPath);
  if (!dirNode || dirNode.type !== 'directory' || !dirNode.children) {
    return [];
  }

  return dirNode.children
    .filter((child) => child.name.startsWith(prefix))
    .map((child) => {
      const name = child.name;
      return child.type === 'directory' ? name + '/' : name;
    })
    .sort();
}

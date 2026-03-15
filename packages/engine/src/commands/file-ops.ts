import type { CommandContext, CommandOutput } from '../types';
import {
  getNode,
  resolvePath,
  createNode,
  deleteNode,
  cloneFS,
} from '../filesystem/operations';

export function cat(ctx: CommandContext): CommandOutput {
  if (ctx.args.length === 0) {
    // If stdin available, output it (for piping)
    if (ctx.stdin) return { stdout: ctx.stdin, stderr: '', exitCode: 0 };
    return { stdout: '', stderr: 'cat: missing file operand', exitCode: 1 };
  }

  const targetPath = resolvePath(ctx.cwd, ctx.args[0], ctx.env.HOME);
  const node = getNode(ctx.fs, targetPath);

  if (!node) {
    return { stdout: '', stderr: `cat: ${ctx.args[0]}: No such file or directory`, exitCode: 1 };
  }
  if (node.type === 'directory') {
    return { stdout: '', stderr: `cat: ${ctx.args[0]}: Is a directory`, exitCode: 1 };
  }

  return { stdout: node.content || '', stderr: '', exitCode: 0 };
}

export function touch(ctx: CommandContext): CommandOutput {
  if (ctx.args.length === 0) {
    return { stdout: '', stderr: 'touch: missing file operand', exitCode: 1 };
  }

  const targetPath = resolvePath(ctx.cwd, ctx.args[0], ctx.env.HOME);
  const existing = getNode(ctx.fs, targetPath);
  if (existing) {
    // File already exists, touch just updates timestamp (no-op in our virtual FS)
    return { stdout: '', stderr: '', exitCode: 0 };
  }

  try {
    const newFS = createNode(ctx.fs, targetPath, { type: 'file', name: '', content: '' });
    return { stdout: '', stderr: '', exitCode: 0, fs: newFS };
  } catch (error) {
    return { stdout: '', stderr: `touch: cannot create '${ctx.args[0]}': ${(error as Error).message}`, exitCode: 1 };
  }
}

export function mkdir(ctx: CommandContext): CommandOutput {
  if (ctx.args.length === 0) {
    return { stdout: '', stderr: 'mkdir: missing operand', exitCode: 1 };
  }

  const targetPath = resolvePath(ctx.cwd, ctx.args[0], ctx.env.HOME);
  try {
    const newFS = createNode(ctx.fs, targetPath, { type: 'directory', name: '', children: [] });
    return { stdout: '', stderr: '', exitCode: 0, fs: newFS };
  } catch (error) {
    return { stdout: '', stderr: `mkdir: cannot create directory '${ctx.args[0]}': ${(error as Error).message}`, exitCode: 1 };
  }
}

export function rm(ctx: CommandContext): CommandOutput {
  const flags = new Set<string>();
  const paths: string[] = [];
  for (const arg of ctx.args) {
    if (arg.startsWith('-')) {
      for (const ch of arg.slice(1)) flags.add(ch);
    } else {
      paths.push(arg);
    }
  }

  if (paths.length === 0) {
    return { stdout: '', stderr: 'rm: missing operand', exitCode: 1 };
  }

  const targetPath = resolvePath(ctx.cwd, paths[0], ctx.env.HOME);
  const node = getNode(ctx.fs, targetPath);

  if (!node) {
    return { stdout: '', stderr: `rm: cannot remove '${paths[0]}': No such file or directory`, exitCode: 1 };
  }

  if (node.type === 'directory' && !flags.has('r')) {
    return { stdout: '', stderr: `rm: cannot remove '${paths[0]}': Is a directory (use -r)`, exitCode: 1 };
  }

  try {
    const newFS = deleteNode(ctx.fs, targetPath);
    return { stdout: '', stderr: '', exitCode: 0, fs: newFS };
  } catch (error) {
    return { stdout: '', stderr: `rm: ${(error as Error).message}`, exitCode: 1 };
  }
}

export function cp(ctx: CommandContext): CommandOutput {
  if (ctx.args.length < 2) {
    return { stdout: '', stderr: 'cp: missing operand', exitCode: 1 };
  }

  const sourcePath = resolvePath(ctx.cwd, ctx.args[0], ctx.env.HOME);
  const destPath = resolvePath(ctx.cwd, ctx.args[1], ctx.env.HOME);
  const sourceNode = getNode(ctx.fs, sourcePath);

  if (!sourceNode) {
    return { stdout: '', stderr: `cp: cannot stat '${ctx.args[0]}': No such file or directory`, exitCode: 1 };
  }

  const existingDest = getNode(ctx.fs, destPath);
  if (existingDest) {
    return { stdout: '', stderr: `cp: cannot copy to '${ctx.args[1]}': File exists`, exitCode: 1 };
  }

  try {
    const newFS = createNode(ctx.fs, destPath, cloneFS(sourceNode));
    return { stdout: '', stderr: '', exitCode: 0, fs: newFS };
  } catch (error) {
    return { stdout: '', stderr: `cp: ${(error as Error).message}`, exitCode: 1 };
  }
}

export function mv(ctx: CommandContext): CommandOutput {
  if (ctx.args.length < 2) {
    return { stdout: '', stderr: 'mv: missing operand', exitCode: 1 };
  }

  const sourcePath = resolvePath(ctx.cwd, ctx.args[0], ctx.env.HOME);
  const destPath = resolvePath(ctx.cwd, ctx.args[1], ctx.env.HOME);
  const sourceNode = getNode(ctx.fs, sourcePath);

  if (!sourceNode) {
    return { stdout: '', stderr: `mv: cannot stat '${ctx.args[0]}': No such file or directory`, exitCode: 1 };
  }

  const existingDest = getNode(ctx.fs, destPath);
  if (existingDest) {
    return { stdout: '', stderr: `mv: cannot move to '${ctx.args[1]}': File exists`, exitCode: 1 };
  }

  try {
    let newFS = deleteNode(ctx.fs, sourcePath);
    newFS = createNode(newFS, destPath, sourceNode);
    return { stdout: '', stderr: '', exitCode: 0, fs: newFS };
  } catch (error) {
    return { stdout: '', stderr: `mv: ${(error as Error).message}`, exitCode: 1 };
  }
}

export function chmod(ctx: CommandContext): CommandOutput {
  if (ctx.args.length < 2) {
    return { stdout: '', stderr: 'chmod: missing operand', exitCode: 1 };
  }

  const mode = ctx.args[0];
  const targetPath = resolvePath(ctx.cwd, ctx.args[1], ctx.env.HOME);
  const node = getNode(ctx.fs, targetPath);

  if (!node) {
    return { stdout: '', stderr: `chmod: cannot access '${ctx.args[1]}': No such file or directory`, exitCode: 1 };
  }

  // Update permissions on the node immutably
  const parts = targetPath.split('/').filter(Boolean);
  const fileName = parts[parts.length - 1];
  if (!fileName) {
    return { stdout: '', stderr: 'chmod: cannot change root permissions', exitCode: 1 };
  }

  // Simple permission string update
  const updateAtPath = (
    fsNode: import('@cli-quest/shared').FSNode,
    pathParts: string[],
    updater: (n: import('@cli-quest/shared').FSNode) => import('@cli-quest/shared').FSNode
  ): import('@cli-quest/shared').FSNode => {
    if (pathParts.length === 0) return updater(fsNode);
    if (fsNode.type !== 'directory' || !fsNode.children) throw new Error('Not found');
    const [head, ...rest] = pathParts;
    const idx = fsNode.children.findIndex((c) => c.name === head);
    if (idx === -1) throw new Error('Not found');
    return {
      ...fsNode,
      children: fsNode.children.map((c, i) =>
        i === idx ? updateAtPath(c, rest, updater) : c
      ),
    };
  };

  const newFS = updateAtPath(ctx.fs, parts, (n) => ({ ...n, permissions: mode }));
  return { stdout: '', stderr: '', exitCode: 0, fs: newFS };
}

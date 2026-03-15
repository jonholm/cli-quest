import type { CommandContext, CommandOutput } from '../types';
import { getNode, listDirectory, resolvePath } from '../filesystem/operations';

export function pwd(ctx: CommandContext): CommandOutput {
  return { stdout: ctx.cwd, stderr: '', exitCode: 0 };
}

export function ls(ctx: CommandContext): CommandOutput {
  const flags = new Set<string>();
  const paths: string[] = [];
  for (const arg of ctx.args) {
    if (arg.startsWith('-')) {
      for (const ch of arg.slice(1)) flags.add(ch);
    } else {
      paths.push(arg);
    }
  }

  const targetPath = paths[0]
    ? resolvePath(ctx.cwd, paths[0], ctx.env.HOME)
    : ctx.cwd;
  const node = getNode(ctx.fs, targetPath);

  if (!node) {
    return {
      stdout: '',
      stderr: `ls: cannot access '${paths[0] || targetPath}': No such file or directory`,
      exitCode: 1,
    };
  }

  if (node.type !== 'directory') {
    return { stdout: node.name, stderr: '', exitCode: 0 };
  }

  let items = listDirectory(node);
  if (!flags.has('a')) {
    items = items.filter((name) => {
      const child = node.children?.find((c) => c.name === name);
      return !child?.hidden && !name.startsWith('.');
    });
  }

  if (items.length === 0) return { stdout: '', stderr: '', exitCode: 0 };

  if (flags.has('l')) {
    const lines = items.map((name) => {
      const child = node.children?.find((c) => c.name === name);
      const t = child?.type === 'directory' ? 'd' : '-';
      const perms = child?.permissions || 'rw-r--r--';
      const size = child?.content?.length || 0;
      return `${t}${perms}  1 user  user  ${size.toString().padStart(8)} ${name}`;
    });
    return { stdout: lines.join('\n'), stderr: '', exitCode: 0 };
  }

  return { stdout: items.join('  '), stderr: '', exitCode: 0 };
}

export function cd(ctx: CommandContext): CommandOutput {
  const target = ctx.args[0] || ctx.env.HOME || '/home/user';
  const targetPath = resolvePath(ctx.cwd, target, ctx.env.HOME);
  const node = getNode(ctx.fs, targetPath);

  if (!node) {
    return {
      stdout: '',
      stderr: `cd: ${ctx.args[0]}: No such file or directory`,
      exitCode: 1,
    };
  }
  if (node.type !== 'directory') {
    return { stdout: '', stderr: `cd: ${ctx.args[0]}: Not a directory`, exitCode: 1 };
  }

  return { stdout: '', stderr: '', exitCode: 0, cwd: targetPath };
}

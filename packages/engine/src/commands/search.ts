import type { CommandContext, CommandOutput } from '../types';
import type { FSNode } from '@cli-quest/shared';
import { getNode, resolvePath } from '../filesystem/operations';
import { MAX_REGEX_LENGTH } from '@cli-quest/shared';

function safeRegex(pattern: string, flags?: string): RegExp {
  if (pattern.length > MAX_REGEX_LENGTH) {
    throw new Error(`Pattern too long (max ${MAX_REGEX_LENGTH} characters)`);
  }
  try {
    return new RegExp(pattern, flags);
  } catch {
    throw new Error(`Invalid pattern: ${pattern}`);
  }
}

export function grep(ctx: CommandContext): CommandOutput {
  const flags = new Set<string>();
  const positional: string[] = [];
  for (const arg of ctx.args) {
    if (arg.startsWith('-')) {
      for (const ch of arg.slice(1)) flags.add(ch);
    } else {
      positional.push(arg);
    }
  }

  if (positional.length < 1) {
    return { stdout: '', stderr: 'grep: missing search pattern', exitCode: 1 };
  }

  const pattern = positional[0];
  const caseInsensitive = flags.has('i');

  let regex: RegExp;
  try {
    regex = safeRegex(pattern, caseInsensitive ? 'i' : '');
  } catch (error) {
    return { stdout: '', stderr: (error as Error).message, exitCode: 1 };
  }

  // If no file arg but stdin available, search stdin
  let content: string;
  if (positional.length < 2) {
    if (ctx.stdin) {
      content = ctx.stdin;
    } else {
      return { stdout: '', stderr: 'grep: missing file operand', exitCode: 1 };
    }
  } else {
    const filePath = resolvePath(ctx.cwd, positional[1], ctx.env.HOME);
    const node = getNode(ctx.fs, filePath);
    if (!node) {
      return { stdout: '', stderr: `grep: ${positional[1]}: No such file or directory`, exitCode: 1 };
    }
    if (node.type === 'directory') {
      return { stdout: '', stderr: `grep: ${positional[1]}: Is a directory`, exitCode: 1 };
    }
    content = node.content || '';
  }

  const lines = content.split('\n');
  const matching = lines.filter((line) => regex.test(line));

  return { stdout: matching.join('\n'), stderr: '', exitCode: matching.length > 0 ? 0 : 1 };
}

export function find(ctx: CommandContext): CommandOutput {
  const positional: string[] = [];
  const flagValues: Record<string, string> = {};

  for (let i = 0; i < ctx.args.length; i++) {
    const arg = ctx.args[i];
    if (arg === '-name' || arg === '-type') {
      if (i + 1 < ctx.args.length) {
        flagValues[arg.slice(1)] = ctx.args[i + 1];
        i++;
      }
    } else if (!arg.startsWith('-')) {
      positional.push(arg);
    }
  }

  const startPath = positional[0] || '.';
  const namePattern = flagValues['name'];
  const typeFilter = flagValues['type'];

  const resolvedStart =
    startPath === '.' ? ctx.cwd : resolvePath(ctx.cwd, startPath, ctx.env.HOME);
  const startNode = getNode(ctx.fs, resolvedStart);

  if (!startNode) {
    return { stdout: '', stderr: `find: '${startPath}': No such file or directory`, exitCode: 1 };
  }

  let nameRegex: RegExp | undefined;
  if (namePattern) {
    try {
      nameRegex = safeRegex(namePattern.replace(/\*/g, '.*').replace(/\?/g, '.'));
    } catch (error) {
      return { stdout: '', stderr: (error as Error).message, exitCode: 1 };
    }
  }

  const results: string[] = [];

  function searchNode(node: FSNode, currentPath: string) {
    let matches = true;
    if (nameRegex) matches = matches && nameRegex.test(node.name);
    if (typeFilter === 'f') matches = matches && node.type === 'file';
    if (typeFilter === 'd') matches = matches && node.type === 'directory';

    if (matches && node.name) {
      results.push(currentPath + '/' + node.name);
    }

    if (node.type === 'directory' && node.children) {
      for (const child of node.children) {
        searchNode(child, currentPath + (node.name ? '/' + node.name : ''));
      }
    }
  }

  if (startNode.type === 'directory' && startNode.children) {
    for (const child of startNode.children) {
      searchNode(child, startPath === '.' ? '.' : startPath);
    }
  }

  return { stdout: results.join('\n'), stderr: '', exitCode: 0 };
}

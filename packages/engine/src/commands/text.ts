import type { CommandContext, CommandOutput } from '../types';
import { getNode, resolvePath } from '../filesystem/operations';
import { DEFAULT_LINE_COUNT } from '@cli-quest/shared';

function getContent(ctx: CommandContext, cmdName: string): string | CommandOutput {
  // Find file path: skip flags and their values
  const filePath = findFilePath(ctx.args);
  if (filePath) {
    const targetPath = resolvePath(ctx.cwd, filePath, ctx.env.HOME);
    const node = getNode(ctx.fs, targetPath);
    if (!node) return { stdout: '', stderr: `${cmdName}: ${filePath}: No such file or directory`, exitCode: 1 };
    if (node.type === 'directory') return { stdout: '', stderr: `${cmdName}: ${filePath}: Is a directory`, exitCode: 1 };
    return node.content || '';
  }
  if (ctx.stdin) return ctx.stdin;
  return { stdout: '', stderr: `${cmdName}: missing file operand`, exitCode: 1 };
}

function findFilePath(args: string[]): string | undefined {
  const flagsWithValues = new Set(['n']);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('-')) {
      const flagName = arg.slice(1);
      // Skip flag value if this flag takes one
      if (flagsWithValues.has(flagName) && i + 1 < args.length) {
        i++;
      }
      continue;
    }
    return arg;
  }
  return undefined;
}

function parseFlag(args: string[], flag: string): string | undefined {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === `-${flag}` && i + 1 < args.length && !args[i + 1].startsWith('-')) {
      return args[i + 1];
    }
  }
  return undefined;
}

export function head(ctx: CommandContext): CommandOutput {
  const content = getContent(ctx, 'head');
  if (typeof content !== 'string') return content;

  const nFlag = parseFlag(ctx.args, 'n');
  const numLines = nFlag ? parseInt(nFlag, 10) : DEFAULT_LINE_COUNT;
  if (isNaN(numLines) || numLines < 1) {
    return { stdout: '', stderr: 'head: invalid line count', exitCode: 1 };
  }

  const lines = content.split('\n');
  return { stdout: lines.slice(0, numLines).join('\n'), stderr: '', exitCode: 0 };
}

export function tail(ctx: CommandContext): CommandOutput {
  const content = getContent(ctx, 'tail');
  if (typeof content !== 'string') return content;

  const nFlag = parseFlag(ctx.args, 'n');
  const numLines = nFlag ? parseInt(nFlag, 10) : DEFAULT_LINE_COUNT;
  if (isNaN(numLines) || numLines < 1) {
    return { stdout: '', stderr: 'tail: invalid line count', exitCode: 1 };
  }

  const lines = content.split('\n');
  return { stdout: lines.slice(-numLines).join('\n'), stderr: '', exitCode: 0 };
}

export function wc(ctx: CommandContext): CommandOutput {
  const content = getContent(ctx, 'wc');
  if (typeof content !== 'string') return content;

  const flags = new Set<string>();
  let fileName = '';
  for (const arg of ctx.args) {
    if (arg.startsWith('-')) {
      for (const ch of arg.slice(1)) flags.add(ch);
    } else {
      fileName = arg;
    }
  }

  const lines = content.split('\n').length;
  const words = content.split(/\s+/).filter((w) => w.length > 0).length;
  const chars = content.length;

  const label = fileName || '';

  if (flags.has('l')) return { stdout: `${lines}${label ? ' ' + label : ''}`, stderr: '', exitCode: 0 };
  if (flags.has('w')) return { stdout: `${words}${label ? ' ' + label : ''}`, stderr: '', exitCode: 0 };
  if (flags.has('c')) return { stdout: `${chars}${label ? ' ' + label : ''}`, stderr: '', exitCode: 0 };

  return { stdout: `${lines} ${words} ${chars}${label ? ' ' + label : ''}`, stderr: '', exitCode: 0 };
}

export function echo(ctx: CommandContext): CommandOutput {
  return { stdout: ctx.args.join(' '), stderr: '', exitCode: 0 };
}

export function sort(ctx: CommandContext): CommandOutput {
  const content = getContent(ctx, 'sort');
  if (typeof content !== 'string') return content;

  const flags = new Set<string>();
  for (const arg of ctx.args) {
    if (arg.startsWith('-')) {
      for (const ch of arg.slice(1)) flags.add(ch);
    }
  }

  const lines = content.split('\n');
  lines.sort();
  if (flags.has('r')) lines.reverse();

  return { stdout: lines.join('\n'), stderr: '', exitCode: 0 };
}

export function uniq(ctx: CommandContext): CommandOutput {
  const content = getContent(ctx, 'uniq');
  if (typeof content !== 'string') return content;

  const flags = new Set<string>();
  for (const arg of ctx.args) {
    if (arg.startsWith('-')) {
      for (const ch of arg.slice(1)) flags.add(ch);
    }
  }

  const lines = content.split('\n');
  const result: string[] = [];
  const counts: number[] = [];

  for (const line of lines) {
    if (result.length === 0 || result[result.length - 1] !== line) {
      result.push(line);
      counts.push(1);
    } else {
      counts[counts.length - 1]++;
    }
  }

  if (flags.has('c')) {
    return {
      stdout: result.map((line, i) => `${counts[i].toString().padStart(7)} ${line}`).join('\n'),
      stderr: '',
      exitCode: 0,
    };
  }

  return { stdout: result.join('\n'), stderr: '', exitCode: 0 };
}

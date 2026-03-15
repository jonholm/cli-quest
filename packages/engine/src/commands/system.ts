import type { CommandContext, CommandOutput } from '../types';
import { getRegisteredCommands } from './registry';
import { helpText } from './help-text';

export function clear(): CommandOutput {
  return { stdout: '__CLEAR__', stderr: '', exitCode: 0 };
}

export function history(ctx: CommandContext): CommandOutput {
  const hist = ctx.history || [];
  if (hist.length === 0) {
    return { stdout: '', stderr: '', exitCode: 0 };
  }
  const lines = hist.map((cmd, i) => `${(i + 1).toString().padStart(4)}  ${cmd}`);
  return { stdout: lines.join('\n'), stderr: '', exitCode: 0 };
}

export function man(ctx: CommandContext): CommandOutput {
  if (ctx.args.length === 0) {
    const commands = getRegisteredCommands();
    return {
      stdout: `Available commands:\n${commands.join(', ')}\n\nUse 'man <command>' for details.`,
      stderr: '',
      exitCode: 0,
    };
  }

  const cmdName = ctx.args[0];
  const help = helpText[cmdName];

  if (!help) {
    return { stdout: '', stderr: `man: no manual entry for ${cmdName}`, exitCode: 1 };
  }

  return { stdout: help, stderr: '', exitCode: 0 };
}

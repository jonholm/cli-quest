import type { CommandContext, CommandOutput } from '../types';

export function exportCmd(ctx: CommandContext): CommandOutput {
  if (ctx.args.length === 0) {
    // List all env vars
    const lines = Object.entries(ctx.env)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`);
    return { stdout: lines.join('\n'), stderr: '', exitCode: 0 };
  }

  const assignment = ctx.args.join(' ');
  const eqIndex = assignment.indexOf('=');
  if (eqIndex === -1) {
    return { stdout: '', stderr: `export: invalid assignment: ${assignment}`, exitCode: 1 };
  }

  const name = assignment.slice(0, eqIndex);
  const value = assignment.slice(eqIndex + 1);

  return {
    stdout: '',
    stderr: '',
    exitCode: 0,
    env: { ...ctx.env, [name]: value },
  };
}

export function envCmd(ctx: CommandContext): CommandOutput {
  const lines = Object.entries(ctx.env)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`);
  return { stdout: lines.join('\n'), stderr: '', exitCode: 0 };
}

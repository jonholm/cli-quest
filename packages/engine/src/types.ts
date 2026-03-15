import type { FSNode, Env } from '@cli-quest/shared';

// === AST Types ===

export type Token =
  | { type: 'word'; value: string }
  | { type: 'pipe' }
  | { type: 'and' }
  | { type: 'or' }
  | { type: 'semicolon' }
  | { type: 'redirect_out' }
  | { type: 'redirect_append' }
  | { type: 'redirect_in' };

export type SimpleCommand = {
  type: 'command';
  name: string;
  args: string[];
};

export type Pipeline = {
  type: 'pipeline';
  commands: SimpleCommand[];
};

export type Redirect = {
  type: 'redirect';
  command: Pipeline;
  operator: '>' | '>>' | '<';
  target: string;
};

export type CommandList = {
  type: 'list';
  entries: {
    command: Pipeline | Redirect;
    operator?: '&&' | '||' | ';';
  }[];
};

// === Command Handler ===

export type CommandContext = {
  args: string[];
  stdin: string;
  fs: FSNode;
  env: Env;
  cwd: string;
  history?: string[];
};

export type CommandOutput = {
  stdout: string;
  stderr: string;
  exitCode: number;
  fs?: FSNode;
  env?: Env;
  cwd?: string;
};

export type CommandHandler = (ctx: CommandContext) => CommandOutput;

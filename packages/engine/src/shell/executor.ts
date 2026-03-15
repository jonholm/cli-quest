import type { FSNode, Env } from '@cli-quest/shared';
import { parse } from '../parser/parser';
import type { Pipeline, Redirect } from '../types';
import { getCommand } from '../commands/registry';
import { expandWord, expandArgs } from './expander';
import { getNode, writeFile, appendFile, resolvePath } from '../filesystem/operations';

export type ExecuteResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
  fs: FSNode;
  env: Env;
  cwd: string;
  commandsUsed: string[];
};

export function execute(
  input: string,
  fs: FSNode,
  env: Env,
  cwd: string,
  existingCommandsUsed: string[],
  history?: string[]
): ExecuteResult {
  const ast = parse(input);
  const commandsUsed = [...existingCommandsUsed];
  let currentFS = fs;
  let currentEnv = { ...env };
  let currentCwd = cwd;
  let lastStdout = '';
  let lastStderr = '';
  let lastExitCode = 0;

  for (let i = 0; i < ast.entries.length; i++) {
    const entry = ast.entries[i];

    // Handle chaining logic based on previous entry's operator
    if (i > 0) {
      const prevOp = ast.entries[i - 1].operator;
      if (prevOp === '&&' && lastExitCode !== 0) continue;
      if (prevOp === '||' && lastExitCode === 0) continue;
    }

    const result = executeEntry(
      entry.command,
      currentFS,
      currentEnv,
      currentCwd,
      '',
      commandsUsed,
      history
    );
    currentFS = result.fs;
    currentEnv = result.env;
    currentCwd = result.cwd;
    lastStdout = result.stdout;
    lastStderr = result.stderr;
    lastExitCode = result.exitCode;
  }

  return {
    stdout: lastStdout,
    stderr: lastStderr,
    exitCode: lastExitCode,
    fs: currentFS,
    env: currentEnv,
    cwd: currentCwd,
    commandsUsed,
  };
}

function executeEntry(
  node: Pipeline | Redirect,
  fs: FSNode,
  env: Env,
  cwd: string,
  stdin: string,
  commandsUsed: string[],
  history?: string[]
): ExecuteResult {
  if (node.type === 'redirect') {
    return executeRedirect(node, fs, env, cwd, commandsUsed, history);
  }
  return executePipeline(node, fs, env, cwd, stdin, commandsUsed, history);
}

function executePipeline(
  pipeline: Pipeline,
  fs: FSNode,
  env: Env,
  cwd: string,
  stdin: string,
  commandsUsed: string[],
  history?: string[]
): ExecuteResult {
  let currentStdin = stdin;
  let currentFS = fs;
  let currentEnv = env;
  let currentCwd = cwd;
  let lastStdout = '';
  let lastStderr = '';
  let lastExitCode = 0;

  for (const cmd of pipeline.commands) {
    if (!cmd.name) continue;

    const expandedName = expandWord(cmd.name, currentEnv);
    const expandedArgs = expandArgs(
      cmd.args.map((a) => expandWord(a, currentEnv)),
      currentFS,
      currentCwd,
      currentEnv
    );

    const handler = getCommand(expandedName);
    if (!handler) {
      return {
        stdout: '',
        stderr: `${expandedName}: command not found`,
        exitCode: 127,
        fs: currentFS,
        env: currentEnv,
        cwd: currentCwd,
        commandsUsed,
      };
    }

    commandsUsed.push(expandedName);
    const output = handler({
      args: expandedArgs,
      stdin: currentStdin,
      fs: currentFS,
      env: currentEnv,
      cwd: currentCwd,
      history,
    });

    currentFS = output.fs || currentFS;
    currentEnv = output.env || currentEnv;
    currentCwd = output.cwd || currentCwd;
    currentStdin = output.stdout;
    lastStdout = output.stdout;
    lastStderr = output.stderr;
    lastExitCode = output.exitCode;
  }

  return {
    stdout: lastStdout,
    stderr: lastStderr,
    exitCode: lastExitCode,
    fs: currentFS,
    env: currentEnv,
    cwd: currentCwd,
    commandsUsed,
  };
}

function executeRedirect(
  redirect: Redirect,
  fs: FSNode,
  env: Env,
  cwd: string,
  commandsUsed: string[],
  history?: string[]
): ExecuteResult {
  if (redirect.operator === '<') {
    const filePath = resolvePath(cwd, expandWord(redirect.target, env), env.HOME);
    const node = getNode(fs, filePath);
    if (!node || node.type !== 'file') {
      return {
        stdout: '',
        stderr: `${redirect.target}: No such file`,
        exitCode: 1,
        fs,
        env,
        cwd,
        commandsUsed,
      };
    }
    return executePipeline(
      redirect.command,
      fs,
      env,
      cwd,
      node.content || '',
      commandsUsed,
      history
    );
  }

  // Output redirect: execute pipeline, write stdout to file
  const result = executePipeline(redirect.command, fs, env, cwd, '', commandsUsed, history);
  const filePath = resolvePath(cwd, expandWord(redirect.target, env), env.HOME);

  const updatedFS =
    redirect.operator === '>>'
      ? appendFile(result.fs, filePath, result.stdout)
      : writeFile(result.fs, filePath, result.stdout);

  return { ...result, fs: updatedFS, stdout: '' };
}

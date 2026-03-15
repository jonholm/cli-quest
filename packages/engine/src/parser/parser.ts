import { tokenize } from './tokenizer';
import type { Token, SimpleCommand, Pipeline, Redirect, CommandList } from '../types';

export function parse(input: string): CommandList {
  const tokens = tokenize(input);
  if (tokens.length === 0) return { type: 'list', entries: [] };

  const entries: CommandList['entries'] = [];
  let pos = 0;

  while (pos < tokens.length) {
    const pipeline = parsePipeline();
    const command = maybeParseRedirect(pipeline);

    let operator: '&&' | '||' | ';' | undefined;
    if (pos < tokens.length) {
      const tok = tokens[pos];
      if (tok.type === 'and') {
        operator = '&&';
        pos++;
      } else if (tok.type === 'or') {
        operator = '||';
        pos++;
      } else if (tok.type === 'semicolon') {
        operator = ';';
        pos++;
      }
    }

    entries.push({ command, operator });
  }

  // Last entry shouldn't have an operator
  if (entries.length > 0 && entries[entries.length - 1].operator) {
    delete entries[entries.length - 1].operator;
  }

  return { type: 'list', entries };

  function parsePipeline(): Pipeline {
    const commands: SimpleCommand[] = [];
    commands.push(parseSimpleCommand());

    while (pos < tokens.length && tokens[pos].type === 'pipe') {
      pos++;
      commands.push(parseSimpleCommand());
    }

    return { type: 'pipeline', commands };
  }

  function parseSimpleCommand(): SimpleCommand {
    const nameTok = tokens[pos];
    if (!nameTok || nameTok.type !== 'word') {
      return { type: 'command', name: '', args: [] };
    }
    pos++;
    const args: string[] = [];
    while (pos < tokens.length && tokens[pos].type === 'word') {
      args.push((tokens[pos] as { type: 'word'; value: string }).value);
      pos++;
    }
    return { type: 'command', name: nameTok.value, args };
  }

  function maybeParseRedirect(pipeline: Pipeline): Pipeline | Redirect {
    if (pos >= tokens.length) return pipeline;
    const tok = tokens[pos];
    if (
      tok.type === 'redirect_out' ||
      tok.type === 'redirect_append' ||
      tok.type === 'redirect_in'
    ) {
      pos++;
      const target = tokens[pos];
      if (!target || target.type !== 'word') {
        return pipeline;
      }
      pos++;
      const operator =
        tok.type === 'redirect_out'
          ? '>'
          : tok.type === 'redirect_append'
            ? '>>'
            : '<';
      return {
        type: 'redirect',
        command: pipeline,
        operator: operator as '>' | '>>' | '<',
        target: target.value,
      };
    }
    return pipeline;
  }
}

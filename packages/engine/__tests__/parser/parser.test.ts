import { describe, it, expect } from 'vitest';
import { parse } from '../../src/parser/parser';

describe('parse', () => {
  it('parses a simple command', () => {
    const ast = parse('ls -la');
    expect(ast).toEqual({
      type: 'list',
      entries: [
        {
          command: {
            type: 'pipeline',
            commands: [{ type: 'command', name: 'ls', args: ['-la'] }],
          },
        },
      ],
    });
  });

  it('parses a pipeline', () => {
    const ast = parse('grep err log | wc -l');
    expect(ast.type).toBe('list');
    const pipeline = ast.entries[0].command;
    expect(pipeline.type).toBe('pipeline');
    if (pipeline.type === 'pipeline') {
      expect(pipeline.commands).toHaveLength(2);
      expect(pipeline.commands[0].name).toBe('grep');
      expect(pipeline.commands[1].name).toBe('wc');
    }
  });

  it('parses output redirect', () => {
    const ast = parse('echo hi > out.txt');
    const entry = ast.entries[0].command;
    expect(entry.type).toBe('redirect');
    if (entry.type === 'redirect') {
      expect(entry.operator).toBe('>');
      expect(entry.target).toBe('out.txt');
    }
  });

  it('parses append redirect', () => {
    const ast = parse('echo hi >> out.txt');
    const entry = ast.entries[0].command;
    expect(entry.type).toBe('redirect');
    if (entry.type === 'redirect') {
      expect(entry.operator).toBe('>>');
    }
  });

  it('parses input redirect', () => {
    const ast = parse('wc -l < data.csv');
    const entry = ast.entries[0].command;
    expect(entry.type).toBe('redirect');
    if (entry.type === 'redirect') {
      expect(entry.operator).toBe('<');
      expect(entry.target).toBe('data.csv');
    }
  });

  it('parses command chaining with &&', () => {
    const ast = parse('mkdir dir && cd dir');
    expect(ast.entries).toHaveLength(2);
    expect(ast.entries[0].operator).toBe('&&');
  });

  it('parses command chaining with ||', () => {
    const ast = parse('cd nope || echo fail');
    expect(ast.entries).toHaveLength(2);
    expect(ast.entries[0].operator).toBe('||');
  });

  it('parses command chaining with ;', () => {
    const ast = parse('echo a ; echo b');
    expect(ast.entries).toHaveLength(2);
    expect(ast.entries[0].operator).toBe(';');
  });

  it('parses empty input', () => {
    const ast = parse('');
    expect(ast.entries).toHaveLength(0);
  });

  it('parses multi-stage pipeline', () => {
    const ast = parse('cat file | grep pat | wc -l');
    const pipeline = ast.entries[0].command;
    if (pipeline.type === 'pipeline') {
      expect(pipeline.commands).toHaveLength(3);
    }
  });
});

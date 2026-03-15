import { describe, it, expect } from 'vitest';
import { resolvePath, getNode, listDirectory, createNode, deleteNode, cloneFS } from '../../lib/fileSystem';
import { testFS } from '../fixtures';
import { FSNode } from '../../lib/types';

describe('resolvePath', () => {
  it('handles absolute paths', () => {
    expect(resolvePath('/home/user', '/var/log')).toBe('/var/log');
  });

  it('handles relative paths', () => {
    expect(resolvePath('/home/user', 'docs')).toBe('/home/user/docs');
  });

  it('handles .. navigation', () => {
    expect(resolvePath('/home/user', '..')).toBe('/home');
  });

  it('handles . (current directory)', () => {
    expect(resolvePath('/home/user', '.')).toBe('/home/user');
  });

  it('handles complex relative paths', () => {
    expect(resolvePath('/home/user', '../docs/../user/projects')).toBe('/home/user/projects');
  });

  it('normalizes absolute paths with ..', () => {
    expect(resolvePath('/anywhere', '/home/user/../docs')).toBe('/home/docs');
  });
});

describe('getNode', () => {
  it('returns root for / path', () => {
    const node = getNode(testFS, '/');
    expect(node).toBe(testFS);
  });

  it('returns root for empty path', () => {
    const node = getNode(testFS, '');
    expect(node).toBe(testFS);
  });

  it('finds a directory', () => {
    const node = getNode(testFS, '/home/user');
    expect(node).not.toBeNull();
    expect(node!.type).toBe('directory');
    expect(node!.name).toBe('user');
  });

  it('finds a file', () => {
    const node = getNode(testFS, '/home/user/hello.txt');
    expect(node).not.toBeNull();
    expect(node!.type).toBe('file');
    expect(node!.content).toBe('Hello World\nSecond line\nThird line');
  });

  it('returns null for non-existent path', () => {
    expect(getNode(testFS, '/nonexistent')).toBeNull();
  });

  it('returns null when traversing through a file', () => {
    expect(getNode(testFS, '/home/user/hello.txt/something')).toBeNull();
  });
});

describe('listDirectory', () => {
  it('lists directory contents sorted', () => {
    const node = getNode(testFS, '/home/user')!;
    const items = listDirectory(node);
    expect(items).toEqual(['data.csv', 'docs', 'empty', 'hello.txt']);
  });

  it('returns empty array for file', () => {
    const node = getNode(testFS, '/home/user/hello.txt')!;
    expect(listDirectory(node)).toEqual([]);
  });

  it('returns empty array for empty directory', () => {
    const node = getNode(testFS, '/home/user/empty')!;
    expect(listDirectory(node)).toEqual([]);
  });
});

describe('createNode', () => {
  it('creates a new file', () => {
    const fs = structuredClone(testFS);
    const newFS = createNode(fs, '/home/user/new.txt', {
      type: 'file',
      name: '',
      content: 'new file',
    });

    const node = getNode(newFS, '/home/user/new.txt');
    expect(node).not.toBeNull();
    expect(node!.name).toBe('new.txt');
    expect(node!.content).toBe('new file');
  });

  it('creates a new directory', () => {
    const fs = structuredClone(testFS);
    const newFS = createNode(fs, '/home/user/newdir', {
      type: 'directory',
      name: '',
      children: [],
    });

    const node = getNode(newFS, '/home/user/newdir');
    expect(node).not.toBeNull();
    expect(node!.type).toBe('directory');
  });

  it('does NOT mutate the original file system', () => {
    const fs = structuredClone(testFS);
    const originalChildren = getNode(fs, '/home/user')!.children!.length;

    createNode(fs, '/home/user/new.txt', {
      type: 'file',
      name: '',
      content: '',
    });

    const afterChildren = getNode(fs, '/home/user')!.children!.length;
    expect(afterChildren).toBe(originalChildren);
  });

  it('throws if file already exists', () => {
    const fs = structuredClone(testFS);
    expect(() =>
      createNode(fs, '/home/user/hello.txt', { type: 'file', name: '', content: '' })
    ).toThrow('File or directory already exists');
  });

  it('throws if parent does not exist', () => {
    const fs = structuredClone(testFS);
    expect(() =>
      createNode(fs, '/nonexistent/file.txt', { type: 'file', name: '', content: '' })
    ).toThrow('Parent directory not found');
  });

  it('throws for invalid path', () => {
    const fs = structuredClone(testFS);
    expect(() =>
      createNode(fs, '/', { type: 'file', name: '', content: '' })
    ).toThrow('Invalid path');
  });
});

describe('deleteNode', () => {
  it('deletes a file', () => {
    const fs = structuredClone(testFS);
    const newFS = deleteNode(fs, '/home/user/hello.txt');

    expect(getNode(newFS, '/home/user/hello.txt')).toBeNull();
  });

  it('deletes a directory', () => {
    const fs = structuredClone(testFS);
    const newFS = deleteNode(fs, '/home/user/empty');

    expect(getNode(newFS, '/home/user/empty')).toBeNull();
  });

  it('does NOT mutate the original file system', () => {
    const fs = structuredClone(testFS);
    const originalChildren = getNode(fs, '/home/user')!.children!.length;

    deleteNode(fs, '/home/user/hello.txt');

    const afterChildren = getNode(fs, '/home/user')!.children!.length;
    expect(afterChildren).toBe(originalChildren);
  });

  it('throws when deleting root', () => {
    const fs = structuredClone(testFS);
    expect(() => deleteNode(fs, '/')).toThrow('Cannot delete root');
  });

  it('throws when file not found', () => {
    const fs = structuredClone(testFS);
    expect(() => deleteNode(fs, '/home/user/nonexistent.txt')).toThrow('File or directory not found');
  });
});

describe('cloneFS', () => {
  it('creates a deep clone', () => {
    const clone = cloneFS(testFS);
    expect(clone).toEqual(testFS);
    expect(clone).not.toBe(testFS);
  });

  it('clone modifications do not affect original', () => {
    const clone = cloneFS(testFS);
    clone.children![0].name = 'modified';
    expect(testFS.children![0].name).toBe('home');
  });
});

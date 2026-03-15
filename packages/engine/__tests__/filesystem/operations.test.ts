import { describe, it, expect } from 'vitest';
import {
  resolvePath,
  getNode,
  listDirectory,
  createNode,
  deleteNode,
  cloneFS,
  writeFile,
  appendFile,
} from '../../src/filesystem/operations';
import { testFS } from '../fixtures';

describe('resolvePath', () => {
  it('returns absolute paths unchanged', () => {
    expect(resolvePath('/home/user', '/var/log')).toBe('/var/log');
  });

  it('resolves relative paths', () => {
    expect(resolvePath('/home/user', 'docs')).toBe('/home/user/docs');
  });

  it('resolves .. navigation', () => {
    expect(resolvePath('/home/user', '..')).toBe('/home');
  });

  it('resolves . as current directory', () => {
    expect(resolvePath('/home/user', '.')).toBe('/home/user');
  });

  it('normalizes absolute paths with ..', () => {
    expect(resolvePath('/x', '/home/user/../docs')).toBe('/home/docs');
  });

  it('resolves ~ to home directory', () => {
    expect(resolvePath('/var', '~', '/home/user')).toBe('/home/user');
  });

  it('resolves ~/path', () => {
    expect(resolvePath('/var', '~/docs', '/home/user')).toBe('/home/user/docs');
  });
});

describe('getNode', () => {
  it('returns root for /', () => {
    expect(getNode(testFS, '/')).toBe(testFS);
  });

  it('returns root for empty string', () => {
    expect(getNode(testFS, '')).toBe(testFS);
  });

  it('finds a nested file', () => {
    const node = getNode(testFS, '/home/user/hello.txt');
    expect(node?.type).toBe('file');
    expect(node?.content).toContain('Hello World');
  });

  it('finds a directory', () => {
    const node = getNode(testFS, '/home/user/docs');
    expect(node?.type).toBe('directory');
  });

  it('returns null for non-existent path', () => {
    expect(getNode(testFS, '/nonexistent')).toBeNull();
  });

  it('returns null when traversing through a file', () => {
    expect(getNode(testFS, '/home/user/hello.txt/child')).toBeNull();
  });
});

describe('listDirectory', () => {
  it('lists sorted children', () => {
    const node = getNode(testFS, '/home/user')!;
    expect(listDirectory(node)).toEqual(['data.csv', 'docs', 'empty', 'hello.txt']);
  });

  it('returns empty for file', () => {
    const node = getNode(testFS, '/home/user/hello.txt')!;
    expect(listDirectory(node)).toEqual([]);
  });

  it('returns empty for empty directory', () => {
    const node = getNode(testFS, '/home/user/empty')!;
    expect(listDirectory(node)).toEqual([]);
  });
});

describe('createNode', () => {
  it('creates a file without mutating original', () => {
    const fs = structuredClone(testFS);
    const original = getNode(fs, '/home/user')!.children!.length;
    const newFS = createNode(fs, '/home/user/new.txt', {
      type: 'file',
      name: '',
      content: 'new',
    });
    expect(getNode(newFS, '/home/user/new.txt')?.content).toBe('new');
    expect(getNode(fs, '/home/user')!.children!.length).toBe(original);
  });

  it('creates a directory', () => {
    const fs = structuredClone(testFS);
    const newFS = createNode(fs, '/home/user/newdir', {
      type: 'directory',
      name: '',
      children: [],
    });
    expect(getNode(newFS, '/home/user/newdir')?.type).toBe('directory');
  });

  it('throws if file already exists', () => {
    expect(() =>
      createNode(structuredClone(testFS), '/home/user/hello.txt', {
        type: 'file',
        name: '',
        content: '',
      })
    ).toThrow('File or directory already exists');
  });

  it('throws if parent does not exist', () => {
    expect(() =>
      createNode(structuredClone(testFS), '/nonexistent/file.txt', {
        type: 'file',
        name: '',
        content: '',
      })
    ).toThrow('Parent directory not found');
  });
});

describe('deleteNode', () => {
  it('deletes a file without mutating original', () => {
    const fs = structuredClone(testFS);
    const original = getNode(fs, '/home/user')!.children!.length;
    const newFS = deleteNode(fs, '/home/user/hello.txt');
    expect(getNode(newFS, '/home/user/hello.txt')).toBeNull();
    expect(getNode(fs, '/home/user')!.children!.length).toBe(original);
  });

  it('throws when deleting root', () => {
    expect(() => deleteNode(structuredClone(testFS), '/')).toThrow('Cannot delete root');
  });

  it('throws when file not found', () => {
    expect(() => deleteNode(structuredClone(testFS), '/home/user/nope')).toThrow(
      'File or directory not found'
    );
  });
});

describe('writeFile', () => {
  it('creates a new file', () => {
    const fs = structuredClone(testFS);
    const newFS = writeFile(fs, '/home/user/new.txt', 'content');
    expect(getNode(newFS, '/home/user/new.txt')?.content).toBe('content');
  });

  it('overwrites existing file', () => {
    const fs = structuredClone(testFS);
    const newFS = writeFile(fs, '/home/user/hello.txt', 'overwritten');
    expect(getNode(newFS, '/home/user/hello.txt')?.content).toBe('overwritten');
  });
});

describe('appendFile', () => {
  it('appends to existing file', () => {
    const fs = structuredClone(testFS);
    const newFS = appendFile(fs, '/home/user/hello.txt', 'appended');
    const content = getNode(newFS, '/home/user/hello.txt')?.content;
    expect(content).toBe('Hello World\nSecond line\nThird line\nappended');
  });

  it('creates file if not exists', () => {
    const fs = structuredClone(testFS);
    const newFS = appendFile(fs, '/home/user/new.txt', 'new content');
    expect(getNode(newFS, '/home/user/new.txt')?.content).toBe('new content');
  });
});

describe('cloneFS', () => {
  it('deep clones without shared references', () => {
    const clone = cloneFS(testFS);
    expect(clone).toEqual(testFS);
    expect(clone).not.toBe(testFS);
  });
});

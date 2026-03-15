import type { FSNode } from '@cli-quest/shared';

export function resolvePath(cwd: string, target: string, home?: string): string {
  if (target.startsWith('~')) {
    const h = home || '/home/user';
    target = h + target.slice(1);
  }
  if (target.startsWith('/')) return normalizePath(target);

  const parts = cwd.split('/').filter(Boolean);
  for (const part of target.split('/').filter(Boolean)) {
    if (part === '..') parts.pop();
    else if (part !== '.') parts.push(part);
  }
  return '/' + parts.join('/');
}

function normalizePath(path: string): string {
  const normalized: string[] = [];
  for (const part of path.split('/').filter(Boolean)) {
    if (part === '..') normalized.pop();
    else if (part !== '.') normalized.push(part);
  }
  return '/' + normalized.join('/');
}

export function getNode(fs: FSNode, path: string): FSNode | null {
  if (path === '/' || path === '') return fs;
  let current = fs;
  for (const part of path.split('/').filter(Boolean)) {
    if (current.type !== 'directory' || !current.children) return null;
    const child = current.children.find((c) => c.name === part);
    if (!child) return null;
    current = child;
  }
  return current;
}

export function listDirectory(node: FSNode): string[] {
  if (node.type !== 'directory' || !node.children) return [];
  return node.children.map((c) => c.name).sort();
}

export function createNode(fs: FSNode, path: string, node: FSNode): FSNode {
  const parts = path.split('/').filter(Boolean);
  const fileName = parts[parts.length - 1];
  if (!fileName) throw new Error('Invalid path');
  return updateAtPath(fs, parts.slice(0, -1), (parent) => {
    if (parent.type !== 'directory') throw new Error('Parent is not a directory');
    const children = parent.children || [];
    if (children.some((c) => c.name === fileName))
      throw new Error('File or directory already exists');
    return { ...parent, children: [...children, { ...node, name: fileName }] };
  });
}

export function deleteNode(fs: FSNode, path: string): FSNode {
  const parts = path.split('/').filter(Boolean);
  const fileName = parts[parts.length - 1];
  if (!fileName) throw new Error('Cannot delete root');
  return updateAtPath(fs, parts.slice(0, -1), (parent) => {
    if (parent.type !== 'directory' || !parent.children)
      throw new Error('Parent is not a directory');
    const idx = parent.children.findIndex((c) => c.name === fileName);
    if (idx === -1) throw new Error('File or directory not found');
    return { ...parent, children: parent.children.filter((_, i) => i !== idx) };
  });
}

function updateAtPath(
  node: FSNode,
  parts: string[],
  updater: (node: FSNode) => FSNode
): FSNode {
  if (parts.length === 0) return updater(node);
  if (node.type !== 'directory' || !node.children)
    throw new Error('Parent directory not found');
  const [head, ...rest] = parts;
  const idx = node.children.findIndex((c) => c.name === head);
  if (idx === -1) throw new Error('Parent directory not found');
  return {
    ...node,
    children: node.children.map((c, i) =>
      i === idx ? updateAtPath(c, rest, updater) : c
    ),
  };
}

export function writeFile(fs: FSNode, path: string, content: string): FSNode {
  const node = getNode(fs, path);
  if (node) {
    const parts = path.split('/').filter(Boolean);
    const fileName = parts[parts.length - 1];
    return updateAtPath(fs, parts.slice(0, -1), (parent) => ({
      ...parent,
      children: parent.children!.map((c) =>
        c.name === fileName ? { ...c, content } : c
      ),
    }));
  }
  return createNode(fs, path, { type: 'file', name: '', content });
}

export function appendFile(fs: FSNode, path: string, content: string): FSNode {
  const node = getNode(fs, path);
  if (node && node.type === 'file') {
    const existing = node.content || '';
    const separator = existing.length > 0 ? '\n' : '';
    return writeFile(fs, path, existing + separator + content);
  }
  return createNode(fs, path, { type: 'file', name: '', content });
}

export function cloneFS(fs: FSNode): FSNode {
  return structuredClone(fs);
}

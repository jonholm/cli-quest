import { FSNode } from './types';

export function resolvePath(currentPath: string, targetPath: string): string {
  if (targetPath.startsWith('/')) {
    return normalizePath(targetPath);
  }

  const parts = currentPath.split('/').filter(Boolean);
  const targetParts = targetPath.split('/').filter(Boolean);

  for (const part of targetParts) {
    if (part === '..') {
      parts.pop();
    } else if (part !== '.') {
      parts.push(part);
    }
  }

  return '/' + parts.join('/');
}

function normalizePath(path: string): string {
  const parts = path.split('/').filter(Boolean);
  const normalized: string[] = [];

  for (const part of parts) {
    if (part === '..') {
      normalized.pop();
    } else if (part !== '.') {
      normalized.push(part);
    }
  }

  return '/' + normalized.join('/');
}

export function getNode(fs: FSNode, path: string): FSNode | null {
  if (path === '/' || path === '') {
    return fs;
  }

  const parts = path.split('/').filter(Boolean);
  let current = fs;

  for (const part of parts) {
    if (current.type !== 'directory' || !current.children) {
      return null;
    }

    const child = current.children.find((c) => c.name === part);
    if (!child) {
      return null;
    }

    current = child;
  }

  return current;
}

export function listDirectory(node: FSNode): string[] {
  if (node.type !== 'directory' || !node.children) {
    return [];
  }

  return node.children.map((child) => child.name).sort();
}

export function createNode(fs: FSNode, path: string, node: FSNode): FSNode {
  const parts = path.split('/').filter(Boolean);
  const fileName = parts[parts.length - 1];

  if (!fileName) {
    throw new Error('Invalid path');
  }

  const parentParts = parts.slice(0, -1);

  return updateAtPath(fs, parentParts, (parent) => {
    if (parent.type !== 'directory') {
      throw new Error('Parent is not a directory');
    }

    const children = parent.children || [];

    if (children.some((c) => c.name === fileName)) {
      throw new Error('File or directory already exists');
    }

    return {
      ...parent,
      children: [...children, { ...node, name: fileName }],
    };
  });
}

export function deleteNode(fs: FSNode, path: string): FSNode {
  const parts = path.split('/').filter(Boolean);
  const fileName = parts[parts.length - 1];

  if (!fileName) {
    throw new Error('Cannot delete root');
  }

  const parentParts = parts.slice(0, -1);

  return updateAtPath(fs, parentParts, (parent) => {
    if (parent.type !== 'directory' || !parent.children) {
      throw new Error('Parent is not a directory');
    }

    const childIndex = parent.children.findIndex((c) => c.name === fileName);
    if (childIndex === -1) {
      throw new Error('File or directory not found');
    }

    return {
      ...parent,
      children: parent.children.filter((_, i) => i !== childIndex),
    };
  });
}

function updateAtPath(
  node: FSNode,
  pathParts: string[],
  updater: (node: FSNode) => FSNode
): FSNode {
  if (pathParts.length === 0) {
    return updater(node);
  }

  if (node.type !== 'directory' || !node.children) {
    throw new Error('Parent directory not found');
  }

  const [head, ...rest] = pathParts;
  const childIndex = node.children.findIndex((c) => c.name === head);

  if (childIndex === -1) {
    throw new Error('Parent directory not found');
  }

  const updatedChild = updateAtPath(node.children[childIndex], rest, updater);

  return {
    ...node,
    children: node.children.map((c, i) => (i === childIndex ? updatedChild : c)),
  };
}

export function cloneFS(fs: FSNode): FSNode {
  return structuredClone(fs);
}

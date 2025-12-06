/**
 * Virtual File System Operations
 *
 * This module provides core functionality for the virtual file system used in CLI Quest.
 * All operations are immutable - they return new objects rather than modifying in place.
 *
 * @module fileSystem
 */

import { FSNode } from './types';

/**
 * Resolves a target path relative to the current path.
 * Handles both absolute paths (starting with '/') and relative paths.
 * Supports '.' (current directory) and '..' (parent directory).
 *
 * @param currentPath - The current working directory (e.g., '/home/user')
 * @param targetPath - The target path, absolute or relative (e.g., '../docs' or '/var/log')
 * @returns The resolved absolute path
 *
 * @example
 * resolvePath('/home/user', '../docs')      // Returns: '/home/docs'
 * resolvePath('/home/user', '/var/log')     // Returns: '/var/log'
 * resolvePath('/home/user', './projects')   // Returns: '/home/user/projects'
 */
export function resolvePath(currentPath: string, targetPath: string): string {
  // If absolute path, use it directly
  if (targetPath.startsWith('/')) {
    return normalizePath(targetPath);
  }

  // Handle relative paths
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

/**
 * Normalizes a path by resolving '.' and '..' references.
 * Internal helper function.
 *
 * @param path - Path to normalize
 * @returns Normalized absolute path
 * @internal
 */
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

/**
 * Retrieves a file system node at the specified path.
 *
 * @param fs - The root file system node
 * @param path - Absolute path to the target node (e.g., '/home/user/file.txt')
 * @returns The FSNode at the path, or null if not found
 *
 * @example
 * const node = getNode(fileSystem, '/home/user/readme.txt');
 * if (node && node.type === 'file') {
 *   console.log(node.content);
 * }
 */
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

/**
 * Lists all files and directories in a directory node.
 *
 * @param node - The directory node to list
 * @returns Sorted array of file/directory names, or empty array if not a directory
 *
 * @example
 * const dir = getNode(fs, '/home/user');
 * const files = listDirectory(dir);  // ['docs', 'file.txt', 'projects']
 */
export function listDirectory(node: FSNode): string[] {
  if (node.type !== 'directory' || !node.children) {
    return [];
  }

  return node.children.map((child) => child.name).sort();
}

/**
 * Creates a new file or directory in the file system.
 * Returns a new file system object (immutable operation).
 *
 * @param fs - The root file system node
 * @param path - Absolute path where the node should be created
 * @param node - The FSNode to create (without name - name taken from path)
 * @returns New file system root with the node added
 * @throws {Error} If path is invalid, parent doesn't exist, parent isn't a directory, or file already exists
 *
 * @example
 * const newFS = createNode(fs, '/home/user/newfile.txt', {
 *   type: 'file',
 *   name: '',  // Will be set to 'newfile.txt'
 *   content: 'Hello World'
 * });
 */
export function createNode(fs: FSNode, path: string, node: FSNode): FSNode {
  const parts = path.split('/').filter(Boolean);
  const fileName = parts.pop();

  if (!fileName) {
    throw new Error('Invalid path');
  }

  const parentPath = '/' + parts.join('/');
  const parent = getNode(fs, parentPath);

  if (!parent) {
    throw new Error('Parent directory not found');
  }

  if (parent.type !== 'directory') {
    throw new Error('Parent is not a directory');
  }

  if (!parent.children) {
    parent.children = [];
  }

  // Check if file already exists
  if (parent.children.some((c) => c.name === fileName)) {
    throw new Error('File or directory already exists');
  }

  parent.children.push({ ...node, name: fileName });

  return { ...fs };
}

/**
 * Deletes a file or directory from the file system.
 * Returns a new file system object (immutable operation).
 *
 * @param fs - The root file system node
 * @param path - Absolute path to the node to delete
 * @returns New file system root with the node removed
 * @throws {Error} If trying to delete root, parent doesn't exist, parent isn't a directory, or node not found
 *
 * @example
 * const newFS = deleteNode(fs, '/home/user/oldfile.txt');
 */
export function deleteNode(fs: FSNode, path: string): FSNode {
  const parts = path.split('/').filter(Boolean);
  const fileName = parts.pop();

  if (!fileName) {
    throw new Error('Cannot delete root');
  }

  const parentPath = '/' + parts.join('/');
  const parent = getNode(fs, parentPath);

  if (!parent) {
    throw new Error('Parent directory not found');
  }

  if (parent.type !== 'directory' || !parent.children) {
    throw new Error('Parent is not a directory');
  }

  const childIndex = parent.children.findIndex((c) => c.name === fileName);
  if (childIndex === -1) {
    throw new Error('File or directory not found');
  }

  parent.children.splice(childIndex, 1);

  return { ...fs };
}

/**
 * Creates a deep clone of the file system.
 * Useful for level resets and immutable operations.
 *
 * @param fs - The file system to clone
 * @returns Deep copy of the file system
 *
 * @example
 * const backup = cloneFS(currentFS);
 * // Make changes to currentFS
 * // Restore from backup if needed
 */
export function cloneFS(fs: FSNode): FSNode {
  return JSON.parse(JSON.stringify(fs));
}

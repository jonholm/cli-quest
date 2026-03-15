# Shell Engine + Monorepo Setup — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the standalone shell engine package within a Turborepo monorepo, supporting pipes, redirection, env vars, wildcards, 23 commands, tab completion, command history, and declarative level validation.

**Architecture:** The engine is a zero-dependency TypeScript library (`packages/engine`) that exposes a `createShell()` factory. Input flows through tokenizer → parser (AST) → expander (vars, globs) → executor (pipes, redirects). Filesystem and env are immutable — every `execute()` returns new state. A shared types package (`packages/shared`) holds the Level schema and validator config types. The monorepo uses Turborepo + pnpm workspaces.

**Tech Stack:** TypeScript 5, Vitest, Turborepo, pnpm workspaces

**Spec:** `docs/superpowers/specs/2026-03-15-cli-quest-v2-design.md`

**Related plans:**
- Plan 2: Backend + Auth + Gamification (not yet written)
- Plan 3: Frontend + UI + Content (not yet written)

---

## Chunk 1: Monorepo Scaffolding + Shared Types

### Task 1: Initialize monorepo root

**Files:**
- Create: `package.json` (root — replace existing)
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Modify: `.gitignore`

- [ ] **Step 1: Back up existing project**

The current V1 codebase will be replaced by the monorepo structure. Move existing source to a `v1/` archive branch for reference.

```bash
git checkout -b v1-archive
git checkout main
```

- [ ] **Step 2: Clean the working directory**

Remove V1 source files that will be replaced. Keep `docs/`, `.gitignore`, `README.md`.

```bash
rm -rf app/ components/ hooks/ lib/ data/ __tests__/ public/
rm -f package.json package-lock.json tsconfig.json tailwind.config.ts postcss.config.js next.config.js vitest.config.ts globals.css
```

- [ ] **Step 3: Create root package.json**

```json
{
  "name": "cli-quest",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "test": "turbo test",
    "lint": "turbo lint",
    "clean": "turbo clean"
  },
  "devDependencies": {
    "turbo": "^2.5.0",
    "typescript": "^5.9.3"
  },
  "packageManager": "pnpm@10.11.0"
}
```

- [ ] **Step 4: Create pnpm-workspace.yaml**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 5: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "lint": {},
    "clean": {
      "cache": false
    }
  }
}
```

- [ ] **Step 6: Create tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

- [ ] **Step 7: Update .gitignore**

Append to existing `.gitignore`:

```
node_modules/
dist/
.turbo/
*.tsbuildinfo
```

- [ ] **Step 8: Create directory structure**

```bash
mkdir -p apps/web packages/engine/src packages/engine/__tests__ packages/shared/src supabase
```

- [ ] **Step 9: Install dependencies and verify**

```bash
pnpm install
pnpm turbo build
```

Expected: installs Turbo and TypeScript, build succeeds (no packages have build scripts yet).

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: initialize Turborepo monorepo structure"
```

---

### Task 2: Create shared types package

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/types.ts`
- Create: `packages/shared/src/constants.ts`
- Create: `packages/shared/src/index.ts`

- [ ] **Step 1: Create packages/shared/package.json**

```json
{
  "name": "@cli-quest/shared",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "typescript": "^5.9.3"
  }
}
```

- [ ] **Step 2: Create packages/shared/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create packages/shared/src/types.ts**

```typescript
// === Filesystem ===

export type FSNode = {
  type: 'file' | 'directory';
  name: string;
  content?: string;
  children?: FSNode[];
  permissions?: string;
  hidden?: boolean;
};

// === Environment ===

export type Env = Record<string, string>;

// === Shell Result ===

export type ShellResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
  fs: FSNode;
  env: Env;
  cwd: string;
};

// === Validator ===

export type ValidatorCondition =
  | { type: 'fileExists'; path: string }
  | { type: 'fileNotExists'; path: string }
  | { type: 'fileContains'; path: string; substring: string }
  | { type: 'fileNotContains'; path: string; substring: string }
  | { type: 'directoryContains'; path: string; childName: string }
  | { type: 'currentPath'; path: string }
  | { type: 'commandUsed'; command: string }
  | { type: 'outputContains'; substring: string }
  | { type: 'envVar'; name: string; value: string };

export type ValidatorConfig =
  | { type: 'all'; conditions: ValidatorConfig[] }
  | { type: 'any'; conditions: ValidatorConfig[] }
  | ValidatorCondition;

// === Dialogue ===

export type DialogueEntry = {
  character: string;
  message: string;
  trigger?: {
    type: 'commandExecuted' | 'levelStart' | 'hintUsed';
    command?: string;
  };
};

// === Hints ===

export type Hint = {
  text: string;
  commandHint?: string;
};

// === Level ===

export type Level = {
  id: string;
  arcId: string;
  chapter: number;
  position: number;
  title: string;
  objective: string;
  briefing: string;
  dialogue?: DialogueEntry[];
  initialFS: FSNode;
  initialEnv?: Env;
  startingPath: string;
  hints: Hint[];
  validator: ValidatorConfig;
  xpReward: number;
  commandsIntroduced?: string[];
  par?: number;
};

// === Validation State (passed to validator) ===

export type ValidationState = {
  fs: FSNode;
  cwd: string;
  env: Env;
  lastOutput: string;
  commandsUsed: string[];
};
```

- [ ] **Step 4: Create packages/shared/src/constants.ts**

```typescript
export const DEFAULT_LINE_COUNT = 10;
export const HOME_DIRECTORY = '/home/user';
export const MAX_REGEX_LENGTH = 100;

export const PLAYER_LEVELS = [
  'intern',
  'junior',
  'mid',
  'senior',
  'staff',
  'principal',
] as const;

export type PlayerLevel = typeof PLAYER_LEVELS[number];

export const MASTERY_TIERS = ['learned', 'practiced', 'mastered'] as const;
export type MasteryTier = typeof MASTERY_TIERS[number];

export const MASTERY_THRESHOLDS = {
  practiced: 10,
  mastered: 25,
} as const;

export const DECAY_DAYS = 7;
export const MAX_REVIEW_QUEUE = 3;
```

- [ ] **Step 5: Create packages/shared/src/index.ts**

```typescript
export * from './types';
export * from './constants';
```

- [ ] **Step 6: Verify build**

```bash
pnpm --filter @cli-quest/shared build
```

Expected: compiles with no errors.

- [ ] **Step 7: Commit**

```bash
git add packages/shared/
git commit -m "feat: add shared types package with Level, Validator, and FS types"
```

---

### Task 3: Scaffold engine package

**Files:**
- Create: `packages/engine/package.json`
- Create: `packages/engine/tsconfig.json`
- Create: `packages/engine/vitest.config.ts`
- Create: `packages/engine/src/index.ts` (stub)
- Create: `packages/engine/src/types.ts`

- [ ] **Step 1: Create packages/engine/package.json**

```json
{
  "name": "@cli-quest/engine",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@cli-quest/shared": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.9.3",
    "vitest": "^4.1.0"
  }
}
```

- [ ] **Step 2: Create packages/engine/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create packages/engine/vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['__tests__/**/*.test.ts'],
  },
});
```

- [ ] **Step 4: Create packages/engine/src/types.ts**

Internal engine types (not exported from shared — these are implementation details):

```typescript
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
  fs: import('@cli-quest/shared').FSNode;
  env: import('@cli-quest/shared').Env;
  cwd: string;
  history?: string[];
};

export type CommandOutput = {
  stdout: string;
  stderr: string;
  exitCode: number;
  fs?: import('@cli-quest/shared').FSNode;
  env?: import('@cli-quest/shared').Env;
  cwd?: string;
};

export type CommandHandler = (ctx: CommandContext) => CommandOutput;
```

- [ ] **Step 5: Create packages/engine/src/index.ts** (stub)

```typescript
export { createShell } from './shell/shell';
export type { Shell } from './shell/shell';
```

This will fail to compile initially — that's expected. We'll implement `shell.ts` in Chunk 4.

- [ ] **Step 6: Create test fixtures**

Create `packages/engine/__tests__/fixtures.ts`:

```typescript
import type { FSNode, Env } from '@cli-quest/shared';

export const testFS: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'home',
      children: [
        {
          type: 'directory',
          name: 'user',
          children: [
            {
              type: 'file',
              name: 'hello.txt',
              content: 'Hello World\nSecond line\nThird line',
            },
            {
              type: 'file',
              name: 'data.csv',
              content: 'name,age\nAlice,30\nBob,25\nCharlie,35',
            },
            {
              type: 'directory',
              name: 'docs',
              children: [
                {
                  type: 'file',
                  name: 'readme.md',
                  content: '# README\nThis is a readme file.',
                },
              ],
            },
            {
              type: 'directory',
              name: 'empty',
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

export const defaultEnv: Env = {
  HOME: '/home/user',
  USER: 'user',
  PWD: '/home/user',
  PATH: '/usr/bin',
};
```

- [ ] **Step 7: Install dependencies**

```bash
pnpm install
```

- [ ] **Step 8: Commit**

```bash
git add packages/engine/
git commit -m "feat: scaffold engine package with types and test fixtures"
```

---

## Chunk 2: Filesystem + Parser

### Task 4: Implement filesystem operations

**Files:**
- Create: `packages/engine/src/filesystem/operations.ts`
- Create: `packages/engine/__tests__/filesystem/operations.test.ts`

- [ ] **Step 1: Write filesystem operation tests**

Create `packages/engine/__tests__/filesystem/operations.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import {
  resolvePath,
  getNode,
  listDirectory,
  createNode,
  deleteNode,
  cloneFS,
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

  it('finds a nested file', () => {
    const node = getNode(testFS, '/home/user/hello.txt');
    expect(node?.type).toBe('file');
    expect(node?.content).toContain('Hello World');
  });

  it('returns null for non-existent path', () => {
    expect(getNode(testFS, '/nonexistent')).toBeNull();
  });
});

describe('createNode', () => {
  it('creates a file without mutating original', () => {
    const fs = structuredClone(testFS);
    const original = getNode(fs, '/home/user')!.children!.length;
    const newFS = createNode(fs, '/home/user/new.txt', {
      type: 'file', name: '', content: 'new',
    });
    expect(getNode(newFS, '/home/user/new.txt')?.content).toBe('new');
    expect(getNode(fs, '/home/user')!.children!.length).toBe(original);
  });

  it('throws if file already exists', () => {
    expect(() => createNode(
      structuredClone(testFS),
      '/home/user/hello.txt',
      { type: 'file', name: '', content: '' }
    )).toThrow('File or directory already exists');
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
});

describe('listDirectory', () => {
  it('lists sorted children', () => {
    const node = getNode(testFS, '/home/user')!;
    expect(listDirectory(node)).toEqual(['data.csv', 'docs', 'empty', 'hello.txt']);
  });
});

describe('cloneFS', () => {
  it('deep clones without shared references', () => {
    const clone = cloneFS(testFS);
    expect(clone).toEqual(testFS);
    expect(clone).not.toBe(testFS);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd packages/engine && pnpm test
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement filesystem operations**

Create `packages/engine/src/filesystem/operations.ts`. Port the immutable implementation from V1 (`lib/fileSystem.ts`) with the addition of tilde expansion in `resolvePath`:

```typescript
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
    // File exists — update content via updateAtPath
    const parts = path.split('/').filter(Boolean);
    const fileName = parts[parts.length - 1];
    return updateAtPath(fs, parts.slice(0, -1), (parent) => ({
      ...parent,
      children: parent.children!.map((c) =>
        c.name === fileName ? { ...c, content } : c
      ),
    }));
  }
  // File doesn't exist — create it
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd packages/engine && pnpm test
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add packages/engine/src/filesystem/ packages/engine/__tests__/filesystem/
git commit -m "feat(engine): implement immutable filesystem operations with tilde expansion"
```

---

### Task 5: Implement glob matching

**Files:**
- Create: `packages/engine/src/filesystem/glob.ts`
- Create: `packages/engine/__tests__/filesystem/glob.test.ts`

- [ ] **Step 1: Write glob tests**

```typescript
import { describe, it, expect } from 'vitest';
import { matchGlob, expandGlob } from '../../src/filesystem/glob';
import { testFS } from '../fixtures';

describe('matchGlob', () => {
  it('matches * wildcard', () => {
    expect(matchGlob('hello.txt', '*.txt')).toBe(true);
    expect(matchGlob('hello.md', '*.txt')).toBe(false);
  });

  it('matches ? wildcard', () => {
    expect(matchGlob('a.txt', '?.txt')).toBe(true);
    expect(matchGlob('ab.txt', '?.txt')).toBe(false);
  });

  it('matches exact strings', () => {
    expect(matchGlob('hello.txt', 'hello.txt')).toBe(true);
    expect(matchGlob('hello.txt', 'other.txt')).toBe(false);
  });
});

describe('expandGlob', () => {
  it('expands *.txt in /home/user', () => {
    const results = expandGlob(testFS, '/home/user', '*.txt');
    expect(results).toContain('hello.txt');
    expect(results).not.toContain('docs');
  });

  it('returns pattern unchanged if no matches', () => {
    const results = expandGlob(testFS, '/home/user', '*.xyz');
    expect(results).toEqual(['*.xyz']);
  });

  it('expands path-based globs', () => {
    const results = expandGlob(testFS, '/', 'home/user/*.txt');
    expect(results).toContain('home/user/hello.txt');
  });
});
```

- [ ] **Step 2: Run tests to verify fail**

```bash
cd packages/engine && pnpm test
```

- [ ] **Step 3: Implement glob matching**

Create `packages/engine/src/filesystem/glob.ts`:

```typescript
import type { FSNode } from '@cli-quest/shared';
import { getNode } from './operations';

export function matchGlob(name: string, pattern: string): boolean {
  const regex = globToRegex(pattern);
  return regex.test(name);
}

function globToRegex(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  return new RegExp(`^${escaped}$`);
}

export function expandGlob(fs: FSNode, cwd: string, pattern: string): string[] {
  // Split pattern into directory part and filename part
  const lastSlash = pattern.lastIndexOf('/');
  const dirPart = lastSlash >= 0 ? pattern.slice(0, lastSlash) : '';
  const filePart = lastSlash >= 0 ? pattern.slice(lastSlash + 1) : pattern;

  // If no wildcard characters, return as-is
  if (!filePart.includes('*') && !filePart.includes('?')) {
    return [pattern];
  }

  // Resolve the directory to search in
  const searchDir = dirPart
    ? (dirPart.startsWith('/') ? dirPart : cwd + '/' + dirPart)
    : cwd;

  const dirNode = getNode(fs, searchDir);
  if (!dirNode || dirNode.type !== 'directory' || !dirNode.children) {
    return [pattern];
  }

  const matches = dirNode.children
    .filter((child) => matchGlob(child.name, filePart))
    .map((child) => (dirPart ? dirPart + '/' + child.name : child.name));

  return matches.length > 0 ? matches.sort() : [pattern];
}
```

- [ ] **Step 4: Run tests to verify pass**

```bash
cd packages/engine && pnpm test
```

- [ ] **Step 5: Commit**

```bash
git add packages/engine/src/filesystem/glob.ts packages/engine/__tests__/filesystem/glob.test.ts
git commit -m "feat(engine): implement glob pattern matching and expansion"
```

---

### Task 6: Implement tokenizer

**Files:**
- Create: `packages/engine/src/parser/tokenizer.ts`
- Create: `packages/engine/__tests__/parser/tokenizer.test.ts`

- [ ] **Step 1: Write tokenizer tests**

Create `packages/engine/__tests__/parser/tokenizer.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { tokenize } from '../../src/parser/tokenizer';

describe('tokenize', () => {
  it('tokenizes a simple command', () => {
    expect(tokenize('ls')).toEqual([{ type: 'word', value: 'ls' }]);
  });

  it('tokenizes command with args', () => {
    const tokens = tokenize('cat file.txt');
    expect(tokens).toEqual([
      { type: 'word', value: 'cat' },
      { type: 'word', value: 'file.txt' },
    ]);
  });

  it('tokenizes pipe', () => {
    const tokens = tokenize('grep err log | wc -l');
    expect(tokens).toEqual([
      { type: 'word', value: 'grep' },
      { type: 'word', value: 'err' },
      { type: 'word', value: 'log' },
      { type: 'pipe' },
      { type: 'word', value: 'wc' },
      { type: 'word', value: '-l' },
    ]);
  });

  it('tokenizes redirect operators', () => {
    expect(tokenize('echo hi > out.txt')).toContainEqual({ type: 'redirect_out' });
    expect(tokenize('echo hi >> out.txt')).toContainEqual({ type: 'redirect_append' });
    expect(tokenize('wc < in.txt')).toContainEqual({ type: 'redirect_in' });
  });

  it('tokenizes && and || and ;', () => {
    expect(tokenize('a && b')).toContainEqual({ type: 'and' });
    expect(tokenize('a || b')).toContainEqual({ type: 'or' });
    expect(tokenize('a ; b')).toContainEqual({ type: 'semicolon' });
  });

  it('handles double-quoted strings', () => {
    const tokens = tokenize('echo "hello world"');
    expect(tokens).toEqual([
      { type: 'word', value: 'echo' },
      { type: 'word', value: 'hello world' },
    ]);
  });

  it('handles single-quoted strings', () => {
    const tokens = tokenize("echo 'hello world'");
    expect(tokens).toEqual([
      { type: 'word', value: 'echo' },
      { type: 'word', value: 'hello world' },
    ]);
  });

  it('handles empty input', () => {
    expect(tokenize('')).toEqual([]);
    expect(tokenize('   ')).toEqual([]);
  });

  it('handles escaped characters', () => {
    const tokens = tokenize('echo hello\\ world');
    expect(tokens).toEqual([
      { type: 'word', value: 'echo' },
      { type: 'word', value: 'hello world' },
    ]);
  });
});
```

- [ ] **Step 2: Run tests to verify fail**

- [ ] **Step 3: Implement tokenizer**

Create `packages/engine/src/parser/tokenizer.ts`:

```typescript
import type { Token } from '../types';

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const src = input.trim();

  while (i < src.length) {
    // Skip whitespace
    if (src[i] === ' ' || src[i] === '\t') { i++; continue; }

    // Two-char operators
    if (src[i] === '>' && src[i + 1] === '>') { tokens.push({ type: 'redirect_append' }); i += 2; continue; }
    if (src[i] === '&' && src[i + 1] === '&') { tokens.push({ type: 'and' }); i += 2; continue; }
    if (src[i] === '|' && src[i + 1] === '|') { tokens.push({ type: 'or' }); i += 2; continue; }

    // Single-char operators
    if (src[i] === '|') { tokens.push({ type: 'pipe' }); i++; continue; }
    if (src[i] === '>') { tokens.push({ type: 'redirect_out' }); i++; continue; }
    if (src[i] === '<') { tokens.push({ type: 'redirect_in' }); i++; continue; }
    if (src[i] === ';') { tokens.push({ type: 'semicolon' }); i++; continue; }

    // Quoted strings
    if (src[i] === '"' || src[i] === "'") {
      const quote = src[i];
      i++;
      let value = '';
      while (i < src.length && src[i] !== quote) {
        if (src[i] === '\\' && quote === '"' && i + 1 < src.length) {
          i++;
          value += src[i];
        } else {
          value += src[i];
        }
        i++;
      }
      i++; // skip closing quote
      tokens.push({ type: 'word', value });
      continue;
    }

    // Unquoted word
    let value = '';
    while (i < src.length && !' \t|><;&'.includes(src[i])) {
      if (src[i] === '\\' && i + 1 < src.length) {
        i++;
        value += src[i];
      } else {
        value += src[i];
      }
      i++;
    }
    if (value) tokens.push({ type: 'word', value });
  }

  return tokens;
}
```

- [ ] **Step 4: Run tests to verify pass**

- [ ] **Step 5: Commit**

```bash
git add packages/engine/src/parser/tokenizer.ts packages/engine/__tests__/parser/tokenizer.test.ts
git commit -m "feat(engine): implement shell tokenizer with quotes, escapes, operators"
```

---

### Task 7: Implement parser (tokens → AST)

**Files:**
- Create: `packages/engine/src/parser/parser.ts`
- Create: `packages/engine/__tests__/parser/parser.test.ts`

- [ ] **Step 1: Write parser tests**

Create `packages/engine/__tests__/parser/parser.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { parse } from '../../src/parser/parser';

describe('parse', () => {
  it('parses a simple command', () => {
    const ast = parse('ls -la');
    expect(ast).toEqual({
      type: 'list',
      entries: [{
        command: {
          type: 'pipeline',
          commands: [{ type: 'command', name: 'ls', args: ['-la'] }],
        },
      }],
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

  it('parses command chaining with ;', () => {
    const ast = parse('echo a ; echo b');
    expect(ast.entries).toHaveLength(2);
    expect(ast.entries[0].operator).toBe(';');
  });

  it('parses empty input', () => {
    const ast = parse('');
    expect(ast.entries).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run tests to verify fail**

- [ ] **Step 3: Implement parser**

Create `packages/engine/src/parser/parser.ts`:

```typescript
import { tokenize } from './tokenizer';
import type { Token, SimpleCommand, Pipeline, Redirect, CommandList } from '../types';

export function parse(input: string): CommandList {
  const tokens = tokenize(input);
  if (tokens.length === 0) return { type: 'list', entries: [] };

  const entries: CommandList['entries'] = [];
  let pos = 0;

  while (pos < tokens.length) {
    // Parse a pipeline (one or more commands joined by |)
    const pipeline = parsePipeline();

    // Check for redirect after the pipeline
    const command = maybeParseRedirect(pipeline);

    // Check for chaining operator
    let operator: '&&' | '||' | ';' | undefined;
    if (pos < tokens.length) {
      const tok = tokens[pos];
      if (tok.type === 'and') { operator = '&&'; pos++; }
      else if (tok.type === 'or') { operator = '||'; pos++; }
      else if (tok.type === 'semicolon') { operator = ';'; pos++; }
    }

    entries.push({ command, operator });
  }

  // Last entry shouldn't have an operator
  if (entries.length > 0 && entries[entries.length - 1].operator) {
    // Trailing operator with no following command — remove operator
    delete entries[entries.length - 1].operator;
  }

  return { type: 'list', entries };

  function parsePipeline(): Pipeline {
    const commands: SimpleCommand[] = [];
    commands.push(parseSimpleCommand());

    while (pos < tokens.length && tokens[pos].type === 'pipe') {
      pos++; // skip |
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
    while (
      pos < tokens.length &&
      tokens[pos].type === 'word'
    ) {
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
        return pipeline; // malformed redirect, return pipeline as-is
      }
      pos++;
      const operator =
        tok.type === 'redirect_out' ? '>' :
        tok.type === 'redirect_append' ? '>>' : '<';
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
```

- [ ] **Step 4: Run tests to verify pass**

- [ ] **Step 5: Commit**

```bash
git add packages/engine/src/parser/parser.ts packages/engine/__tests__/parser/parser.test.ts
git commit -m "feat(engine): implement shell parser producing AST with pipes, redirects, chains"
```

---

## Chunk 3: Commands

### Task 8: Implement command registry + navigation commands

**Files:**
- Create: `packages/engine/src/commands/registry.ts`
- Create: `packages/engine/src/commands/navigation.ts`
- Create: `packages/engine/__tests__/commands/navigation.test.ts`

- [ ] **Step 1: Write command registry**

Create `packages/engine/src/commands/registry.ts`:

```typescript
import type { CommandHandler } from '../types';

const commands = new Map<string, CommandHandler>();

export function registerCommand(name: string, handler: CommandHandler): void {
  commands.set(name, handler);
}

export function getCommand(name: string): CommandHandler | undefined {
  return commands.get(name);
}

export function getRegisteredCommands(): string[] {
  return Array.from(commands.keys()).sort();
}
```

- [ ] **Step 2: Write navigation command tests**

Create `packages/engine/__tests__/commands/navigation.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { pwd, ls, cd } from '../../src/commands/navigation';
import { testFS, defaultEnv } from '../fixtures';
import type { CommandContext } from '../../src/types';

function ctx(overrides: Partial<CommandContext> = {}): CommandContext {
  return { args: [], stdin: '', fs: structuredClone(testFS), env: { ...defaultEnv }, cwd: '/home/user', ...overrides };
}

describe('pwd', () => {
  it('returns current directory', () => {
    expect(pwd(ctx()).stdout).toBe('/home/user');
  });
});

describe('ls', () => {
  it('lists current directory', () => {
    const out = ls(ctx());
    expect(out.stdout).toContain('hello.txt');
    expect(out.stdout).toContain('docs');
  });

  it('lists specified directory', () => {
    const out = ls(ctx({ args: ['/home/user/docs'] }));
    expect(out.stdout).toContain('readme.md');
  });

  it('errors on non-existent path', () => {
    const out = ls(ctx({ args: ['/nope'] }));
    expect(out.exitCode).toBe(1);
    expect(out.stderr).toContain('No such file');
  });

  it('supports -l flag', () => {
    const out = ls(ctx({ args: ['-l'] }));
    expect(out.stdout).toContain('rw-');
  });

  it('supports -a flag to show hidden files', () => {
    const fsWithHidden = structuredClone(testFS);
    fsWithHidden.children![0].children![0].children!.push({
      type: 'file', name: '.hidden', content: '', hidden: true,
    });
    const out = ls(ctx({ fs: fsWithHidden, args: ['-a'] }));
    expect(out.stdout).toContain('.hidden');
  });
});

describe('cd', () => {
  it('changes to absolute path', () => {
    const out = cd(ctx({ args: ['/home'] }));
    expect(out.cwd).toBe('/home');
  });

  it('changes to relative path', () => {
    const out = cd(ctx({ args: ['docs'] }));
    expect(out.cwd).toBe('/home/user/docs');
  });

  it('defaults to HOME', () => {
    const out = cd(ctx({ cwd: '/' }));
    expect(out.cwd).toBe('/home/user');
  });

  it('errors on non-directory', () => {
    const out = cd(ctx({ args: ['hello.txt'] }));
    expect(out.exitCode).toBe(1);
  });
});
```

- [ ] **Step 3: Run tests to verify fail**

- [ ] **Step 4: Implement navigation commands**

Create `packages/engine/src/commands/navigation.ts`:

```typescript
import type { CommandContext, CommandOutput } from '../types';
import { getNode, listDirectory, resolvePath } from '../filesystem/operations';

export function pwd(ctx: CommandContext): CommandOutput {
  return { stdout: ctx.cwd, stderr: '', exitCode: 0 };
}

export function ls(ctx: CommandContext): CommandOutput {
  // Parse flags from args
  const flags = new Set<string>();
  const paths: string[] = [];
  for (const arg of ctx.args) {
    if (arg.startsWith('-')) {
      for (const ch of arg.slice(1)) flags.add(ch);
    } else {
      paths.push(arg);
    }
  }

  const targetPath = paths[0]
    ? resolvePath(ctx.cwd, paths[0], ctx.env.HOME)
    : ctx.cwd;
  const node = getNode(ctx.fs, targetPath);

  if (!node) {
    return { stdout: '', stderr: `ls: cannot access '${paths[0] || targetPath}': No such file or directory`, exitCode: 1 };
  }

  if (node.type !== 'directory') {
    return { stdout: node.name, stderr: '', exitCode: 0 };
  }

  let items = listDirectory(node);
  if (!flags.has('a')) {
    // Filter out hidden files by default
    items = items.filter((name) => {
      const child = node.children?.find((c) => c.name === name);
      return !child?.hidden && !name.startsWith('.');
    });
  }

  if (items.length === 0) return { stdout: '', stderr: '', exitCode: 0 };

  if (flags.has('l')) {
    const lines = items.map((name) => {
      const child = node.children?.find((c) => c.name === name);
      const t = child?.type === 'directory' ? 'd' : '-';
      const size = child?.content?.length || 0;
      return `${t}rw-r--r--  1 user  user  ${size.toString().padStart(8)} ${name}`;
    });
    return { stdout: lines.join('\n'), stderr: '', exitCode: 0 };
  }

  return { stdout: items.join('  '), stderr: '', exitCode: 0 };
}

export function cd(ctx: CommandContext): CommandOutput {
  const target = ctx.args[0] || ctx.env.HOME || '/home/user';
  const targetPath = resolvePath(ctx.cwd, target, ctx.env.HOME);
  const node = getNode(ctx.fs, targetPath);

  if (!node) {
    return { stdout: '', stderr: `cd: ${ctx.args[0]}: No such file or directory`, exitCode: 1 };
  }
  if (node.type !== 'directory') {
    return { stdout: '', stderr: `cd: ${ctx.args[0]}: Not a directory`, exitCode: 1 };
  }

  return { stdout: '', stderr: '', exitCode: 0, cwd: targetPath };
}
```

- [ ] **Step 5: Run tests to verify pass**

- [ ] **Step 6: Commit**

```bash
git add packages/engine/src/commands/ packages/engine/__tests__/commands/
git commit -m "feat(engine): implement command registry + pwd, ls, cd with flag support"
```

---

### Task 9: Implement file operation commands

**Files:**
- Create: `packages/engine/src/commands/file-ops.ts`
- Create: `packages/engine/__tests__/commands/file-ops.test.ts`

- [ ] **Step 1: Write file-ops tests**

Cover: `cat`, `touch`, `mkdir`, `rm` (with -r), `cp`, `mv`, `chmod`. Each command tests happy path, error cases (missing operand, not found, is-a-directory where applicable). See V1 tests for patterns. Key additions:
- `chmod` tests: verify permissions string updates on node
- `mv`/`cp` tests: verify destination-exists check
- All tests verify immutability (original FS unchanged)

- [ ] **Step 2: Run tests to verify fail**

- [ ] **Step 3: Implement file-ops commands**

Create `packages/engine/src/commands/file-ops.ts` with all 7 commands. Each follows the `CommandContext → CommandOutput` signature. Return `fs` in output when FS is modified. `chmod` updates the `permissions` field on the target node.

- [ ] **Step 4: Run tests to verify pass**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(engine): implement cat, touch, mkdir, rm, cp, mv, chmod commands"
```

---

### Task 10: Implement search commands

**Files:**
- Create: `packages/engine/src/commands/search.ts`
- Create: `packages/engine/__tests__/commands/search.test.ts`

- [ ] **Step 1: Write search tests**

Cover: `grep` (pattern matching, -i flag, stdin support for pipes, invalid regex error), `find` (-name with globs, -type f/d, boolean flag handling). Key additions over V1:
- `grep` accepts stdin (for `cat file | grep pattern` — reads from `ctx.stdin` when no file arg)
- `find` uses `safeRegex` for pattern validation

- [ ] **Step 2: Run tests to verify fail**

- [ ] **Step 3: Implement search commands**

Create `packages/engine/src/commands/search.ts`. `grep` checks `ctx.stdin` first — if non-empty and no file argument, search stdin lines. Otherwise, resolve file path and search file content.

- [ ] **Step 4: Run tests to verify pass**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(engine): implement grep (with stdin) and find commands"
```

---

### Task 11: Implement text processing commands

**Files:**
- Create: `packages/engine/src/commands/text.ts`
- Create: `packages/engine/__tests__/commands/text.test.ts`

- [ ] **Step 1: Write text command tests**

Cover: `head` (-n flag, boolean flag, stdin), `tail` (-n flag, stdin), `wc` (-l, -w, -c flags, stdin), `echo` (args joined), `sort` (stdin and file, -r reverse), `uniq` (stdin and file, -c count).

Key: all text commands support both file argument AND stdin. When stdin is non-empty and no file arg, operate on stdin. This enables pipes like `cat file | sort | uniq`.

- [ ] **Step 2: Run tests to verify fail**

- [ ] **Step 3: Implement text commands**

Create `packages/engine/src/commands/text.ts`. Each command follows pattern: if args has a file path, read from file; else if `ctx.stdin` is non-empty, use stdin; else error. `sort` splits lines, sorts alphabetically (or reverse with -r). `uniq` removes adjacent duplicate lines (or with -c, prefixes count).

Important: `echo` must NOT append a trailing newline to stdout. The redirect system handles newlines — `>` writes content as-is, `>>` prepends `\n` before appending if the file already has content. This ensures `echo line1 > f && echo line2 >> f` produces `line1\nline2`.

- [ ] **Step 4: Run tests to verify pass**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(engine): implement head, tail, wc, echo, sort, uniq with stdin support"
```

---

### Task 12: Implement env and system commands

**Files:**
- Create: `packages/engine/src/commands/env.ts`
- Create: `packages/engine/src/commands/system.ts`
- Create: `packages/engine/__tests__/commands/env.test.ts`
- Create: `packages/engine/__tests__/commands/system.test.ts`

- [ ] **Step 1: Write env command tests**

Cover:
- `export VAR=value` → returns updated env with VAR set
- `export` with no args → lists all env vars
- `env` → lists all env vars (same as export with no args)

- [ ] **Step 2: Write system command tests**

Cover:
- `clear` → returns `__CLEAR__` stdout signal
- `history` → returns numbered list of commands (from ctx, not tested here — tested in integration)
- `man ls` → returns help text for ls command
- `man` with no args → lists available commands

- [ ] **Step 3: Run tests to verify fail**

- [ ] **Step 4: Implement env commands**

Create `packages/engine/src/commands/env.ts`:
- `exportCmd`: parse `VAR=value` from args, return `{ env: { ...ctx.env, [name]: value } }`
- `envCmd`: return formatted list of env vars

- [ ] **Step 5: Implement system commands**

Create `packages/engine/src/commands/system.ts`:
- `clear`: return `{ stdout: '__CLEAR__' }`
- `history`: return `{ stdout: numberedHistoryList }` — reads from `ctx.history` array (passed by executor via `CommandContext.history`)
- `man`: lookup command name in a help text map, return description

- [ ] **Step 6: Run tests to verify pass**

- [ ] **Step 7: Register all commands**

Create `packages/engine/src/commands/index.ts`:

```typescript
import { registerCommand } from './registry';
import { pwd, ls, cd } from './navigation';
import { cat, touch, mkdir, rm, cp, mv, chmod } from './file-ops';
import { grep, find } from './search';
import { head, tail, wc, echo, sort, uniq } from './text';
import { exportCmd, envCmd } from './env';
import { clear, history, man } from './system';

export function registerAllCommands(): void {
  registerCommand('pwd', pwd);
  registerCommand('ls', ls);
  registerCommand('cd', cd);
  registerCommand('cat', cat);
  registerCommand('touch', touch);
  registerCommand('mkdir', mkdir);
  registerCommand('rm', rm);
  registerCommand('cp', cp);
  registerCommand('mv', mv);
  registerCommand('chmod', chmod);
  registerCommand('grep', grep);
  registerCommand('find', find);
  registerCommand('head', head);
  registerCommand('tail', tail);
  registerCommand('wc', wc);
  registerCommand('echo', echo);
  registerCommand('sort', sort);
  registerCommand('uniq', uniq);
  registerCommand('export', exportCmd);
  registerCommand('env', envCmd);
  registerCommand('clear', clear);
  registerCommand('history', history);
  registerCommand('man', man);
}
```

- [ ] **Step 8: Commit**

```bash
git commit -m "feat(engine): implement export, env, clear, history, man + register all 23 commands"
```

---

## Chunk 4: Execution, Completion, Validator, and Public API

### Task 13: Implement expander (env vars, globs, tilde)

**Files:**
- Create: `packages/engine/src/shell/expander.ts`
- Create: `packages/engine/__tests__/shell/expander.test.ts`

- [ ] **Step 1: Write expander tests**

```typescript
import { describe, it, expect } from 'vitest';
import { expandWord, expandArgs } from '../../src/shell/expander';
import { testFS, defaultEnv } from '../fixtures';

describe('expandWord', () => {
  it('expands $VAR', () => {
    expect(expandWord('$HOME', defaultEnv)).toBe('/home/user');
  });

  it('expands ${VAR}', () => {
    expect(expandWord('${USER}', defaultEnv)).toBe('user');
  });

  it('leaves undefined vars empty', () => {
    expect(expandWord('$NOPE', defaultEnv)).toBe('');
  });

  it('expands vars within strings', () => {
    expect(expandWord('hello $USER bye', defaultEnv)).toBe('hello user bye');
  });

  it('expands tilde', () => {
    expect(expandWord('~/docs', defaultEnv)).toBe('/home/user/docs');
  });
});

describe('expandArgs', () => {
  it('expands glob patterns', () => {
    const result = expandArgs(['*.txt'], testFS, '/home/user', defaultEnv);
    expect(result).toContain('hello.txt');
    expect(result).not.toContain('data.csv');
  });

  it('leaves non-glob args unchanged', () => {
    const result = expandArgs(['hello.txt'], testFS, '/home/user', defaultEnv);
    expect(result).toEqual(['hello.txt']);
  });
});
```

- [ ] **Step 2: Run tests to verify fail**

- [ ] **Step 3: Implement expander**

Create `packages/engine/src/shell/expander.ts`:
- `expandWord(word, env)`: replace `$VAR` and `${VAR}` patterns with env values, expand `~` to `$HOME`
- `expandArgs(args, fs, cwd, env)`: for each arg, expand env vars first, then if it contains `*` or `?`, expand globs

- [ ] **Step 4: Run tests to verify pass**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(engine): implement shell expander for env vars, globs, tilde"
```

---

### Task 14: Implement executor (AST → results, pipes, redirects)

**Files:**
- Create: `packages/engine/src/shell/executor.ts`
- Create: `packages/engine/__tests__/shell/executor.test.ts`

- [ ] **Step 1: Write executor tests**

```typescript
import { describe, it, expect } from 'vitest';
import { execute } from '../../src/shell/executor';
import { getNode } from '../../src/filesystem/operations';
import { testFS, defaultEnv } from '../fixtures';
import { registerAllCommands } from '../../src/commands';

registerAllCommands();

describe('execute', () => {
  it('executes a simple command', () => {
    const result = execute('pwd', structuredClone(testFS), defaultEnv, '/home/user', []);
    expect(result.stdout).toBe('/home/user');
    expect(result.exitCode).toBe(0);
  });

  it('executes a pipeline', () => {
    const result = execute('cat hello.txt | wc -l', structuredClone(testFS), defaultEnv, '/home/user', []);
    expect(result.stdout.trim()).toBe('3');
  });

  it('executes output redirect', () => {
    const result = execute('echo hello > new.txt', structuredClone(testFS), defaultEnv, '/home/user', []);
    const file = getNode(result.fs, '/home/user/new.txt');
    expect(file?.content).toBe('hello');
  });

  it('executes append redirect', () => {
    const fs = structuredClone(testFS);
    const result1 = execute('echo line1 > out.txt', fs, defaultEnv, '/home/user', []);
    const result2 = execute('echo line2 >> out.txt', result1.fs, defaultEnv, '/home/user', []);
    expect(getNode(result2.fs, '/home/user/out.txt')?.content).toBe('line1\nline2');
  });

  it('executes input redirect', () => {
    const result = execute('wc -l < hello.txt', structuredClone(testFS), defaultEnv, '/home/user', []);
    expect(result.stdout.trim()).toContain('3');
  });

  it('executes && chaining (success)', () => {
    const result = execute('mkdir newdir && cd newdir', testFS, defaultEnv, '/home/user', []);
    expect(result.cwd).toBe('/home/user/newdir');
  });

  it('executes && chaining (failure stops)', () => {
    const result = execute('cd nonexistent && echo yes', testFS, defaultEnv, '/home/user', []);
    expect(result.stdout).toBe('');
    expect(result.exitCode).not.toBe(0);
  });

  it('executes || chaining (runs on failure)', () => {
    const result = execute('cd nonexistent || echo fallback', testFS, defaultEnv, '/home/user', []);
    expect(result.stdout).toBe('fallback');
  });

  it('expands environment variables', () => {
    const result = execute('echo $HOME', testFS, defaultEnv, '/home/user', []);
    expect(result.stdout).toBe('/home/user');
  });

  it('expands wildcards', () => {
    const result = execute('echo *.txt', testFS, defaultEnv, '/home/user', []);
    expect(result.stdout).toContain('hello.txt');
  });

  it('returns error for unknown command', () => {
    const result = execute('foobar', testFS, defaultEnv, '/home/user', []);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain('command not found');
  });
});
```

Note: some of these tests use dynamic imports — refactor to static imports in implementation. The test structure shows intent.

- [ ] **Step 2: Run tests to verify fail**

- [ ] **Step 3: Implement executor**

Create `packages/engine/src/shell/executor.ts`:

The executor walks the `CommandList` AST:
1. For each entry, execute the `Pipeline` or `Redirect`
2. For pipelines: execute commands left-to-right, feeding stdout of one as stdin of next
3. For redirects: execute the pipeline, then write stdout to file (`>` creates/overwrites, `>>` appends), or read file content as stdin (`<`)
4. For chaining: `&&` skips next if exitCode !== 0, `||` skips next if exitCode === 0, `;` always continues
5. Before executing each command: expand env vars in args, expand globs in args
6. Update `cwd` and `env` across chained commands (cd in first affects second)
7. Track `commandsUsed` list for validator

```typescript
import type { FSNode, Env } from '@cli-quest/shared';
import { parse } from '../parser/parser';
import type { CommandList, Pipeline, Redirect, SimpleCommand } from '../types';
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
  existingCommandsUsed: string[]
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
    const operator = i > 0 ? ast.entries[i - 1].operator : undefined;

    // Handle chaining logic
    if (operator === '&&' && lastExitCode !== 0) continue;
    if (operator === '||' && lastExitCode === 0) continue;

    const result = executeEntry(entry.command, currentFS, currentEnv, currentCwd, '', commandsUsed);
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
  commandsUsed: string[]
): ExecuteResult {
  if (node.type === 'redirect') {
    return executeRedirect(node, fs, env, cwd, commandsUsed);
  }
  return executePipeline(node, fs, env, cwd, stdin, commandsUsed);
}

function executePipeline(
  pipeline: Pipeline,
  fs: FSNode,
  env: Env,
  cwd: string,
  stdin: string,
  commandsUsed: string[]
): ExecuteResult {
  let currentStdin = stdin;
  let currentFS = fs;
  let currentEnv = env;
  let currentCwd = cwd;
  let lastResult: ExecuteResult = {
    stdout: '', stderr: '', exitCode: 0, fs, env, cwd, commandsUsed,
  };

  for (const cmd of pipeline.commands) {
    if (!cmd.name) continue;
    const expandedArgs = expandArgs(
      cmd.args.map((a) => expandWord(a, currentEnv)),
      currentFS, currentCwd, currentEnv
    );
    const handler = getCommand(cmd.name);
    if (!handler) {
      return {
        stdout: '', stderr: `${cmd.name}: command not found`,
        exitCode: 127, fs: currentFS, env: currentEnv, cwd: currentCwd, commandsUsed,
      };
    }

    commandsUsed.push(cmd.name);
    const output = handler({
      args: expandedArgs,
      stdin: currentStdin,
      fs: currentFS,
      env: currentEnv,
      cwd: currentCwd,
    });

    currentFS = output.fs || currentFS;
    currentEnv = output.env || currentEnv;
    currentCwd = output.cwd || currentCwd;
    currentStdin = output.stdout;

    lastResult = {
      stdout: output.stdout,
      stderr: output.stderr,
      exitCode: output.exitCode,
      fs: currentFS,
      env: currentEnv,
      cwd: currentCwd,
      commandsUsed,
    };
  }

  return lastResult;
}

function executeRedirect(
  redirect: Redirect,
  fs: FSNode,
  env: Env,
  cwd: string,
  commandsUsed: string[]
): ExecuteResult {
  if (redirect.operator === '<') {
    // Input redirect: read file, pass as stdin
    const filePath = resolvePath(cwd, expandWord(redirect.target, env), env.HOME);
    const node = getNode(fs, filePath);
    if (!node || node.type !== 'file') {
      return {
        stdout: '', stderr: `${redirect.target}: No such file`,
        exitCode: 1, fs, env, cwd, commandsUsed,
      };
    }
    return executePipeline(redirect.command, fs, env, cwd, node.content || '', commandsUsed);
  }

  // Output redirect: execute pipeline, write stdout to file
  const result = executePipeline(redirect.command, fs, env, cwd, '', commandsUsed);
  const filePath = resolvePath(cwd, expandWord(redirect.target, env), env.HOME);

  const updatedFS = redirect.operator === '>>'
    ? appendFile(result.fs, filePath, result.stdout)
    : writeFile(result.fs, filePath, result.stdout);

  return { ...result, fs: updatedFS, stdout: '' };
}
```

- [ ] **Step 4: Run tests to verify pass**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(engine): implement executor with pipes, redirects, chaining, var/glob expansion"
```

---

### Task 15: Implement tab completion

**Files:**
- Create: `packages/engine/src/shell/completion.ts`
- Create: `packages/engine/__tests__/shell/completion.test.ts`

- [ ] **Step 1: Write completion tests**

```typescript
import { describe, it, expect } from 'vitest';
import { complete } from '../../src/shell/completion';
import { testFS, defaultEnv } from '../fixtures';
import { registerAllCommands } from '../../src/commands';

registerAllCommands();

describe('complete', () => {
  it('completes command names', () => {
    const results = complete('pw', 2, testFS, '/home/user', defaultEnv);
    expect(results).toContain('pwd');
  });

  it('completes file paths', () => {
    const results = complete('cat he', 6, testFS, '/home/user', defaultEnv);
    expect(results).toContain('hello.txt');
  });

  it('completes directory paths with trailing /', () => {
    const results = complete('cd do', 5, testFS, '/home/user', defaultEnv);
    expect(results).toContain('docs/');
  });

  it('returns empty for no matches', () => {
    const results = complete('cat zzz', 7, testFS, '/home/user', defaultEnv);
    expect(results).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests to verify fail**

- [ ] **Step 3: Implement completion**

Create `packages/engine/src/shell/completion.ts`:

Determine if user is completing a command name (first word) or an argument (subsequent words). For command names, match against registered command names. For arguments, match against files/directories in the relevant directory. Directories get a trailing `/`.

- [ ] **Step 4: Run tests to verify pass**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(engine): implement tab completion for commands and file paths"
```

---

### Task 16: Implement declarative validator

**Files:**
- Create: `packages/engine/src/validator/validator.ts`
- Create: `packages/engine/__tests__/validator/validator.test.ts`

- [ ] **Step 1: Write validator tests**

```typescript
import { describe, it, expect } from 'vitest';
import { validate } from '../../src/validator/validator';
import { testFS, defaultEnv } from '../fixtures';
import type { ValidatorConfig, ValidationState } from '@cli-quest/shared';

function state(overrides: Partial<ValidationState> = {}): ValidationState {
  return {
    fs: structuredClone(testFS),
    cwd: '/home/user',
    env: { ...defaultEnv },
    lastOutput: '',
    commandsUsed: [],
    ...overrides,
  };
}

describe('validate', () => {
  it('passes fileExists when file exists', () => {
    const config: ValidatorConfig = { type: 'fileExists', path: '/home/user/hello.txt' };
    expect(validate(config, state())).toBe(true);
  });

  it('fails fileExists when file missing', () => {
    const config: ValidatorConfig = { type: 'fileExists', path: '/nope' };
    expect(validate(config, state())).toBe(false);
  });

  it('passes fileNotExists when file missing', () => {
    const config: ValidatorConfig = { type: 'fileNotExists', path: '/nope' };
    expect(validate(config, state())).toBe(true);
  });

  it('passes commandUsed', () => {
    const config: ValidatorConfig = { type: 'commandUsed', command: 'grep' };
    expect(validate(config, state({ commandsUsed: ['ls', 'grep'] }))).toBe(true);
  });

  it('passes all combinator', () => {
    const config: ValidatorConfig = {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/hello.txt' },
        { type: 'currentPath', path: '/home/user' },
      ],
    };
    expect(validate(config, state())).toBe(true);
  });

  it('fails all if any condition fails', () => {
    const config: ValidatorConfig = {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/hello.txt' },
        { type: 'fileExists', path: '/nope' },
      ],
    };
    expect(validate(config, state())).toBe(false);
  });

  it('passes any combinator', () => {
    const config: ValidatorConfig = {
      type: 'any',
      conditions: [
        { type: 'fileExists', path: '/nope' },
        { type: 'currentPath', path: '/home/user' },
      ],
    };
    expect(validate(config, state())).toBe(true);
  });

  it('handles nested combinators', () => {
    const config: ValidatorConfig = {
      type: 'all',
      conditions: [
        {
          type: 'any',
          conditions: [
            { type: 'commandUsed', command: 'grep' },
            { type: 'commandUsed', command: 'find' },
          ],
        },
        { type: 'fileExists', path: '/home/user/hello.txt' },
      ],
    };
    expect(validate(config, state({ commandsUsed: ['find'] }))).toBe(true);
  });

  it('passes fileContains', () => {
    const config: ValidatorConfig = { type: 'fileContains', path: '/home/user/hello.txt', substring: 'Hello' };
    expect(validate(config, state())).toBe(true);
  });

  it('passes outputContains', () => {
    const config: ValidatorConfig = { type: 'outputContains', substring: 'found' };
    expect(validate(config, state({ lastOutput: 'file found here' }))).toBe(true);
  });

  it('passes envVar', () => {
    const config: ValidatorConfig = { type: 'envVar', name: 'USER', value: 'user' };
    expect(validate(config, state())).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify fail**

- [ ] **Step 3: Implement validator**

Create `packages/engine/src/validator/validator.ts`:

```typescript
import type { ValidatorConfig, ValidationState } from '@cli-quest/shared';
import { getNode } from '../filesystem/operations';

export function validate(config: ValidatorConfig, state: ValidationState): boolean {
  switch (config.type) {
    case 'all':
      return config.conditions.every((c) => validate(c, state));
    case 'any':
      return config.conditions.some((c) => validate(c, state));
    case 'fileExists':
      return getNode(state.fs, config.path) !== null;
    case 'fileNotExists':
      return getNode(state.fs, config.path) === null;
    case 'fileContains': {
      const node = getNode(state.fs, config.path);
      return node?.type === 'file' && (node.content || '').includes(config.substring);
    }
    case 'fileNotContains': {
      const node = getNode(state.fs, config.path);
      return !node || node.type !== 'file' || !(node.content || '').includes(config.substring);
    }
    case 'directoryContains': {
      const node = getNode(state.fs, config.path);
      return node?.type === 'directory' && (node.children || []).some((c) => c.name === config.childName);
    }
    case 'currentPath':
      return state.cwd === config.path;
    case 'commandUsed':
      return state.commandsUsed.includes(config.command);
    case 'outputContains':
      return state.lastOutput.includes(config.substring);
    case 'envVar':
      return state.env[config.name] === config.value;
    default:
      return false;
  }
}
```

- [ ] **Step 4: Run tests to verify pass**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(engine): implement declarative level validator with all/any combinators"
```

---

### Task 17: Implement Shell public API (createShell)

**Files:**
- Create: `packages/engine/src/shell/shell.ts`
- Modify: `packages/engine/src/index.ts`
- Create: `packages/engine/__tests__/shell/integration.test.ts`

- [ ] **Step 1: Write integration tests**

```typescript
import { describe, it, expect } from 'vitest';
import { createShell } from '../../src/shell/shell';
import { testFS, defaultEnv } from '../fixtures';

describe('createShell (integration)', () => {
  it('executes a simple command', () => {
    const shell = createShell({ filesystem: structuredClone(testFS), env: { ...defaultEnv }, cwd: '/home/user' });
    const result = shell.execute('pwd');
    expect(result.stdout).toBe('/home/user');
  });

  it('maintains state across executions', () => {
    const shell = createShell({ filesystem: structuredClone(testFS), env: { ...defaultEnv }, cwd: '/home/user' });
    const r1 = shell.execute('cd docs');
    const r2 = shell.execute('pwd');
    expect(r2.stdout).toBe('/home/user/docs');
  });

  it('supports pipes', () => {
    const shell = createShell({ filesystem: structuredClone(testFS), env: { ...defaultEnv }, cwd: '/home/user' });
    const result = shell.execute('cat data.csv | grep Alice');
    expect(result.stdout).toContain('Alice');
  });

  it('supports output redirect', () => {
    const shell = createShell({ filesystem: structuredClone(testFS), env: { ...defaultEnv }, cwd: '/home/user' });
    shell.execute('echo "test content" > newfile.txt');
    const result = shell.execute('cat newfile.txt');
    expect(result.stdout).toBe('test content');
  });

  it('supports env vars', () => {
    const shell = createShell({ filesystem: structuredClone(testFS), env: { ...defaultEnv }, cwd: '/home/user' });
    shell.execute('export MYVAR=hello');
    const result = shell.execute('echo $MYVAR');
    expect(result.stdout).toBe('hello');
  });

  it('tracks command history', () => {
    const shell = createShell({ filesystem: structuredClone(testFS), env: { ...defaultEnv }, cwd: '/home/user' });
    shell.execute('pwd');
    shell.execute('ls');
    expect(shell.historyUp()).toBe('ls');
    expect(shell.historyUp()).toBe('pwd');
    expect(shell.historyDown()).toBe('ls');
  });

  it('provides tab completion', () => {
    const shell = createShell({ filesystem: structuredClone(testFS), env: { ...defaultEnv }, cwd: '/home/user' });
    const completions = shell.complete('cat he', 6);
    expect(completions).toContain('hello.txt');
  });

  it('tracks commands used for validation', () => {
    const shell = createShell({ filesystem: structuredClone(testFS), env: { ...defaultEnv }, cwd: '/home/user' });
    shell.execute('ls');
    shell.execute('cat hello.txt');
    expect(shell.getCommandsUsed()).toEqual(['ls', 'cat']);
  });
});
```

- [ ] **Step 2: Run tests to verify fail**

- [ ] **Step 3: Implement Shell class**

Create `packages/engine/src/shell/shell.ts`:

```typescript
import type { FSNode, Env, ShellResult } from '@cli-quest/shared';
import { execute } from './executor';
import { complete as completeImpl } from './completion';
import { registerAllCommands } from '../commands';

export interface Shell {
  execute(input: string): ShellResult;
  complete(input: string, cursorPos: number): string[];
  historyUp(): string | null;
  historyDown(): string | null;
  getCommandsUsed(): string[];
  getState(): { fs: FSNode; env: Env; cwd: string };
}

export interface ShellOptions {
  filesystem: FSNode;
  env: Env;
  cwd: string;
  history?: string[];
}

let commandsRegistered = false;

export function createShell(options: ShellOptions): Shell {
  if (!commandsRegistered) {
    registerAllCommands();
    commandsRegistered = true;
  }

  let fs = options.filesystem;
  let env = { ...options.env };
  let cwd = options.cwd;
  const commandHistory: string[] = options.history ? [...options.history] : [];
  let historyIndex = commandHistory.length;
  let commandsUsed: string[] = [];

  return {
    execute(input: string): ShellResult {
      commandHistory.push(input);
      historyIndex = commandHistory.length;

      const result = execute(input, fs, env, cwd, commandsUsed);
      fs = result.fs;
      env = result.env;
      cwd = result.cwd;
      commandsUsed = result.commandsUsed;

      // Update PWD env var
      env.PWD = cwd;

      return {
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
        fs,
        env: { ...env },
        cwd,
      };
    },

    complete(input: string, cursorPos: number): string[] {
      return completeImpl(input, cursorPos, fs, cwd, env);
    },

    historyUp(): string | null {
      if (historyIndex <= 0) return null;
      historyIndex--;
      return commandHistory[historyIndex];
    },

    historyDown(): string | null {
      if (historyIndex >= commandHistory.length - 1) {
        historyIndex = commandHistory.length;
        return null;
      }
      historyIndex++;
      return commandHistory[historyIndex];
    },

    getCommandsUsed(): string[] {
      return [...commandsUsed];
    },

    getState() {
      return { fs, env: { ...env }, cwd };
    },
  };
}
```

- [ ] **Step 4: Update packages/engine/src/index.ts**

```typescript
export { createShell } from './shell/shell';
export type { Shell, ShellOptions } from './shell/shell';
export { validate } from './validator/validator';
export { registerAllCommands } from './commands';
```

- [ ] **Step 5: Run tests to verify pass**

```bash
cd packages/engine && pnpm test
```

Expected: all tests pass across all test files.

- [ ] **Step 6: Verify full build**

```bash
pnpm turbo build
pnpm turbo test
```

Expected: both packages build, all engine tests pass.

- [ ] **Step 7: Commit**

```bash
git add packages/engine/
git commit -m "feat(engine): implement createShell public API with history, completion, state management"
```

---

### Task 18: Final verification and cleanup

- [ ] **Step 1: Run full test suite**

```bash
pnpm turbo test
```

Expected: all tests green.

- [ ] **Step 2: Run build**

```bash
pnpm turbo build
```

Expected: clean build.

- [ ] **Step 3: Verify test count**

The engine should have approximately:
- ~10 filesystem tests
- ~8 glob tests
- ~12 tokenizer tests
- ~10 parser tests
- ~20 navigation command tests
- ~25 file-ops command tests
- ~15 search command tests
- ~20 text command tests
- ~10 env command tests
- ~10 system command tests
- ~10 expander tests
- ~12 executor tests
- ~5 completion tests
- ~15 validator tests
- ~10 integration tests

Total: ~180+ tests

- [ ] **Step 4: Commit final state**

```bash
git add -A
git commit -m "chore(engine): verify full test suite and build"
```

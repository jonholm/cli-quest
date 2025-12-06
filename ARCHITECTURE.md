# CLI Quest Architecture

This document explains the technical architecture, design decisions, and implementation details of CLI Quest.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Core Systems](#core-systems)
- [Data Flow](#data-flow)
- [Key Design Decisions](#key-design-decisions)
- [File Structure](#file-structure)

## Overview

CLI Quest is a web-based interactive learning platform that teaches command-line interface (CLI) skills through gamification. The app simulates a virtual terminal with a functional file system, allowing users to practice real CLI commands in a safe, guided environment.

## Tech Stack

### Frontend Framework
- **Next.js 14** with App Router
  - Server and client components for optimal performance
  - File-based routing for pages
  - Built-in optimization for production builds

### State Management
- **Zustand** with persist middleware
  - Lightweight, hook-based state management
  - localStorage persistence for progress tracking
  - No boilerplate compared to Redux

### Styling
- **Tailwind CSS v3**
  - Utility-first CSS framework
  - Custom terminal color scheme
  - Responsive design utilities
  - JetBrains Mono font for authentic terminal feel

### Language
- **TypeScript**
  - Type safety throughout the codebase
  - Better IDE support and autocomplete
  - Catch errors at compile time

## Core Systems

### 1. Virtual File System (`lib/fileSystem.ts`)

The virtual file system is implemented as a nested object structure:

```typescript
type FSNode = {
  type: 'file' | 'directory';
  name: string;
  content?: string;        // For files
  children?: FSNode[];     // For directories
  permissions?: string;
  hidden?: boolean;
};
```

**Key Functions:**
- `resolvePath()` - Converts relative/absolute paths to absolute paths
- `getNode()` - Retrieves a node at a given path
- `listDirectory()` - Returns files/directories in a directory
- `createNode()` - Adds files or directories
- `deleteNode()` - Removes nodes
- `cloneFS()` - Deep clones the file system for level resets

**Design Decisions:**
- Nested objects allow natural tree traversal
- Immutable operations (clone-then-modify) for predictable state
- Path resolution handles `.` (current) and `..` (parent) navigation
- Hidden files support (for `ls -a` functionality)

### 2. Command System

#### Command Parser (`lib/commandParser.ts`)

Parses raw input strings into structured commands:

```typescript
type ParsedCommand = {
  cmd: string;
  args: string[];
  flags: Record<string, string | boolean>;
};
```

**Parsing Rules:**
- Splits on whitespace
- Flags start with `-` or `--`
- Supports flag values: `-n 10` or `--name=value`
- Preserves quoted strings (future enhancement)

#### Command Executor (`lib/commandExecutor.ts`)

Routes parsed commands to their implementations:

```typescript
function executeCommand(input: string, state: GameState): ExecutionResult {
  const parsed = parseCommand(input);

  switch (parsed.cmd) {
    case 'pwd': return executePwd(args, flags, state);
    case 'ls': return executeLs(args, flags, state);
    // ... other commands
  }
}
```

**Returns:**
```typescript
type ExecutionResult = {
  output: string;
  newState: GameState;
  error?: boolean;
};
```

#### Individual Commands (`lib/commands/*.ts`)

Each command is a pure function that:
1. Takes args, flags, and current game state
2. Performs validation
3. Returns output and updated state
4. Handles errors gracefully

**Command Categories:**
- **Basic Navigation:** pwd, ls, cd
- **File Operations:** cat, touch, mkdir, rm
- **Content Search:** grep, find
- **File Manipulation:** cp, mv, echo
- **Text Processing:** head, tail, wc
- **Utility:** clear

### 3. Level System (`data/*.ts`)

Levels are declarative objects that define:

```typescript
type Level = {
  id: string;
  title: string;
  objective: string;                    // What to accomplish
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  zone: ZoneType;
  initialFS: FSNode;                    // Starting file system
  startingPath: string;                 // Initial directory
  hints: string[];                      // Progressive hints
  validator: (state: GameState) => boolean;  // Win condition
  successMessage: string;
  xpReward?: number;
  storyText?: string;                   // For narrative levels
  unlockRequirements?: string[];        // Level dependencies
};
```

**Level Organization:**
- `challenges.ts` - Basic training (5 levels)
- `adventureLevels.ts` - Story mode (5 levels)
- `challengeLevels.ts` - Themed challenges (6 levels)
- `advancedLevels.ts` - Advanced techniques (5 levels)
- `allLevels.ts` - Combines and exports all levels

**Zones:**
Each zone has metadata (title, description, icon, color) and groups related levels.

### 4. State Management (`lib/store.ts`)

Zustand store manages:

```typescript
interface Store extends GameState {
  // Current session state
  currentLevel: string | null;
  currentPath: string;
  fileSystem: FSNode;
  history: CommandOutput[];
  hintsUsed: number;
  commandCount: number;
  lastOutput: string;

  // Persistent progress
  completedLevels: string[];
  totalXP: number;
  commandsExecuted: number;

  // Actions
  executeCommand: (input: string) => void;
  loadLevel: (levelId: string) => void;
  useHint: () => string | null;
  resetLevel: () => void;
  completeLevel: () => void;
}
```

**Persistence:**
Only user progress is persisted to localStorage:
- `completedLevels`
- `totalXP`
- `commandsExecuted`

Session state (current file system, history, etc.) is ephemeral and reloads with each level.

### 5. UI Components

#### Terminal Components

- **Terminal.tsx** - Main terminal container
  - Manages focus on terminal input
  - Displays command history
  - Shows current working directory prompt

- **CommandInput.tsx** - Input field with keyboard handling
  - Auto-focuses on any user interaction
  - Command history navigation (up/down arrows)
  - Submits commands to store

- **OutputDisplay.tsx** - Command history renderer
  - Syntax highlighting for file listings
  - Error message styling
  - Auto-scrolls to latest output

- **LevelObjective.tsx** - Sticky objective banner
  - Always visible while playing
  - Shows current goal

#### Navigation Components

- **HintButton.tsx** - Hint system UI
  - Tracks hints used
  - Shows remaining hints
  - Keyboard shortcut support

- **LevelComplete.tsx** - Victory modal
  - Displays success message
  - Shows stats (commands used, hints)
  - Keyboard navigation to next level or hub

#### Layout Component

- **TerminalWindow.tsx** - MacOS terminal chrome
  - Traffic light buttons (red, yellow, green)
  - Title bar with app name
  - Window border and shadow
  - Wraps entire application

### 6. Routing Structure

```
/                        → Redirects to /hub
/hub                     → Zone selection hub
/zone/[zoneId]          → Level browser for a zone
/play/[level]           → Level gameplay
/tutorial               → Help and documentation
/achievements           → Progress and achievements
/sandbox                → Free exploration mode
```

## Data Flow

### Playing a Level

1. User selects level from zone page
2. Route: `/play/[levelId]`
3. Page loads level from `allLevels`
4. Store's `loadLevel()` initializes:
   - File system from `level.initialFS`
   - Starting path
   - Empty history
   - Reset hints/commands
5. User types command
6. `CommandInput` calls `store.executeCommand(input)`
7. Store:
   - Increments `commandCount` and `commandsExecuted`
   - Calls `commandExecutor.executeCommand()`
   - Updates `fileSystem` and `history`
   - Checks `level.validator()` for completion
8. If validator returns `true`:
   - Add to `completedLevels`
   - Award `xpReward` to `totalXP`
   - Show `LevelComplete` modal

### Persistence

- On each state update, persist middleware saves:
  - `completedLevels`
  - `totalXP`
  - `commandsExecuted`
- On app load, rehydrates from localStorage
- Session state is not persisted (intentional - levels reset on reload)

### Keyboard Navigation

Each page implements keyboard handlers:

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Handle arrow keys, Enter, ESC, etc.
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [dependencies]);
```

**Navigation Patterns:**
- **Arrow keys:** Navigate menus/options
- **Enter:** Select/confirm
- **ESC:** Go back
- **Single letters (H, A):** Quick actions (no modifier)
- **Modifier combos (Ctrl/Cmd+H, Ctrl/Cmd+R):** In-game actions

## Key Design Decisions

### Why Zustand over Redux?

- Simpler API with less boilerplate
- Built-in TypeScript support
- Easy persistence middleware
- Hook-based - no context providers needed
- Sufficient for this app's complexity

### Why Virtual File System?

- Safe learning environment (no real system access)
- Predictable behavior across platforms
- Full control over file operations
- Can seed with specific structures for challenges
- Easy to reset and manipulate

### Why Pure Functions for Commands?

- Testable - pass in state, assert output
- Predictable - same input = same output
- No hidden side effects
- Easy to debug
- Composable for complex operations

### Why Declarative Levels?

- Non-programmers can create levels (just define object)
- Easy to add new content
- Validators are flexible (any logic)
- Separates content from code

### Why Client-Side Only?

- No server needed - lower hosting costs
- Faster interactions (no network latency)
- Works offline (PWA potential)
- Simpler deployment
- User data stays local (privacy)

### Keyboard-First Design

- Accessibility for all users
- Faster interaction for power users
- Aligns with CLI learning goals
- Better user experience in terminal context
- No mouse required after initial page load

## File Structure

```
cli-quest/
├── app/                           # Next.js App Router pages
│   ├── layout.tsx                # Root layout with TerminalWindow
│   ├── page.tsx                  # Redirects to /hub
│   ├── globals.css              # Global styles and terminal theme
│   ├── hub/
│   │   └── page.tsx             # Zone selection hub
│   ├── zone/[zoneId]/
│   │   └── page.tsx             # Level browser for zone
│   ├── play/[level]/
│   │   └── page.tsx             # Level gameplay page
│   ├── tutorial/
│   │   └── page.tsx             # Help and documentation
│   ├── achievements/
│   │   └── page.tsx             # Progress tracking
│   └── sandbox/
│       └── page.tsx             # Free exploration mode
│
├── components/                    # React components
│   ├── Terminal.tsx              # Main terminal container
│   ├── CommandInput.tsx          # Command input field
│   ├── OutputDisplay.tsx         # Command history display
│   ├── LevelObjective.tsx        # Objective banner
│   ├── HintButton.tsx            # Hint UI
│   ├── LevelComplete.tsx         # Victory modal
│   └── TerminalWindow.tsx        # MacOS terminal chrome
│
├── lib/                           # Core application logic
│   ├── types.ts                  # TypeScript type definitions
│   ├── fileSystem.ts             # Virtual FS operations
│   ├── commandParser.ts          # Parse command strings
│   ├── commandExecutor.ts        # Route commands to handlers
│   ├── store.ts                  # Zustand state management
│   └── commands/                 # Command implementations
│       ├── pwd.ts
│       ├── ls.ts
│       ├── cd.ts
│       ├── cat.ts
│       ├── mkdir.ts
│       ├── touch.ts
│       ├── rm.ts
│       ├── clear.ts
│       ├── grep.ts
│       ├── find.ts
│       ├── echo.ts
│       ├── mv.ts
│       ├── cp.ts
│       ├── head.ts
│       ├── tail.ts
│       └── wc.ts
│
├── data/                          # Level definitions
│   ├── challenges.ts             # Basic training levels
│   ├── adventureLevels.ts        # Story-driven levels
│   ├── challengeLevels.ts        # Themed challenges
│   ├── advancedLevels.ts         # Advanced technique levels
│   └── allLevels.ts              # Combines all levels + zone info
│
├── public/                        # Static assets (if needed)
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── next.config.js                 # Next.js configuration
├── README.md                      # Project documentation
├── LICENSE                        # MIT License
├── CONTRIBUTING.md                # Contribution guidelines
└── ARCHITECTURE.md                # This file
```

## Future Enhancements

Potential areas for expansion:

1. **Additional Commands:** `chmod`, `chown`, `ps`, `kill`, `curl`, `wget`
2. **Piping:** Support `|` operator to chain commands
3. **Redirection:** Support `>`, `>>`, `<` for file I/O
4. **Variables:** Environment variables and shell scripting
5. **Multiplayer:** Leaderboards or collaborative challenges
6. **Custom Levels:** Level editor for community content
7. **Mobile Support:** Touch-friendly virtual keyboard
8. **Themes:** Alternative color schemes beyond terminal green
9. **Localization:** Multi-language support
10. **Analytics:** Track which commands users struggle with

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on contributing to this project.

## License

MIT License - see [LICENSE](./LICENSE) for details.

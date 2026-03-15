# CLI Quest V2 — Complete Rebuild Design Spec

## Overview

CLI Quest V2 is a ground-up rebuild of the CLI learning platform. It transforms the current terminal-aesthetic MVP (21 levels, 16 commands, client-only) into a modern game-like educational platform with narrative story arcs, a real shell engine supporting pipes and redirection, full backend with auth and social features, and retention mechanics (daily challenges, streaks, skill tree, leaderboards, spaced repetition).

**Audience**: Total beginners through junior developers. The app starts with hand-held tutorials and scales to genuinely useful real-world scenarios.

**Feel**: Three pillars — narrative RPG immersion, gamified curriculum with retention mechanics, and open-ended realistic sandbox scenarios.

**First release strategy**: Impressive MVP, then iterate. Ship one complete story arc, core gamification, auth, leaderboards, and polished UI. Get it in front of users fast.

---

## Architecture: Decoupled Engine (Monorepo)

The shell engine is separated from the frontend as its own package. This allows independent testing, potential reuse, and clean separation between game logic and command execution.

### Monorepo Structure (Turborepo + pnpm)

```
cli-quest/
├── apps/
│   └── web/                    # Next.js 14 app (App Router)
│       ├── app/                # Pages and layouts
│       ├── components/         # React components
│       ├── hooks/              # Custom hooks
│       └── lib/                # App-specific logic (store, API clients)
├── packages/
│   ├── engine/                 # Standalone shell engine (zero React deps)
│   │   ├── src/
│   │   │   ├── parser/         # Tokenizer, AST, pipe/redirect parsing
│   │   │   ├── filesystem/     # Virtual FS with immutable operations
│   │   │   ├── commands/       # All command implementations
│   │   │   ├── shell/          # Shell execution (pipes, env vars, wildcards)
│   │   │   └── index.ts        # Public API
│   │   └── __tests__/
│   └── shared/                 # Shared types, constants, level schema
├── supabase/                   # Migrations, edge functions, seed data
├── turbo.json
└── package.json
```

### Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS 4, Framer Motion, Zustand
- **Backend**: Supabase (Auth, Postgres, Realtime, Edge Functions, Row Level Security)
- **Engine**: Pure TypeScript, zero dependencies, Vitest
- **Monorepo**: Turborepo, pnpm workspaces
- **Deployment**: Vercel (web), Supabase Cloud (backend)

---

## Shell Engine

The engine is the core of the product — a standalone TypeScript library that simulates real shell behavior while staying sandboxed and testable.

### Execution Pipeline

```
Input string
  → Tokenizer (handles quotes, escapes, variable expansion)
  → Parser (builds AST with pipes, redirects, chains)
  → Expander (glob patterns, env vars, tilde expansion)
  → Executor (walks AST, runs commands, connects pipes)
  → Output
```

### Capabilities (MVP)

| Feature | Example |
|---------|---------|
| Pipes | `grep error log.txt \| wc -l` |
| Output redirect | `echo "hello" > file.txt` |
| Append redirect | `echo "line" >> file.txt` |
| Input redirect | `wc -l < data.csv` |
| Env variables | `$HOME`, `$USER`, `$PWD`, plus user-defined via `export` |
| Wildcards | `ls *.txt`, `rm docs/*.md` |
| Chaining | `mkdir dir && cd dir`, `cmd1 \|\| cmd2`, `cmd1 ; cmd2` |
| Quoting | Double quotes allow expansion, single quotes literal |
| Command history | Up/down arrow recall, stored per session |
| Tab completion | Context-aware: commands, file paths, flags |

### Commands (23 for MVP)

**Retained from V1 (16)**: `pwd`, `ls`, `cd`, `cat`, `mkdir`, `touch`, `rm`, `cp`, `mv`, `grep`, `find`, `head`, `tail`, `wc`, `echo`, `clear`

**New (7)**: `export`, `env`, `chmod`, `sort`, `uniq`, `man`, `history`

### Public API

```typescript
const shell = createShell({ filesystem, env, cwd });

const result = shell.execute("grep error log.txt | wc -l");
// → { stdout: "3", stderr: "", exitCode: 0, fs: FSNode, env: Env }

const completions = shell.complete("cat he", cursorPos);
// → ["hello.txt", "headers.csv"]

shell.historyUp() / shell.historyDown()
// → returns previous/next command string, or null
```

The filesystem and environment are immutable — every `execute()` returns new state, and the caller passes it back in. This makes undo, replay, and validation trivial. Command history is the one piece of mutable internal state the shell holds, since it is session-scoped and not part of the game state. The shell can be constructed with an initial history array for testing.

---

## Story Arc System

Each story arc is a self-contained narrative that teaches a family of commands through a cohesive storyline.

### MVP Content

**Tutorial Track** (not a story — structured curriculum):
- 10-12 short guided lessons for total beginners
- Covers: navigation, file ops, reading files, creating/deleting
- Interactive tooltips, animated prompts, "try typing this" moments
- Warm, encouraging, zero-jargon on-ramp

**Story Arc 1: "Ghost in the Machine"** (cybersecurity thriller):
- Player is a junior security analyst on their first day at NovaCorp
- Anomalous server activity detected; mentor goes dark
- 15-20 levels across 4 chapters:
  - **Ch 1: Orientation** — Navigate servers, read logs (`cd`, `ls`, `cat`, `pwd`)
  - **Ch 2: The Trail** — Search logs, filter data, find patterns (`grep`, `find`, `head`, `tail`, `wc`, pipes)
  - **Ch 3: Containment** — Quarantine files, set permissions (`mv`, `cp`, `chmod`, `mkdir`, redirection)
  - **Ch 4: The Truth** — Full picture using everything learned (complex pipes, env vars, multi-step operations)
- Characters: Kai (mentor), Reeves (sysadmin), ARIA (AI assistant), mystery antagonist
- Story delivered through: terminal messages, "emails" to `cat`, log entries, ARIA dialogue in side panel

**Post-MVP arcs** (designed, not built):
- "Mission Control" — Space station operations (process management, monitoring)
- "Startup Mode" — Solo DevOps at a viral startup (deployment, git, server management)
- "Data Heist" — Digital forensics (text processing pipelines, advanced grep/sed/awk)

### Level Schema

```typescript
type Level = {
  id: string;
  arcId: string;
  chapter: number;
  position: number;
  title: string;
  objective: string;
  briefing: string;                       // Story context shown before level
  dialogue?: DialogueEntry[];             // In-level character messages
  initialFS: FSNode;
  initialEnv?: Record<string, string>;
  startingPath: string;
  hints: Hint[];                          // Progressive, context-aware
  validator: ValidatorConfig;             // Declarative, not a function
  xpReward: number;
  commandsIntroduced?: string[];
  par?: number;                           // Target command count for bonus XP
};
```

### Declarative Validators

Replaces fragile validator functions with composable, testable config:

```typescript
// Composable conditions
validator: {
  type: "all",
  conditions: [
    { type: "fileExists", path: "/quarantine/malware.sh" },
    { type: "fileNotExists", path: "/var/log/malware.sh" },
    { type: "commandUsed", command: "mv" },
  ]
}
```

Supported condition types for MVP:
- `fileExists` / `fileNotExists` — check path presence
- `fileContains` / `fileNotContains` — check file content substring
- `directoryContains` — check that a directory has a child by name
- `currentPath` — check current working directory
- `commandUsed` — check that a command was used during the level
- `outputContains` — check last command output
- `envVar` — check environment variable value

Combinators: `all` (AND) and `any` (OR), nestable.

This makes levels data-driven. Community members could eventually create levels through a form with no code needed.

### Sandbox Mode

Free exploration mode with no objectives, story, or validation:
- Accessible from the top nav (Play → Sandbox) without auth
- Pre-seeded filesystem: `/home/user` with a `welcome.txt` explaining available commands
- All 23 commands available
- Full shell capabilities (pipes, redirection, env vars)
- No XP, no timer, no leaderboard — pure practice
- Command mastery still tracks (if logged in) so sandbox practice prevents decay

---

## Gamification & Retention

### Skill Tree

A constellation-style branching node graph where each node represents a command or concept.

- Nodes unlock as commands are used in levels
- Three mastery tiers: **Learned** (used it) → **Practiced** (used 10x) → **Mastered** (used in complex contexts like pipes)
- Mastery decays via spaced repetition — nodes dim if a command hasn't been used recently
- Visual: constellation map, nodes glow as mastery increases

### XP & Player Levels

- XP earned from: completing levels, daily challenges, achieving par, streak bonuses
- Player level progression: Intern → Junior → Mid → Senior → Staff → Principal
- Each player level unlocks cosmetic rewards (terminal themes, prompt styles)

### Daily Challenges

- One new challenge per day, available to all users
- 3 difficulty tiers: Quick (2 min), Standard (5 min), Hard (10 min)
- Generated from a pool of challenge templates seeded by date. Each template defines: a filesystem factory (parameterized), an objective description template, a validator config, and a difficulty tier. MVP needs ~30 templates (10 per tier) to provide variety. The `generate-daily-challenge` edge function uses `date` as a seed to deterministically pick one template per tier, instantiates the filesystem with randomized file names/content, and writes three rows to `daily_challenges`.
- Leaderboard for fastest completion per tier
- Completing any tier extends streak

### Streak System

- Consecutive days with activity (level completed or daily challenge done)
- Milestones: 7, 30, 100, 365 days
- Streak freeze tokens earned from achievements, protect one missed day

### Leaderboards

- **Daily**: Fastest daily challenge completion per tier
- **Weekly**: Most XP earned that week
- Anonymous by default, opt-in to display username

### Achievements (~20 for MVP)

- **Skill**: "Pipe Dream" (first pipe), "Redirect Master" (all redirect types)
- **Exploration**: "Archaeologist" (find all hidden files), "Completionist" (100% an arc)
- **Social**: "Trailblazer" (top 10 daily challenge)
- **Meta**: "Speed Demon" (under par), "No Hints" (arc without hints)

### Spaced Repetition

- Engine tracks per-user command last-used timestamps in `command_mastery` table
- Decay is a cliff at 7 days: once `last_used_at` is >7 days ago, `mastery_tier` drops one level (Mastered → Practiced, Practiced → Learned). The `decay-check` edge function runs weekly and processes all users.
- Decayed commands appear in a "Review" queue on the dashboard, capped at 3 pending reviews at a time
- Review challenges are generated from templates: each command has 2-3 template micro-levels (hand-authored, stored as seed data) that present a small filesystem and a single objective exercising that command. Template selection is random.
- Completing a review restores the previous mastery tier and resets `last_used_at`

---

## Database Schema (Supabase Postgres)

### Core Tables

**users**: `id` (uuid, Supabase Auth), `username` (unique), `display_name`, `avatar_url`, `player_level`, `total_xp`, `current_streak`, `longest_streak`, `last_active_date`, `streak_freezes_remaining`, `created_at`

**user_progress**: `user_id` → users, `level_id`, `completed_at`, `commands_used`, `hints_used`, `par_achieved`, `time_seconds`

**command_mastery**: `user_id` → users, `command_name`, `times_used`, `mastery_tier` (learned/practiced/mastered), `last_used_at`, `decay_notified`

**daily_challenges**: `id`, `date`, `tier`, `config` (jsonb — level definition), `created_at`. Unique constraint on `(date, tier)` — three rows per day, one per tier.

**daily_challenge_results**: `user_id` → users, `challenge_id` → daily_challenges, `completed_at`, `time_seconds`, `commands_used`

**achievements**: `user_id` → users, `achievement_id`, `unlocked_at`

**community_levels** (post-MVP, not included in MVP migrations)

### Auth

- Supabase Auth with GitHub and Google OAuth
- Magic link (email) as fallback
- Guest mode: play tutorial and first chapter without signup, prompted to create account to save progress
- Guest progress stored in localStorage: `{ completedLevels: string[], totalXP: number, commandsExecuted: number, commandMastery: Record<string, { timesUsed: number, lastUsed: string }> }`
- On signup: migration edge function reads this localStorage blob, creates corresponding `user_progress` and `command_mastery` rows, then clears localStorage. If the user has already completed a level server-side (e.g., signed up on another device), server data wins — no duplicates.

### Edge Functions

- `generate-daily-challenge`: Daily cron, picks template + generates FS + validator
- `update-leaderboard`: Triggered on challenge completion
- `check-streak`: Runs on login, calculates streak, applies freezes
- `decay-check`: Weekly cron, flags commands approaching decay threshold

### Realtime

- Daily challenge leaderboard updates via Supabase Realtime subscriptions
- Live player count on daily challenge

### Row Level Security

- Users read/write only their own progress, mastery, achievements
- Daily challenges and leaderboards publicly readable
- Community levels: authors edit their own, everyone reads published

---

## UI & Visual Design

### Theme: "Cyber Night"

- Deep purple-black gradients (`#0f0f23` → `#1a1a3e` → `#2d1b69`)
- Primary accent: neon green (`#00ff88`)
- Secondary accents: coral red (`#ff6b6b`), warm yellow (`#ffe66d`), teal (`#4ecdc4`)
- Purple highlights for interactive elements (`#4a2d8a`)
- Typography: JetBrains Mono for terminal, system sans-serif for UI

### Navigation: Top Bar

Horizontal nav across the top with text labels: Play, Skill Tree, Daily, Rankings. Right side shows XP count, streak flame, and avatar. During gameplay, nav collapses to a minimal bar with level title and controls.

### Gameplay Layout: Side Panel + Terminal

- Left panel (~240px, collapsible): objective at top, chat-style story dialogue (scrollable), stats at bottom (commands used, hints remaining)
- Terminal fills the right side
- Dialogue accumulates like a chat log — characters "speak" as the player progresses
- Panel collapse gives full-width terminal for power users

### Key Screens

- **Dashboard/Home**: Continue current arc card, daily challenge card, streak/XP stats, skill tree preview
- **Arc Selection**: Story arc cards with progress bars, chapter breakdowns, locked arcs teased
- **Gameplay**: Side panel + terminal as designed
- **Skill Tree**: Constellation-style interactive node graph
- **Daily Challenge**: Tier selector, timer, live leaderboard sidebar
- **Profile**: Stats overview, achievement grid, streak history, command mastery breakdown
- **Leaderboard**: Daily/weekly tabs, ranked player list, highlight own position

---

## MVP vs Post-MVP

### MVP (V1)

| Feature | Scope |
|---------|-------|
| Shell engine | Pipes, redirection, env vars, wildcards, quoting, history, tab completion. 23 commands. |
| Story arc | "Ghost in the Machine" — 4 chapters, 15-20 levels, full narrative |
| Tutorial track | 10-12 guided lessons for beginners |
| Auth | Supabase — GitHub + Google OAuth, guest mode with upgrade |
| Progression | XP, player levels, interactive skill tree |
| Daily challenges | 3 tiers, date-seeded, personal best tracking |
| Streaks | Day tracking, freeze tokens |
| Leaderboards | Daily challenge (per tier), weekly XP |
| Achievements | ~20 badges |
| Spaced repetition | Command decay tracking, review challenge queue |
| Sandbox | Free mode with full command set |
| UI | Cyber Night theme, top nav, side panel gameplay, skill tree, responsive (desktop-first) |

### Post-MVP (V2+)

| Feature | Rationale for deferral |
|---------|----------------------|
| Additional story arcs | Content-intensive; V1 proves the format |
| Community levels | Needs editor UI, moderation, curation |
| Social features (friends, sharing, multiplayer) | Not core to learning loop |
| Mobile optimization | Desktop-first for terminal app; mobile is separate design |
| All-time leaderboard | Needs anti-cheat, fairness tuning |
| Advanced commands (sed, awk, networking) | Engine supports them; levels need writing |
| Push notifications | Service worker setup, permissions UX |
| Light mode / theme customization | Cosmetic, not core |

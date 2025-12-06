# CLI Quest

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

An epic, adventure-filled web application that transforms CLI learning into an exciting journey. Master the command line through narrative adventures, themed challenges, and hands-on practice!

**Live Demo:** [Coming Soon]

## Why CLI Quest?

Learning the command line can be intimidating. CLI Quest makes it fun, interactive, and gamified. Practice real CLI commands in a safe virtual environment, earn XP, unlock achievements, and progress through increasingly challenging zones - all without ever touching your actual file system.

## Features

### Multiple Learning Zones
- **Basic Training** - 5 foundational levels teaching core commands
- **The Lost Data (Adventure Mode)** - Story-driven expedition with 5 narrative levels
- **Challenge Zones** - Themed challenges (File Detective, SysAdmin, Data Analyst)
- **Advanced Techniques** - Master-level command combinations
- **Sandbox Lab** - Free exploration with all commands unlocked

### Rich Game Features
- Interactive terminal simulation with 16+ working CLI commands
- Virtual file system with full CRUD operations
- XP system with 8 unlockable achievements
- Progress tracking with localStorage persistence
- Narrative storytelling in adventure mode
- Dynamic difficulty progression
- Full keyboard navigation - Zero mouse required!

### Command Library
**Basic:** pwd, ls, cd, cat, mkdir, touch, rm, clear
**Advanced:** grep, find, echo, mv, cp, head, tail, wc

### UI/UX
- Authentic terminal aesthetic (green-on-black)
- JetBrains Mono font for that pro coding feel
- Smooth animations and transitions
- Responsive design
- Accessibility-focused keyboard controls

## Keyboard Controls

### Landing Page
- **Arrow Keys** (↑ ↓ ← →) - Navigate between levels
- **Enter** - Select and start level
- Mouse hover also works to select levels

### Level Play
- **ESC** - Exit to level select
- **Ctrl/⌘ + H** - Show hint
- **Ctrl/⌘ + R** - Reset level
- Terminal automatically captures keyboard input

### Level Complete Modal
- **Arrow Keys** (← →) - Navigate buttons
- **Enter** - Select option

## Learning Pathways

### Basic Training (5 Levels)
1. **Where Am I?** - pwd basics
2. **Look Around** - ls mastery
3. **Go Deeper** - cd navigation
4. **Read the Manual** - cat file reading
5. **Treasure Hunt** - Combining skills

### Adventure Mode: The Lost Data (5 Levels)
Story-driven narrative following a digital archaeologist recovering data from abandoned servers.

### Challenge Zones (6+ Levels)
- **File Detective** - Find hidden files and search for evidence
- **System Administrator** - Manage servers and clean up files
- **Data Analyst** - Extract insights from data files

### Advanced Techniques (5 Levels)
Master grep, find, pipes, and complex workflows

## Achievements System

- **First Steps** - Complete your first level
- **Apprentice** - Complete 5 levels
- **Journeyman** - Complete 10 levels
- **Master** - Complete all levels
- **Explorer** - Execute 100 commands
- **Power User** - Execute 500 commands
- **XP Hunter** - Earn 1000 XP
- **XP Legend** - Earn 5000 XP

## Quick Start

```bash
# Clone the repository
git clone https://github.com/jonholm/cli-quest.git
cd cli-quest

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

The app will open in your browser. Start with Basic Training if you're new to CLI, or jump into any zone that interests you!

## How to Play

1. **Navigate** with arrow keys through zones and levels
2. **Press Enter** to select a level
3. **Type commands** in the terminal to complete objectives
4. **Use hints** if you get stuck (Ctrl/Cmd+H)
5. **Earn XP** and unlock achievements
6. **Master** all zones to become a CLI expert!

**Remember:** 100% keyboard navigation. No mouse required!

## Screenshots

[Coming Soon]

## Tech Stack

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Zustand](https://github.com/pmndrs/zustand)** - Lightweight state management with localStorage persistence
- **[JetBrains Mono](https://www.jetbrains.com/lp/mono/)** - Professional coding font

## Deployment

### Vercel (Recommended)

The easiest way to deploy CLI Quest is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy with one click
4. Vercel automatically detects Next.js and configures everything

### Other Platforms

CLI Quest can be deployed to any platform that supports Next.js:

- **Netlify:** Use the Next.js build plugin
- **AWS Amplify:** Connect your GitHub repository
- **Docker:** Use the included Dockerfile (create one if needed)
- **Static Export:** Run `npm run build` and deploy the `out/` directory

### Build for Production

```bash
# Create optimized production build
npm run build

# Test production build locally
npm start
```

## Project Structure

```
cli-quest/
├── app/                       # Next.js app directory
│   ├── layout.tsx            # Root layout with TerminalWindow
│   ├── page.tsx              # Redirects to hub
│   ├── globals.css          # Global styles
│   ├── hub/                 # Zone selection hub
│   ├── zone/[zoneId]/       # Zone level browser
│   ├── play/[level]/        # Level gameplay
│   ├── tutorial/            # Help and documentation
│   ├── achievements/        # Progress tracking
│   └── sandbox/             # Free exploration mode
├── components/               # React components
│   ├── Terminal.tsx         # Main terminal
│   ├── CommandInput.tsx     # Input field
│   ├── OutputDisplay.tsx    # Command history
│   ├── LevelObjective.tsx   # Objective banner
│   ├── HintButton.tsx       # Hint UI
│   ├── LevelComplete.tsx    # Victory modal
│   └── TerminalWindow.tsx   # MacOS terminal chrome
├── lib/                      # Core application logic
│   ├── types.ts             # TypeScript types
│   ├── fileSystem.ts        # Virtual FS operations
│   ├── commandParser.ts     # Parse command input
│   ├── commandExecutor.ts   # Execute commands
│   ├── store.ts             # Zustand store
│   └── commands/            # Command implementations
│       ├── pwd.ts, ls.ts, cd.ts, cat.ts
│       ├── mkdir.ts, touch.ts, rm.ts, clear.ts
│       ├── grep.ts, find.ts, echo.ts
│       ├── mv.ts, cp.ts, head.ts, tail.ts, wc.ts
└── data/                     # Level definitions
    ├── challenges.ts        # Basic training
    ├── adventureLevels.ts   # Story mode
    ├── challengeLevels.ts   # Themed challenges
    ├── advancedLevels.ts    # Advanced techniques
    └── allLevels.ts         # Combines all levels
```

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

Ways to contribute:
- Report bugs and request features
- Add new levels or commands
- Improve documentation
- Fix issues
- Share the project

## Development

### Prerequisites

- Node.js 18+ and npm
- Basic understanding of React and TypeScript

### Local Development

```bash
# Install dependencies
npm install

# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

### Creating New Levels

See [CONTRIBUTING.md](./CONTRIBUTING.md#adding-new-levels) for detailed instructions on creating levels.

### Adding New Commands

See [CONTRIBUTING.md](./CONTRIBUTING.md#adding-new-commands) for detailed instructions on implementing commands.

## Architecture

For technical details about the app's architecture and design decisions, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Roadmap

Upcoming features and improvements:

- [ ] Additional command support (chmod, chown, ps, kill, etc.)
- [ ] Piping support (`|` operator)
- [ ] File redirection (`>`, `>>`, `<`)
- [ ] Environment variables and shell scripting
- [ ] Multiplayer challenges and leaderboards
- [ ] Community-created levels
- [ ] Mobile-optimized UI
- [ ] Alternative themes
- [ ] Multi-language support
- [ ] Progress analytics

## FAQ

**Q: Is this a real terminal?**
A: No, it's a simulated terminal running in your browser. All commands operate on a virtual file system.

**Q: Can I break anything?**
A: Nope! Everything is sandboxed. Reset any level to start fresh.

**Q: Will this teach me real CLI skills?**
A: Yes! The commands work the same way as real Unix/Linux commands. Skills transfer directly to your terminal.

**Q: Do I need to install anything?**
A: Just Node.js for development. For playing, just visit the deployed site.

**Q: Can I use this offline?**
A: Once loaded, most features work offline. We may add PWA support for full offline functionality.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- Inspired by real-world CLI learning needs
- Built with amazing open-source tools
- JetBrains Mono font for that authentic terminal feel
- The Next.js and React communities

## Contact

- **GitHub:** [@jonholm](https://github.com/jonholm)
- **Project Issues:** [GitHub Issues](https://github.com/jonholm/cli-quest/issues)

---

Made with care by [Jon Holm](https://github.com/jonholm) | [Report Bug](https://github.com/jonholm/cli-quest/issues) | [Request Feature](https://github.com/jonholm/cli-quest/issues)

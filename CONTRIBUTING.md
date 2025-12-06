# Contributing to CLI Quest

Thank you for your interest in contributing to CLI Quest! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Be respectful, constructive, and collaborative. We welcome contributions from developers of all skill levels.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Your environment (browser, OS, Node version)
- Screenshots if applicable

### Suggesting Features

Feature suggestions are welcome! Please open an issue with:
- A clear description of the feature
- Use cases and benefits
- Any implementation ideas you have

### Submitting Code

1. **Fork the repository**
   ```bash
   # Fork via GitHub UI, then clone your fork
   git clone https://github.com/YOUR_USERNAME/cli-quest.git
   cd cli-quest
   ```

2. **Set up the development environment**
   ```bash
   npm install
   npm run dev
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

4. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Ensure keyboard navigation still works
   - Test your changes thoroughly

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add awesome feature"
   # or
   git commit -m "fix: resolve terminal input bug"
   ```

   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for code style changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Provide a clear description of your changes

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Use functional components with hooks
- Keep components focused and single-purpose
- Use meaningful variable and function names

### Adding New Levels

Levels are defined in `data/` directory. To add a new level:

1. Choose the appropriate zone file:
   - `challenges.ts` - Basic training levels
   - `adventureLevels.ts` - Story-driven levels
   - `challengeLevels.ts` - Themed challenges
   - `advancedLevels.ts` - Advanced techniques

2. Follow this structure:
   ```typescript
   {
     id: 'unique-id',
     title: 'Level Title',
     objective: 'What the player must accomplish',
     difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert',
     zone: 'basics' | 'adventure' | 'challenges' | 'advanced',
     initialFS: { /* file system structure */ },
     startingPath: '/starting/path',
     hints: ['hint 1', 'hint 2', 'hint 3'],
     validator: (state: GameState) => {
       // Return true when level is complete
     },
     successMessage: 'Congratulations message',
     xpReward: 100,
   }
   ```

3. Add the level to `allLevels.ts` if creating a new zone

### Adding New Commands

Commands are in `lib/commands/` directory. To add a new command:

1. Create a new file: `lib/commands/yourcommand.ts`
2. Implement the command following this pattern:
   ```typescript
   import { GameState, ExecutionResult } from '../types';

   export function executeYourCommand(
     args: string[],
     flags: Record<string, string | boolean>,
     state: GameState
   ): ExecutionResult {
     // Implement command logic
     return {
       output: 'command output',
       newState: state,
     };
   }
   ```

3. Add the command to `lib/commandExecutor.ts`:
   ```typescript
   case 'yourcommand':
     return executeYourCommand(parsed.args, parsed.flags, state);
   ```

4. Update documentation in README.md and tutorial page

### Keyboard Navigation

**CRITICAL:** All features must be fully accessible via keyboard. Before submitting:
- Test navigation with arrow keys
- Verify Enter key selects/confirms
- Ensure ESC key returns to previous screen
- Check that no mouse interaction is required
- Test all keyboard shortcuts

### Testing Your Changes

Before submitting a PR:
1. Run the development server: `npm run dev`
2. Test all affected features
3. Verify keyboard navigation works throughout
4. Check for console errors
5. Test on different screen sizes
6. Ensure the terminal aesthetic is maintained

## Project Structure

```
cli-quest/
├── app/                    # Next.js pages
│   ├── hub/               # Zone selection hub
│   ├── zone/[zoneId]/     # Zone level browser
│   ├── play/[level]/      # Level play page
│   ├── tutorial/          # Help/tutorial page
│   ├── achievements/      # Achievements page
│   └── sandbox/           # Sandbox mode
├── components/            # React components
├── lib/                   # Core logic
│   ├── commands/         # Command implementations
│   ├── commandExecutor.ts
│   ├── commandParser.ts
│   ├── fileSystem.ts
│   ├── store.ts
│   └── types.ts
└── data/                 # Level definitions
```

## Questions?

If you have questions about contributing, feel free to:
- Open an issue for discussion
- Check existing issues and PRs
- Review the ARCHITECTURE.md file

Thank you for contributing to CLI Quest!
